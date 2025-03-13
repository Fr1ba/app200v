import {useState} from 'react';
import styles from './notification.module.css';
import pepper from './img/pepper.png';


function Notification () {
   const [notis, setNotis] = useState([]);
   const randomNotisList = ["Sunny day", "Rainy day", "Snowy day", "Darkies day"];

   const handleClick = () => {
    // choose a random notis from randomNotisList
    const randomIndex = Math.floor(Math.random()* randomNotisList.length);
    const newNotis = randomNotisList[randomIndex];

    // Update notis-array with new notis
    setNotis(prevNotis => [...prevNotis, newNotis]);
   };

   // remove li item when clicked
   const removeNotis = (indexToRemove) => {
    setNotis(prevNotis => prevNotis.filter((_, index) => index !== indexToRemove));
   };

    return (
        <>
        <h1>Notifications</h1>
            <img src={pepper} alt ="pepper" onClick={handleClick} />
        <ul>
            {notis.map((noti, index) => (
            <li key={index} onClick={()=> removeNotis(index)}>Case {index}: {noti}</li>))
            }
        </ul>
        </>
    );
}

export default Notification;