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

      setName(entity.name1 || null);
      setNewName(entity.name1 || "");

      if (entity.emails && entity.emails.length > 0) {
        setEmail(entity.emails[0].email);
        setNewEmail(entity.emails[0].email);
      } else {
        setEmail(null);
        setNewEmail("");
      }

      setPhonePrefix(entity.corporation?.phoneNumberPrefix || null);

      if (entity.addresses && entity.addresses[0]) {
        const addr = `${entity.addresses[0].street} ${entity.addresses[0].streetNumber}`;
        setAddress(addr);
      } else {
        setAddress(null);
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