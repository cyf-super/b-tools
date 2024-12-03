import styles from './index.module.scss';
import { BaseButton, Checkbox } from '@/components';
import uploadImg from './img/upload.png';
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { analyzeFiles } from './utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { globalStore } from '../../store';

export default function FileAnalyze() {
  const { files, setFiles } = globalStore();
  const [nameList, setNameList] = useState<string[]>([]);
  const [typeList, setTypeList] = useState<string[]>([]);
  const [urlDir, setUrlDir] = useState<string[]>([]);
  const [imgDir, setImgDir] = useState<string[]>([]);
  const [textDir, setTextDir] = useState<string[]>([]);
  const [zipDir, setZipDir] = useState<string[]>([]);
  const [dirname, setDirname] = useState<string>('');

  const [suffix, setSuffix] = useState(true);
  const [onlyDir, setOnlyDir] = useState(false);
  const [subDir, setSubDir] = useState(true);

  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!boxRef.current) return;
    const fileInput = boxRef.current;
    fileInput.addEventListener('paste', handlePaste);

    return () => {
      fileInput.removeEventListener('paste', handlePaste);
    };
  }, [boxRef]);

  useEffect(() => {
    if (files.length) {
      transform(files, { suffix, onlyDir, subDir });
    }
  }, [suffix, onlyDir, subDir, files]);

  const handlePaste = (event: any) => {
    event.preventDefault();
    const files = event.clipboardData.files;
    transform([...files], { suffix, onlyDir, subDir });
    setFiles([...files]);
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFiles([]);

    if (!files) return;
    setFiles([...files]);
    e.target.value = '';
    toast.success('上传成功');
  };

  function transform(
    files: File[],
    {
      suffix,
      onlyDir,
      subDir
    }: {
      suffix: boolean;
      onlyDir: boolean;
      subDir: boolean;
    }
  ) {
    const info = analyzeFiles(files, {
      isSuffix: suffix,
      isDir: onlyDir,
      isAddSubDir: subDir
    });
    setDirname(info.dirName)
    setNameList(info.nameList);
    setTypeList(info.typeList);
    setImgDir(info.imgDir);
    setUrlDir(info.urlDir);
    setTextDir(info.textDir);
    setZipDir(info.zipDir);
  }

  const onCopy = async () => {
    let copyText = '';
    nameList.forEach(name => {
      copyText += name + '\n';
    });
    copyText +=
      `\n上面是一个“${dirname}”视频教程的目录，你是一个顶级的产品专家和营销专家，帮我总结一下大致内容，要求：分点总结，简单易懂，创意新颖； 最后再根据这个教程的主题给出10句吸引用户的宣传语/营销语，同样要求有创意，能抓住用户眼球，可以有多种风格，比如幽默、励志、文艺风等等`;
    try {
      await navigator.clipboard.writeText(copyText);
      toast.success('已复制');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('复制失败');
    }
  };

  const onDelete = (index: number) => {
    const newList = [...nameList];
    newList.splice(index, 1);
    setNameList(newList);
  };

  return (
    <>
      <div className={styles.box} ref={boxRef}>
        <h2>File Analyze</h2>
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

        <div className="content">
          <div className="left">
            <div className="header">
              <BaseButton
                className="copy"
                disabled={nameList.length === 0}
                onClick={onCopy}
              >
                copy
              </BaseButton>
              <div className="fileNum">文件数量：{nameList.length}</div>
              <div className="typeNum" title={typeList.join(',')}>
                文件种类：{typeList.length}
              </div>
              <div className="typeWarn">{typeList.join(', ')}</div>
            </div>
            <motion.ul layout layoutId={'list'} className="list-container">
              <AnimatePresence>
                {nameList.map((name, index) => (
                  <motion.li
                    initial={{ y: -200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={name}
                    className="item"
                  >
                    {name}
                    <span
                      className="delIcon"
                      onClick={() => onDelete(index)}
                    ></span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
          <div className="right">
            <div className="suffix">
              <Checkbox
                checked={suffix}
                label="是否带上后缀"
                onChange={setSuffix}
              />
            </div>
            <div className="subDir">
              <Checkbox
                checked={subDir}
                label="是否带上子目录"
                onChange={setSubDir}
              />
            </div>
            <div className="onlyDir">
              <Checkbox
                checked={onlyDir}
                label="是否针对文件夹"
                onChange={setOnlyDir}
              />
            </div>
            <div className="zipList">
              <p className={zipDir.length ? 'warning' : ''}>
                是否有压缩文件{zipDir.length ? `【${zipDir.length}】` : ''}
              </p>

              {zipDir.map(name => (
                <div key={name} className="dir">
                  {name}
                </div>
              ))}
            </div>
            <div className="textList">
              <p className={textDir.length ? 'warning' : ''}>
                是否有txt文件{textDir.length ? `【${textDir.length}】` : ''}
              </p>
              {textDir.map(name => (
                <div key={name} className="dir">
                  {name}
                </div>
              ))}
            </div>
            <div className="urlList">
              <p className={urlDir.length ? 'warning' : ''}>
                是否有链接{urlDir.length ? `【${urlDir.length}】` : ''}
              </p>
              {urlDir.map(dir => (
                <div key={dir} className="dir">
                  {dir}
                </div>
              ))}
            </div>
            <div className="imageList">
              <p className={imgDir.length ? 'warning' : ''}>
                是否有图片{imgDir.length ? `【${imgDir.length}】` : ''}
              </p>
              {imgDir.map(dir => (
                <div key={dir} className="dir">
                  {dir}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
