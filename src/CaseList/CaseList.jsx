import Case from './Case';
import React, {useEffect, useState, useContext} from "react";
import styles from "./CaseList.module.css";
import { Link } from 'react-router-dom';
import { fetchCases } from "../api/caseApi.js";
import { CaseContext } from "../SelectedCase.jsx";

/**
 * Component displaying a list of cases with filter, search, and sort options.
 *
 * Fetches data from the server, filters/search/sorts it based on user input,
 * and renders each case using the `Case` component.
 *
 * @component
 * @returns The CaseList component.
 * @author Nikola Deja
 */
function CaseList() {

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("new");

    const [list, setList] = useState([]);
    const [caseList, setCaseList] = useState();

    const { caseId } = useContext(CaseContext);

    /**
     * Loads case data on component mount.
     *
     * Calls the `fetchCases` function to retrieve case data from the API.
     * Filters out duplicates by `caseEactId`, updates the list state,
     * and renders the cases using `CreateCases`.
     *
     * Logs an error to the console if the request fails.
     */
  useEffect(() => {
    fetchCases()
      .then((responseData) => {
        const uniqueCases = Array.from(
          new Map(responseData.map((item) => [item.caseEactId, item])).values()
        );
        console.log(uniqueCases);
        setList(uniqueCases);
        CreateCases(uniqueCases);
      })
      .catch((error) => {
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
            <Case key={caseItem.eactId} caseId={caseItem.caseEactId} caseTitle={caseItem.subject} caseCategory={caseItem.kategori || "Retur"}
                  caseStatus={caseItem.eactId} casetimestamp={caseItem.timestamp} />))

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

    const shouldHide = caseId && window.innerWidth <= 991;

    return (

            <div className={`${styles.div} ${shouldHide ? styles.hidden : ''}`}>
            <div className={styles.controls}>
                <div className={styles.dropdown}>
                    <button onClick={showFilterDropdown} className={styles.dropbtnFilter}> Filtrer</button>
                    <div id="myDropdown" className={styles.dropdown_contentFilter}>
                        <a onClick={() => setFilter("all")}>Vis alle</a>
                        <a onClick={() => setFilter("active")}>Aktiv</a>
                        <a onClick={() => setFilter("closed")}>Avsluttet</a>
                    </div>
                </div>


                <input type="text" placeholder="Søk..." className={styles.search} onChange={handleSearch}/>


                <div className={styles.dropdown}>
                    <button onClick={showSortDropdown} className={styles.dropbtnSort}> Sorter</button>
                    <div id="myDropdown2" className={styles.dropdown_contentSort}>
                        <a onClick={() => setSort("new")}>Nyeste</a>
                        <a onClick={() => setSort("old")}>Eldste</a>
                    </div>
                </div>
            </div>

                <ul className={styles.list}>
                    {caseList}
                </ul>

                <Link to="/CreateCase" className={styles.button}>Opprett ny sak</Link>

        </div>
    );

}

export default CaseList;

/*
function Filter(action){
caseList = list.filter(action).map((caseItem) =>
    <Case caseTitle={caseItem.caseTitle} caseCategory={caseItem.caseCategory}
          caseStatus={caseItem.caseStatus}/>)
//return (list.map(caseItem.caseCategory :true => <cas))
}

return(
<div>
    <select>
        <option onClick={() => Filter(item => item.caseStatus || !item.caseStatus)}>Filters</option>
        <option onClick={() => Filter(item => item.caseStatus)}>Active</option>
        <option onClick={() => Filter(item => !item.caseStatus)}>Passive</option>
    </select>*/
