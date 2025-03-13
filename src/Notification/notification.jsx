import styles from './notification.module.css'
import pepper from './img/pepper.png'

function Notification () {
    const notis = ["New message", "Updated status", "Case closed"];

    return (
        <>
        <h1>Notifications</h1>
            <img src={pepper} alt ="pepper" />
        <ul>
            {notis.map((noti, index) => (
            <li key={index}>Case {index}: {noti}</li>))
            }
        </ul>
        </>
    );
}

export default Notification;