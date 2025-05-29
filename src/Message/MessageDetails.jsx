import React, { useState, useContext, useEffect, useRef } from "react";
import { getMessages } from "../api/messageApi.js";
import { CaseContext } from "../SelectedCase.jsx";
import styles from "./MessageDetails.module.css";
/**
 * A component for displaying details about the current case.
 * The component can be toggled on and off by clicking a button.
 * The details are fetched from the API.
 * @component
 * @returns {JSX.Element} The MessageDetails component
 * @author Oda
 * @author Vendela
 */
function MessageDetails() {
  const [caseDetails, setCaseDetails] = useState(null);
  const [buttonText, setButtonText] = useState("Vis detaljer");
  const [isOpen, setIsOpen] = useState(false);
  const { caseId } = useContext(CaseContext);
  const detailsRef = useRef(null);

  /**
   * Function for toggling the visibility of the case details.
   * @function
   * @author Oda
   * @author Vendela
   */
  const handleClick = () => {
    if (buttonText === "Vis detaljer") {
      fetchCaseDetails();
      setButtonText("Skjul detaljer");
      setIsOpen(true);
    } else if (buttonText === "Skjul detaljer") {
      setCaseDetails(null);
      setButtonText("Vis detaljer");
      setIsOpen(false);
    }
  };

  /**
   * Fetches the details of the current case using the caseId from context.
   * Sets default details if no messages are found or the data is invalid.
   * Updates the caseDetails state with the fetched or default details.
   *
   * @function
   * @returns {Promise<void>} Resolves when the case details have been set.
   * @author Oda
   * @author Vendela
   */
  const fetchCaseDetails = async () => {
    if (!caseId) return;
    const data = await getMessages(caseId);

    if (!data || !Array.isArray(data) || data.length === 0) {
      setCaseDetails({
        caseWorker: "Venter på tildeling av saksbehandler",
        createdDate: "Ingen opprettelsesdato funnet",
        status: "Aktiv",
        priority: "Høy",
        category: "Retur",
      });
      return;
    }
    let caseWorker = "";
    let checkElements = Math.min(data.length, 3);
    for (let i = 0; i <= checkElements; i++) {
      if (data[i] && data[i].user) {
        if (data[i].user.firstName) {
          caseWorker += data[i].user.firstName;
          if (data[i].user.lastName) {
            caseWorker += " " + data[i].user.lastName;
            break;
          }
        }
      }
    }

    let date = "";
    if (data[0] && data[0].timestamp) {
      date = new Date(data[0].timestamp).toLocaleString("nb-NO", {
        dateStyle: "short",
        timeStyle: "short",
      });
    }

    const details = {
      caseWorker: caseWorker || "Venter på tildeling av saksbehandler",
      createdDate: date || "Ingen opprettelsesdato funnet",
      status: data.status || "Aktiv",
      priority: data.priority || "Høy",
      category: data.category || "Retur",
    };
    setCaseDetails(details);
  };

  /**
   * Makes it so when you click outside of the open casedetails dropdown, the dropdown closes. 
   * @function
   * @author Erica Laub Varpe
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isOpen) return;

      const detailsNode = detailsRef.current;
      if (detailsNode && !detailsNode.contains(event.target)) {
        setCaseDetails(null);
        setButtonText("Vis detaljer");
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button ref={detailsRef} className={styles.caseButton} onClick={handleClick}>
        {buttonText}
        <span
          className={`${styles.arrow} ${
            isOpen ? styles.arrowUp : styles.arrowDown
          }`}
        ></span>
      </button>
      {caseDetails && (
        <div className={styles.caseDetails}>
          <h4 className={styles.header}>Detaljer</h4>
          <p>
            <strong>Saksbehandler:</strong> {caseDetails.caseWorker}
          </p>
          <p>
            <strong>Opprettet:</strong> {caseDetails.createdDate}
          </p>
          <p>
            <strong>Status:</strong> {caseDetails.status}
          </p>
          <p>
            <strong>Prioritet:</strong> {caseDetails.priority}
          </p>
          <p>
            <strong>Kategori:</strong> {caseDetails.category}
          </p>
        </div>
      )}
    </div>
  );
}
export default MessageDetails;
