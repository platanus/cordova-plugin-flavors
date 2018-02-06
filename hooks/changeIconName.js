#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const xml = require('cordova-common').xmlHelpers;

module.exports = function (ctx) {
  return run(ctx);
};

// based on https://stackoverflow.com/a/35128023
function run(ctx) {
  console.log('Updating AndroidManifest.xml with correct icon name');
  const manifestPath = path.join(ctx.opts.projectRoot, 'platforms/android/AndroidManifest.xml');
  const doc = xml.parseElementtreeSync(manifestPath);
  if (doc.getroot().tag !== 'manifest') {
    throw new Error(`${manifestPath} has incorrect root node name (expected "manifest")`);
  }

  doc.getroot().find('./application').attrib['android:icon'] = '@mipmap/ic_launcher';

  fs.writeFileSync(manifestPath, doc.write({ indent: 4 }), 'utf-8');
}
