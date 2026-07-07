import fs from 'fs';
import path from 'path';

const uiDir = 'apps/web/src/components/ui';
const srcDir = 'apps/web/src';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allSrcFiles = getAllFiles(srcDir);
const uiFiles = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

for (const uiFile of uiFiles) {
  const componentName = uiFile.replace('.tsx', '');
  // Pascal case
  const pascalName = componentName.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  
  let isUsed = false;
  for (const srcFile of allSrcFiles) {
    if (srcFile === path.join(uiDir, uiFile)) continue;
    const content = fs.readFileSync(srcFile, 'utf-8');
    if (content.includes(`@/components/ui/${componentName}`) || content.includes(`from "./${componentName}"`) || content.includes(`from './${componentName}'`)) {
      isUsed = true;
      break;
    }
  }
  
  if (!isUsed) {
    console.log(uiFile);
  }
}
