import React from 'react';
import styles from'./Login.module.css';
import { FaUser, FaLock } from "react-icons/fa";
import logo from './Assets/itxLogo.png';


function Login() {
    return(
     <div className={styles.container}> 
        <div>
            <div className={styles.logoContainer}>
                <img src = {logo} alt ="Logo" className={styles.logo}/>
            </div>
            <div className={styles.wrapper}>
                <form action = "">
                    <h1>Logg in</h1>
                    <div className={styles.inputBox}>
                        <input type="text" placeholder='Brukernavn' required />
                        <FaUser className={styles.icon}/>
                </div>
                <div className={styles.inputBox}>
                    <input type="password" placeholder='Passord' required />
                    <FaLock className={styles.icon}/>
                </div>
                <div className={styles.rememberForgot}>
                    <label> 
                        <input type='checkbox' />Husk meg
                    </label>
                    <a href='#'> Glemt passord? </a>
                </div>
                <button type='submit' className={styles.button}>Logg inn</button>
            </form>
         </div>
       </div>
    </div>
   );
};

export default Login;