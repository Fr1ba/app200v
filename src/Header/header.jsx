import styles from './header.module.css';
import React from 'react';
import NotificationBell from '../Notification/NotificationBell';
import logo from '../images/logo.png';

function Header() {
  return (
    <nav className={styles.header}>
      <div className={styles.headerLeft}>
        <a href="#" className={styles.headerLogo}>
          <img src= { logo } alt="Logo" className={styles.logo}></img>
        </a>
        <ul className={styles.navLinks}>
          <li><a href="#">Hjem</a></li>
          <li><a href="#">Ny Sak</a></li>
          <li><a href="#">Profil</a></li>
        </ul>
      </div>
      
      <div className={styles.headerRight}>
        <NotificationBell/>
        <button className={styles.logoutButton}>Logg ut</button>
      </div>
    </nav>
  );
}

export default Header;
