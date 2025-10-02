from pathlib import Path
lines = Path("src/app/profile/page.tsx").read_text().splitlines()
for idx, line in enumerate(lines, start=1):
    if 't("profile_' in line:
        print(idx, line)
