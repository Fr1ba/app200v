import React, { useState } from 'react';
import styles from'./Login.module.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from '../Logo/Logo';
import {useEffect} from "react";


const endpoint = "https://app06.itxnorge.no"

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState('password');

    const handleSubmit = (event) => {
        event.preventDefault(); //prevents page from refreshing  

             console.log(`${endpoint}/rest/core/login`);
        
             const fetchData = async () => {
                 return await fetch(`${endpoint}/rest/core/login`, {
                    method: 'POST',
                     credentials: 'include',
                     body: JSON.stringify({
                         username,
                         password,
                         rememberMe: true
                     })
                 });
             };
        
             const data = fetchData();
        
             data.then(response => {
                 if (response.ok) {
                     window.location.href = '/';
                 }
             })
        };
        

    return(
     <div className={styles.container}> 
        <div>
            <div className={styles.logoContainer}>
            <Logo className={styles.logo}/> 
            </div>
            <div className={styles.wrapper}>
                <form onSubmit={handleSubmit}> {/* runs the handleSubmit logic on form submit */}
                    <h1>Velkommen</h1>
                    <div className={styles.inputBox}>
                        <input type="text" placeholder='Brukernavn' value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <FaUser className={styles.icon}/>
                </div>
                <div className={styles.inputBox}>
                    <input type={type} placeholder='Passord' value ={password} onChange={(e) => setPassword(e.target.value)} required />
                    
                    <div className={styles.passwordToggle} onClick={showPassword}>
                        {type === 'password' ? <FaEye /> : <FaEyeSlash />}
                    </div>
                </div>
               
                <div className={styles.rememberForgot}>
                    <label> 
                        <input type='checkbox' />Husk meg
                    </label>
                    <a href='#'> Glemt passord? </a>
                </div>
                <div className={styles.buttonContainer}>
                <button type='submit' className={styles.button}>Logg inn</button>
                </div>
            </form>
         </div>
       </div>
    </div>
   );

   function showPassword() {
    if (type === 'password') {
        setType('text')
    } else {
        setType('password')
    }
  }
};



export default Login;