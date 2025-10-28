import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Welcome.module.css';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/code-entry');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to Code to Flowchart</h1>
        <p className={styles.subtitle}>Convert your code into beautiful flowcharts</p>
        <button onClick={handleGetStarted} className={styles.button}>
          Get Started
        </button>
      </header>
    </div>
  );
};

export default Welcome; 