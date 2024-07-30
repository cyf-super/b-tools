import { toPng } from 'html-to-image';
import { IMAGE, PDF, PPT, VIDEO, VOICE, WORD, ZIP, sort } from '@/utils';
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

export function analyzeFiles(files: File[]) {
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
    }
    nameList.push({ name: file.name, image: img, suffix: fileSuffix });

    // 只处理一级目录
    const dirArr = file.webkitRelativePath.split('/');
    if (dirArr.length > 2) {
      const dir = dirArr[1];
      const flag = dirList.some(item => dir === item.name);
      if (!flag && dir) {
        dirList.push({ name: dir, image: folder, suffix: 'dir' });
      }
    }
  });

  return {
    nameList: nameList.sort(ObjectNaturalSort),
    typeList: [...setType].sort(naturalSort),
    dirList: [...dirList].sort(ObjectNaturalSort)
  };
}

// 自然排序函数
export function ObjectNaturalSort(a: Item, b: Item) {
  const regex = /(\d+|\D+)/g; // 匹配数字和非数字部分
  const partsA = a.name.match(regex)!;
  const partsB = b.name.match(regex)!;
  return sort(partsA, partsB);
}

export function download(image: string, name: string) {
  const link = document.createElement('a');
  link.href = image;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function generateImg(width = 375, nodeId = 'list') {
  const node = document.getElementById(nodeId) as HTMLElement;
  return toPng(node, {
    width,
    quality: 1,
    pixelRatio: 2
  });
}

/**
 * 获取初始化数组
 * @param length
 * @returns
 */
export const getArr = (length: number) =>
  Array.from({ length }, (_, index) => index);
