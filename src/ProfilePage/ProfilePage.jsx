import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import { FaHome, FaPhone, FaUser } from "react-icons/fa"; // kjør npm install react-icons
import { IoMdMail } from "react-icons/io";

const endpoint = "https://app06.itxnorge.no";

function ProfilePage() {
  /*rest/itxems/entity)*/
  const [email, setEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

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

      // Extract the name
      if (data.name1) {
        setName(data.name1); // Update state with name
      } else {
        setName(null); // if no name is found, the value of name is set to null so a placeholder is shown
        console.log("No name found in response");
        return null;
      }
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
        setPhonePrefix(null);
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
        setAddress(null);
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
    <div className={styles.pageContainer}>
      <div className={styles.wrapper}>
      <h1 className={styles.title}>Profil</h1>
        <form>
          <label className={styles.inputlabel}>
            Navn
            <div className={styles.inputField}>
            <input
              type="text"
              placeholder={name ? name : "Kari Nordmann"}
              value={name}
              disabled
              className={styles["disabled-input"]}
            />  

              <FaUser className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputlabel}>
            Epost
            <div className={styles.inputField}>
            <input
              type="text"
              placeholder="eksempel@eksempel.no"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles["editable-input"]}
            />

              <IoMdMail className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputLabel}>
            Mobil
            <div className={styles.inputField}>
            <input
              type="text"
              placeholder={phonePrefix ? phonePrefix : "22334455"}
              value={phonePrefix}
              disabled
              className={styles["disabled-input"]}
            />

              <FaPhone className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputLabel}>
            Adresse
            <div className={styles.inputField}>
            <input
              type="text"
              placeholder="gatenavn 1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles["editable-input"]}
            />

              <FaHome className={styles.icon} />
            </div>
          </label>
          <div className={styles.buttonContainer}>
          <input
            type="submit"
            className={styles.savechangesbuttons}
            value="Lagre endringer"
          ></input>
          
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
