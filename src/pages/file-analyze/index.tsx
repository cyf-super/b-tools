import styles from './index.module.scss';
import { BaseButton } from '@/components';
import uploadImg from './img/upload.png';
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { analyzeFiles } from './utils';
import { toast } from 'sonner';

export function FileAnalyze() {
  const [nameList, setNameList] = useState<string[]>([]);
  const [urlDir, setUrlDir] = useState<string[]>([]);
  const [imgDir, setImgDir] = useState<string[]>([]);
  const [textDir, setTextDir] = useState<string[]>([]);

  const [suffix, setSuffix] = useState(true);
  const [onlyDir, setOnlyDir] = useState(false);
  const [subDir, setSubDir] = useState(true);

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
      transform(filesRef.current, { suffix, onlyDir, subDir });
    }
  }, [suffix, onlyDir, subDir]);

  const handlePaste = (event: any) => {
    event.preventDefault();
    const files = event.clipboardData.files;
    transform([...files], { suffix, onlyDir, subDir });
    filesRef.current = [...files];
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    filesRef.current = [];

    if (!files) return;
    transform([...files], { suffix, onlyDir, subDir });
    filesRef.current = [...files];
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
    copyText +=
      '\n上面是一个视频教程的目录，你帮我总结一下大致内容，要求：分点总结，创意新颖； 最后再根据这个教程的主题给出10句吸引用户的宣传语/营销语，同样要求有创意，能抓住用户眼球';
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
        <h2>File Analyze</h2>
        <div className="upload">
          <input
            type="file"
            className="file"
            {...{ webkitdirectory: '' }}
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
              copy
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
