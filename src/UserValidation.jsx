const endpoint = "https://app06.itxnorge.no";

export async function IsLoggedIn() {
    const response = await fetch(`${endpoint}/rest/itxems/entity`, {
        method: "GET",
        credentials: "include",
    });

    return response.ok;
}