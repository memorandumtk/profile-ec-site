import fetchData from "./utils/fetchJson.js";
import fetchUserData from "./utils/fetchJson.js";


async function storeSamplePlantsData() {

    const plantsData = await fetchData('/data/PlantsSample.json');
    console.log(plantsData);
    
    sessionStorage.setItem('plants', JSON.stringify(plantsData));
}

window.onload = async () => {
    const isUserLoggedIn = sessionStorage.getItem('login_user');

    // Temporary commented out.
    //// ログインしていない場合、ログインページにリダイレクト
    // if (!isUserLoggedIn) {
    //     window.location.href = '/login.html';
    // }

    storeSamplePlantsData();
}