import styles from './index.module.scss';
import { BaseButton, Checkbox } from '@/components';
import uploadImg from './img/upload.png';
import { useState, ChangeEvent, useEffect } from 'react';
import { analyzeFiles, download, generateImg, getSplitArr } from './utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { folderStore } from '../../store';
import PreviewModal from './previewModal';

export interface Item {
  name: string;
  suffix: string;
  image: string;
}

const OPTIONS = [320, 375, 425, 475, 525, 575, 625, 675];
const SPLIT_SIZE = 30;
const imgSizeMap: {
  [key: string]: string;
} = {};

export function GeneratePicture() {
  const { files, setFiles } = folderStore();
  const [nameList, setNameList] = useState<Item[]>([]);
  const [dirList, setDirList] = useState<Item[]>([]);
  const [typeList, setTypeList] = useState<string[]>([]);
  const [selectTypeList, setSelectTypeList] = useState<string[]>([
    'mp4',
    '文件夹'
  ]);
  const [selectNameList, setSelectNameList] = useState<Item[]>([]);
  const [isDownloading, setDownloadStatus] = useState(false);
  // const [isGenerating, setIsGenerating] = useState(false);

  const [dataUrl, setDataUrl] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectSize, setSelectSize] = useState(375);
  const [isSplitimg, setIsSplitimg] = useState(false);

  useEffect(() => {
    if (imgSizeMap[selectSize]) {
      setDataUrl(imgSizeMap[selectSize]);
    } else {
      setDataUrl('');
      previewOpen && generateImgUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSize]);

  useEffect(() => {
    if (files.length) {
      transform(files);
    }
  }, [files]);

  useEffect(() => {
    if (selectTypeList.length) {
      let list = nameList.filter(item => selectTypeList.includes(item.suffix));
      if (selectTypeList.includes('文件夹')) {
        list = [...dirList, ...list];
      }
      setSelectNameList(list);
    } else {
      setSelectNameList(nameList);
    }
    setDataUrl('');
  }, [nameList, dirList, selectTypeList]);

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFiles([]);

    if (!files) return;
    setFiles([...files]);
    e.target.value = '';
    toast.success('上传成功');
  };

  function transform(files: File[]) {
    const info = analyzeFiles(files);
    setNameList(info.nameList);
    setTypeList(['文件夹', ...info.typeList]);
    setDirList(info.dirList);
  }

  const onDelete = (index: number) => {
    const newList = [...selectNameList];
    newList.splice(index, 1);
    setSelectNameList(newList);
  };

  const onSelectType = (type: string) => {
    if (!selectTypeList.length) {
      setSelectTypeList([type]);
      return;
    }

    const newList = [...selectTypeList];
    const index = selectTypeList.findIndex(item => item === type);
    if (index > -1) {
      newList.splice(index, 1);
    } else {
      newList.push(type);
    }
    setSelectTypeList(newList);
  };

  const downloadAsImage = async () => {
    setDownloadStatus(true);
    if (isSplitimg && selectNameList.length > SPLIT_SIZE) {
      const splitArr = getSplitArr(selectNameList.length, SPLIT_SIZE);
      console.log('splitArr ', splitArr);
      // splitArr.forEach(async arr => {
      //   const dataUrl = await generateImg(arr, selectSize);
      //   download(dataUrl, '详情.png');
      // });
      const dataUrl = await generateImg(selectSize);
      download(dataUrl, '详情.png');
    } else if (dataUrl) {
      download(dataUrl, '详情.png');
    } else {
      await generateImgUrl();
      download(imgSizeMap[selectSize], '详情.png');
    }
    toast('下载成功');
    setDownloadStatus(false);
  };

  const onPreview = async () => {
    setPreviewOpen(true);
    generateImgUrl();
  };

  const generateImgUrl = async () => {
    try {
      if (!imgSizeMap[selectSize]) {
        // setIsGenerating(true);
        const dataUrl = await generateImg(selectSize);
        setDataUrl(dataUrl);
        imgSizeMap[selectSize] = dataUrl;
      }
    } catch (error) {
      toast.error('加载失败');
    } finally {
      // setIsGenerating(false);
    }
  };

  return (
    <>
      <main className={styles.box}>
        <h2>Generate Picture</h2>
        <div className="upload">
          <input
            type="file"
            className="file"
            {...{ webkitdirectory: '' }}
            onChange={onChangeFile}
          />
          <img src={uploadImg} alt="" />
          <div className="text">将文件夹拖到此处，或点击上传</div>
        </div>

        <section className="content">
          <section className="left">
            <div className="handleBtn">
              <BaseButton
                className="preview"
                disabled={nameList.length === 0 || isDownloading}
                onClick={onPreview}
              >
                preview
              </BaseButton>
              <BaseButton
                className="download"
                disabled={nameList.length === 0 || isDownloading}
                primary={true}
                onClick={downloadAsImage}
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </BaseButton>
            </div>
            <div className="fileDetail">
              <div className="fileNum">文件数量：{nameList.length}</div>
              <div className="typeNum" title={typeList.join(',')}>
                文件种类：{typeList.length - 1}
              </div>
            </div>
            <div className="options">
              {typeList.map(type => (
                <span
                  className={selectTypeList.includes(type) ? 'select' : ''}
                  onClick={() => onSelectType(type)}
                >
                  {type}
                </span>
              ))}
            </div>
            <motion.ul
              layout
              layoutId={'list'}
              className="list-container"
              id="list"
              style={selectNameList.length ? { marginBlock: '20px' } : {}}
            >
              <AnimatePresence>
                {selectNameList.map((item, index) => (
                  <motion.li
                    initial={{ y: -200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.name}
                    data-id={index}
                    className="item"
                  >
                    <div className="fileName" data-id={index}>
                      <img src={item.image} alt="" />
                      {item.name}
                    </div>
                    <div
                      className="delIcon"
                      onClick={() => onDelete(index)}
                      data-id={index}
                    ></div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </section>
          <section className="right">
            <Checkbox
              checked={isSplitimg}
              onChange={setIsSplitimg}
              label="是否分割图片"
            ></Checkbox>
            <SelectBox value={selectSize} onSelect={setSelectSize} />
          </section>
        </section>
      </main>

      <PreviewModal
        open={previewOpen}
        setOpen={setPreviewOpen}
        src={dataUrl}
        footer={
          <BaseButton
            primary={true}
            onClick={() => {
              downloadAsImage();
            }}
          >
            download
          </BaseButton>
        }
      >
        <SelectBox value={selectSize} onSelect={setSelectSize} />
      </PreviewModal>
    </>
  );
}

function SelectBox({
  value,
  onSelect
}: {
  value: number;
  onSelect: (num: number) => void;
}) {
  return (
    <select
      onChange={e => onSelect(+e.target.value)}
      onClick={e => {
        e.stopPropagation();
      }}
      defaultValue={375}
      className={styles.select}
    >
      {OPTIONS.map(size => (
        <option
          value={size}
          selected={size === value}
          className={styles.selectOption}
        >
          宽度: {size}px
        </option>
      ))}
    </select>
  );
}
