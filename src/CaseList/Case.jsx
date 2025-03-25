import styles from './Case.module.css';
function Case({caseTitle, caseCategory, caseStatus}) {

    return (
        <div className={styles.case}>
            <div className={styles.circle} style={caseStatus ? {backgroundColor: "lightgreen"} : {backgroundColor: "lightgray"}}></div>
            <h1 className={styles.text}>{caseTitle}</h1>
            <p className={styles.text}>{caseCategory}</p>
        </div>
    );
}

export default Case;