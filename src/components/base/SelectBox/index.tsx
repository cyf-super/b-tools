import styles from './index.module.scss';

type SelectBoxType<T> = {
  value: T;
  onSelect: (num: T) => void;
  OPTIONS: {
    value: T;
    label: string;
  }[];
  label?: string;
};

export function SelectBox<T extends number | string = number>({
  value,
  onSelect,
  OPTIONS,
  label
}: SelectBoxType<T>) {
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
        onChange={e => {
          const value = e.target.value;
          onSelect((Number.isNaN(+value) ? value : +value) as unknown as T);
        }}
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
