import React from 'react';
import logo from './RNDM-3.png'; // Make sure the path is correct
import styles from './Logo.module.css';

function Logo({ className, ...props }) {
  return <img src={logo} alt="ITX Logo" className={`${styles.logo} ${className || ''}`} {...props} />;
}

export default Logo;