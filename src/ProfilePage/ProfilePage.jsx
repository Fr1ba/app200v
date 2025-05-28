import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import { FaHome, FaPhone, FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { fetchEntity, updateProfile } from "../api/profileApi.js";

/**
 * This component displays the user's profile information, including name, email,
 * phone number, and address. It supports editing and updating of email and address fields.
 *
 * NOTE: A requirement from ITX was to make it possible to change name and phone number in the future.
 * Placeholder code for these features has been added, but is currently commented out.
 * These placeholders have been kept intentionally for the possibility of future development.
 *
 * Responsibilities:
 * - Fetch entity data from the backend (name, email, phone, address).
 * - Render the profile form with editable fields (email, address).
 * - Validate and update profile data using the updateProfile API.
 *
 * @returns {ReactElement} The ProfilePage component.
 * @author Vendela
 * @author Trudy
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
      setNewEmail(email ?? "");
      setNewAddress(address ?? "");
      setIsEditable(true);
      return;
    }

    try {
      const entity = await fetchEntity();
      let changes = false;
      let emailChanged = false;
      let addressChanged = false;

      // --- EMAIL ---
      if (!entity.emails || entity.emails.length === 0) {
        entity.emails = [
          {
            seqNo: 1,
            email: "",
            emailType: 20,
            desc: "Kontaktadresse",
          },
        ];
      }

      const oldEmail = entity.emails[0].email ?? "";
      if (!newEmail.trim()) {
        setEmailError("Epost kan ikke være tom.");
        return;
      }

      if (newEmail !== oldEmail) {
        if (validateEmail()) {
          entity.emails[0].email = newEmail;
          entity.emails[0].emailType = 20;
          entity.emails[0].seqNo = 1;
          entity.emails[0].desc = "Kontaktadresse";
          emailChanged = true;
          changes = true;
        } else {
          setEmailError("Ikke gyldig epost-adresse");
          return;
        }
      }

      // --- ADDRESS ---
      if (!newAddress.trim()) {
        setAddressError("Adressen kan ikke være tom");
        return;
      }

      if (!entity.addresses || entity.addresses.length === 0) {
        entity.addresses = [
          {
            seqNo: 1,
            addressType: 10,
            street: "",
            streetNumber: "",
          },
        ];
      }

      const oldStreet = entity.addresses[0].street ?? "";
      const oldStreetNumber = entity.addresses[0].streetNumber ?? "";
      const fullOldAddress = `${oldStreet} ${oldStreetNumber}`.trim();

      if (newAddress !== fullOldAddress) {
        const splitAddress = newAddress.trim().split(" ");
        const streetName = splitAddress.slice(0, -1).join(" ");
        const streetNumber = splitAddress.slice(-1)[0];

        if (!isNaN(streetNumber)) {
          entity.addresses[0].street = streetName;
          entity.addresses[0].streetNumber = streetNumber;
        } else {
          entity.addresses[0].street = newAddress;
          entity.addresses[0].streetNumber = "";
        }

        // Ensure required props
        entity.addresses[0].addressType = 10;
        entity.addresses[0].country = entity.addresses[0].country ?? "Norway";
        entity.addresses[0].postalCode =
          entity.addresses[0].postalCode ?? "0000";
        entity.addresses[0].city = entity.addresses[0].city ?? "Oslo";
        entity.addresses[0].seqNo = 1;

        addressChanged = true;
        changes = true;
      }

      if (!changes) {
        setIsEditable(false);
        return;
      }

      entity.emailChanged = emailChanged;
      entity.addressChanged = addressChanged;

      const result = await updateProfile(entity);
      console.log("Updated:", result);
      await loadEntityData();
      setEmail(newEmail);
      setAddress(newAddress);
      setIsEditable(false);
    } catch (error) {
      console.error("Error saving profile:", error);
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
    if (emailPattern.test(emailInput.value)) {
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
    setEmailError("");
    setAddressError("");
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
                  value={newEmail ?? ""}
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
                  value={newAddress ?? ""}
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
