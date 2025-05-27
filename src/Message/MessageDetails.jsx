import React, { useEffect, useState, useContext } from "react";
import { getMessages } from "../api/messageApi.js";
import { CaseContext } from "../SelectedCase.jsx";
import styles from "./MessageDetails.module.css";
/**
 * Component for viewing and hiding details about messages.
 * @returns the MessageDetails component.
 * @author Oda
 * @author Vendela
 */
function MessageDetails() {
  const [caseDetails, setCaseDetails] = useState(null);
  const [buttonText, setButtonText] = useState("Vis detaljer");
  const [isOpen, setIsOpen] = useState(false);
  const { caseId } = useContext(CaseContext);

  /**
   * Function for handling button click
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
   * Function for fetching details about a case. The details are per now mock data as the API does not have the data.
   * @author Oda
   * @author Vendela
   */
  const fetchCaseDetails = async () => {
    if (!caseId) return;
    const data = await getMessages(caseId);

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
      priority: "Høy",
      category: "Retur",
    };
    setCaseDetails(details);
  };

  return (
    <div>
      <button className={styles.caseButton} onClick={handleClick}>
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
