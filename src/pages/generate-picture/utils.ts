import { toPng } from 'html-to-image';
import { IMAGE, PDF, PPT, PSD, VIDEO, VOICE, WORD, ZIP, sort } from '@/utils';
import { Item } from '.';
import { naturalSort } from '../file-analyze/utils';
import image from './img/image.png';
import fileImg from './img/file.png';
import folder from './img/folder.png';
import pdf from './img/pdf.png';
import ppt from './img/ppt.png';
import video from './img/video.png';
import voice from './img/voice.png';
import zip from './img/zip.png';
import word from './img/word.png';
import psd from './img/psd.png';

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
  options: {
    isThirtDir: boolean;
  }
) {
  const nameList: Item[] = [];
  const dirList: Item[] = [];
  const setType = new Set<string>();

  files.forEach(file => {
    if (file.name === '.DS_Store') return;
    const { suffix: fileSuffix } = getFileName(file.webkitRelativePath);
    setType.add(fileSuffix);

    let img = fileImg;
    if (ZIP.includes(fileSuffix)) {
      img = zip;
    } else if (VIDEO.includes(fileSuffix)) {
      img = video;
    } else if (VOICE.includes(fileSuffix)) {
      img = voice;
    } else if (IMAGE.includes(fileSuffix)) {
      img = image;
    } else if (PPT.includes(fileSuffix)) {
      img = ppt;
    } else if (PDF.includes(fileSuffix)) {
      img = pdf;
    } else if (WORD.includes(fileSuffix)) {
      img = word;
    } else if (PSD.includes(fileSuffix)) {
      img = psd;
    }
    nameList.push({ name: file.name, image: img, suffix: fileSuffix });

    // 只处理二三级目录
    const dirArr = file.webkitRelativePath.split('/');
    if (dirArr.length > 2) {
      let dir = '';
      if (options.isThirtDir) {
        dirArr.length > 3 && (dir = dirArr[2]);
      } else {
        dir = dirArr[1];
      }
      const flag = dirList.some(item => dir === item.name);
      if (!flag && dir) {
        dirList.push({ name: dir, image: folder, suffix: 'dir' });
      }
    }
  });

  return {
    nameList: nameList.sort(ObjectNaturalSort),
    typeList: [...setType].sort(naturalSort),
    dirList: [...dirList].sort(ObjectNaturalSort),
    dirName: files[0].webkitRelativePath.split('/')[0]
  };
}

// 自然排序函数
export function ObjectNaturalSort(a: Item, b: Item) {
  const regex = /(\d+|\D+)/g; // 匹配数字和非数字部分
  const partsA = a.name.match(regex)!;
  const partsB = b.name.match(regex)!;
  return sort(partsA, partsB);
}

export async function generateImg({
  width = 375,
  nodeId = 'list',
  isSingle = false
}: {
  width: number;
  nodeId?: string;
  isSingle?: boolean;
}) {
  const node = document.getElementById(nodeId) as HTMLElement;
  if (isSingle) {
    node.style.paddingBottom = '11px';
  }
  return toPng(node, {
    width,
    quality: 1,
    pixelRatio: 2
  });
}
