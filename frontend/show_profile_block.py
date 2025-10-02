from pathlib import Path
lines = Path("src/core/i18n/messages/vi.json").read_text(encoding="utf-8").splitlines()
start = None
for i, line in enumerate(lines):
    if '"profile": {' in line:
        start = i
        break
if start is None:
    raise SystemExit('profile block not found')
for j in range(start, start + 40):
    print(f"{j+1}: {lines[j]}")
