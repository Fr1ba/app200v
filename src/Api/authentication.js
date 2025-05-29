import { endpoint } from "./endpoint";

/**
 * Sends login credentials to the API for authentication.
 * @function
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @param {boolean} rememberMe - Whether the user should be remembered between sessions.
 * @returns {Promise<Response>} Resolves with the server's response to the login request.
 * @author Oda
 */
export const loginUser = async (username, password, rememberMe) => {
  
  const response = await fetch(`${endpoint}/rest/core/login`, {
    method: "POST",
    credentials: "include", //cookies sendes med alle de neste requestene, så brukeren blir identifisert av API'et
    body: JSON.stringify({
      username,
      password,
      rememberMe,
    }),
  });
  return response;
};

/**
 * Logs the user out of the system by sending a POST request to the logout endpoint.
 * After logout, the user will no longer be identified by the API.
 * @function
 * @returns {Promise<Response>} Resolves with the server's response to the logout request.
 * @author Michal
 */

export const logoutUser = async () => {
  const response = await fetch(`${endpoint}/rest/core/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return response;
};

/**
 * Checks if the user is currently logged in.
 * 
 * Sends a GET request to the /rest/itxems/entity endpoint to determine if the user is logged in.
 * If the request returns 200 OK, the user is logged in, otherwise they aren't.
 * @function
 * @returns {Promise<boolean>} Resolves with true if the user is logged in, false otherwise.
 * @author Michal
 */
export async function IsLoggedIn() {
    const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        method: "GET",
        credentials: "include",
    });

    return response.ok;
}