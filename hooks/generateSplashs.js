const util = require('util');
const path = require('path');
const execFile = util.promisify(require('child_process').execFile);

module.exports = function(ctx) {
  return run(ctx);
};

function run(cordovaContext) {
  const input = process.env['SPLASH_INPUT'] || 'resources/splash.png';

  return execFile('npx', ['cordova-splash', `--splash=${input}`]).then(stats => {
    console.log(stats.stdout);
  });
}
