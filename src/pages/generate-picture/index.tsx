import styles from './index.module.scss';
import { BaseButton, Checkbox, SelectBox } from '@/components';
import uploadImg from './img/upload.png';
import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { analyzeFiles, generateImg, getArr } from './utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { folderStore } from '../../store';
import PreviewModal from './previewModal';
import { download, getBase64ImageSize } from '@/utils';
import { formatBytes } from '../slice-picture/utils';

export interface Item {
  name: string;
  suffix: string;
  image: string;
}

const options = [325, 375, 425, 450, 475, 525, 575, 625, 675];
const OPTIONS = options.map(width => ({
  value: width,
  label: `宽度: ${width}px`
}));
const SPLIT_SIZE = 25;
const imgSizeMap: {
  [key: string]: string;
} = {};

export function GeneratePicture() {
  const { files, setFiles } = folderStore();
  const [nameList, setNameList] = useState<Item[]>([]);
  const [dirList, setDirList] = useState<Item[]>([]);
  const [typeList, setTypeList] = useState<string[]>(['文件夹']);
  const [selectTypeList, setSelectTypeList] = useState<string[]>([
    'mp4',
    '文件夹'
  ]);
  const [selectNameList, setSelectNameList] = useState<Item[]>([]);
  const [splitList, setSplitList] = useState<Item[][]>([]);
  const [isDownloading, setDownloadStatus] = useState(false);

  const [dataUrl, setDataUrl] = useState('');
  const [title, setTitle] = useState('');
  const [watermark, setWatermark] = useState('');

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectSize, setSelectSize] = useState(450);
  const [isSplitimg, setIsSplitimg] = useState(true);
  const [isThirtDir, setIsThirtDir] = useState(false);

  const previewOpenRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape') {
        if (!nameList.length) return;
        if (previewOpenRef.current) {
          setPreviewOpen(false);
        } else {
          onPreview();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const key = selectSize + selectTypeList.join('');
    if (imgSizeMap[key]) {
      setDataUrl(imgSizeMap[key]);
    } else {
      setDataUrl('');
      previewOpen && generateImgUrl();
    }
    previewOpenRef.current = previewOpen;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSize, previewOpen]);

  useEffect(() => {
    if (files.length) {
      transform(files);
    }
  }, [files, isThirtDir]);

  useEffect(() => {
    const sizeArr = getArr(Math.ceil(selectNameList.length / SPLIT_SIZE));
    const splitList = sizeArr.map(num =>
      selectNameList.slice(num * SPLIT_SIZE, (num + 1) * SPLIT_SIZE)
    );
    setSplitList(splitList);
    const key = selectSize + selectTypeList.join('');
    imgSizeMap[key] && setDataUrl(imgSizeMap[key]);
  }, [selectNameList]);

  useEffect(() => {
    if (selectTypeList.length) {
      let list = nameList.filter(item => selectTypeList.includes(item.suffix));
      if (selectTypeList.includes('文件夹')) {
        list = [...dirList, ...list];
      }
      list.sort();
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
    const info = analyzeFiles(files, {
      isThirtDir
    });
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
    newList.sort();
    setSelectTypeList(newList);
  };

  const downloadAsImage = async () => {
    setDownloadStatus(true);
    // 分割图片
    if (isSplitimg && selectNameList.length > SPLIT_SIZE) {
      const sizeArr = getArr(Math.ceil(selectNameList.length / SPLIT_SIZE));
      sizeArr.forEach(async id => {
        generateImg({
          width: selectSize,
          nodeId: 'list-' + id,
          isSingle: sizeArr.length === 1
        })
          .then(dataUrl => {
            download(dataUrl, '详情.png');
          })
          .catch(e => {
            console.log('e==> ', e);
            toast.error('生成失败!');
          })
          .finally(() => {
            setDownloadStatus(false);
          });
      });
    } else if (dataUrl) {
      download(dataUrl, '详情.png');
      toast('下载成功');
      setDownloadStatus(false);
    } else {
      await generateImgUrl();
      const key = selectSize + selectTypeList.join('');
      download(imgSizeMap[key], '详情.png');
      toast('下载成功');
      setDownloadStatus(false);
    }
  };

  const onPreview = () => {
    setPreviewOpen(true);
  };

  const generateImgUrl = async () => {
    try {
      const key = selectSize + selectTypeList.join('');
      console.log(imgSizeMap, imgSizeMap[key]);
      if (!imgSizeMap[key]) {
        generateImg({
          width: selectSize,
          isSingle: true
        })
          .then(dataUrl => {
            setDataUrl(dataUrl);
            imgSizeMap[key] = dataUrl;
          })
          .catch(e => {
            console.log('加载失败 ', e);
          });
      }
    } catch (error) {
      toast.error('加载失败');
    }
  };

  const onReset = () => {
    transform(files);
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
                onClick={onReset}
              >
                Reset
              </BaseButton>
              <BaseButton
                className="preview"
                disabled={nameList.length === 0 || isDownloading}
                onClick={onPreview}
              >
                Preview
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
              <span className="fileNum">文件数量：{nameList.length}</span>
              <span className="typeNum" title={typeList.join(',')}>
                文件种类：{typeList.length - 1}
              </span>
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
            <div className="input">
              <div className="titleInput">
                title：
                <input
                  type="text"
                  placeholder="标题"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="watermarkInput">
                watermark：
                <input
                  type="text"
                  placeholder="水印"
                  value={watermark}
                  onChange={e => setWatermark(e.target.value)}
                />
              </div>
            </div>
            <motion.ul
              layout
              layoutId={'list'}
              className="list-container"
              id="list"
            >
              <AnimatePresence>
                {title && <p className="imgTitle">{title}</p>}

                {splitList.map((nameArr, index) => (
                  <div className="" id={'list-' + index} key={index}>
                    {watermark && <p className="watermark">{watermark}</p>}
                    {nameArr.map((item, index) => (
                      <motion.li
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={item.name}
                        className="item"
                      >
                        <div className="fileName">
                          <img src={item.image} alt="" />
                          {item.name}
                        </div>
                        <div
                          className="delIcon"
                          onClick={() => onDelete(index)}
                        ></div>
                      </motion.li>
                    ))}
                  </div>
                ))}
              </AnimatePresence>
            </motion.ul>
          </section>
          <section className="right">
            <Checkbox
              checked={isSplitimg}
              onChange={setIsSplitimg}
              label="分割图片"
            ></Checkbox>
            <Checkbox
              checked={isThirtDir}
              onChange={setIsThirtDir}
              label="只针对二级目录"
            ></Checkbox>
            <SelectBox
              value={selectSize}
              onSelect={setSelectSize}
              OPTIONS={OPTIONS}
              label="图片宽度： "
            />
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
        <div>
          <Checkbox
            checked={isSplitimg}
            onChange={setIsSplitimg}
            label="分割图片"
          ></Checkbox>
          <SelectBox
            value={selectSize}
            onSelect={setSelectSize}
            OPTIONS={OPTIONS}
          />

          <div className={styles.size}>
            大小: {dataUrl && formatBytes(getBase64ImageSize(dataUrl))}
          </div>
        </div>
      </PreviewModal>
    </>
  );
}
