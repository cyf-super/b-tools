export const IMAGE = [
  'bmp',
  'jpg',
  'png',
  'tif',
  'gif',
  'pcx',
  'tga',
  'exif',
  'fpx',
  'svg',
  'psd',
  'cdr',
  'pcd',
  'dxf',
  'ufo',
  'eps',
  'ai',
  'raw',
  'WMF',
  'webp',
  'avif',
  'apng'
];

export function getFileName(fileName: string) {
  const nameArr = fileName.split('.');
  const suffix = nameArr.pop();
  return [nameArr.join('.'), suffix?.toLocaleLowerCase()];
}

export function analyzeFiles(files: File[], isSuffix: boolean, isDir: boolean) {
  const imgDir: string[] = [];
  const urlDir: string[] = [];
  const nameList: string[] = [];
  const textDir: string[] = [];

  files.forEach(file => {
    if (file.name === '.DS_Store') return;
    const [fileName = '', fileSuffix = ''] = getFileName(file.name);

    if (IMAGE.includes(fileSuffix)) {
      imgDir.push(file.webkitRelativePath);
    } else if (fileSuffix === 'html') {
      urlDir.push(file.webkitRelativePath);
    } else if (fileSuffix === 'txt') {
      textDir.push(file.webkitRelativePath);
    } else if (!isDir) {
      nameList.push(isSuffix ? file.name : fileName);
    }
    if (isDir) {
      // 只处理一级目录
      const dir = file.webkitRelativePath.split('/')[0];
      const flag = nameList.some(name => dir === name);
      if (!flag) {
        nameList.push(dir);
      }
    }
  });

  return {
    nameList,
    urlDir,
    imgDir,
    textDir
  };
}
