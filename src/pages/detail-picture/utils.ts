import { Item } from './hooks/useTransform';

const fontsFamily = [
  '正文宋楷',
  '思源黑体',
  '创粗黑',
  '方方先锋体',
  '江南手书',
  '御守锦书',
  '清平手书',
  'Ma Shan Zheng'
];
const fontsSize = [16, 18, 20, 21, 22, 23, 24];
const fontsWeight = [400, 700];

export const FontsFamily = fontsFamily.map(font => ({
  label: font,
  value: font
}));
export const FontsWeight = fontsWeight.map(weight => ({
  label: weight + '',
  value: weight
}));
export const FontsSize = fontsSize.map(size => ({
  label: size + 'px',
  value: size + 'px'
}));

export function textToTextHtml(descendant: Descendant[]) {
  const list: Item[] = [];
  let name = '';
  let detailList: Item['detailList'] = [];
  descendant.forEach(item => {
    let text = item.children.reduce((htmlText, paragraph) => {
      let text = paragraph.text;
      return (htmlText += text), htmlText;
    }, '');

    if (text.startsWith('● ')) {
      detailList.push({
        text: text.substring(2)
      });
    } else {
      if (detailList.length) {
        list.push({
          name,
          detailList
        });
        detailList = [];
      }
      name = text;
    }
  });
  if (detailList.length) {
    list.push({
      name,
      detailList
    });
    detailList = [];
  }
  return list;
}
