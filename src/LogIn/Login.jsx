import React, { useState } from "react";
import styles from "./Login.module.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../Logo/Logo";
import { loginUser } from "../api/authentication";

/**
 * Login component, handles user login. Uses the loginUser function from
 * authenticationApi.js to make a POST request to the API. If the request is
 * successful, redirects the user to the front page. If the request fails, shows
 * an error message. Remember me checkbox is also handled here.
 * @component
 * @return {JSX.Element} The login component.
 * @author Oda
 */
function Login() {
  const [username, setUsername] = useState(""); //tracks input fields
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /**
   * Handles the login form submission.
   *
   * Prevents the form from doing a full page reload, shows a loading state,
   * and then tries to log the user in using the loginUser function from
   * authenticationApi.js. If the request is successful, redirects the user
   * to the front page. If the request fails, shows an error message
   * @function
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   * @author Oda
   */
  const handleSubmit = async (event) => {
    event.preventDefault(); //prevents page from refreshing  
    setIsLoading(true); 

    try {
      const response = await loginUser(username, password, rememberMe);

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

  /**
   * Toggles the type of the password field between "password" and "text",
   * showing or hiding the password.
   * 
   * @function
   * @author Oda
   */
  const showPassword = () => {
    setType(type === "password" ? "text" : "password");
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
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/>
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
