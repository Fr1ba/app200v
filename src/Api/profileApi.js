import { endpoint } from "./endpoint";

      /**
       * Fetches the current user's entity from the ITX API.
       * @function
       * @author Vendela
       * @returns {Object} The user's entity object
       */
      export const fetchEntity = async () => {
        try {
          const response = await fetch(`${endpoint}/rest/itxems/entity`, {
            method: "GET",
            credentials: "include",
          });
          console.log(`${endpoint}/rest/itxems/entity`);
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
    
          const entity = await response.json();
          return entity;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

        /**
   * Updates the user's entity data in the ITX API.
   * @function
   * @param {Object} entity - The user's entity data to be updated.
   * @returns {Promise} Resolves with the updated entity data from the API.
   * @author Vendela
   * @author Trudy
   */
  export const updateProfile = async (entity) => {
    try {
    const response = await fetch(`${endpoint}/rest/itxems/entity`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity),
    });

    return response.json();
  } catch (error) {
    console.error("En feil skjedde ved oppdatering av profil:", error);
    throw error; 
  }
  };