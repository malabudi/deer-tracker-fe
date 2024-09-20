import React from 'react';
import styles from '@/components/Active-Button/page.module.css';
interface ActiveButtonProps {
  onClick?: () => void;
  text: string;
}
const ActiveButton = ({ onClick, text }: ActiveButtonProps) => {
  return (
    <button className={styles.ActiveButton} onClick={onClick}>
      {text}
    </button>
  );
};

export default ActiveButton;
