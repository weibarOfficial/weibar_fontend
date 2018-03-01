const fsE = require('fs-extra');
const path = require('path');
const srcDir = path.resolve(__dirname, 'dist');
const srcCommonsDir = path.resolve(__dirname, './src/js/commons');
const srcStylesDir = path.resolve(__dirname, './src/style');
const destDir = path.resolve(__dirname, '../../weibar/web/src/main/resources/static/static');
fsE.emptyDirSync(path.join(destDir, 'js'));
fsE.copySync( srcCommonsDir, path.join(destDir, 'js', 'commons'));
fsE.copySync( srcStylesDir, path.join(destDir, 'style'));
fsE.copy( srcDir, destDir)
  .then(() => console.log('success!'))
  .catch(err => console.error(err))