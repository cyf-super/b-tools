import { textToTextHtml } from '../utils';
import { useState, useCallback, useRef } from 'react';
import { BaseEditor, Descendant } from 'slate';
import { toast } from 'sonner';
import { ReactEditor, withReact } from 'slate-react';
import { createEditor, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { globalStore } from '@/store';
import { generateImg } from '@/pages/generate-picture/utils';
import { download } from '@/utils';
import templateList from '../template.json';

export interface Item {
  name: string;
  detailList: {
    text: string;
  }[];
}

export interface StyleType {
  fontWeight: number;
  fontFamily: string;
  fontSize: string;
  color: string;
}
export type TemplateType = (typeof templateList)[0];

export const LogoTemplate = Array.from({ length: 10 }).map(
  (_, index) => index + 1
);

export function useTransform() {
  const { descendant, setDescendant } = globalStore();
  const [textList, setTextList] = useState<Item[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [template, setTemplate] = useState<TemplateType>(templateList[0]);
  const [logo, setLogo] = useState({
    id: 0,
    opacity: 1
  });

  const [nameStyle, setNameStyle] = useState<StyleType>({
    fontWeight: 700,
    fontFamily: '正文宋楷',
    fontSize: '19px',
    color: '#333'
  });
  const [textStyle, setTextStyle] = useState<StyleType>({
    fontWeight: 400,
    fontFamily: '正文宋楷',
    fontSize: '18px',
    color: '#333'
  });

  const watermarkList = useRef([]);

  const [watermark, setWatermark] = useState({
    text: '',
    num: ''
  });
  const [secondText, setSecondText] = useState({
    checked: false,
    value: ''
  });

  const headerInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<BaseEditor & ReactEditor & HistoryEditor>();
  if (!editorRef.current) {
    editorRef.current = withHistory(withReact(createEditor()));
  }

  function onReset() {
    if (!editorRef.current) return;

    editorRef.current?.children.map(_ => {
      Transforms.delete(editorRef.current!, { at: [0] });
    });
    // reset init
    editorRef.current.children = [
      {
        children: [{ text: '' }]
      }
    ];
    setDescendant(editorRef.current.children);
  }

  const onTransform = useCallback(() => {
    const textList = textToTextHtml(descendant as any);
    setTextList(textList);
    let length = watermark.num;
    if (!length) {
      length = Math.ceil(descendant.length / 10) + '';
    }
    watermarkList.current = Array.from({
      length: +length
    });
  }, [descendant]);

  const editChange = useCallback(
    (val: Descendant[]) => {
      setDescendant(val);
    },
    [setDescendant]
  );

  const onCopy = async (text: string) => {
    if (!text) {
      toast.error('没有内容', {
        className: 'toast-error'
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success('已复制');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('复制失败');
    }
  };

  const onDownload = async () => {
    setIsDownloading(true);
    const base64 = await generateImg({
      width: 350,
      nodeId: 'detailList'
    });
    download(base64, '详情.png');
    toast('下载成功');
    setIsDownloading(false);
  };

  const setSecondChecked = (checked: boolean) => {
    setSecondText({
      ...secondText,
      checked
    });
  };
  const setSecondValue = (value: string) => {
    setSecondText({
      ...secondText,
      value
    });
  };

  const onChangeLogo = (rest: Partial<typeof logo>) => {
    setLogo({
      ...logo,
      ...rest
    });
  };

  return {
    logo,
    template,
    descendant,
    textList,
    editorRef,
    nameStyle,
    textStyle,
    watermark,
    headerInputRef,
    isDownloading,
    watermarkList,
    secondText,
    setSecondChecked,
    setSecondValue,
    setSecondText,
    setWatermark,
    setNameStyle,
    setTextStyle,
    setTemplate,
    editChange,
    onReset,
    onTransform,
    onCopy,
    onDownload,
    onChangeLogo
  };
}
