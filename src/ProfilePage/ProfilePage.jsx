/**
 * A requirement from ITX was to be able to change name and phone number in the future.
 * The code that is commented out is for this purpose.
 */

import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import { FaHome, FaPhone, FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const endpoint = "https://app06.itxnorge.no";

/**
 * ProfilePage component. Contains the user's profile information and allows the user to edit this information.
 * @component
 * @author Vendela
 * @author Trudy
 * @returns A ProfilePage component
 */
function ProfilePage() {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  /*   const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState(""); */
  const [phonePrefix, setPhonePrefix] = useState("");
  /*   const [number, setNumber] = useState("");
  const [newNumber, setNewNumber] = useState(""); */
  const [address, setAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    loadEntityData();
  }, []);

  /**
   * Fetches the current user's entity from the ITX API.
   * @function
   * @author Vendela
   * @returns {Object} The user's entity object
   */
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
      return entity;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  /**
   * Loads the current user's entity data from the ITX API into the component's state.
   * @function
   * @author Vendela
   * @returns {Object} The user's entity object. If no entity is found, null is returned.
   */
  const loadEntityData = async () => {
    const entity = await fetchEntity();
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

    /*     // Extract the phone number
    if (entity.numbers) {
      setNumber(entity.numbers[0].number);
    } else {
      setNumber(null);
      console.log("No phone number found in response");
      return null;
    } */

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
  };

  /**
   * Updates the user's entity data in the ITX API.
   * @function
   * @param {Object} entity - The user's entity data to be updated.
   * @returns {Promise} Resolves with the updated entity data from the API.
   * @author Vendela
   * @author Trudy
   */
  const updateProfile = async (entity) => {
    const response = await fetch(`${endpoint}/rest/itxems/entity`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity),
    });

    return response.json();
  };

  /**
   * Handles saving the user's profile changes.
   * If the user is not in edit mode, sets the new values for email and address to the current values and sets isEditable to true.
   * If the user is in edit mode, updates the user's entity data in the ITX API if the email or address has changed.
   * If the user is in edit mode and no changes have been made, sets isEditable to false.
   * @param {Event} e - The event that triggered this function.
   * @author Vendela
   * @author Trudy
   */
  const onSave = async (e) => {
    e.preventDefault();
    if (!isEditable) {
      //      setNewName(name);
      //      setNewNumber(number);
      setNewEmail(email);
      setNewAddress(address);
      setIsEditable(true);
      return;
    }

    try {
      const entity = await fetchEntity();
      let changes = false;

      /*       if (newName && newName !== name) {
        if (newName.trim() === "") {    
          setNameError("Navnet kan ikke være tom.");
          return;
        }
        entity.name1 = newName;
        changes = true;
      } */

      if (!newEmail.trim()) {
        setEmailError("Epost kan ikke være tom.");
        return;
      }

      if (newEmail !== entity.emails[0].email) {
        if (validateEmail()) {
          entity.emails[0].email = newEmail;
          changes = true;
        } else {
          setEmailError("Ikke gyldig epost-adresse");
          return;
        }
      }

      if (newAddress && newAddress !== entity.address) {
        if (newAddress.trim() === "") {
          setAddressError("Adressen kan ikke være tom");
          return;
        }
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

          /*           if (newNumber !== entity.numbers[0].number) {
            entity.numbers[0].number = newNumber;
            changes = true;
          } else {
            setNumberError("Ugyldig telefonnummer");
            return;
          } */

          changes = true;
        }
      }

      if (!changes) {
        setIsEditable(false);
        return;
      }

      const result = await updateProfile(entity);
      console.log("Updated:", result);
      await loadEntityData(); //kan fjernes mby
      setEmail(newEmail);
      setAddress(newAddress);
      // setName(newName);
      //setNumber(newNumber);
      setIsEditable(false);
    } catch (emailError) {
      console.emailError("emailError saving profile:", emailError);
    }
  };

  /**
   * Validates the email input field to ensure it matches the standard
   * email pattern. The function uses the built-in HTML5 input validation
   * and a regular expression to check if the email is valid.
   * @function
   * @author Trudy
   * @author Vendela
   * @returns {boolean} True if the email is valid, false if it is not.
   */
  const validateEmail = () => {
    const emailInput = document.getElementById("email");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    // Check if the email input matches the pattern
    if (emailInput.validity.valid && emailPattern.test(emailInput.value)) {
      return true;
    } else {
      console.log("Ugyldig epost!!!!");
      return false;
    }
  };

  /**
   * Resets the input fields to the original values and sets isEditable to false.
   * @function
   * @author Trudy
   */
  const onCancel = () => {
    //setNewName(name);
    setNewEmail(email);
    setNewAddress(address);
    setIsEditable(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.wrapper}>
        <div className={styles.contentContainer}>
          <h1 className={styles.title}>Profil</h1>
          <form>
            <label className={styles.inputLabel}>
              Navn
              <div className={styles.inputField}>
                <input
                  type="text"
                  /*                   value= {newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setNameError("");
                  }} */
                  readOnly={true}
                  placeholder={name ? name : "Kari Nordmann"}
                  className={styles["disabled-input"]}
                />

                <FaUser className={styles.icon} />
              </div>
            </label>
            <label className={styles.inputLabel}>
              Epost
              <div className={styles.inputField}>
                <input
                  type="email"
                  id="email"
                  readOnly={!isEditable}
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setEmailError(""); // Clear the emailError when typing
                  }}
                  placeholder={email ? email : "eksempel@eksempel.no"}
                  className={
                    isEditable
                      ? styles["editable-input"]
                      : styles["disabled-input"]
                  }
                />
                <IoMdMail className={styles.icon} />
              </div>
              {emailError && <p style={{ color: "red" }}>{emailError}</p>}
            </label>
            <label className={styles.inputLabel}>
              Mobil
              <div className={styles.inputField}>
                <input
                  type="text"
                  readOnly={true}
                  placeholder={phonePrefix ? phonePrefix : "22334455"}
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
                  readOnly={!isEditable}
                  value={newAddress}
                  onChange={(e) => {
                    setNewAddress(e.target.value);
                    setAddressError(""); // Clear the emailError when typing
                  }}
                  placeholder={address ? address : "gatenavn 1"}
                  className={
                    isEditable
                      ? styles["editable-input"]
                      : styles["disabled-input"]
                  }
                />

                <FaHome className={styles.icon} />
              </div>
              {addressError && <p style={{ color: "red" }}>{addressError}</p>}
            </label>
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                onClick={onSave}
                className={styles.editButton}
              >
                {isEditable ? "Lagre endringer" : "Rediger"}
              </button>
              {isEditable && (
                <button
                  type="button"
                  onClick={onCancel}
                  className={styles.cancelButton}
                >
                  Avbryt
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
