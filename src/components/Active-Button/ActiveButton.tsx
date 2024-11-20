// ActiveButton.tsx
import React from 'react';
import styles from '@/components/Active-Button/page.module.css';

interface ActiveButtonProps {
  onClick?: () => void;
  text: string;
  isDisabled?: boolean;
}

const ActiveButton: React.FC<ActiveButtonProps> = ({
  onClick,
  text,
  isDisabled = false,
}) => {
  return (
    <button
      className={`${styles.ActiveButton} ${isDisabled ? styles.disabledButton : ''}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
};

export default ActiveButton;
