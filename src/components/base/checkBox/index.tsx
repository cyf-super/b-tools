import styles from './index.module.scss';

interface CheckboxType {
  checked: boolean;
  label: string;
  onChange: (flag: boolean) => void;
}

export function Checkbox({ checked, onChange, label }: CheckboxType) {
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
