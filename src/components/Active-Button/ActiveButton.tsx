// ActiveButton.tsx
import React from 'react';
import styles from '@/components/Active-Button/page.module.css';

interface ActiveButtonProps {
  onClick?: () => void;
  text: string;
  isdisabled?: boolean;
}

const ActiveButton: React.FC<ActiveButtonProps> = ({
  onClick,
  text,
  isdisabled = false,
}) => {
  return (
    <button
      className={`${styles.ActiveButton} ${isdisabled ? styles.disabledButton : ''}`}
      onClick={onClick}
      disabled={isdisabled}
    >
      {text}
    </button>
  );
};

export default ActiveButton;
