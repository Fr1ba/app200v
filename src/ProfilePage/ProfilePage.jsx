import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import { FaHome, FaPhone, FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const endpoint = "https://app06.itxnorge.no";

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [name, setName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("");
  const [address, setAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    fetchEntity();
  }, []);

  const fetchEntity = async () => {
    try {
      const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        method: "GET",
        credentials: "include",
      });
      console.log(`${endpoint}/rest/itxems/entity`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

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

    if (!isEditable) {
      setNewEmail(email);
      setNewAddress(address);
      setIsEditable(true);
      return;
    }

    try {
      const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        method: "GET",
        credentials: "include",
      });

      const entity = await response.json();
      let changes = false;

      if (newEmail && newEmail !== entity.emails[0].email) {
        entity.emails[0].email = newEmail;
        changes = true;
      }

      if (newAddress && newAddress !== entity.address) {
        let splitAdress = newAddress.split(" ");
        if (splitAdress.length == 2) {
          entity.addresses[0].street = splitAdress[0];
          entity.addresses[0].streetNumber = splitAdress[1];
          changes = true;
        } else if (splitAdress.length < 2) {
          entity.addresses[0].street = newAddress;
          entity.addresses[0].streetNumber = "";
          changes = true;
        } else if (splitAdress.length > 2) {
          /*let streetName = "";
          for (let i = 0; i < splitAdress.length - 1; i++) {
            streetName += splitAdress[i] + " ";
          }
          let streetNumber = splitAdress[splitAdress.length - 1];
          if (streetNumber.isInteger) {
            entity.addresses[0].streetNumber =
              splitAdress[splitAdress.length - 1];
          } else {
            streetName += splitAdress[splitAdress.length - 1];
            entity.addresses[0].streetNumber = "";
          }
          entity.addresses[0].street = streetName;*/
          let streetName = splitAdress.slice(0, -1).join(" ");
          let streetNumber = splitAdress[splitAdress.length - 1];

          if (!isNaN(streetNumber)) {
            entity.addresses[0].street = streetName;
            entity.addresses[0].streetNumber = streetNumber;
          } else {
           // Hvis det siste elementet ikke er et tall, ta alt som gatenavn
            entity.addresses[0].street = streetName + " " + streetNumber;
            entity.addresses[0].streetNumber = "";
          }

          changes = true;
        }
      }

      if (!changes) {
        setIsEditable(false);
        return;
      }

      const result = await updateProfile(entity);
      console.log("Updated:", result);
      fetchEntity();
      setIsEditable(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const onCancel = () => {
    setNewEmail(email);
    setNewAddress(address);
    setIsEditable(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.wrapper}>
      <h1 className={styles.title}>Profil</h1>
        <form>
          <label className={styles.inputlabel}>
            Navn
            <div className={styles.inputField}>
              <FaUser className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputlabel}>
            Epost
            <div className={styles.inputField}>
              <IoMdMail className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputLabel}>
            Mobil
            <div className={styles.inputField}>
              <FaPhone className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputLabel}>
            Adresse
            <div className={styles.inputField}>
              <input
                type="text"
                readOnly={!isEditable}
                onChange={(e) => setNewAddress(e.target.value)}
                value={newAddress}
                placeholder={address ? address : "gatenavn 1"}
              />
              <FaHome className={styles.icon} />
            </div>
          </label>
          <button type="submit" onClick={onSave} className="editButton">
            {isEditable ? "Lagre endringer" : "Rediger"}
          </button>
          {isEditable && (
            <button type="button" onClick={onCancel} className="cancelButton">
              Avbryt
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
export default ProfilePage;
