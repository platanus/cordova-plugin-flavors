#!/usr/bin/env node
const path = require('path');
const os = require('os');
const isImagemagickInstalled = require('app-icon/src/imagemagick/is-imagemagick-installed');
const labelImage = require('app-icon/src/label/label-image');
const generate = require('app-icon/src/generate');

module.exports = function(ctx) {
  return run(ctx);
};

function run(cordovaContext) {
  const input = process.env['ICON_INPUT'] || 'resources/icon.png';
  const output = path.join(os.tmpdir(), 'icon-label.png');

  const label_top = process.env['ICON_LABEL_TOP'] || '';
  const label_bottom = process.env['ICON_LABEL_BOTTOM'] || '';

  const platforms = cordovaContext.opts.platforms.join(',');
  const search = '';

  return isImagemagickInstalled()
    .catch(err => {
      throw err;
    })
    .then(imageMagickInstalled => {
      if (!imageMagickInstalled) {
        console.error('  Error: ImageMagick must be installed. Try:');
        console.error('    brew install imagemagick');
        return process.exit(1);
      }

      //  Label the icon
      return new Promise((resolve, reject) => {
        if (!label_top && !label_bottom) return resolve(input);
        labelImage(input, output, label_top, label_bottom).then(() => {
          return resolve(output);
        });
      });
    })
    .then(icon => {
      return generate({ sourceIcon: icon, search, platforms });
    });
}
