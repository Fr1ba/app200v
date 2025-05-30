/**
 * This code simulates a notification bell. It is not a functional component, but can be further developed later.
 * @author Erica Laub Varpe
 */

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import styles from './bell.module.css';


/**
 * The notification bell
 * @returns notification bell
 * @author Erica Laub Varpe
 */
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const notificationRef = useRef(null);
  
  const handleOpen = () => setOpen(!open);
  const notificationCount = notisArray().props.children.length;

  /**
   * Handle clicks outside the profile component
   * @author Erica Laub Varpe
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // Add event listener when the dropdown menu is open
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Remove event listener when click outside dropdown menu
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={notificationRef}>
       <div className={styles.bellWithCount}>
         <Bell
           className={styles.bell}
           onClick={handleOpen}
           fill={open ? "white" : "none"}
         />
         {notificationCount > 0 && (
           <span className={styles.notificationCount}>
             {notificationCount > 5 ? "5+" : notificationCount}
           </span>
         )}
       </div>
       {open ? (<div>{notisArray()}</div>): null}
    </div>
  );
}

/**
 * Hardcoded notifications to be sent to the notificationbell
 * @returns array of notifications
 * @author Erica Laub Varpe
 */
function notisArray(){
  const notisList = ["Ny melding", "Sak oppdatert", "Sak lukket"];
  return (
    <ul className={styles.notificationBox}>
      {notisList.map((noti, index) => (
      <li className={styles.notifications} key={index}>
          <strong>Sak {index}:</strong> {noti}
      </li>))
      }
    </ul>
  )
}

export default NotificationBell;