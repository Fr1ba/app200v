import { endpoint } from "./endpoint";

/**
 * Sends a message to the specified case endpoint using a POST request.
 * Validates the message content to ensure it is not empty.
 * Constructs a JSON blob with the provided message details and sends it as form data.
 * 
 * @param {Object} params - The parameters for the message.
 * @param {string} params.message - The HTML content of the message.
 * @param {string} params.caseId - The ID of the case the message is associated with.
 * @param {string} params.caseSubject - The subject of the case.
 * @param {string} [params.replyToEactId] - Optional ID of the message being replied to.
 * @throws Will throw an error if the message content is empty or if the HTTP request fails.
 * @returns {Promise<Object>} The response data from the server.
 * @author Trudy
 * @author Oda
 */
export const postMessage = async ({ message, caseId, caseSubject, replyToEactId }) => {
  const temp = document.createElement("div");
  temp.innerHTML = message;
  const plainText = temp.innerText.trim();

  if (!plainText) {
    throw new Error("Meldingen kan ikke være tom!");
  }

  const data = {
    direction: 2,
    subject: caseSubject,
    body: message,
    createCase: false,
    caseEactId: caseId,
    ...(replyToEactId && { replyToEactId }),
  };

  const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const formData = new FormData();
  formData.append("data", jsonBlob);

  const response = await fetch(`${endpoint}/rest/itxems/message`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

/**
 * Fetches all messages for a given case ID.
 * @param {string} caseId - The ID of the case to fetch messages for.
 * @throws Will throw an error if the HTTP request fails.
 * @returns {Promise<Object[]>} The response data from the server, sorted by timestamp.
 * @author Oda
 * @author Trudy
 */

export const getMessages = async (caseId) => {
  const response = await fetch(`${endpoint}/rest/itxems/message/search`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      getConversations: false,
      getContent: true,
      draft: false,
      caseEactId: caseId,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};