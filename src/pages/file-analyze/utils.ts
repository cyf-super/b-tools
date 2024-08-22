import { HREF, IMAGE, ZIP, sort } from '@/utils';

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
  const zipDir: string[] = [];
  const setType = new Set<string>();

  files.forEach(file => {
    if (file.name === '.DS_Store') return;
    const {
      subDir,
      fileName,
      suffix: fileSuffix
    } = getFileName(file.webkitRelativePath);
    setType.add(fileSuffix);

    if (IMAGE.includes(fileSuffix)) {
      imgDir.push(file.webkitRelativePath);
    } else if (ZIP.includes(fileSuffix)) {
      zipDir.push(file.webkitRelativePath);
    } else if (HREF.includes(fileSuffix)) {
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
      // 只处理二级目录
      let dirList = file.webkitRelativePath.split('/');
      if (dirList.length > 2) {
        let dir = '';
        if (isAddSubDir) {
          dir = dirList.slice(1, -1).join('/');
        } else {
          dir = dirList[1];
        }
        const flag = nameList.some(name => dir === name);
        if (!flag && dir) {
          nameList.push(dir);
        }
      }
    }
  });

  return {
    nameList: nameList.sort(naturalSort),
    typeList: [...setType].sort(naturalSort),
    urlDir: urlDir.sort(naturalSort),
    imgDir: imgDir.sort(naturalSort),
    textDir: textDir.sort(naturalSort),
    zipDir: zipDir.sort(naturalSort)
  };
}

// 自然排序函数
export function naturalSort(a: string, b: string) {
  const regex = /(\d+|\D+)/g; // 匹配数字和非数字部分
  const partsA = a.match(regex)!;
  const partsB = b.match(regex)!;
  return sort(partsA, partsB);
}
