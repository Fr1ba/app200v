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
 * @param {Object} props - Component props.
 * @param {string} props.caseId - The unique identifier for the case.
 * @param {string} props.caseTitle - The title or subject of the case.
 * @param {string} props.caseCategory - The category or type of the case.
 * @param {boolean} props.caseStatus - The status of the case (e.g., open or closed).
 * @returns {JSX.Element} The rendered case component.
 */
function Case({ caseId, caseTitle, caseCategory, caseStatus }) {
    const { setCaseId, setCaseSubject } = useContext(CaseContext);


    /**
     * Handles the click event on the case item.
     * Sets the selected case ID and subject in the context.
     */
    const handleClick = () => {
        setCaseId(caseId);
        setCaseSubject(caseTitle); // Use subject from case
        console.log(caseId, caseTitle);
    }

    return (
        <div className={styles.case} onClick={handleClick}>
            <div className={styles.circle} style={caseStatus ? {backgroundColor: "lightgreen"} : {backgroundColor: "lightgray"}}></div>
            <p className={styles.text}>{caseTitle}</p>
            <p className={styles.category}>{caseCategory}</p>
        </div>
    );
}

export default Case;