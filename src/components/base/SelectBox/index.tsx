import styles from './index.module.scss';

type SelectBoxType = {
  value: number;
  onSelect: (num: number) => void;
  OPTIONS: {
    value: number;
    label: string;
  }[];
};

export function SelectBox({ value, onSelect, OPTIONS }: SelectBoxType) {
  return (
    <select
      onChange={e => onSelect(+e.target.value)}
      onClick={e => {
        e.stopPropagation();
      }}
      defaultValue={375}
      className={styles.select}
    >
      {OPTIONS.map(item => (
        <option
          value={item.value}
          selected={item.value === value}
          className={styles.selectOption}
        >
          {item.label}
        </option>
      ))}
    </select>
  );
}
