import styles from './index.module.scss';
import { BaseButton, SelectBox } from '@/components';
import uploadImg from '/content/upload.png';
import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { formatBytes } from './utils';
import { toast } from 'sonner';
import { folderStore } from '../../store';
import { download, getBase64ImageSize } from '@/utils';

export interface Item {
  name: string;
  suffix: string;
  image: string;
}

interface SplitImage {
  url: string;
  width: number;
  height: number;
  size: string;
}

const options = [2, 3, 4, 5, 6];
const OPTIONS = options.map(num => ({
  value: num,
  label: ` ${num} 张`
}));

export function SlicePicture() {
  const { splitImage, setSplitImage } = folderStore();
  const [image, setImage] = useState('');
  const [imageInfo, setImageInfo] = useState({
    width: 0,
    height: 0,
    size: '0kb'
  });
  const [splitImgList, setSplitImgList] = useState<SplitImage[]>([]);
  const splitSizeRef = useRef<HTMLInputElement | null>(null);

  const [selectSize, setSelectSize] = useState(3);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (splitImage) {
      setImage(splitImage);
      setWidthAndHeight(splitImage);
    }
  }, []);

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    const url = window.URL.createObjectURL(file);
    setImageInfo(info => ({
      ...info,
      size: formatBytes(file.size || 0)
    }));
    setImage(url);
    setSplitImage(url);
    setWidthAndHeight(url);
    e.target.value = '';
  };

  function setWidthAndHeight(url: string) {
    const image = new Image();
    image.onload = () => {
      const { width, height } = image;
      setImageInfo(info => ({
        ...info,
        width,
        height
      }));
    };
    image.src = url;
  }

  const downloadAsImage = async () => {
    if (splitImgList.length) {
      for (let i = 0; i < splitImgList.length; i++) {
        await download(splitImgList[i].url, '详情.png');
      }
      toast.success('下载完成');
    }
  };

  const onPreview = async () => {
    const img = new Image();
    img.src = image;
    setSplitImgList([]);
    const croppedParts: SplitImage[] = [];
    img.onload = () => {
      const canvas = cropperRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { width, height } = img;
      let splitSize = Number(splitSizeRef.current?.value);
      if (typeof splitSize !== 'number' || isNaN(splitSize)) {
        splitSize = 0;
      }
      const sliceHeight = (height - splitSize) / selectSize;

      for (let i = 0; i < selectSize; i++) {
        // 清空画布
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = width;
        canvas.height = sliceHeight;
        // 绘制每一部分的图像到画布上
        ctx?.drawImage(img, 0, -i * sliceHeight);
        // 获取每一部分的图像数据URL
        const url = canvas.toDataURL();
        croppedParts.push({
          url,
          width,
          height: sliceHeight,
          size: formatBytes(getBase64ImageSize(url))
        });
        if (croppedParts.length === selectSize) {
          setSplitImgList(croppedParts);
        }
      }
    };
  };

  return (
    <>
      <main className={styles.box}>
        <h2>Slice Picture</h2>
        <section className="content">
          <section className="left">
            <div className="upload">
              <input
                type="file"
                className="file"
                onChange={onChangeFile}
                accept="image/*"
              />
              <img src={uploadImg} alt="" />
              <div className="text">将图片拖到此处，或点击上传</div>
              {image && <img src={image} className="image" ref={imgRef}></img>}
            </div>
          </section>
          <section className="right">
            <div className="handleBtn">
              <BaseButton
                className="previewBtn"
                disabled={!image}
                onClick={onPreview}
              >
                preview
              </BaseButton>
              <BaseButton disabled={!image} primary onClick={downloadAsImage}>
                Download
              </BaseButton>
            </div>
            <div className="fileDetail">
              <span className="fileNum">
                图片尺寸：{imageInfo.width} x {imageInfo.height}
              </span>
              <span className="fileNum">图片大小：{imageInfo.size}</span>
            </div>
            <SelectBox
              value={selectSize}
              onSelect={setSelectSize}
              OPTIONS={OPTIONS}
              label="分割张数："
            />
            <div className="sizeInput">
              <span className="sizeInputIcon"></span>
              <label htmlFor="splitInput">去除尾部：</label>
              <input
                ref={splitSizeRef}
                id="splitInput"
                type="text"
                placeholder="高度"
              />
            </div>
          </section>
        </section>
        <canvas ref={cropperRef} style={{ display: 'none' }} />

        <section className="preview">
          <h1>预览</h1>
          <div className="previewList">
            {splitImgList.map((item, index) => (
              <div className="item">
                <div className="index">{index + 1}</div>
                <img src={item.url} />
                <div className="imageInfo">
                  <p>
                    尺寸：{item.width} x {item.height}
                  </p>
                  <p>大小：{item.size}</p>
                  <p></p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
