import fetchUserData from "./utils/fetchJson.js";

window.onload = () => {
    const isUserLoggedIn = sessionStorage.getItem('login_user');

    if (!isUserLoggedIn) {
        window.location.href = '/login.html';
    }
}