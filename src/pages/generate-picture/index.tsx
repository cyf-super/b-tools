import styles from './index.module.scss';
import { BaseButton } from '@/components';
import uploadImg from './img/upload.png';
import { useState, ChangeEvent, useEffect } from 'react';
import { analyzeFiles, download } from './utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { folderStore } from '../../store';
import { toPng } from 'html-to-image';

export interface Item {
  name: string;
  suffix: string;
  image: string;
}

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

  const [suffix, setSuffix] = useState(true);
  const [onlyDir, setOnlyDir] = useState(false);
  const [subDir, setSubDir] = useState(true);

  useEffect(() => {
    if (files.length) {
      transform(files);
    }
  }, [suffix, onlyDir, subDir, files]);

  useEffect(() => {
    if (selectTypeList.length) {
      let list = nameList.filter(item => selectTypeList.includes(item.suffix));

      console.log(
        'dirList ',
        dirList,
        selectTypeList,
        selectTypeList.includes('文件夹')
      );
      if (selectTypeList.includes('文件夹')) {
        list = [...dirList, ...list];
      }
      console.log('list', list);
      setSelectNameList(list);
    } else {
      setSelectNameList(nameList);
    }
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
    const node = document.getElementById('list') as HTMLElement;
    console.log(node);
    try {
      const dataUrl = await toPng(node, {
        width: 375,
        quality: 1,
        pixelRatio: 2
      });
      download(dataUrl, '详情.png');
      toast('下载成功');
    } catch (error) {
      console.error('Oops, something went wrong!', error);
      toast.error('下载失败');
    } finally {
      setDownloadStatus(false);
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
            <div className="header">
              <BaseButton
                className="copy"
                disabled={nameList.length === 0 || isDownloading}
                onClick={downloadAsImage}
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </BaseButton>
              <div className="fileNum">文件数量：{nameList.length}</div>
              <div className="typeNum" title={typeList.join(',')}>
                文件种类：{typeList.length}
              </div>
              <div className="typeWarn">{typeList.join(', ')}</div>
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
                    className="item"
                  >
                    <span className="fileName">
                      <img src={item.image} alt="" />
                      {item.name}
                    </span>
                    <span
                      className="delIcon"
                      onClick={() => onDelete(index)}
                    ></span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </section>
          <section className="right">
            <div className="subDir">
              <Checkbox
                checked={subDir}
                label="是否带上子目录"
                onChange={setSubDir}
              />
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

interface CheckboxType {
  checked: boolean;
  label: string;
  onChange: (flag: boolean) => void;
}

function Checkbox({ checked, onChange, label }: CheckboxType) {
  return (
    <div className={styles.checkBox}>
      <input
        type="checkbox"
        id={label}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
}
