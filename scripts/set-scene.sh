#!/usr/bin/env bash
# Picks sunrise / day / sunset / night from the current time in India (IST)
# and copies the matching artwork into place.
set -euo pipefail
H=$(TZ=Asia/Kolkata date +%-H)
if   (( H >= 5  && H < 8  )); then MODE=sunrise
elif (( H >= 8  && H < 16 )); then MODE=day
elif (( H >= 16 && H < 19 )); then MODE=sunset
else                               MODE=night
fi
cp "assets/scenes/header-${MODE}.svg"    assets/header.svg
cp "assets/about/about-dark-${MODE}.svg"  assets/about-dark.svg
cp "assets/about/about-light-${MODE}.svg" assets/about-light.svg
cp "assets/footer/footer-${MODE}.svg"     assets/footer.svg
echo "mode=${MODE}" >> "${GITHUB_OUTPUT:-/dev/null}"
echo "IST hour ${H} -> ${MODE}"
