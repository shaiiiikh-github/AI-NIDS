"""
Shared SQLAlchemy setup for AI-NIDS.

Imported by both:
  - live_ids_monitor.py (writer -- inserts one FlowLog row per classified flow)
  - the FastAPI backend  (reader -- serves /health, /metrics, /flows, etc.)

Two-tier schema:
  Tier 1: real columns, cheap to filter/sort/aggregate, shown in the log
          table by default.
  Tier 2: all 77 model input features, stored as a single JSON blob
          (raw_features), fetched only on row-click / GET /flows/{id}.

DB_PATH is the single source of truth for where the SQLite file lives --
both live_ids_monitor.py and the FastAPI app should import DB_PATH (or just
import the engine/SessionLocal from here directly) rather than hardcoding
their own path, so they always point at the same file.
"""

import os
from datetime import datetime

from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, JSON
from sqlalchemy.orm import declarative_base, sessionmaker

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "logs", "nids.db")   # resolves relative to wherever this file lives

os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

# check_same_thread=False: SQLite by default only allows the connection to be
# used from the thread that created it. FastAPI can handle a request on a
# different thread than the one that opened the session, so this is required.
# It's safe here because we're not sharing a single Session across threads --
# each request/write gets its own Session via SessionLocal().
engine = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


class FlowLog(Base):
    __tablename__ = "flow_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, index=True, default=datetime.utcnow)

    # Tier 1 -- real columns, shown in the log table by default
    src_ip = Column(String, index=True)
    src_port = Column(Integer)
    dst_ip = Column(String, index=True)
    dst_port = Column(Integer)
    protocol = Column(String)

    flow_duration = Column(Float)
    tot_fwd_pkts = Column(Integer)
    tot_bwd_pkts = Column(Integer)

    label = Column(String, index=True)
    confidence = Column(Float)
    uncertain = Column(Boolean, default=False)
    alternative = Column(String, nullable=True)
    is_alert = Column(Boolean, index=True)
    response_time_ms = Column(Float, nullable=True) 

    # Tier 2 -- all 77 model input features, drill-down only
    raw_features = Column(JSON)


def init_db():
    """Create the table if it doesn't exist yet. Safe to call every time
    both live_ids_monitor.py and the FastAPI app start up -- it's a no-op
    if flow_logs already exists."""
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    # Quick manual check: `python db.py` creates the DB file/table so you
    # can confirm it works before wiring it into the other scripts.
    init_db()
    print(f"DB initialized at {DB_PATH}")