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
export const PSD = ['psd'];

export function download(image: string, name: string) {
  const link = document.createElement('a');
  link.href = image;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 计算base64编码图片大小
export function getBase64ImageSize(base64: string) {
  if (!base64) return 0;
  const str = atob(base64.split(',')[1]);
  const bytes = str.length;
  return bytes;
}

const SIZE = 1024;
const SIZE_UNIT = ['B', 'KB', 'MB', 'GB', 'TB'];

/**
 * 将文件大小转化为 KB，MB，GB 等
 * @param bytes 文件的size，单位：B
 * @param radix 保留小数点后几位
 */
export const formatBytes = (bytes: number, radix = 2) => {
  if (bytes === 0) return '0B';
  const index = Math.floor(Math.log(bytes) / Math.log(SIZE));

  return (
    parseFloat((bytes / Math.pow(SIZE, index)).toFixed(radix)) +
    SIZE_UNIT[index]
  );
};

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];

/**
 * 字符串添加0前缀
 * @param str string | number
 * @param len number
 * @returns string
 */
function pad(str: string | number, len = 2): string {
  str += '';
  return '0000'.slice(0, len - (str as string).length) + str;
}

/**
 * 格式化时间
 * @param time string | number | Date
 * @param template string 格式
 * @returns string
 */
export function formatTime(time: string | number | Date, template: string) {
  const date = new Date(time);
  const y = date.getFullYear();
  const M = date.getMonth() + 1;
  const q = Math.floor((M - 1) / 4) + 1; // 季度
  const d = date.getDate();
  const w = date.getDay();
  const H = date.getHours(); // 24小时
  const h = ((H - 1) % 12) + 1; // 12小时
  const m = date.getMinutes();
  const s = date.getSeconds(); // 秒
  const S = date.getMilliseconds(); // 毫秒

  return (template || '')
    .replace(/yyyy/g, y + '')
    .replace(/yy/g, (y % 100) + '')
    .replace(/q/g, q + '')
    .replace(/MM/g, pad(M, 2))
    .replace(/M/g, M + '')
    .replace(/dd/g, pad(d, 2))
    .replace(/d/g, d + '')
    .replace(/WWW/g, '星期' + WEEK_DAYS[w])
    .replace(/WW/g, '周' + WEEK_DAYS[w])
    .replace(/W/g, '' + WEEK_DAYS[w])
    .replace(/HH/g, pad(H, 2))
    .replace(/H/g, H + '')
    .replace(/hh/g, pad(h + '', 2))
    .replace(/h/g, h + '')
    .replace(/mm/g, pad(m, 2))
    .replace(/m/g, m + '')
    .replace(/ss/g, pad(s, 2))
    .replace(/s/g, s + '')
    .replace(/SSS/g, pad(S, 3))
    .replace(/S/g, S + '');
}
