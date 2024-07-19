import { Item } from './text-transform/hooks/useTransform';

const STYLE_TYPE = {
  bold: 'strong',
  italic: 'em',
  code: 'code'
};

function getDomByText(text: string, type: keyof typeof STYLE_TYPE) {
  const ele = STYLE_TYPE[type];
  return `<${ele}>${text}</${ele}>`;
}

export function textToTextHtml(
  descendant: unknown,
  isTitle: boolean,
  isSimple = true
) {
  const textHtml = (descendant as Descendant[]).map(item => {
    let text = item.children.reduce((htmlText, paragraph) => {
      let text = paragraph.text;
      for (const key of Object.keys(paragraph)) {
        if (STYLE_TYPE[key as keyof typeof STYLE_TYPE]) {
          text = getDomByText(text, key as keyof typeof STYLE_TYPE);
        }
      }
      return (htmlText += text), htmlText;
    }, '');

    if (text === '') {
      return (text = '<br />'), text;
    }

    if (isSimple) text += '<br />';
    else text = `<p>${text}</p>`;
    return text;
  });

  const htmlArr: Item[] = [];
  let item = '';
  let previous = false;
  textHtml.forEach(text => {
    if (text === '[图片]<br />') {
      htmlArr.push(getHtmlObj(item, isTitle));
      item = '';
      previous = true;
    } else if (text === '<br />' && previous) {
      return;
    } else {
      item += text;
      previous = false;
    }
  });
  if (!previous) {
    htmlArr.push(getHtmlObj(item, isTitle));
  }
  return htmlArr;
}

function getHtmlObj(textHtml: string, isTitle: boolean) {
  if (isTitle) {
    const arr = textHtml.split('<br />');
    const title = arr.shift()!;
    const detail = arr.join('<br />');
    return {
      title,
      detail
    };
  }
  return {
    title: '',
    detail: textHtml
  };
}
