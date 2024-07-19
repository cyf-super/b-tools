import styles from './index.module.scss';
import { BaseButton } from '@/components';
import uploadImg from './img/upload.png';
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { getFileName, IMAGE } from './utils';
import { toast } from 'sonner';

export function FilePath() {
  const [nameList, setNameList] = useState<string[]>([]);
  const [urlDir, setUrlDir] = useState<string[]>([]);
  const [imgDir, setImgDir] = useState<string[]>([]);
  const [textDir, setTextDir] = useState<string[]>([]);

  const [suffix, setSuffix] = useState(true);
  const [onlyDir, setOnlyDir] = useState(false);

  const filesRef = useRef<File[]>([]);
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
    if (filesRef.current.length) {
      transform(filesRef.current, suffix, onlyDir);
    }
  }, [suffix, onlyDir]);

  const handlePaste = (event: any) => {
    event.preventDefault();
    const files = event.clipboardData.files;
    transform([...files], suffix, onlyDir);
    filesRef.current = [...files];
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    filesRef.current = [];

    if (!files) return;
    transform([...files], suffix, onlyDir);
    filesRef.current = [...files];
    e.target.value = '';
    toast.success('上传成功');
  };

  function transform(files: File[], suffix: boolean, onlyDir: boolean) {
    const info = analyzeFiles(files, suffix, onlyDir);
    setNameList(info.nameList);
    setImgDir(info.imgDir);
    setUrlDir(info.urlDir);
    setTextDir(info.textDir);
  }

  const onCopy = async () => {
    let copyText = '';
    nameList.forEach(name => {
      copyText += name + '\n';
    });
    try {
      await navigator.clipboard.writeText(copyText);
      toast.success('已复制');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('复制失败');
    }
  };

  return (
    <>
      <div className={styles.box} ref={boxRef}>
        <h2>To TextHtml</h2>
        <div className="upload">
          <input
            type="file"
            className="file"
            webkitdirectory=""
            directory=""
            onChange={onChangeFile}
          />
          <img src={uploadImg} alt="" />
          <div className="text">将图片拖到此处，或点击上传</div>
        </div>

        <div className="content">
          <div className="left">
            <BaseButton
              className="copy"
              disabled={nameList.length === 0}
              onClick={onCopy}
            >
              复制名称
            </BaseButton>
            <span className="fileNum">文件数量：{nameList.length}</span>
            {nameList.map(name => (
              <div key={name} className="item">
                {name}
              </div>
            ))}
          </div>
          <div className="right">
            <div className="suffix">
              <Checkbox
                checked={suffix}
                label="是否带上后缀"
                onChange={setSuffix}
              />
            </div>
            <div className="onlyDir">
              <Checkbox
                checked={onlyDir}
                label="是否针对文件夹"
                onChange={setOnlyDir}
              />
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
            <div className="textList">
              <p className={textDir.length ? 'warning' : ''}>
                是否有txt文件{textDir.length ? `【${textDir.length}】` : ''}
              </p>
              {textDir.map(dir => (
                <div key={dir} className="dir">
                  {dir}
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
          </div>
        </div>
      </div>
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

function analyzeFiles(files: File[], isSuffix: boolean, isDir: boolean) {
  const imgDir: string[] = [];
  const urlDir: string[] = [];
  const nameList: string[] = [];
  const textDir: string[] = [];

  files.forEach(file => {
    if (file.name === '.DS_Store') return;
    const [fileName = '', fileSuffix = ''] = getFileName(file.name);

    if (IMAGE.includes(fileSuffix)) {
      imgDir.push(file.webkitRelativePath);
    } else if (fileSuffix === 'html') {
      urlDir.push(file.webkitRelativePath);
    } else if (fileSuffix === 'txt') {
      textDir.push(file.webkitRelativePath);
    } else if (!isDir) {
      nameList.push(isSuffix ? file.name : fileName);
    }
    if (isDir) {
      // 只处理一级目录
      const dir = file.webkitRelativePath.split('/')[0];
      const flag = nameList.some(name => dir === name);
      if (!flag) {
        nameList.push(dir);
      }
    }
  });

  return {
    nameList,
    urlDir,
    imgDir,
    textDir
  };
}
