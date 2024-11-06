import React, { useEffect, useState } from 'react';
import styles from '@/components/textbox/page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/context/ThemeProvider';

interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  label?: string;
  disabled?: boolean;
  errMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  label,
  disabled = false,
  errMessage,
}) => {
  const { theme } = useTheme();
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [shake, setShake] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  useEffect(() => {
    // Trigger shake effect briefly if there is an error
    if (errMessage) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [errMessage]);

  // Determine the input type dynamically
  const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

  const handleCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (type === 'password') {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (type === 'password') {
      e.preventDefault();
    }
  };

  // Define light/dark mode exclusive theme classes
  const inputTheme =
    theme === 'dark' ? styles.inputFieldDark : styles.inputFieldLight;

  return (
    <div className={styles.inputWrapper}>
      <div className={styles.inputContainer}>
        <label className={styles.TextBoxLabel}>{label}</label>
        <input
          className={`${styles.InputField} ${inputTheme} ${shake ? styles.shake : ''}`}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onCopy={handleCopy}
          onPaste={handlePaste}
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
      {errMessage && (
        <div
          className={`${styles.Err} ${shake ? styles.shake : ''}`}
          style={{ whiteSpace: 'pre-line' }}
        >
          {errMessage}
        </div>
      )}
    </div>
  );
};

export default InputField;
