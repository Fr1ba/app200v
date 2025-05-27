import { endpoint } from "./endpoint";

/**
 * Fetches case data from the backend API.
 *
 * Sends a POST request to the ITX message search endpoint to retrieve case data
 * with content but without conversations. Throws an error if the response is not OK.
 *
 * @async
 * @function fetchCases
 * @returns {Promise<Object[]>} A promise that resolves to an array of case objects.
 * @throws {Error} If the API response is not successful.
 * @author Nikola Deja
 */
export const fetchCases = async () => {
  const response = await fetch(`${endpoint}/rest/itxems/message/search`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      getConversations: false,
      getContent: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cases");
  }

  return await response.json();
};

export const createCase = async (caseData) => {
  const formData = new FormData();

  const messageData = {
    direction: 2,
    subject: caseData.subject,
    body: caseData.details, 
    createCase: true 
  };

  const jsonBlob = new Blob([JSON.stringify(messageData)], {
    type: 'application/json'
  });

  formData.append('data', jsonBlob);
  
  const response = await fetch(`${endpoint}/rest/itxems/message`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`API-forespørselen mislyktes med status ${response.status}`);
  }

  return await response.json();
};