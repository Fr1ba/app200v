import { endpoint } from "./endpoint";

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