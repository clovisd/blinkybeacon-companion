#!/usr/bin/env bash
set -euo pipefail

SRCDIR="$(cd "$(dirname "$0")/.." && pwd)"
STAGEDIR=/tmp/companion-module-blinkybeacon-stage
OUT="$SRCDIR/companion-module-blinkybeacon.tar.gz"
FINALDIR="$SRCDIR/final-build"

echo "Building TypeScript..."
cd "$SRCDIR"
npm run build

echo "Staging production install..."
rm -rf "$STAGEDIR"
mkdir -p "$STAGEDIR"
cp -r dist companion package.json package-lock.json "$STAGEDIR/"
cd "$STAGEDIR"
npm ci --omit=dev --silent

echo "Creating archive: $OUT"
cd /tmp
tar -czf "$OUT" companion-module-blinkybeacon-stage/

echo "Updating final-build/..."
rm -rf "$FINALDIR"
cp -r "$STAGEDIR" "$FINALDIR"

echo "Done. Bundle: $OUT  ($(du -sh "$OUT" | cut -f1))"
echo "      Live dir: $FINALDIR"
