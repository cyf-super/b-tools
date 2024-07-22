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

export function getFileName(webkitRelativePath: string) {
  const nameArr = webkitRelativePath.split('.');
  const suffix = nameArr.pop()!;
  const subDir = nameArr.join('.').split('/').slice(1).join('/');
  const fileName = nameArr.join('.').split('/').pop()!;
  return {
    subDir,
    fileName,
    suffix: suffix.toLocaleLowerCase()
  };
}

export function analyzeFiles(
  files: File[],
  {
    isSuffix,
    isDir,
    isAddSubDir
  }: { isSuffix: boolean; isDir: boolean; isAddSubDir: boolean }
) {
  const imgDir: string[] = [];
  const urlDir: string[] = [];
  const nameList: string[] = [];
  const textDir: string[] = [];

  files.forEach(file => {
    if (file.name === '.DS_Store') return;
    const {
      subDir,
      fileName,
      suffix: fileSuffix
    } = getFileName(file.webkitRelativePath);

    if (IMAGE.includes(fileSuffix)) {
      imgDir.push(file.webkitRelativePath);
    } else if (fileSuffix === 'html') {
      urlDir.push(file.webkitRelativePath);
    } else if (fileSuffix === 'txt') {
      textDir.push(file.webkitRelativePath);
    } else if (!isDir) {
      if (isAddSubDir) {
        nameList.push(isSuffix ? subDir + '.' + fileSuffix : subDir);
      } else {
        nameList.push(isSuffix ? file.name : fileName);
      }
    }
    if (isDir) {
      // 只处理一级目录
      let dir = file.webkitRelativePath.split('/')[0];
      if (isAddSubDir) {
        dir = file.webkitRelativePath.split('/').slice(1, -1).join('/');
      }
      const flag = nameList.some(name => dir === name);
      if (!flag && dir) {
        nameList.push(dir);
      }
    }
  });

  return {
    nameList: nameList.sort(naturalSort),
    urlDir: urlDir.sort(naturalSort),
    imgDir: imgDir.sort(naturalSort),
    textDir: textDir.sort(naturalSort)
  };
}

// 自然排序函数
function naturalSort(a: string, b: string) {
  const regex = /(\d+|\D+)/g; // 匹配数字和非数字部分
  const partsA = a.match(regex)!;
  const partsB = b.match(regex)!;

  for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
    const partA = partsA[i];
    const partB = partsB[i];

    // 如果都是数字，进行数值比较
    if (
      !isNaN(partA as unknown as number) &&
      !isNaN(partB as unknown as number)
    ) {
      const numA = parseFloat(partA);
      const numB = parseFloat(partB);
      if (numA !== numB) {
        return numA - numB;
      }
    } else {
      // 否则进行字符串比较
      const comparison = partA.localeCompare(partB);
      if (comparison !== 0) {
        return comparison;
      }
    }
  }

  return partsA.length - partsB.length; // 如果一方更长，排在后面
}
