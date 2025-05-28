/**
 * Header.jsx
 *
 * Implements a responsive navigation header for the application.
 * Renders different components based on screen size:
 * - MobileHeader: A compact header with a hamburger menu for small screens.
 * - DesktopHeader: A full-width navigation bar for larger screens.
 * - Header: Main export that chooses between MobileHeader and DesktopHeader based on screen width.
 *
 * Shared functionality includes logo, navigation links, notification bell, and user actions like logout.
 *
 * @module Header
 * @author Erica
 * @author Trudy
 */
import styles from './header.module.css';
import React, { useState, useEffect } from 'react';
import NotificationBell from './Notification/NotificationBell';
import ProfileIcon from './ProfileIcon/profileIcon';
import logo from '../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { logoutUser } from '../api/authentication.js';


/**
 * A navigation header for mobile devices.
 *
 * This component displays a logo, a notification bell and a menu button.
 * When the menu button is clicked, a menu with links to various pages is
 * displayed. The menu is closed when a link is clicked.
 *
 * @returns {React.ReactElement} A nav element with the mobile header.
 * @author Erica
 */
function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Toggles the menu open or closed.
   */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  /**
   * Closes the menu.
   */
  const closeMenu = () => {
    setMenuOpen(false);
  };

  /**
   * Handles the logout button click event.
   *
   * Calls the logoutUser API and navigates to the login page
   * after successful logout. If the logout fails, an error
   * message is logged to the console.
   * @author Erica
   */
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
            <li><Link to="/ProfilePage">Profil</Link></li>
            <li>
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Logg ut
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

/**
 * A navigation header for desktop devices.
 *
 * This component displays a logo, a navigation menu with links to the home page
 * and create case page, as well as a notification bell and profile icon.
 *
 * @returns {React.ReactElement} A nav element with the desktop header.
 * @author Trudy
 */
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

/**
 * A responsive navigation header that renders a mobile or desktop header
 * depending on the screen width.
 *
 * @returns {React.ReactElement} A nav element with the responsive header.
 * @author Erica
 */
function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    /**
     * Handles the window resize event.
     *
     * Checks if the window width is less than 768px and updates the
     * isMobile state accordingly.
     */
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