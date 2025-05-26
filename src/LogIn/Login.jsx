import React, { useState } from "react";
import styles from "./Login.module.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../Logo/Logo";
import { loginUser } from "../api/authentication";

function Login() {
  const [username, setUsername] = useState(""); //tracks input fields
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); //prevents page from refreshing  
    setIsLoading(true); 

    try {
      const response = await loginUser(username, password);

      if (response.ok) {
        window.location.href = "/";
      } else {
        const data = await response.json().catch(() => ({}));// If API response can’t be read as JSON => "Login failed"
        alert(data.errorMsg || "Login failed"); //successful fetch but with error status, f.ex. unauthorised access
      }
    } catch (error) {
      console.error("Login error:", error); //fetch unsuccesful, e.g. problem with network connection. 
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const showPassword = () => {
    setType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logoContainer}>
          <Logo className={styles.logo} />
        </div>
        <div className={styles.wrapper}>
          <form onSubmit={handleSubmit}>
            <h1>Velkommen</h1>
            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FaUser className={styles.icon} />
            </div>
            <div className={styles.inputBox}>
              <input
                type={type}
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className={styles.passwordToggle} onClick={showPassword}>
                {type === "password" ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <div className={styles.rememberForgot}>
              <label>
                <input type="checkbox" />
                Husk meg
              </label>
              <a href="#">Glemt passord?</a>
            </div>
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.button}
                disabled={isLoading}
              >
                {isLoading ? "Laster..." : "Logg inn"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
