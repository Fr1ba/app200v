import styles from './header.module.css';
import React, { useState, useEffect } from 'react';
import NotificationBell from './Notification/NotificationBell';
import ProfileIcon from './ProfileIcon/profileIcon';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Mobileview of header
function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
 
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close the menu when the user clicks on a link
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={styles.mobileHeader}>
      <div className={styles.mobileHeaderTop}>
        <Link to="/" className={styles.headerLogo}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </Link>
        
        <div className={styles.headerRight}>
          <NotificationBell />
          <button 
            className={styles.menuButton} 
            onClick={toggleMenu} 
            aria-label="Åpne meny"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        

      </div>
      
      {/* Navigation for mobileview*/}
      {menuOpen && (
        <div className={styles.mobileNav}>
          <ul className={styles.mobileNavLinks}>
            <li><Link to="/" onClick={closeMenu}>Hjem</Link></li>
            <li><Link to="/CreateCase" onClick={closeMenu}>Opprett ny Sak</Link></li>
            <li ><Link to="/ProfilePage">Profil</Link></li>
            <li onClick={Logout}><Link to="/Login">Logg ut</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

// Desktopview of header
function DesktopHeader() {
  return (
    <nav className={styles.desktopHeader}>
      <div className={styles.headerLeft}>
        <Link to="/" className={styles.headerLogo}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </Link>
        
        <ul className={styles.desktopNavLinks}>
          <li><Link to="/">Hjem</Link></li>
          <li><Link to="/CreateCase">Opprett ny Sak</Link></li>
        </ul>
      </div>
      
      <div className={styles.headerRight}>
        <NotificationBell />
        <ProfileIcon />
      </div>
    </nav>
  );
}

// Main component that chooses the right header based on screen size
function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}

//Function copied from profileIcon.jsx to be able to logout from mobileview
const endpoint = "https://app06.itxnorge.no"

async function Logout() {
    await fetch(`${endpoint}/rest/core/logout`, {
        method: 'POST',
        credentials: 'include'
    });
}

export default Header;