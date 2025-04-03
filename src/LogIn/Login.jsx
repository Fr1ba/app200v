import React, { useState } from 'react';
import styles from'./Login.module.css';
import { FaUser, FaLock } from "react-icons/fa";
import logo from './Assets/itxLogo.png';
import {useEffect} from "react";


const endpoint = "https://app06.itxnorge.no"

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault(); //prevents page from refreshing  

             console.log(`${endpoint}/rest/core/login`);
        
             const fetchData = async () => {
                 return await fetch(`${endpoint}/rest/core/login`, {
                    method: 'POST',
                     credentials: 'include',
                     body: JSON.stringify({
                         username,
                         password
                         // rememberMe: true
                     })
                 });
             };
        
             const data = fetchData().then(res => res.json()); //turning the response into JSON
        
             data.then(responseData => {    //responseData is the parsed JSON returned by the server (response from API)
                 console.log(responseData);  //logs the response including status
                 console.log(responseData.status);
             }).catch(error => {
                 console.error("Error fetching data:", error);
             });
        };

    return(
     <div className={styles.container}> 
        <div>
            <div className={styles.logoContainer}>
                <img src = {logo} alt ="Logo" className={styles.logo}/>
            </div>
            <div className={styles.wrapper}>
                <form onSubmit={handleSubmit}> {/* runs the handleSubmit logic on form submit */}
                    <h1>Logg inn</h1>
                    <div className={styles.inputBox}>
                        <input type="text" placeholder='Brukernavn' value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <FaUser className={styles.icon}/>
                </div>
                <div className={styles.inputBox}>
                    <input type="password" placeholder='Passord' value ={password} onChange={(e) => setPassword(e.target.value)} required />
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