#!/usr/bin/env bash
set -euo pipefail

SRCDIR="$(cd "$(dirname "$0")/.." && pwd)"
PKG_NAME="companion-module-blinkybeacon"
PKG_VERSION="$(node -p "require('$SRCDIR/package.json').version")"
STAGEDIR="/tmp/${PKG_NAME}-stage"
ROOTDIR="${STAGEDIR}/${PKG_NAME}"       # single root dir — stripped by Companion on install
OUT="$SRCDIR/${PKG_NAME}-${PKG_VERSION}.tgz"
FINALDIR="$SRCDIR/final-build"

echo "Building TypeScript..."
cd "$SRCDIR"
npm run build

echo "Staging production install..."
rm -rf "$STAGEDIR"
mkdir -p "$ROOTDIR"
cp -r dist companion package.json package-lock.json "$ROOTDIR/"
cd "$ROOTDIR"
npm ci --omit=dev --silent

echo "Creating Companion bundle: $OUT"
cd "$STAGEDIR"
tar -czf "$OUT" "${PKG_NAME}/"

echo "Updating final-build/..."
rm -rf "$FINALDIR"
cp -r "$ROOTDIR" "$FINALDIR"

SIZE="$(du -sh "$OUT" | cut -f1)"
echo ""
echo "  Bundle (web UI import): $OUT  ($SIZE)"
echo "  Live dir (developer):   $FINALDIR"
