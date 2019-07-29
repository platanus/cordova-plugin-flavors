#!/usr/bin/env node
const path = require('path');
const os = require('os');
const fs = require('fs');

const im = require('imagemagick');

const generate = require('app-icon/src/generate');

const LABEL_TOP = process.env['ICON_LABEL_TOP'] || '';
const LABEL_BOTTOM = process.env['ICON_LABEL_BOTTOM'] || '';
const DEFAULT_ICON_PATH = process.env['ICON_INPUT'] || 'resources/icon.png'; 
const ADAPTIVE_ICON_BACKGROUND_PATH = process.env['ICON_BACKGROUND_INPUT'] || 'resources/android/ic_launcher_background.png';
const ADAPTIVE_ICON_FOREGROUND_PATH = process.env['ICON_FOREGROUND_INPUT'] || 'resources/android/ic_launcher.png';

const useAdaptiveIcons = fs.existsSync(ADAPTIVE_ICON_BACKGROUND_PATH) && fs.existsSync(ADAPTIVE_ICON_FOREGROUND_PATH);

module.exports = function(ctx) {
  return run(ctx);
};

function run(cordovaContext) {
  const platforms = cordovaContext.opts.platforms;

  return checkPlatformIcons(platforms)
    .then(getDimentions)
    .then(generateLabels)
    .then(generateIcons)
    .catch(err => {
      throw err;
    });
}

function getDimentions(icons) {
  return Promise.all(icons.map(getDimention))
}

function getDimention(icon) {
  return new Promise((resolve) => {
    im.identify(icon.iconPath, (err, features) => {
      if (err) throw err;
      icon.width = features.width;
      icon.height = features.height;
      resolve(icon);
    });
  }) 
}

function checkPlatformIcons(platforms) {
  return Promise.all(platforms.map(checkPlatformIcon));
}

function checkPlatformIcon(platform) {
  const platformFolderName = platform.toLowerCase();
  let platformIconPath = `resources/${platformFolderName}/icon.png`;

  if (platformFolderName == 'android' && useAdaptiveIcons) {
    platformIconPath = ADAPTIVE_ICON_FOREGROUND_PATH;
  }

  return new Promise((resolve) => {
    fs.exists(platformIconPath, (exists) => {
      const finalIconPath = (exists) ?
        platformIconPath :
        DEFAULT_ICON_PATH;
      resolve({ platform: platformFolderName, iconPath: finalIconPath });
    });
  });
}

function generateLabels(icons) {
  const output = path.join(os.tmpdir(), 'icon-label');

  return Promise.all(
    icons.map(
      ({ platform, iconPath, width, height }) => {
        const outputIcon = `${output}-${platform}.png`;

        return new Promise((resolve, reject) => {
          if (!LABEL_TOP && !LABEL_BOTTOM) return resolve({ platform, iconPath });
          let wOffset = parseInt(parseInt(width, 10) * 0.35);
          let labelHOffset = parseInt(parseInt(height, 10) * 0.55);
          let labelH = parseInt(parseInt(height, 10) * 0.2); 
          im.convert([
              iconPath,
              '-size', `${width - wOffset}x${labelH}!`, '-background', '#000000bb', '-fill', 'white',
              `caption:  ${LABEL_BOTTOM}`, '-geometry', `+${wOffset}+${labelHOffset}`, '-composite', outputIcon
            ], (err, stout) => {
              if (err) throw err;
              return resolve({ platform, iconPath: outputIcon });
            })
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
  if (useAdaptiveIcons) {
    return Promise.all(Object.keys(icons).map(platform => generate({
      sourceIcon: icons[platform],
      backgroundIcon: ADAPTIVE_ICON_BACKGROUND_PATH,
      foregroundIcon: icons[platform],
      search,
      platforms: platform,
      adaptiveIcons: true
    })));
  } else {
    console.log('No adaptive icons found. Creating legacy icons.');
    return Promise.all(Object.keys(icons).map(platform => generate({ sourceIcon: icons[platform], search, platforms: platform })));
  }
}
