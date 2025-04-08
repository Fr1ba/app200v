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
  const [newEmail, setNewEmail] = useState("");
  let newName = "";

  let entity = undefined;

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

      entity = await response.json();

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


  useEffect(() => {
    fetchData();
  }, []);

//UPDATING PROFILE
function handleNameChange(event) {
  entity.name = event.target.value;
}
function getEntity() {
  const fetchData = async () => {
    try {
      const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      entity = await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return entity;
}

async function updateProfile(entity) {
      const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(entity),
      });

      return response.json()
}

async function onSave() {
  let entity=getEntity();
  let changes = false

  const parameters = {}

  if (entity.emails[0].email !== newEmail) {
    entity.emails[0].email = newEmail;
    parameters.emailChanged = true;
    changes = true;
    }
    try{
      if(!changes)return;

      const result = await updateProfile(entity);
      console.log(result);
      entity = result;
      return true;
    }
    catch(error){
      console.log(error);
    }
}

  return (
    <>
      <h1 className={styles.title}>Profil</h1>
      <div className={styles.wrapper}>
        <form>
          <label className={styles.inputlabel}>
            Navn
            <div className={styles.inputField}>
              <input type="text" value = {newName} placeholder={name ? name : "Kari Nordmann"} />
              <FaUser className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputlabel}>
            Epost
            <div className={styles.inputField}>
              <input
                type="text" value = {newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={email ? email : "eksempel@eksempel.no"}
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
              />
              <FaPhone className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputLabel}>
            Adresse
            <div className={styles.inputField}>
              <input
                type="text"
                placeholder={address ? address : "gatenavn 1"}
              />
              <FaHome className={styles.icon} />
            </div>
          </label>
          <input
            type="submit" onClick = {onSave}
            className={styles.buttons}
            value="Lagre endringer"
          ></input>
        </form>
      </div>
    </>
  );
}

export default ProfilePage;
