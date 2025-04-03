import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import { CiMail } from "react-icons/ci";
import { LuPhone } from "react-icons/lu"; // kjør npm install react-icons
/*<LuPhone /> 
<CiMail />
*/

const endpoint = "https://app06.itxnorge.no";

function ProfilePage() {
  /*rest/itxems/entity)*/
  const [email, setEmail] = useState("");
  console.log(`${endpoint}/rest/itxems/entity`);

  const fetchData = async () => {
    try {
      const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Extract the email
      if (data.emails && data.emails.length > 0) {
        setEmail(data.emails[0].email); // Update state with email
      } else {
        console.log("No email found in response");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      <h1 className={styles.title}>Profil</h1>
      <div className={styles.wrapper}>
        <form>
          <label className={styles.inputlabel}>
            Epost
            <div className={styles.inputField}>
              <input type="text" placeholder={email} readOnly /> />
              <CiMail className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputLabel}>
            Mobil
            <div className={styles.inputField}>
              <input type="text" placeholder="+47 93145789" />
              <LuPhone className={styles.icon} />
            </div>
          </label>
          <input
            type="submit"
            className={styles.buttons}
            value="Lagre endringer"
          ></input>
          <input
            type="button"
            className={styles.buttons}
            value="Logg ut"
          ></input>
        </form>
      </div>
    </>
  );
}

export default ProfilePage;
