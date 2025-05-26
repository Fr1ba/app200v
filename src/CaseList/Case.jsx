// Case.jsx
import styles from './Case.module.css';
import { useContext } from "react";
import { CaseContext } from "../SelectedCase.jsx";

function Case({ caseId, caseTitle, caseCategory, caseStatus }) {
    const { setCaseId, setCaseSubject } = useContext(CaseContext);

    const handleClick = () => {
        setCaseId(caseId);
        setCaseSubject(caseTitle); // Use subject from case
        console.log(caseId, caseTitle);
    }

    return (
  <div className={styles.case} onClick={handleClick}>
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