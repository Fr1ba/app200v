import styles from './header.module.css';
import React, { useState, useEffect } from 'react';
import NotificationBell from './Notification/NotificationBell';
import ProfileIcon from './ProfileIcon/profileIcon';
import logo from '../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { logoutUser } from '../api/authentication.js';

/**
 * Responsive navigation header component for the application.
 * Renders either a mobile or desktop header based on screen width.
 *
 * Shared features include:
 * - Logo
 * - Navigation links
 * - Notification bell
 * - User actions like logout and profile access
 *
 * @component
 * @author Erica
 * @author Trudy
 */

/**
 * Mobile version of the navigation header.
 * Displays a logo, notification bell, and a hamburger menu that toggles navigation links.
 * 
 * @returns {JSX.Element} The mobile navigation header.
 * @component
 * @author Erica
 */
function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Toggles the visibility of the mobile menu.
   */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  /**
   * Closes the mobile menu.
   */
  const closeMenu = () => {
    setMenuOpen(false);
  };

  /**
   * Logs out the user by calling the API and redirects to login page.
   * Logs errors if logout fails.
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
     
      {/* Mobile navigation links, shown when menu is open */}
      {menuOpen && (
        <div className={styles.mobileNav}>
          <ul className={styles.mobileNavLinks}>
            <li><Link to="/" onClick={closeMenu}>Mine saker</Link></li>
            <li><Link to="/CreateCase" onClick={closeMenu}>Opprett ny sak</Link></li>
            <li><Link to="/ProfilePage" onClick={closeMenu}>Profil</Link></li>
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
 * Desktop version of the navigation header.
 * Displays logo, navigation links, notification bell, and profile icon.
 * 
 * @returns {JSX.Element} The desktop navigation header.
 * @component
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
          <li><Link to="/">Mine saker</Link></li>
          <li><Link to="/CreateCase">Opprett ny sak</Link></li>
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
 * Responsive Header component that switches between mobile and desktop versions
 * based on the current window width.
 * 
 * @returns {JSX.Element} The appropriate navigation header based on screen size.
 * @component
 * @author Erica
 */
function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    /**
     * Updates isMobile state based on window width.
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
