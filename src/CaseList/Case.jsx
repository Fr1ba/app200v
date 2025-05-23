import styles from './Case.module.css';
import {useContext} from "react";
import {CaseContext} from "../SelectedCase.jsx";

function Case({caseId, caseTitle, caseCategory, caseStatus}) {

    const { setCaseId } = useContext(CaseContext);

    const handleClick = () => {
        setCaseId(caseId);

        console.log(caseId);
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