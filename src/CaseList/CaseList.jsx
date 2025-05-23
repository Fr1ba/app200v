﻿import React, { useEffect, useState } from "react";
import Case from './Case';
import styles from "./CaseList.module.css";
import { Link } from 'react-router-dom';
import { fetchCases } from "../api/caseApi.js";

function CaseList() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("new");

  const [list, setList] = useState([]);
  const [caseList, setCaseList] = useState();

  useEffect(() => {
    fetchCases()
      .then((responseData) => {
        const uniqueCases = Array.from(
          new Map(responseData.map((item) => [item.caseEactId, item])).values()
        );
        setList(uniqueCases);
        CreateCases(uniqueCases);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

    function CreateCases(someList) {
        setCaseList(someList.map((caseItem) =>
            <Case key={caseItem.eactId} caseId={caseItem.caseEactId} caseTitle={caseItem.subject} caseCategory={caseItem.isDraft}
                  caseStatus={caseItem.eactId}/>))

    }

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


    function handleSearch(event) {
        setSearch(event.target.value);
    }

    function showFilterDropdown() {
        document.getElementById("myDropdown").classList.toggle(styles.show);
    }

    function showSortDropdown() {
        document.getElementById("myDropdown2").classList.toggle(styles.show);
    }

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
