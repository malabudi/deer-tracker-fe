import React from 'react';
import styles from './page.module.css';

interface RadioButtonProps {
  label: React.ReactNode;
  name: string;
  value: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  name,
  value,
  checked = false,
  onChange,
}) => {
  return (
    <div className={styles.RadioButtonContainer}>
      <label className={styles.RadioButtonLabel}>
        <input
          className={styles.RadioButtonInput}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
        />
        <span
          className={`${styles.RadioButton} ${checked ? styles.filled : ''}`}
        />
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  );
};

export default RadioButton;
