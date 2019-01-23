#!/usr/bin/env node
const path = require('path');
const os = require('os');
const fs = require('fs');
const labelImage = require('app-icon/src/label/label-image');
const generate = require('app-icon/src/generate');

const LABEL_TOP = process.env['ICON_LABEL_TOP'] || '';
const LABEL_BOTTOM = process.env['ICON_LABEL_BOTTOM'] || '';
const DEFAULT_ICON_PATH = process.env['ICON_INPUT'] || 'resources/icon.png';

module.exports = function(ctx) {
  return run(ctx);
};

function run(cordovaContext) {
  const platforms = cordovaContext.opts.platforms;
  return checkPlatformIcons(platforms)
    .then(generateLabels)
    .then(generateIcons)
    .catch(err => {
      throw err;
    });
}

function checkPlatformIcons(platforms) {
  return Promise.all(platforms.map(checkPlatformIcon));
}

function checkPlatformIcon(platform) {
  const platformFolderName = platform.toLowerCase();
  const platformIconPath = `resources/${platformFolderName}/icon.png`;

  return new Promise((resolve) => {
    fs.exists(platformIconPath, (exists) => {
      const finalIconPath = (exists) ?
        `resources/${platformFolderName}/icon.png` :
        DEFAULT_ICON_PATH;
      resolve({ platform: platformFolderName, iconPath: finalIconPath });
    });
  });
}

function generateLabels(icons) {
  const output = path.join(os.tmpdir(), 'icon-label');

  return Promise.all(
    icons.map(
      ({ platform, iconPath }) => {
        const outputIcon = `${output}-${platform}.png`;

        return new Promise((resolve, reject) => {
          if (!LABEL_TOP && !LABEL_BOTTOM) return resolve({ platform, iconPath });
          labelImage(iconPath, outputIcon, LABEL_TOP, LABEL_BOTTOM).then(() => {
            return resolve({ platform, iconPath: outputIcon });
          });
        });
      }
    ),
  ).then(iconArr => {
    const icons = {};
    iconArr.forEach(({ platform, iconPath }) => {
      icons[platform] = iconPath;
    });

    return icons;
  });
}

function generateIcons(icons) {
  const search = '';

  return Promise.all(Object.keys(icons).map(platform => generate({ sourceIcon: icons[platform], search, platforms: platform })));
}
