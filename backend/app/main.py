"""
FastAPI backend for AI-NIDS.

Reads from the same SQLite DB that live_ids_monitor.py writes to (see db.py
-- DB_PATH is the single source of truth for the file path, both scripts
import it from there rather than hardcoding their own).

This process is intentionally separate from live_ids_monitor.py: it only
reads FlowLog rows and serves them over HTTP. It never loads the LightGBM
models and never touches the pcap/CSV pipeline.

ENDPOINTS
    Existing dashboard contract (matches src/hooks/useDashboardData.ts):
        GET /health                  -> SystemHealth
        GET /metrics                 -> NetworkMetrics
        GET /attacks/distribution    -> AttackDistribution[]
        GET /attacks/trends          -> AttackTrendPoint[]
        GET /predictions/recent      -> PredictionRecord[]

    New -- full log view (not covered by the above, which are all
    aggregates/summaries):
        GET /flows                   -> paginated, filterable list of ALL flows
        GET /flows/{id}               -> one flow's full 77-feature vector (raw_features)

KNOWN APPROXIMATIONS (flagged, not hidden):
    - modelAccuracy has no ground-truth labels to compare against in live
      traffic, so it's the model's own average prediction confidence, not
      true accuracy. Rename/replace this once you have a way to validate
      against known traffic.
    - cpuUsage/memoryUsage/uptimeSeconds reflect THIS API process's host
      and process uptime, not live_ids_monitor.py's process specifically.
      Fine if both run on the same machine (per the README's setup), but
      worth knowing.
    - responseTimeMs on /predictions/recent is a batch-average (see
      live_ids_monitor.py's per_flow_ms), not true per-flow timing.
    - PredictionRecord.protocol only ever comes out as TCP/UDP/ICMP -- the
      raw `protocol` column from cicflowmeter is an IANA protocol number
      (6/17/1), not application-layer info, so 'HTTP' (allowed by the
      frontend type) never actually gets produced here.

SETUP
    pip install fastapi uvicorn psutil
    uvicorn main:app --reload --port 8000
"""

import time
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Optional

import psutil
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import desc, func

from db import FlowLog, SessionLocal, init_db
import json
import numpy as np
import lightgbm as lgb
from pydantic import BaseModel
import os 

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
FRONTEND_ORIGIN = "http://localhost:5173"   # <-- edit if your Vite port differs
BENIGN_LABEL = "Benign"                     # must match live_ids_monitor.py's BENIGN_LABEL

APP_START_TIME = time.time()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

MAIN_MODEL_PATH = os.path.join(MODELS_DIR, "cicids2017_lightgbm.txt")
MAIN_LABEL_MAP_PATH = os.path.join(MODELS_DIR, "label_mapping.json")
SUB_MODEL_PATH = os.path.join(MODELS_DIR, "webattack_submodel.txt")
SUB_LABEL_MAP_PATH = os.path.join(MODELS_DIR, "webattack_label_mapping.json")

WEB_ATTACK_CLASSES = [
    "Web Attack - Brute Force",
    "Web Attack - XSS",
    "Web Attack - Sql Injection",
]
UNCERTAINTY_MARGIN = 0.15

print("LightGBM version:", lgb.__version__)
print("Loading:", MAIN_MODEL_PATH)
_predict_main_model = lgb.Booster(model_file=MAIN_MODEL_PATH)
_predict_sub_model = lgb.Booster(model_file=SUB_MODEL_PATH)
with open(MAIN_LABEL_MAP_PATH) as f:
    _predict_main_labels = json.load(f)
with open(SUB_LABEL_MAP_PATH) as f:
    _predict_sub_labels = json.load(f)
_predict_main_features = _predict_main_model.feature_name()
_predict_sub_features = _predict_sub_model.feature_name()

PROTOCOL_NUM = {"TCP": 6, "UDP": 17, "ICMP": 1, "HTTP": 6}  # HTTP rides on TCP at flow level

RECOMMENDATIONS = {
    "Benign": "No action required. Continue monitoring.",
    "PortScan": "Monitor source IP for follow-up connection attempts.",
    "Bot": "Isolate host and inspect for C2 traffic.",
    "FTP-Patator": "Block source IP and enforce account lockout policy.",
    "SSH-Patator": "Block source IP and enforce account lockout policy.",
    "Web Attack - Brute Force": "Rate-limit login endpoint and block source IP.",
    "Web Attack - XSS": "Sanitize inputs on the targeted endpoint and review logs.",
    "Web Attack - Sql Injection": "Block source IP and audit database access logs.",
}
DEFAULT_RECOMMENDATION = "Immediately block source IP and isolate target node."

app = FastAPI(title="AI-NIDS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()   # no-op if flow_logs already exists -- safe to call every time


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Shared lookup tables (display-only derivations, not stored in the DB)
# ---------------------------------------------------------------------------
ATTACK_COLORS = {
    "DDoS": "#EF4444",
    "Bot": "#F59E0B",
    "DoS GoldenEye": "#F97316",
    "DoS Hulk": "#F97316",
    "DoS Slowhttptest": "#F97316",
    "DoS slowloris": "#F97316",
    "FTP-Patator": "#8B5CF6",
    "SSH-Patator": "#8B5CF6",
    "Heartbleed": "#DC2626",
    "Infiltration": "#DC2626",
    "PortScan": "#3B82F6",
    "Web Attack - Brute Force": "#EC4899",
    "Web Attack - Sql Injection": "#EC4899",
    "Web Attack - XSS": "#EC4899",
}
DEFAULT_COLOR = "#6B7280"

# Coarse severity mapping -- adjust freely, this is a judgment call, not
# something derived from the model itself (the model only outputs a label
# + confidence, not a severity tier).
RISK_MAP = {
    "Benign": "SAFE",
    "PortScan": "LOW",
    "Bot": "MEDIUM",
    "FTP-Patator": "MEDIUM",
    "SSH-Patator": "MEDIUM",
    "Web Attack - Brute Force": "HIGH",
    "Web Attack - XSS": "HIGH",
    "Web Attack - Sql Injection": "HIGH",
    "DoS GoldenEye": "HIGH",
    "DoS Hulk": "HIGH",
    "DoS Slowhttptest": "HIGH",
    "DoS slowloris": "HIGH",
    "DDoS": "CRITICAL",
    "Heartbleed": "CRITICAL",
    "Infiltration": "CRITICAL",
}

# cicflowmeter's `protocol` column is the raw IANA protocol number, not a name.
PROTOCOL_MAP = {"6": "TCP", "17": "UDP", "1": "ICMP"}


def risk_level_for(label: str) -> str:
    return RISK_MAP.get(label, "MEDIUM" if label != BENIGN_LABEL else "SAFE")


def normalize_protocol(raw) -> str:
    return PROTOCOL_MAP.get(str(raw).strip(), "TCP")


def pct_delta(current: int, previous: int) -> float:
    if previous == 0:
        return 0.0
    return round(((current - previous) / previous) * 100, 1)

def _lookup_label(mapping, idx):
    return mapping[str(idx)] if str(idx) in mapping else mapping[idx]


def _build_feature_vector(feature_list, protocol: str, packet_size: int, port: int):
    """Best-effort 77-feature vector from a simplified form submission.
    Everything not directly derivable from the form is zero-filled, same
    approach _prep_features() uses in live_ids_monitor.py for missing
    columns. This is a synthetic approximation, not a real flow -- flagged
    to the user in the API response."""
    values = {}
    for col in feature_list:
        values[col] = 0.0

    if "Protocol" in values:
        values["Protocol"] = float(PROTOCOL_NUM.get(protocol, 6))
    if "Fwd_Packets_Length_Total" in values:
        values["Fwd_Packets_Length_Total"] = float(packet_size)
    if "Fwd_Packet_Length_Max" in values:
        values["Fwd_Packet_Length_Max"] = float(packet_size)
    if "Fwd_Packet_Length_Mean" in values:
        values["Fwd_Packet_Length_Mean"] = float(packet_size)
    if "Avg_Packet_Size" in values:
        values["Avg_Packet_Size"] = float(packet_size)
    if "Total_Fwd_Packets" in values:
        values["Total_Fwd_Packets"] = 1.0
    if "Fwd_Header_Length" in values and port:
        values["Fwd_Header_Length"] = 20.0  # nominal TCP/UDP header, not derived from port

    row = pd_row = [values[c] for c in feature_list]
    return np.array(row, dtype=float).reshape(1, -1)


class PredictRequest(BaseModel):
    sourceIP: str
    destinationIP: str
    protocol: str
    packetSize: int
    port: int


# ---------------------------------------------------------------------------
# Existing dashboard contract
# ---------------------------------------------------------------------------
@app.get("/health")
def get_health():
    db = SessionLocal()
    try:
        latest = db.query(func.max(FlowLog.timestamp)).scalar()
        now = datetime.now()

        if latest is None:
            status = "offline"
        else:
            gap_seconds = (now - latest).total_seconds()
            if gap_seconds < 30:
                status = "operational"
            elif gap_seconds < 300:
                status = "degraded"
            else:
                status = "offline"

        return {
            "status": status,
            "uptimeSeconds": int(time.time() - APP_START_TIME),
            "cpuUsage": psutil.cpu_percent(interval=0.1),
            "memoryUsage": psutil.virtual_memory().percent,
            "activeNodes": 1,
            "lastSync": (latest or now).isoformat(),
        }
    finally:
        db.close()


@app.get("/metrics")
def get_metrics():
    db = SessionLocal()
    try:
        now = datetime.now()
        last_24h = now - timedelta(hours=24)
        prev_24h = now - timedelta(hours=48)

        total = db.query(func.count(FlowLog.id)).scalar() or 0
        threats = (
            db.query(func.count(FlowLog.id))
            .filter(FlowLog.is_alert.is_(True))
            .scalar()
            or 0
        )

        recent_total = (
            db.query(func.count(FlowLog.id))
            .filter(FlowLog.timestamp >= last_24h)
            .scalar()
            or 0
        )
        prev_total = (
            db.query(func.count(FlowLog.id))
            .filter(FlowLog.timestamp >= prev_24h, FlowLog.timestamp < last_24h)
            .scalar()
            or 0
        )
        recent_threats = (
            db.query(func.count(FlowLog.id))
            .filter(FlowLog.timestamp >= last_24h, FlowLog.is_alert.is_(True))
            .scalar()
            or 0
        )
        prev_threats = (
            db.query(func.count(FlowLog.id))
            .filter(
                FlowLog.timestamp >= prev_24h,
                FlowLog.timestamp < last_24h,
                FlowLog.is_alert.is_(True),
            )
            .scalar()
            or 0
        )

        avg_conf = db.query(func.avg(FlowLog.confidence)).scalar() or 0.0
        avg_latency = db.query(func.avg(FlowLog.response_time_ms)).scalar() or 0.0

        return {
            "totalInspections": total,
            "threatsDetected": threats,
            # proxy metric -- see module docstring's KNOWN APPROXIMATIONS
            "modelAccuracy": round(avg_conf * 100, 2),
            "avgLatencyMs": round(avg_latency, 2),
            "inspectionDeltaPct": pct_delta(recent_total, prev_total),
            "threatDeltaPct": pct_delta(recent_threats, prev_threats),
        }
    finally:
        db.close()


@app.get("/attacks/distribution")
def get_attack_distribution():
    db = SessionLocal()
    try:
        rows = (
            db.query(FlowLog.label, func.count(FlowLog.id))
            .filter(FlowLog.is_alert.is_(True))
            .group_by(FlowLog.label)
            .all()
        )
        total = sum(count for _, count in rows) or 1

        return [
            {
                "category": label,
                "count": count,
                "percentage": round((count / total) * 100, 1),
                "color": ATTACK_COLORS.get(label, DEFAULT_COLOR),
            }
            for label, count in sorted(rows, key=lambda r: -r[1])
        ]
    finally:
        db.close()


@app.get("/attacks/trends")
def get_attack_trends():
    db = SessionLocal()
    try:
        now = datetime.now()
        start = now - timedelta(hours=24)
        rows = db.query(FlowLog).filter(FlowLog.timestamp >= start).all()

        buckets = defaultdict(lambda: {"normal": 0, "malicious": 0, "anomalies": 0})
        for r in rows:
            bucket_key = r.timestamp.replace(minute=0, second=0, microsecond=0)
            b = buckets[bucket_key]
            if r.is_alert:
                b["malicious"] += 1
            else:
                b["normal"] += 1
            if r.uncertain:
                b["anomalies"] += 1

        return [
            {
                "timestamp": ts.isoformat(),
                "normalTraffic": b["normal"],
                "maliciousTraffic": b["malicious"],
                "anomalies": b["anomalies"],
            }
            for ts, b in sorted(buckets.items())
        ]
    finally:
        db.close()


@app.get("/predictions/recent")
def get_recent_predictions(limit: int = Query(20, le=200)):
    db = SessionLocal()
    try:
        rows = (
            db.query(FlowLog).order_by(desc(FlowLog.timestamp)).limit(limit).all()
        )
        return [
            {
                "id": f"flow-{r.id}",
                "timestamp": r.timestamp.isoformat(),
                "sourceIP": r.src_ip,
                "destinationIP": r.dst_ip,
                "protocol": normalize_protocol(r.protocol),
                "prediction": r.label,
                "confidence": r.confidence,
                "riskLevel": risk_level_for(r.label),
                "responseTimeMs": round(r.response_time_ms or 0.0, 2),
            }
            for r in rows
        ]
    finally:
        db.close()


# ---------------------------------------------------------------------------
# New -- full log view (satisfies "show the whole logs, not just alerts")
# ---------------------------------------------------------------------------
@app.get("/flows")
def get_flows(
    limit: int = Query(50, le=500),
    offset: int = 0,
    label: Optional[str] = None,
    src_ip: Optional[str] = None,
    dst_ip: Optional[str] = None,
    alerts_only: bool = False,
):
    db = SessionLocal()
    try:
        q = db.query(FlowLog)
        if label:
            q = q.filter(FlowLog.label == label)
        if src_ip:
            q = q.filter(FlowLog.src_ip == src_ip)
        if dst_ip:
            q = q.filter(FlowLog.dst_ip == dst_ip)
        if alerts_only:
            q = q.filter(FlowLog.is_alert.is_(True))

        total = q.count()
        rows = q.order_by(desc(FlowLog.timestamp)).offset(offset).limit(limit).all()

        return {
            "total": total,
            "items": [
                {
                    "id": r.id,
                    "timestamp": r.timestamp.isoformat(),
                    "srcIp": r.src_ip,
                    "srcPort": r.src_port,
                    "dstIp": r.dst_ip,
                    "dstPort": r.dst_port,
                    "protocol": normalize_protocol(r.protocol),
                    "flowDuration": r.flow_duration,
                    "totFwdPkts": r.tot_fwd_pkts,
                    "totBwdPkts": r.tot_bwd_pkts,
                    "label": r.label,
                    "confidence": r.confidence,
                    "uncertain": r.uncertain,
                    "alternative": r.alternative,
                    "isAlert": r.is_alert,
                }
                for r in rows
            ],
        }
    finally:
        db.close()


@app.get("/flows/{flow_id}")
def get_flow_detail(flow_id: int):
    db = SessionLocal()
    try:
        row = db.query(FlowLog).filter(FlowLog.id == flow_id).first()
        if row is None:
            raise HTTPException(status_code=404, detail="Flow not found")

        return {
            "id": row.id,
            "timestamp": row.timestamp.isoformat(),
            "srcIp": row.src_ip,
            "srcPort": row.src_port,
            "dstIp": row.dst_ip,
            "dstPort": row.dst_port,
            "protocol": normalize_protocol(row.protocol),
            "label": row.label,
            "confidence": row.confidence,
            "uncertain": row.uncertain,
            "alternative": row.alternative,
            "isAlert": row.is_alert,
            # Tier 2 -- the full 77-feature vector, for drill-down only
            "rawFeatures": row.raw_features,
        }
    finally:
        db.close()
        
@app.post("/predict")
def predict(req: PredictRequest):
    t0 = time.time()

    X_main = _build_feature_vector(_predict_main_features, req.protocol, req.packetSize, req.port)
    main_probs = _predict_main_model.predict(X_main)[0]
    main_idx = int(np.argmax(main_probs))
    label = _lookup_label(_predict_main_labels, main_idx)
    confidence = float(main_probs[main_idx])

    if label in WEB_ATTACK_CLASSES:
        X_sub = _build_feature_vector(_predict_sub_features, req.protocol, req.packetSize, req.port)
        sub_probs = _predict_sub_model.predict(X_sub)[0]
        sub_idx = int(np.argmax(sub_probs))
        label = _lookup_label(_predict_sub_labels, sub_idx)
        confidence = float(sub_probs[sub_idx])

    risk = risk_level_for(label)
    response_time_ms = round((time.time() - t0) * 1000, 1)

    return {
        "classification": label,
        "confidence": confidence,
        "riskLevel": risk,
        "recommendation": RECOMMENDATIONS.get(label, DEFAULT_RECOMMENDATION if label != BENIGN_LABEL else "No action required. Continue monitoring."),
        "description": (
            f"Classified as '{label}' based on limited packet parameters "
            f"(protocol, size, port) -- approximated, not a full 77-feature "
            f"flow analysis. Confidence reflects model certainty on this "
            f"partial input only."
        ),
        "responseTimeMs": response_time_ms,
    }