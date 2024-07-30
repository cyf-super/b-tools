import styles from './index.module.scss';
import { BaseButton, Checkbox, SelectBox } from '@/components';
import uploadImg from './img/upload.png';
import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { download } from './utils';
import { toast } from 'sonner';
import { folderStore } from '../../store';

export interface Item {
  name: string;
  suffix: string;
  image: string;
}

const OPTIONS = [
  {
    value: 2,
    label: '2张'
  },
  {
    value: 3,
    label: '3 张'
  },
  {
    value: 4,
    label: '4 张'
  },
  {
    value: 5,
    label: ' 5 张'
  },
  {
    value: 6,
    label: ' 6 张'
  }
];

export function SlicePicture() {
  const { splitImage, setSplitImage } = folderStore();
  const [image, setImage] = useState('');
  const [imageInfo, setImageInfo] = useState<[number, number]>([0, 0]);
  const [cropperImgList, setCropperImgList] = useState<string[]>([]);

  const [selectSize, setSelectSize] = useState(3);
  const [isSplitimg, setIsSplitimg] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (splitImage) {
      setImage(splitImage);
      setWidthAndHeight(splitImage);
    }
  }, []);

  // useEffect(() => {
  //   if (imgSizeMap[selectSize]) {
  //     setDataUrl(imgSizeMap[selectSize]);
  //   } else if (imageInfo[0]) {
  //     // onSplitImage();
  //   } else {
  //     toast.error('图片为空，请重新上传');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectSize, imageInfo]);

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;
    const url = window.URL.createObjectURL(files[0]);
    setImage(url);
    setSplitImage(url);
    setWidthAndHeight(url);
    e.target.value = '';
  };

  function setWidthAndHeight(url: string) {
    const image = new Image();
    image.onload = () => {
      console.log([image.width, image.height]);
      setImageInfo([image.width, image.height]);
    };
    image.src = url;
  }

  const downloadAsImage = async () => {
    if (cropperImgList.length) {
      for (let i = 0; i < cropperImgList.length; i++) {
        await download(cropperImgList[i], '详情.png');
      }
      toast.success('下载完成');
    }
  };

  const onPreview = async () => {
    // setPreviewOpen(true);
    // generateImgUrl();
    // onSplitImage()
    const img = new Image();
    img.src = image;
    setCropperImgList([]);
    const croppedParts: string[] = [];
    img.onload = () => {
      const canvas = cropperRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { width, height } = img;
      const sliceHeight = height / selectSize;

      for (let i = 0; i < selectSize; i++) {
        // 清空画布
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = width;
        canvas.height = sliceHeight;
        // 绘制每一部分的图像到画布上
        ctx?.drawImage(img, 0, -i * sliceHeight);
        // 获取每一部分的图像数据URL
        const url = canvas.toDataURL();
        croppedParts.push(url);
        if (croppedParts.length === selectSize) {
          setCropperImgList(croppedParts);
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
                className="preview"
                disabled={!image}
                onClick={onPreview}
              >
                preview
              </BaseButton>
              <BaseButton
                className="preview"
                disabled={!image}
                onClick={downloadAsImage}
              >
                Download
              </BaseButton>
            </div>
            <div className="fileDetail">
              <span className="fileNum">
                图片尺寸：{imageInfo[0]} x {imageInfo[1]}
              </span>
            </div>
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
          </section>
        </section>
        <canvas ref={cropperRef} style={{ display: 'none' }} />

        <section className="preview">
          <h2>预览</h2>
          {cropperImgList.map(src => (
            <div className="item">
              <img src={src} />
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
