// Case.jsx
import styles from './Case.module.css';
import { useContext } from "react";
import { CaseContext } from "../SelectedCase.jsx";

/**
 * A clickable case item component.
 *
 * Displays the case's title, category, and status indicator (color-coded).
 * When clicked, it updates the selected case context with the case ID and title.
 *
 * @component
 * @param {string} caseId - The unique identifier for the case.
 * @param {string} caseTitle - The title or subject of the case.
 * @param {string} caseCategory - The category or type of the case.
 * @param {boolean} caseStatus - The status of the case (e.g., open or closed).
 * @returns The case component.
 * @author Nikola Deja
 */
function Case({ caseId, caseTitle, caseCategory, caseStatus }) {
  const { caseId: selectedCaseId, setCaseId, setCaseSubject } = useContext(CaseContext); // added caseId: selectedCaseId


    /**
     * Handles the click event on the case item.
     * Sets the selected case ID and subject in the context.
     */
    const handleClick = () => {
        setCaseId(caseId);
        setCaseSubject(caseTitle); // Use subject from case
        console.log(caseId, caseTitle);
    }
    // Check if this case is the currently selected one
    const isSelected = selectedCaseId === caseId;

    // added isSelected variable to determine if the case is selected
    return (
      <div className={`${styles.case} ${isSelected ? styles.selected : ''}`} onClick={handleClick}> 
        <div> 
        <p className={styles.text}>Emne: {caseTitle}</p>
            <p>Saksnummer: {caseId}</p>
        <p className={styles.category}>Kategori: {caseCategory}</p>
      </div>
      <div className={styles.circle} style={caseStatus ? {backgroundColor: "lightgreen"} : {backgroundColor: "lightgray"}}>
      </div>
      </div>
    );
}

export default Case;