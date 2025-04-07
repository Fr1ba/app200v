import { useState } from "react";
import { CircleUser } from "lucide-react";
import { Link } from "react-router-dom"; // Add this import
import styles from './profileIcon.module.css';

function ProfileIcon() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    
    return (
        <div>
            <div>
                <CircleUser className={styles.profileIcon} onClick={handleOpen} />
            </div>
            {open ? (<div>{profileOptions()}</div>) : null}
        </div>    
    );
}

function profileOptions() {
    return (
        <ul className={styles.dropDown}>
            <li className={styles.dropDownItems}><Link to="/ProfilePage">Profil</Link></li>
            <li className={styles.dropDownItems}>Logg ut</li>
        </ul>
    );
}

export default ProfileIcon;