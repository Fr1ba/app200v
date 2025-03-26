import styles from './header.module.css';
import React from 'react';
import NotificationBell from '../Notification/NotificationBell';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className={styles.header}>
      <div className={styles.headerLeft}>
        <Link to="/CaseList" className={styles.headerLogo}>
          <img src= { logo } alt="Logo" className={styles.logo}></img>
        </Link>
        <ul className={styles.navLinks}>
          <li><Link to="/CaseList">Hjem</Link></li>
          <li><Link to="/CreateCase">Ny Sak</Link></li>
          <li><Link to="/ProfilePage">Profil</Link></li>
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
