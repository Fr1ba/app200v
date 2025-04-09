import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import { FaHome, FaPhone, FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const endpoint = "https://app06.itxnorge.no";

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchEntity();
  }, []);

  const fetchEntity = async () => {
    try {
      const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const entity = await response.json();

      // Extract the name
      if (entity.name1) {
        setName(entity.name1); // Update state with name
      } else {
        setName(null); // if no name is found, the value of name is set to null so a placeholder is shown
        console.log("No name found in response");
        return null;
      }
      // Extract the email
      if (entity.emails && entity.emails.length > 0) {
        setEmail(entity.emails[0].email); // Update state with email
      } else {
        setEmail(null); // if no email is found, the value of email is set to null so a placeholder is shown
        console.log("No email found in response");
        return null;
      }

      if (entity.corporation && entity.corporation.phoneNumberPrefix) {
        setPhonePrefix(entity.corporation.phoneNumberPrefix);
      } else {
        setPhonePrefix(null);
        console.log("No phone number found in response");
        return null;
      }
      // Extract the address
      if (entity.addresses) {
        setAddress(
          entity.addresses[0].street + " " + entity.addresses[0].streetNumber
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

  const updateProfile = async (entity) => {
    const response = await fetch(`${endpoint}/rest/itxems/entity`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity),
    });

    return response.json();
  };

  const onSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        method: "GET",
        credentials: "include",
      });

      const entity = await response.json();
      let changes = false;

      if (newEmail !== entity.emails[0].email) {
        entity.emails[0].email = newEmail;
        changes = true;
      }

      if (newName !== entity.name1) {
        entity.name1 = newName;
        changes = true;
      }

      if (!changes) return;

      const result = await updateProfile(entity);
      console.log("Updated:", result);
      fetchEntity();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <>
      <h1 className={styles.title}>Profil</h1>
      <div className={styles.wrapper}>
        <form onSubmit={onSave}>
          <label className={styles.inputlabel}>
            Navn
            <div className={styles.inputField}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={name || "Kari Nordmann"}
              />
              <FaUser className={styles.icon} />
            </div>
          </label>

          <label className={styles.inputlabel}>
            Epost
            <div className={styles.inputField}>
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={email || "eksempel@eksempel.no"}
              />
              <IoMdMail className={styles.icon} />
            </div>
          </label>

          <label className={styles.inputLabel}>
            Mobil
            <div className={styles.inputField}>
              <input type="text" placeholder={phonePrefix || "22334455"} readOnly />
              <FaPhone className={styles.icon} />
            </div>
          </label>

          <label className={styles.inputLabel}>
            Adresse
            <div className={styles.inputField}>
              <input type="text" placeholder={address || "gatenavn 1"} readOnly />
              <FaHome className={styles.icon} />
            </div>
          </label>

          <input type="submit" className={styles.buttons} value="Lagre endringer" />
        </form>
      </div>
    </>
  );
}

export default ProfilePage;