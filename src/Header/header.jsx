import styles from './header.module.css';
import React, { useState, useEffect } from 'react';
import NotificationBell from './Notification/NotificationBell';
import ProfileIcon from './ProfileIcon/profileIcon';
import logo from '../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { logoutUser } from '../api/authentication.js';

const endpoint = "https://app06.itxnorge.no";

async function Logout() {
  await fetch(`${endpoint}/rest/core/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}

function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


 // const navigate = useNavigate();
 
 // const toggleMenu = () => {
 //   setMenuOpen(!menuOpen);
 // };
  
  // Close the menu when the user clicks on a link

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Navigate to login page after successful logout
      navigate('/Login');
    } catch (error) {
      console.error('Logout failed:', error);
      // You might want to show an error message to the user
    }
  };

  return (
    <nav className={`${styles.header} ${styles.mobileHeader}`}>
      <div className={styles.headerContainer}>
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
     
      {menuOpen && (
        <div className={styles.mobileNav}>
          <ul className={`${styles.navLinks} ${styles.mobileNavLinks}`}>
            <li><Link to="/" onClick={closeMenu}>Hjem</Link></li>
            <li><Link to="/CreateCase" onClick={closeMenu}>Opprett ny Sak</Link></li>
            <li><Link to="/ProfilePage" onClick={closeMenu}>Profil</Link></li>
            <li onClick={Logout}><Link to="/Login" onClick={closeMenu}>Logg ut</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

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
export default Header;