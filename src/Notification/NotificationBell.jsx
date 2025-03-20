// TODO Make the bell fully colored in when the notifications is open. 
// TODO Add a number on the bell with how many unread notifications is there. If more than five display "5+".
// TODO When you click on the notif you will be directed to the related case and the notif will be gone from the bell. 


import { useState } from "react";
import { Bell } from "lucide-react";
import styles from './bell.module.css';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  
  return (
    <div >
       <Bell className={styles.bell} onClick={handleOpen} />
       {open ? (<div>{notisArray()}</div>): null}
    </div>
     
  );
}

function notisArray(){
  const notisList = ["New message", "Case updated", "Case closed"];
  return (
    <ul>
      {notisList.map((noti, index) => (
      <li key={index}>
          Case {index}: {noti}
      </li>))
      }
    </ul>
  )
 
}
