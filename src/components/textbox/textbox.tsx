import React, { useState } from 'react';
import styles from '@/components/textbox/page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
  label,
  disabled = false,
  errorMessage = [], // Default to empty string
  shake = false, // Default to false
}) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  // Determine the input type dynamically
  const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

  return (
    <div className={styles.inputWrapper}>
      <div className={styles.inputContainer}>
        <label className={styles.TextBoxLabel}>{label}</label>
        <input
          className={`${styles.InputField} ${shake ? styles.shake : ''}`}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        {type === 'password' && (
          <button
            type="button"
            className={styles.toggleVisibilityButton}
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon
              icon={!isPasswordVisible ? faEyeSlash : faEye}
              size="sm"
            />
          </button>
        )}
      </div>
      {errorMessage && (
        <div
          className={`${styles.Err} ${shake ? styles.shake : ''}`}
          style={{ whiteSpace: 'pre-line' }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default InputField;
