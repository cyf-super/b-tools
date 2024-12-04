import { Edit } from './editor';
import styles from './index.module.scss';
import { BaseButton, Checkbox, SelectBox } from '@/components';
import { useTransform, StyleType, LogoTemplate } from './hooks/useTransform';
import { FontsFamily, FontsSize, FontsWeight } from './utils';
import Template from './template.json';

export default function DetailPicture() {
  const {
    // logo,
    template,
    editorRef,
    descendant,
    textList,
    nameStyle,
    textStyle,
    isDownloading,
    watermark,
    watermarkList,
    secondText,
    setSecondChecked,
    setSecondValue,
    setWatermark,
    setTemplate,
    setNameStyle,
    setTextStyle,
    onTransform,
    editChange,
    onReset,
    onDownload,
    onChangeLogo
  } = useTransform();

  const disabled = !descendant[0]?.children[0].text;
  return (
    <>
      <div className={styles.box}>
        <h2>Detail Picture</h2>
        <div className="editor">
          <div className="left">
            <Edit
              onChange={editChange}
              descendant={descendant}
              editor={editorRef.current}
            />
            <div className="btn">
              <BaseButton disabled={disabled} onClick={onReset}>
                Reset
              </BaseButton>
              <BaseButton
                disabled={disabled}
                className="btn-texthtml"
                onClick={onTransform}
              >
                FormatText
              </BaseButton>
              <BaseButton
                disabled={!textList.length || isDownloading}
                onClick={onDownload}
              >
                {isDownloading ? '下载中' : '下载图片'}
              </BaseButton>
            </div>
          </div>
        </div>

        <div className="content">
          {template.header && (
            <div
              className="header"
              style={{
                background: `url(${template.header}) center/100% 100% no-repeat`
              }}
            ></div>
          )}
          <div
            className="textList"
            id="detailList"
            style={{ background: template.background }}
          >
            {/* <img
              src={`/b-tools/templateLogo/logo${logo.id}.png`}
              className="templateLogo"
              alt=""
              style={{ opacity: logo.opacity }}
              id="img"
            /> */}
            <div className="watermarkList" id="watermarkList">
              {watermarkList.current.map(_ => (
                <div className="watermarkText">
                  {watermark.text || '长安不止三万里'}
                </div>
              ))}
            </div>
            {textList.map((item, index) => (
              <div key={index} className="item">
                <div
                  className="name"
                  style={{
                    ...nameStyle,
                    background: template.nameBackground
                  }}
                >{`${index + 1}. ${item.name}`}</div>
                <div
                  className="detailList"
                  style={{ background: template.textListBackground }}
                >
                  {item.detailList.map((detail, i) => (
                    <div
                      className="text"
                      style={{
                        ...textStyle
                      }}
                    >
                      {secondText.checked
                        ? secondText.value
                        : `${index + 1}.${i + 1} `}
                      {detail.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="options">
            <div className="font">
              <div className="title">
                <h3>title样式</h3>
                <SelectBoxGroud
                  style={nameStyle}
                  setType={rest => {
                    setNameStyle({
                      ...nameStyle,
                      ...rest
                    });
                  }}
                />
              </div>
              <div className="textStyle">
                <h3>text样式</h3>
                <SelectBoxGroud
                  style={textStyle}
                  setType={rest => {
                    console.log;
                    setTextStyle({
                      ...textStyle,
                      ...rest
                    });
                  }}
                />
                <div className="editIndex">
                  <Checkbox
                    label="编辑index"
                    checked={secondText.checked}
                    onChange={setSecondChecked}
                  />
                  <input
                    className="textInput"
                    type="text"
                    value={secondText.value}
                    onChange={e => setSecondValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="watermarkEdit">
              <h3>水印: </h3>
              <input
                type="text"
                placeholder="水印"
                value={watermark.text}
                onChange={e =>
                  setWatermark({
                    ...watermark,
                    text: e.target.value
                  })
                }
              />
              <h3 className="num">数量: </h3>
              <input
                type="text"
                placeholder="每10行一水印"
                className="numInput"
                value={watermark.num}
                onChange={e =>
                  setWatermark({
                    ...watermark,
                    num: e.target.value
                  })
                }
              />
            </div>
            <div className="logoEdit">
              <h3>logo</h3>
              <div className="gridLogos">
                {LogoTemplate.map(id => (
                  <img
                    src={`/b-tools/templateLogo/logo${id}.png`}
                    onClick={() => onChangeLogo({ id })}
                  />
                ))}
                <div
                  className={['emptyLogo'].join(' ')}
                  onClick={() => onChangeLogo({ id: 0 })}
                >
                  空
                </div>
              </div>
              <div>
                透明度：
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={e => onChangeLogo({ opacity: +e.target.value })}
                />
              </div>
            </div>
            <div className="templates">
              <h3>模板</h3>
              <div className="templateList">
                {Template.map(item => (
                  <div
                    className={[
                      'template',
                      template.id === item.id ? 'selectTemplate' : ''
                    ].join(' ')}
                    key={item.id}
                    style={{
                      background: item.background
                    }}
                    onClick={() => setTemplate(item)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SelectBoxGroud({
  style,
  setType
}: {
  style: StyleType;
  setType: ({
    fontFamily,
    fontSize,
    fontWeight,
    color
  }: Partial<StyleType>) => void;
}) {
  return (
    <>
      <SelectBox<string>
        label="类型: "
        OPTIONS={FontsFamily}
        value={style.fontFamily}
        onSelect={fontFamily =>
          setType({
            fontFamily
          })
        }
      />
      <SelectBox
        label="大小: "
        OPTIONS={FontsSize}
        value={style.fontSize}
        onSelect={fontSize =>
          setType({
            fontSize
          })
        }
      />
      <SelectBox
        label="粗细: "
        OPTIONS={FontsWeight}
        value={style.fontWeight}
        onSelect={fontWeight =>
          setType({
            fontWeight
          })
        }
      />
      <div className="colorSelect">
        <label form="color">颜色: </label>
        <input
          id="color"
          type="color"
          value={style.color}
          onChange={e =>
            setType({
              color: e.target.value
            })
          }
        />
      </div>
    </>
  );
}
