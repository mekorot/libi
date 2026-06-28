#!/usr/bin/env python3
"""
Local development server for the Mekorot chat UI.
Serves all files in the same directory on http://localhost:8080
and automatically opens the browser.

Usage:
    python serve.py          # default port 8080
    python serve.py 3000     # custom port
"""

import http.server
import socketserver
import webbrowser
import sys
import os
import mimetypes

# Ensure .docx is served with the correct MIME type so browsers
# trigger a Save dialog rather than trying to render the file.
mimetypes.add_type(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.docx'
)

# ── Config ────────────────────────────────────────────────────────────────────
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
HOST = "localhost"
# ──────────────────────────────────────────────────────────────────────────────

# Serve from the directory where this script lives
os.chdir(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler with cleaner console output."""

    def log_message(self, fmt, *args):
        # Suppress noisy 304 / favicon logs; keep the useful ones
        status = args[1] if len(args) > 1 else ""
        if status in ("304", "404") and "favicon" in self.path:
            return
        print(f"  {self.address_string()}  {fmt % args}")


def main():
    url = f"http://{HOST}:{PORT}"

    with socketserver.TCPServer((HOST, PORT), Handler) as httpd:
        httpd.allow_reuse_address = True
        print()
        print("  ┌─────────────────────────────────────────┐")
        print(f"  │  🌊  Mekorot chat UI – dev server        │")
        print(f"  │  Listening on  {url:<26}│")
        print("  │  Press Ctrl+C to stop                   │")
        print("  └─────────────────────────────────────────┘")
        print()

        # Open the browser after a short delay so the server is ready
        webbrowser.open(url)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Server stopped.")


if __name__ == "__main__":
    main() 