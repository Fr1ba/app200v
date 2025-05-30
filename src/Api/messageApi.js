import { endpoint } from "./endpoint";

/**
 * Sends a new message to the backend for a specific case.
 *
 * Validates that the message contains text or images before submission.
 * Constructs a JSON payload wrapped inside a FormData object for the POST request.
 *
 * @async
 * @param {Object} params - The parameters for the message.
 * @param {string} message - The HTML content of the message.
 * @param {string} caseId - The unique identifier of the case.
 * @param {string} caseSubject - The subject/title of the case.
 * @param {string} [replyToEactId] - Optional ID of the message being replied to.
 * @throws {Error} Throws if message is empty or if the HTTP request fails.
 * @returns {Promise<Object>} Resolves with the parsed JSON response from the server.
 * @author Trudy
 */
export const postMessage = async ({
  message,
  caseId,
  caseSubject,
  replyToEactId,
}) => {
  const temp = document.createElement("div");
  temp.innerHTML = message;
  const plainText = temp.innerText.trim();
  const hasImage = message.includes("<img");

  if (!plainText && !hasImage) {
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

  const jsonBlob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  const formData = new FormData();
  formData.append("data", jsonBlob);

  const response = await fetch(`${endpoint}/rest/itxems/message`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Feil ved sending av melding: ${response.status}`);
  }

  return response.json();
};

/**
 * Retrieves all messages for a specified case.
 *
 * Sends a POST request with search parameters to fetch messages,
 * then returns the messages sorted chronologically by their timestamp.
 *
 * @async
 * @param {string} caseId - The unique identifier of the case to fetch messages for.
 * @throws {Error} Throws if the HTTP request fails.
 * @returns {Promise<Object[]>} Resolves with an array of message objects sorted by timestamp.
 * @author Oda
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
    throw new Error(`Feil ved henting av meldinger: ${response.status}`);
  }

  const data = await response.json();
  return data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};
