import { endpoint } from "./endpoint";

export const loginUser = async (username, password) => {
  
  const response = await fetch(`${endpoint}/rest/core/login`, {
    method: "POST",
    credentials: "include", //cookies sendes med alle de neste requestene, så brukeren blir identifisert av API'et
    body: JSON.stringify({
      username,
      password,
      rememberMe: true,
    }),
  });
  return response;
};

export const logoutUser = async () => {
  const response = await fetch(`${endpoint}/rest/core/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return response;
};

export async function IsLoggedIn() {
    const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        method: "GET",
        credentials: "include",
    });

    return response.ok;
}