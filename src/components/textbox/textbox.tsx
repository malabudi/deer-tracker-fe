import React from 'react';
import styles from '@/components/textbox/page.module.css';

interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  label?: string;
  disabled?: boolean;
  errorMessage?: string; // New prop for error message
  shake?: boolean; // New prop for shake animation
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  errorMessage = '', // Default to empty string
  shake = false, // Default to false
}) => {
  return (
    <div>
      <input
        className={`${styles.InputField} ${shake ? styles.shake : ''}`} // Apply shake class if needed
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {errorMessage && (
        <div className={`${styles.Err} ${shake ? styles.shake : ''}`}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default InputField;
