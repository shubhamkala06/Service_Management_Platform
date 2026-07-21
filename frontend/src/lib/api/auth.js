import {get} from "$lib/api/client";


export async function getCurrentUser() {
    const userInfo = await get("/user/me");
    return userInfo;
}

export async function logout() {
    const response = await get("/auth/logout");
    return response;
}