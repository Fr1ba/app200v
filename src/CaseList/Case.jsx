import styles from './Case.module.css';
function Case({caseTitle, caseCategory, caseStatus}) {

    return (
        <div className={styles.case}>
            <div className={styles.circle} style={caseStatus ? {backgroundColor: "lightgreen"} : {backgroundColor: "lightgray"}}></div>
            <p className={styles.text}>{caseTitle}</p>
            <p className={styles.category}>{caseCategory}</p>
        </div>
    );
}

export default Case;