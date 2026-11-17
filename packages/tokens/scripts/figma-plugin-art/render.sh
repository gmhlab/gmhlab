#!/bin/sh
# Renders the listing art for both Figma plugins into their folders:
# icon.png (128×128) and thumbnail.png (1920×1080). Needs Google Chrome and a
# built @gmhlab/tokens (art.html reads its colours from dist/index.css).
set -e
cd "$(dirname "$0")"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PAGE="file://$(pwd)/art.html"
shot() { # plugin asset width height
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --allow-file-access-from-files --virtual-time-budget=3000 \
    --window-size="$3,$4" --screenshot="../figma-copy-$1/$2.png" \
    "$PAGE?plugin=$1&asset=$2" 2>/dev/null
  echo "figma-copy-$1/$2.png"
}
for p in variables styles; do
  shot "$p" icon 128 128
  shot "$p" thumbnail 1920 1080
done
