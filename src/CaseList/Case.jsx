// Case.jsx
import styles from './Case.module.css';
import { useContext } from "react";
import { CaseContext } from "../SelectedCase.jsx";

function Case({ caseId, caseTitle, caseCategory, caseStatus }) {
  const { caseId: selectedCaseId, setCaseId, setCaseSubject } = useContext(CaseContext); // added caseId: selectedCaseId

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
        <p className={styles.text}>{caseTitle}</p>
        <p className={styles.category}>{caseCategory}</p>
      </div>
      <div className={styles.circle} style={caseStatus ? {backgroundColor: "lightgreen"} : {backgroundColor: "lightgray"}}>
      </div>
      </div>
    );
}

export default Case;