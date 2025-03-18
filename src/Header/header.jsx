import styles from './header.module.css';
import React from 'react';

function Header() {
  return (
    <nav className={styles.header}>
      <div className={styles.headerLeft}>
        <a href="#" className={styles.headerLogo}>
          <span className={styles.logo}>LOGO</span>
        </a>
        <ul className={styles.navLinks}>
          <li><a href="#">Hjem</a></li>
          <li><a href="#">Ny Sak</a></li>
          <li><a href="#">Profil</a></li>
        </ul>
      </div>
      <div className={styles.headerRight}>
        <button className={styles.logoutButton}>Logg ut</button>
      </div>
    </nav>
  );
}

export default Header;
