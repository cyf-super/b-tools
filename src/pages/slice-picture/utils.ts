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
