import React from 'react';
import styles from './page.module.css';

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle }) => {
  return (
    <div className={styles.toggleContainer} onClick={handleToggle}>
      <div
        className={`${styles.toggleSwitch} ${isOn ? styles.on : styles.off}`}
      >
        <div className={styles.circle} />
      </div>
      <span className={styles.toggleText}>{isOn ? 'On' : 'Off'}</span>
    </div>
  );
};

export default ToggleSwitch;
