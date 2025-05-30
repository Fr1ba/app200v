import {useState, useEffect, useRef} from "react";
import {CircleUser} from "lucide-react";
import {Link} from "react-router-dom"; 
import styles from './profileIcon.module.css';
import { logoutUser } from "../../api/authentication";

/**
 * Implement a profile icon for desktopview.
 * @returns profile icon with a dropdown menu to profile and logout
 * @author Erica Laub Varpe
 */
function ProfileIcon() {
    const [open, setOpen] = useState(false);
    const profileRef = useRef(null);
    
    const handleOpen = () => setOpen(!open);

    /**
     * Handle clicks outside the profile component and closes the dropdown if it is open
     * 
     * @author Erica Laub Varpe
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
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
        <div ref={profileRef}>
            <div>
                <CircleUser className={styles.profileIcon} onClick={handleOpen}/>
            </div>
            {open ? (<div>{profileOptions()}</div>) : null}
        </div>
    );
}

/**
 * The dropdown menu for the profile icon
 * @returns dropdown menu with options
 * @author Erica Laub Varpe
 */
function profileOptions() {
    return (
        <ul className={styles.dropDown}>
            <li className={styles.dropDownItems}>
                <Link to="/ProfilePage">Profil</Link>
            </li>
            <li
                className={styles.dropDownItems}
                onClick={async () => {
                    await logoutUser();
                    window.location.href = '/Login';
                }}
            >
                Logg ut
            </li>
        </ul>
    );
}

export default ProfileIcon;