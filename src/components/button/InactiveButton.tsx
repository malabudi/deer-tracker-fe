import React from 'react';
import styles from '@/app/page.module.css';
interface InactiveButtonProps {
  onClick?: () => void;
  text: string;
}
const InactiveButton = ({ onClick, text }: InactiveButtonProps) => {
  return (
    <button className={styles.signupbtton} onClick={onClick}>
      {text}
    </button>
  );
};

export default InactiveButton;
