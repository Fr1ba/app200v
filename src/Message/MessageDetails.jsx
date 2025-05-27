import React, { useEffect, useState } from "react";
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
  const fetchCaseDetails = () => {
    const mockDetails = {
      caseWorker: "Anna Hansen",
      openedDate: "10.06.2024",
      priority: "Høy",
      category: "Retur",
    };
    setCaseDetails(mockDetails);
  };
  
  return (
    <div>
      <button className={styles.caseButton} onClick={handleClick}>
        {buttonText} 
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}></span>
      </button>
      {caseDetails && (
          <div className={styles.caseDetails}>
            <h4 className={styles.header}>Detaljer</h4>
            <p>
              <strong>Saksbehandler:</strong> {caseDetails.caseWorker}
            </p>
            <p>
              <strong>Åpnet:</strong> {caseDetails.openedDate}
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