#!/usr/bin/env bash
# Picks the header scene for the current time in India (IST) and copies it to assets/header.svg.
set -euo pipefail
H=$(TZ=Asia/Kolkata date +%-H)
if   (( H >= 5  && H < 8  )); then MODE=sunrise
elif (( H >= 8  && H < 16 )); then MODE=day
elif (( H >= 16 && H < 19 )); then MODE=sunset
else                               MODE=night
fi
cp "assets/scenes/header-${MODE}.svg" assets/header.svg
echo "mode=${MODE}" >> "${GITHUB_OUTPUT:-/dev/null}"
echo "IST hour ${H} -> ${MODE}"
