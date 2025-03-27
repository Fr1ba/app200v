import {useEffect} from "react";

const endpoint = "https://app06.itxnorge.no"

function APITest(){

    // Login
    // useEffect(() => {
    //     console.log(`${endpoint}/rest/core/login`);
    //
    //     const fetchData = async () => {
    //         return await fetch(`${endpoint}/rest/core/login`, {
    //             method: 'POST',
    //             credentials: 'include',
    //             body: JSON.stringify({
    //                 username: "testuser2",
    //                 password: "#3EeGzMGkpr@F9",
    //                 // rememberMe: true
    //             })
    //         });
    //     };
    //
    //     const data = fetchData().then(res => res.json());
    //
    //     data.then(responseData => {
    //         console.log(responseData);
    //         console.log(responseData.status);
    //     }).catch(error => {
    //         console.error("Error fetching data:", error);
    //     });
    //
    //
    //
    // }, []);

    // Getting the messages
    // useEffect(() => {
    //     const fetchData = async () => {
    //         return await fetch(`${endpoint}/rest/itxems/message/search`,
    //             {
    //                 method: 'POST',
    //                 credentials: 'include',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({
    //                     getConversations: false,
    //                     getContent: true,
    //                     // conversationEactId: "3414941"
    //                 })
    //             }
    //         );
    //     }
    //
    //     const data = fetchData().then(res => res.json());
    //
    //     data.then(responseData => {
    //           console.log(responseData);
    //       }).catch(error => {
    //           console.error("Error fetching data:", error);
    //       });
    // })

    // Logout
    // useEffect(() => {
    //     const result = async () => { return await fetch(`${endpoint}/rest/core/logout`, {
    //         method: 'POST',
    //         credentials: 'include'
    //     })};
    //
    //     console.log(result());
    // })


    return(
        <></>
    )
}

export default APITest;