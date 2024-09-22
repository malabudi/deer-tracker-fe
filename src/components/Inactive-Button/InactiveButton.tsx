import React from 'react';
import styles from '@/components/Inactive-Button/page.module.css';
interface InactiveButtonProps {
  onClick?: () => void;
  text: string;
}
const InactiveButton = ({ onClick, text }: InactiveButtonProps) => {
  return (
    <button className={styles.signUpBtn} onClick={onClick}>
      {text}
    </button>
  );
};

export default InactiveButton;
