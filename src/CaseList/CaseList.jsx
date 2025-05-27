import Case from './Case';
import React, {useEffect, useState} from "react";
import styles from "./CaseList.module.css";
import { Link } from 'react-router-dom';


const endpoint = "https://app06.itxnorge.no";

/**
 * Component displaying a list of cases with filter, search, and sort options.
 *
 * Fetches data from the server, filters/search/sorts it based on user input,
 * and renders each case using the `Case` component.
 *
 * @component
 * @returns {JSX.Element} The rendered CaseList component.
 */
function CaseList() {

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("new");

    const [list, setList] = useState([]);
    const [caseList, setCaseList] = useState();

    /**
     * Fetches case data on component mount and processes it into a unique list.
     */
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
            const uniqueCases = Array.from(
                new Map(responseData.map(item => [item.caseEactId, item])).values()
            );
            setList(uniqueCases);
            CreateCases(uniqueCases);
        }).catch(error => {
            console.error("Error fetching data:", error);
        });


    }, []);


    /**
     * Converts a list of case data into rendered `Case` components.
     *
     * @param {Array<Object>} listOfCases - Array of case data items.
     */
    function CreateCases(listOfCases) {
        setCaseList(listOfCases.map((caseItem) =>
            <Case key={caseItem.eactId} caseId={caseItem.caseEactId} caseTitle={caseItem.subject} caseCategory={caseItem.isDraft}
                  caseStatus={caseItem.eactId}/>))

    }

    /**
     * Filters, sorts and search through the case list whenever `filter`, `search`, or `sort` is changed by the user.
     */
    useEffect(() => {
        var tempList = list;

        switch (filter) {
            case "all":
                break;
            case "active":
                tempList = tempList.filter(item => item.caseStatus === true);
                break;
            case "closed":
                tempList = tempList.filter(item => item.caseStatus === false)
                break;
        }

        if (search !== "")
            tempList = tempList.filter((item) => item.subject.toLowerCase().includes(search.toLowerCase()))

        switch (sort) {
            case "new":
                tempList = tempList.sort((a, b) => new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1);
                break;
            case "old":
                tempList = tempList.sort((a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1);
                break;
        }

        CreateCases(tempList)
    }, [filter, search, sort]);

    /**
     * Handles the search input field change.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event.
     */
    function handleSearch(event) {
        setSearch(event.target.value);
    }
    /**
     * Toggles the visibility of the filter dropdown.
     */
    function showFilterDropdown() {
        document.getElementById("myDropdown").classList.toggle(styles.show);
    }

    /**
     * Toggles the visibility of the sort dropdown.
     */
    function showSortDropdown() {
        document.getElementById("myDropdown2").classList.toggle(styles.show);
    }
    /**
     * Closes dropdowns when clicking outside.
     */
    useEffect(() => {
        function handleClickOutside(event) {
            // Check if the click is NOT on a dropdown button
            if (!event.target.closest(`.${styles.dropbtnFilter}`) &&
                !event.target.closest(`.${styles.dropbtnSort}`)) {

                // Close all dropdowns
                const dropdowns = document.querySelectorAll(`.${styles.dropdown_contentFilter}, .${styles.dropdown_contentSort}`);
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove(styles.show);
                });
            }
        }

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);
    return (

        <div className={styles.div}>

            <div className={styles.dropdown}>
                <button onClick={showFilterDropdown} className={styles.dropbtnFilter}>Filter</button>
                <div id="myDropdown" className={styles.dropdown_contentFilter}>
                    <a onClick={() => setFilter("all")}>Show All</a>
                    <a onClick={() => setFilter("active")}>Active</a>
                    <a onClick={() => setFilter("closed")}>Closed</a>
                </div>
            </div>


            <input type="text" placeholder="Search..." className={styles.search} onChange={handleSearch}/>

            <div className={styles.dropdown}>
                <button onClick={showSortDropdown} className={styles.dropbtnSort}>Sort</button>
                <div id="myDropdown2" className={styles.dropdown_contentSort}>
                    <a onClick={() => setSort("new")}>Newest</a>
                    <a onClick={() => setSort("old")}>Oldest</a>
                </div>
            </div>

            <ul className={styles.list}>
                {caseList}
            </ul>

            <Link to="/CreateCase" className={styles.button}>New thread</Link>

        </div>
    );

}

export default CaseList;

