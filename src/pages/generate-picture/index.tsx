import styles from './index.module.scss';
import { BaseButton, Checkbox, SelectBox } from '@/components';
import uploadImg from './img/upload.png';
import { useState, ChangeEvent, useEffect, useRef } from 'react';
import {
  analyzeFiles,
  buildFileStructure,
  generateImg,
  ItemFile
} from './utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { globalStore } from '../../store';
import PreviewModal from './previewModal';
import { download, getBase64ImageSize } from '@/utils';
import { formatBytes } from '../slice-picture/utils';

export interface Item {
  name: string;
  suffix: string;
  image: string;
  size?: string;
  timer?: string;
  dir?: string
}

const options = [325, 375, 425, 450, 475, 525, 575, 625, 675, 725, 750, 775];
const OPTIONS = options.map(width => ({
  value: width,
  label: `宽度: ${width}px`
}));
const SPLIT_SIZE = 25;
let imgSizeMap: {
  [key: string]: string;
} = {};

export default function GeneratePicture() {
  const { files, setFiles } = globalStore();
  const [nameList, setNameList] = useState<Item[]>([]);
  const [dirList, setDirList] = useState<Item[]>([]);
  const [treeDirList, setTreeDirList] = useState<ItemFile[]>([]);
  const [typeList, setTypeList] = useState<string[]>(['文件夹']);
  const [selectTypeList, setSelectTypeList] = useState<string[]>([
    'mp4',
    '文件夹'
  ]);
  const [selectNameList, setSelectNameList] = useState<Item[]>([]);
  const [isDownloading, setDownloadStatus] = useState(false);

  const [dataUrl, setDataUrl] = useState('');
  const [title, setTitle] = useState('');
  const [watermark, setWatermark] = useState({
    name: '',
    num: 2
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageWidth, setImageWidth] = useState(450);
  const [isSplitimg, setIsSplitimg] = useState(true);
  const [isThirtDir, setIsThirtDir] = useState(false);
  const [isTreeDir, setIsTreeDir] = useState(true); // 树结构
  const [showSize, setShowSize] = useState(true); // 树结构
  const [showTimer, setShowTimer] = useState(true); // 树结构

  const previewOpenRef = useRef(false);
  const cropperRef = useRef<HTMLCanvasElement | null>(null);

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
    const key = imageWidth + selectTypeList.join('');
    if (imgSizeMap[key]) {
      setDataUrl(imgSizeMap[key]);
    } else {
      setDataUrl('');
      previewOpen && generateImgUrl();
    }
    previewOpenRef.current = previewOpen;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageWidth, previewOpen]);

  useEffect(() => {
    if (files.length) {
      transform(files);
    }
  }, [files, isThirtDir]);

  useEffect(() => {
    const key = imageWidth + selectTypeList.join('');
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
    console.log('files ', [...files]);
    setFiles([...files]);
    e.target.value = '';
    toast.success('上传成功');
    onReset();
  };

  function transform(files: File[]) {
    const info = analyzeFiles(files, {
      isThirtDir
    });
    setNameList(info.nameList);
    setTypeList(['文件夹', ...info.typeList]);
    setDirList(info.dirList);
    setTitle(info.dirName);
    setSelectTypeList(['文件夹', ...info.typeList]);
    setTreeDirList(buildFileStructure(files));
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
      const size = Math.ceil(selectNameList.length / SPLIT_SIZE);
      try {
        const dataUrl = await generateImg({
          width: imageWidth,
          isSingle: size === 1
        });
        const splitImgList = await getSplitImage(dataUrl, size);
        for (let i = 0; i < splitImgList.length; i++) {
          await download(splitImgList[i], '详情.jpg');
        }
        toast.success('下载完成');
      } catch (error) {
        toast.error('下载失败!');
      } finally {
        setDownloadStatus(false);
      }
    } else if (dataUrl) {
      console.log('dataUrl ', dataUrl);
      download(dataUrl, '详情.png');
      toast('下载成功');
      setDownloadStatus(false);
    } else {
      const dataUrl = await generateImgUrl();
      // const key = imageWidth + selectTypeList.join('');
      download(dataUrl!, '详情.png');
      toast('下载成功');
      setDownloadStatus(false);
    }
  };

  const getSplitImage = async (
    image: string,
    splitSize: number
  ): Promise<string[]> => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = image;
      const croppedParts: string[] = [];
      img.onload = () => {
        const canvas = cropperRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = img;
        const sliceHeight = height / splitSize;

        for (let i = 0; i < splitSize; i++) {
          // 清空画布
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          canvas.width = width;
          canvas.height = sliceHeight;
          // 绘制每一部分的图像到画布上
          ctx?.drawImage(img, 0, -i * sliceHeight);
          // 获取每一部分的图像数据URL
          const url = canvas.toDataURL();
          croppedParts.push(url);
          if (croppedParts.length === splitSize) {
            resolve(croppedParts);
          }
        }
      };
    });
  };

  const onPreview = () => {
    setPreviewOpen(true);
  };

  const generateImgUrl = async () => {
    try {
      const key = imageWidth + selectTypeList.join('');
      if (imgSizeMap[key]) return imgSizeMap[key];
      const dataUrl = await generateImg({
        width: imageWidth,
        isSingle: true
      });
      setDataUrl(dataUrl);
      imgSizeMap[key] = dataUrl;
      return dataUrl;
    } catch (error) {
      toast.error('加载失败');
    }
  };

  const onReset = () => {
    transform(files);
    imgSizeMap = {};
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
          <section className="left" style={{ width: imageWidth + 'px' }}>
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
                  key={type}
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
                  value={watermark.name}
                  onChange={e =>
                    setWatermark({
                      ...watermark,
                      name: e.target.value
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="数量"
                  value={watermark.num}
                  onChange={e =>
                    setWatermark({
                      ...watermark,
                      num: +e.target.value
                    })
                  }
                />
              </div>
            </div>
            <motion.div
              layout
              layoutId={'list'}
              className="list-container"
              id="list"
            >
              <AnimatePresence>
                {watermark.name && (
                  <div className="watermarkList">
                    {Array.from({ length: +watermark.num }).map((_, index) => (
                      <p className="watermark" key={index}>
                        {watermark.name || '长安不止三万里'}
                      </p>
                    ))}
                  </div>
                )}
                {title && <p className="imgTitle">{title}</p>}
                {isTreeDir ? (
                  <TreeDirList
                    treeDirList={treeDirList}
                    typeList={selectTypeList}
                    showSize={showSize}
                    showTimer={showTimer}
                  />
                ) : (
                  selectNameList.map((item, index) => (
                    <motion.li
                      initial={{ y: -200, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={item.name}
                      className="item"
                    >
                      <div className="fileName">
                        <img style={{height: (showSize || showTimer) ? '24px' : '16px'}} src={item.image} alt="" />
                        <FileItem
                          item={item}
                          showSize={showSize}
                          showTime={showTimer}
                        ></FileItem>
                        {/* <div>{item.name}</div> */}
                      </div>
                      <div
                        className="delIcon"
                        onClick={() => onDelete(index)}
                      ></div>
                    </motion.li>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </section>
          <section className="right">
            <Checkbox
              checked={isTreeDir}
              onChange={setIsTreeDir}
              label="文件夹层级格式"
            ></Checkbox>
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
            <Checkbox
              checked={showSize}
              onChange={setShowSize}
              label="展示大小"
            ></Checkbox>
            <Checkbox
              checked={showTimer}
              onChange={setShowTimer}
              label="展示时间"
            ></Checkbox>
            <SelectBox
              value={imageWidth}
              onSelect={setImageWidth}
              OPTIONS={OPTIONS}
              label="图片宽度： "
            />
          </section>
        </section>

        <canvas ref={cropperRef} style={{ display: 'none' }} />
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
            value={imageWidth}
            onSelect={setImageWidth}
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

function TreeDirList({
  treeDirList,
  typeList,
  showTimer,
  showSize,
  index = 0
}: {
  treeDirList: ItemFile[];
  typeList: string[];
  index?: number;
  showTimer: boolean
  showSize: boolean
}) {
  return (
    <div className="treeDirBox" style={{ marginLeft: index * 10 + 'px' }}>
      {treeDirList
        ?.filter(item => !!item && (item.dir || typeList.includes(item.suffix)))
        .map(item => (
          <div className="item dirItem" key={item.name || item.dir}>
            {
              <div
                className={[
                  'fileName',
                  // index > 0 ? 'treeIcon' : '',
                  item.dir ? 'dirIcon' : ''
                ].join(' ')}
              >
                <img src={item.image} alt="" />
                <FileItem
                  item={item}
                  showSize={showSize}
                  showTime={showTimer}
                ></FileItem>
                {/* {item.name || item.dir} */}
              </div>
            }
            <TreeDirList
              treeDirList={item.list}
              typeList={typeList}
              index={index + 1}
              showSize={showSize}
              showTimer={showTimer}
            />
          </div>
        ))}
    </div>
  );
}

function FileItem({
  item,
  showSize,
  showTime
}: {
  item: Item;
  showSize: boolean;
  showTime: boolean;
}) {
  return (
    <div className={styles.fileItem}>
      <div className={styles.name}>{item.name || item.dir}</div>
      {(showSize || showTime) && (
        <div className={styles.fileInfo}>
          {showTime && <span className={styles.timer}>{item.timer}</span>}
          {showSize && <span className={styles.size}>{item.size}</span>}
        </div>
      )}
    </div>
  );
}
