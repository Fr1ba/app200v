// TODO When you click on the notif you will be directed to the related case and the notif will be gone from the bell. 

import { useState } from "react";
import { Bell } from "lucide-react";
import styles from './bell.module.css';

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const notificationCount = notisArray().props.children.length;
  return (
    <div>
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

function notisArray(){
  const notisList = ["New message", "Case updated", "Case closed"];
  return (
    <ul className={styles.notifiactionBox}>
      {notisList.map((noti, index) => (
      <li className={styles.notifications} key={index}>
          Case {index}: {noti}
      </li>))
      }
    </ul>
  )
 
}

export default NotificationBell;