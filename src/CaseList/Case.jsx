import styles from './Case.module.css';
function Case({caseTitle, caseCategory, caseStatus}) {

    return (
        <div>
        <div className={styles.case}>
            <div className={styles.circle} style={caseStatus ? {backgroundColor: "lightgreen"} : {backgroundColor: "lightgray"}}></div>
            <p className={styles.header}>{caseTitle}</p>
            <p className={styles.category}>{caseCategory}</p>
        </div>
        </div>
    );
}

export default Case;