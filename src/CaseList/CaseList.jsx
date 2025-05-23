import Case from './Case';
import React, {useEffect, useState} from "react";
import styles from "./CaseList.module.css";
const endpoint = "https://app06.itxnorge.no"

function CaseList() {

    const [list, setList] = useState([]);
    const [caseList, setCaseList] = useState()
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            return await fetch(`${endpoint}/rest/itxems/message/search`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        getConversations: false,
                        getContent: true,
                        // conversationEactId: "3414941"
                    })
                }
            );
        }

    const data = fetchData().then((response) => response.json());

    data.then(responseData => {
        console.log(responseData);
        setList(responseData)
        CreateCases(responseData)
        }).catch(error => {
            console.error("Error fetching data:", error);
    });


    }, []);

    // const list = [{caseTitle: "Headphones", caseCategory: "Return", caseStatus: true},
    //     {caseTitle: "Telephone", caseCategory: "Return", caseStatus: false}];

    function CreateCases(someList) {
        setCaseList(someList.map((caseItem) =>
            <Case key={caseItem.eactId} caseId={caseItem.caseEactId} caseTitle={caseItem.subject} caseCategory={caseItem.isDraft}
                  caseStatus={caseItem.eactId}/>))

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

    function handleSearch(event) {
        setSearch(event.target.value);
        if (search === "") {
            CreateCases(list);
        }
        CreateCases(list.filter((item) => item.subject.toLowerCase().includes(search.toLowerCase())))
    }

    return (

        <div>
            <select onChange={handleFilterChange} className={styles.filter}>
                <option value="1">Filter</option>
                <option value="2">Active</option>
                <option value="3">Passive</option>
            </select>

            <input type="text" placeholder="Search..." className={styles.search} onChange={handleSearch}/>
            <ul>
                {caseList}
            </ul>

            <button className={styles.button}>New thread</button>
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
