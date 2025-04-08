import styles from './header.module.css';
import React, { useState } from 'react';
import NotificationBell from './Notification/NotificationBell';
import ProfileIcon from './ProfileIcon/profileIcon';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Importerer ikoner for hamburgermeny

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.header}>
      <div className={styles.headerLeft}>
        <Link to="/" className={styles.headerLogo}>
          <img src={logo} alt="Logo" className={styles.logo}></img>
        </Link>
        
        {/* Hamburger-ikon som vises på mobile enheter */}
        <button className={styles.menuButton} onClick={toggleMenu}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        
        {/* Navigasjonslenker som endrer visning basert på skjermstørrelse */}
        <ul className={`${styles.navLinks} ${menuOpen ? styles.navLinksActive : ''}`}>
          <li><Link to="/" onClick={toggleMenu}>Hjem</Link></li>
          <li><Link to="/CreateCase" onClick={toggleMenu}>Opprett ny Sak</Link></li>
        </ul>
      </div>
     
      <div className={styles.headerRight}>
        <NotificationBell/>
        <ProfileIcon/>
      </div>
    </nav>
  );
}

export default Header;