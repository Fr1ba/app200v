import { endpoint } from "./endpoint";

export const loginUser = async (username, password) => {
  //await new Promise(resolve => setTimeout(resolve, 5000)); //delay to see what the pending request looks like. to be removed 
    
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
