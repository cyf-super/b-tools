// 自然排序函数
export function sort(partsA: RegExpMatchArray, partsB: RegExpMatchArray) {
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

export const IMAGE = [
  'bmp',
  'jpg',
  'png',
  'tif',
  'gif',
  'exif',
  'svg',
  'psd',
  'pcd',
  'ai',
  'raw',
  'WMF',
  'webp',
  'avif'
];
export const ZIP = ['zip', 'exe', 'rar', '7z', 'tar'];
export const HREF = ['html', 'url'];
export const VIDEO = ['mp4', '3gp', 'avi', 'wmv', 'mpeg', 'mpg', 'mov', 'flv'];
export const VOICE = ['mp3', 'mp2', 'mp1', 'wav'];
export const PPT = ['ppt', 'pptx'];
export const WORD = ['docx', 'doc', 'docx'];
export const PDF = ['pdf'];
