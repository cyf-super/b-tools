import styles from './index.module.scss';

type SelectBoxType = {
  value: number;
  onSelect: (num: number) => void;
  OPTIONS: {
    value: number;
    label: string;
  }[];
  label?: string;
};

export function SelectBox({ value, onSelect, OPTIONS, label }: SelectBoxType) {
  return (
    <div className={styles.selectBox}>
      {label && (
        <>
          <span className={styles.icon}></span>
          <label htmlFor={label}>{label}</label>
        </>
      )}
      <select
        id={label}
        onChange={e => onSelect(+e.target.value)}
        onClick={e => {
          e.stopPropagation();
        }}
        defaultValue={value}
        className={styles.select}
      >
        {OPTIONS.map(item => (
          <option
            key={item.value}
            value={item.value}
            selected={item.value === value}
            className={styles.selectOption}
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
