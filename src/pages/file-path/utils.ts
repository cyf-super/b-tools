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
