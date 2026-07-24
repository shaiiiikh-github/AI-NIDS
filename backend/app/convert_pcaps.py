"""
Watches the folder where capture_rotate.py writes rotating .pcap files,
and converts each newly-completed pcap into a flow-feature CSV -- feeding
live_ids_monitor.py's input folder.

WHY THIS DOESN'T USE THE `cicflowmeter` COMMAND-LINE TOOL DIRECTLY
Tested and confirmed broken: cicflowmeter's FlowSession expects scapy to
call its on_packet_received() method as a per-packet hook during sniffing
(this was how older scapy's session API worked). The scapy version that
pip installs alongside cicflowmeter today (2.7.0) uses a different session
API (process()/recv()) and never calls on_packet_received() at all -- so
running the actual `cicflowmeter` CLI silently produces EMPTY CSVs. This
isn't a flag or config issue; it's a real incompatibility between the two
package versions.

THE WORKAROUND
on_packet_received() and garbage_collect() are plain Python methods with
no scapy-specific magic in them -- they just take a packet object and
update internal flow state. So this script reads packets directly with
scapy's PcapReader (which works fine on its own) and calls those methods
itself in a simple loop, fully bypassing the broken hook while reusing
100% of cicflowmeter's actual flow-feature calculation logic. Verified
end-to-end against a real pcap before being handed to you.

USAGE:
    pip install cicflowmeter==0.2.0 scapy
    python convert_pcaps.py
    (leave running in its own terminal window during monitoring)
"""

import os
import time

from scapy.utils import PcapReader
from cicflowmeter.flow_session import FlowSession

PCAP_DIR = r"D:\AI-NIDS\pcap_capture"
CSV_OUTPUT_DIR = r"D:\AI-NIDS\live_capture"     # matches CICFLOWMETER_OUTPUT_DIR in live_ids_monitor.py
POLL_INTERVAL_SECONDS = 5
SETTLE_SECONDS = 3   # wait this long after a pcap stops growing before converting,
                      # so we don't grab a file tshark is still mid-write on


def get_pcap_files(folder):
    if not os.path.isdir(folder):
        return {}
    files = {}
    for fname in os.listdir(folder):
        if fname.lower().endswith((".pcap", ".pcapng")):
            path = os.path.join(folder, fname)
            try:
                files[path] = os.path.getsize(path)
            except OSError:
                continue
    return files


def convert_one(pcap_path, csv_output_dir):
    """Convert a single pcap to a flow-feature CSV by driving
    cicflowmeter's FlowSession directly (see module docstring for why)."""
    fname = os.path.splitext(os.path.basename(pcap_path))[0]
    out_csv = os.path.join(csv_output_dir, f"{fname}.csv")

    FlowSession.output_mode = "csv"
    FlowSession.output = out_csv
    FlowSession.fields = None
    FlowSession.verbose = False

    session = FlowSession()

    packet_count = 0
    try:
        with PcapReader(pcap_path) as reader:
            for pkt in reader:
                if "TCP" in pkt or "UDP" in pkt:
                    session.on_packet_received(pkt)
                    packet_count += 1
    except Exception as e:
        return False, f"pcap read error: {e}", 0

    session.garbage_collect(None)   # flush all remaining flows
    return True, None, packet_count


def main():
    os.makedirs(CSV_OUTPUT_DIR, exist_ok=True)

    print(f"Watching {PCAP_DIR} for completed pcap files...")
    print(f"Writing flow CSVs to {CSV_OUTPUT_DIR}")
    print(f"Polling every {POLL_INTERVAL_SECONDS}s. Press Ctrl+C to stop.\n")

    processed = set()
    last_sizes = {}

    try:
        while True:
            current = get_pcap_files(PCAP_DIR)

            for path, size in current.items():
                if path in processed:
                    continue

                prev_size = last_sizes.get(path)
                if prev_size is not None and prev_size == size:
                    # Size unchanged since last poll -- likely done being written.
                    time.sleep(SETTLE_SECONDS)
                    if os.path.getsize(path) != size:
                        continue  # still growing, check again next poll

                    print(f"Converting {os.path.basename(path)} ...")
                    ok, err, n_pkts = convert_one(path, CSV_OUTPUT_DIR)
                    if ok:
                        print(f"  Done ({n_pkts} packets processed).")
                    else:
                        print(f"  [ERROR] {err}")

                    processed.add(path)

            last_sizes = current
            time.sleep(POLL_INTERVAL_SECONDS)

    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()