import Case from './Case';
import {useEffect, useState} from "react";
import styles from "./CaseList.module.css";


function CaseList() {

    const [caseList, setCaseList] = useState()

    useEffect(() => {
        CreateCases(list)
    }, []);

    const list = [{caseTitle: "Headphones", caseCategory: "Return", caseStatus: true},
        {caseTitle: "Telephone", caseCategory: "Return", caseStatus: false}];

    function CreateCases(someList) {
        setCaseList(someList.map((caseItem) =>
            <Case key={caseItem.caseTitle} caseTitle={caseItem.caseTitle} caseCategory={caseItem.caseCategory}
                  caseStatus={caseItem.caseStatus}/>))

    }


    //let filterState = true;
    /* useEffect(() => {
         caseList = Filter(filterState);
     }, filterState);
 */
    function Filter(state) {

        switch (state) {
            case "1":
                CreateCases(list);
                break;
            case "2":
                CreateCases(list.filter(item => item.caseStatus === true));
                break;
            case "3":
                CreateCases(list.filter(item => item.caseStatus === false));
                break;
        }

        // let filteredList = list.filter(caseItem => caseItem.caseStatus === state)
        // CreateCases(filteredList);
    }

    function handleFilterChange(event) {
        Filter(event.target.value)
    }

    return (

        <div>
            <select onChange={handleFilterChange} className={styles.filter}>
                <option value="1">Filter</option>
                <option value="2">Active</option>
                <option value="3">Passive</option>
            </select>

            <ul>
                {caseList}
            </ul>
            {/*<div className={styles.line}></div>*/}
        </div>
    );

}

export default CaseList;

/*
function Filter(action){
    caseList = list.filter(action).map((caseItem) =>
        <Case caseTitle={caseItem.caseTitle} caseCategory={caseItem.caseCategory} caseStatus={caseItem.caseStatus}/>)
    //return (list.map(caseItem.caseCategory :true => <cas))
}

return(
    <div>
        <select>
            <option onClick = {() => Filter(item => item.caseStatus || !item.caseStatus)}>Filters</option>
            <option onClick = {() => Filter(item => item.caseStatus)}>Active</option>
            <option onClick = {() => Filter(item => !item.caseStatus)}>Passive</option>
        </select>*/
