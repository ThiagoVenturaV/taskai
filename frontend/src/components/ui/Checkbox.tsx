import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.checkbox} ${checked ? styles.checked : ''}`}
      onClick={onChange}
      type="button"
    >
      <svg
        className={styles.checkIcon}
        width="10"
        height="8"
        viewBox="0 0 10 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 4L3.5 6.5L9 1"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
