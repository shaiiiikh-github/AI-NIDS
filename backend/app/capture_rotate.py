"""
Continuously captures live traffic in rotating 30-second .pcap files using
tshark, so CICFlowMeter's offline mode can process each completed capture
into flow-feature CSVs shortly after it's written.

This is the "near real-time" front end: instead of CICFlowMeter sniffing
packets directly (which needs the fragile jnetpcap dependency), tshark
does the capturing -- it's actively maintained and needs no extra Java
dependencies -- and CICFlowMeter just analyzes the finished pcap files.

USAGE:
    python capture_rotate.py
    (leave running in its own terminal window during monitoring)
"""

import subprocess
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
TSHARK_PATH = r"C:\Program Files\Wireshark\tshark.exe"
INTERFACE = r"\Device\NPF_{27E7153A-017C-473F-896A-C94AE6B8FAB2}"  # Wi-Fi (stable device path, not numbered index)
CAPTURE_DIR = os.path.join(PROJECT_ROOT, "pcap_capture")

ROTATE_SECONDS = 30                 # new file every 30s -- lower = more real-time, more CPU/disk churn
RING_BUFFER_FILES = 20              # keep only the most recent N files (auto-deletes older ones)


def main():
    os.makedirs(CAPTURE_DIR, exist_ok=True)
    output_pattern = os.path.join(CAPTURE_DIR, "capture.pcap")

    cmd = [
        TSHARK_PATH,
        "-i", INTERFACE,
        "-b", f"duration:{ROTATE_SECONDS}",
        "-b", f"files:{RING_BUFFER_FILES}",
        "-w", output_pattern,
    ]

    print("Starting rotating capture...")
    print(f"  Interface: {INTERFACE} (Wi-Fi)")
    print(f"  Rotating every {ROTATE_SECONDS}s, keeping last {RING_BUFFER_FILES} files")
    print(f"  Writing to: {CAPTURE_DIR}")
    print("  Press Ctrl+C to stop.\n")

    try:
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\nCapture stopped.")
    except subprocess.CalledProcessError as e:
        print(f"\ntshark exited with an error: {e}")
        print("Common cause: needs Administrator privileges for packet capture. "
              "Try running this terminal as Administrator.")


if __name__ == "__main__":
    main()