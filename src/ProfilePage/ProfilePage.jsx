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
  const [phonePrefix, setPhonePrefix] = useState("");
  const [address, setAddress] = useState("");

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
        setEmail(null); // if no email is found, the value of email is set to null so a placeholder is shown
        console.log("No email found in response");
        return null;
      }

      if (data.corporation && data.corporation.phoneNumberPrefix) {
        setPhonePrefix(data.corporation.phoneNumberPrefix);
      } else {
        console.log("No phone number found in response");
        return null;
      }
      // Extract the address
      if (data.addresses) {
        setAddress(
          data.addresses[0].street + " " + data.addresses[0].streetNumber
        );
        console.log(address);
      } else {
        console.log("No address found in response");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <h1 className={styles.title}>Profil</h1>
      <div className={styles.wrapper}>
        <form>
          <label className={styles.inputlabel}>
            Epost
            <div className={styles.inputField}>
              <input
                type="text"
                placeholder={email ? email : "eksempel@eksempel.no"}
              />
              <CiMail className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputLabel}>
            Mobil
            <div className={styles.inputField}>
              <input type="text" placeholder={phonePrefix} />
              <LuPhone className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputLabel}>
            Adresse
            <div className={styles.inputField}>
              <input type="text" placeholder={address} />
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
