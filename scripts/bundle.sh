#!/usr/bin/env bash
set -euo pipefail

SRCDIR="$(cd "$(dirname "$0")/.." && pwd)"
PKG_NAME="companion-module-blinkybeacon"
PKG_VERSION="$(node -p "require('$SRCDIR/package.json').version")"
OUTDIR="$SRCDIR/pkg/blinkybeacon"
OUT="$SRCDIR/${PKG_NAME}-${PKG_VERSION}.tgz"
FINALDIR="$SRCDIR/final-build"

echo "Type-checking..."
cd "$SRCDIR"
node_modules/.bin/tsc --noEmit

echo "Bundling with esbuild..."
rm -rf "$SRCDIR/pkg"
mkdir -p "$OUTDIR"
node_modules/.bin/esbuild src/index.ts \
  --bundle \
  --platform=node \
  --format=esm \
  --target=node22 \
  --outfile="$OUTDIR/main.js" \
  --minify

echo "Writing manifest..."
mkdir -p "$OUTDIR/companion"
# Stamp the runtime.apiVersion from the installed base lib version
BASE_VER="$(node -p "require('./node_modules/@companion-module/base/package.json').version")"
node -e "
  const fs = require('fs');
  const m = JSON.parse(fs.readFileSync('companion/manifest.json', 'utf8'));
  m.runtime.apiVersion = '$BASE_VER';
  m.version = '$PKG_VERSION';
  fs.writeFileSync('$OUTDIR/companion/manifest.json', JSON.stringify(m, null, 2));
"

echo "Writing package.json..."
node -e "
  const src = require('./package.json');
  const out = { name: src.name, version: src.version, license: src.license, type: 'module' };
  require('fs').writeFileSync('$OUTDIR/package.json', JSON.stringify(out, null, 2));
"

echo "Creating archive: $OUT"
cd "$SRCDIR/pkg"
tar -czf "$OUT" blinkybeacon/

echo "Updating final-build/..."
rm -rf "$FINALDIR"
cp -r "$OUTDIR" "$FINALDIR"

SIZE="$(du -sh "$OUT" | cut -f1)"
echo ""
echo "  Bundle (web UI import): $OUT  ($SIZE)"
echo "  Live dir:               $FINALDIR"
