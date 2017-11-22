const util = require('util');
const path = require('path');
const execFile = util.promisify(require('child_process').execFile);

module.exports = function(ctx) {
  return run(ctx);
};

function run(cordovaContext) {
  const input = process.env['SPLASH_INPUT'] || 'resources/splash.png';

  const cordova_splash = path.join(
      'node_modules',
      'cordova-splash',
      'bin',
      'cordova-splash'
    );

  return execFile(cordova_splash, [`--splash=${input}`]).then(stats => {
    console.log(stats.stdout);
  });
}
