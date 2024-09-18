import React from 'react';
import styles from '@/app/page.module.css';
interface ActiveButtonProps {
  onClick?: () => void;
  text: string;
}
const ActiveButton = ({ onClick, text }: ActiveButtonProps) => {
  return (
    <button className={styles.loginbtton} onClick={onClick}>
      {text}
    </button>
  );
};

export default ActiveButton;
