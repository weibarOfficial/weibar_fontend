const fsE = require('fs-extra');
const path = require('path');
const srcDir = path.resolve(__dirname, 'dist');
const srcCommonsDir = path.resolve(__dirname, './src/js/commons');
const srcModulesDir = path.resolve(__dirname, './src/js/modules');
const srcStylesDir = path.resolve(__dirname, './src/style');

/**
 *目录路径 
  weibar_fontend\frontend\h5
  weibar\weibar\web\src\main\resources
 */
const destDir = path.resolve(__dirname, '../../../weibar/weibar/web/src/main/resources/static/static/pc');
if(!fsE.existsSync(destDir)){
  console.log('目录路径不正确。');
  return false;
}
fsE.emptyDirSync(path.join(destDir, 'js'));
fsE.emptyDirSync(path.join(destDir, 'style'));
fsE.copySync( srcCommonsDir, path.join(destDir, 'js', 'commons'));
fsE.copySync( srcModulesDir, path.join(destDir, 'js', 'modules'));
fsE.copySync( srcStylesDir, path.join(destDir, 'style'));
fsE.copy( srcDir, destDir)
  .then(() => console.log('success!'))
  .catch(err => console.error(err))