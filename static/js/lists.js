import fetchData from "./utils/fetchJson.js";
import Plant from "./classes/PlantClass.js";

const cardsContainer = document.getElementById('cards-container');

/**
 * 植物サンプルデータをローカルストレージに保存し、データを返す関数。
 */
async function storeSamplePlantsDataToLocalStorage() {

    const plantsData = await fetchData('/data/PlantsSample.json');
    console.log(plantsData);

    localStorage.setItem('plants', JSON.stringify(plantsData));
}

/**
 * ローカルストレージから植物データを取得する関数。
 * また、取得したデータをクラス化したArrayを返す。 
 */
// async function fetchPlantsDataFromLocalStorage() {
//     let plantsData = [];

//     for (let plant of plants) {
//         plant = new Plant(
//             plant.id,
//             plant.name,
//             plant.japanese_name,
//             plant.description,
//             plant.image_url,
//             plant.price,
//             plant.stock,
//             plant.slug,
//             plant.number_of_liked,
//         );
        
//         plantsData.push(plant);
//     }

//     return plantsData;
// }


/**
 * colをクラスに持つdiv要素を作成する関数。
 */

/**
 * 植物データからカードを作成し一覧表示用にする。
 */
// function createListsWithCard(plantsData) {

//     let rowDiv;

//     for (let i = 0; i < plantsData.length; i++) {

//         let classifiedPlant = Object.assign(new Plant(), plantsData[i]);

//         // 1行ごとに3つのカードが表示されるように3で割った余りが0のときのみrow用のDivを作成する。
//         if (i % 3 === 0) {
//             rowDiv = classifiedPlant.createRowDiv();
//         }

//         // plantsData[i]はPlantクラスのインスタンス。
//         const card = classifiedPlant.createCard(plantsData[i]);

//         const colDiv = createColDiv();
//         colDiv.appendChild(card);

//         rowDiv.appendChild(colDiv);

//         cardsContainer.appendChild(rowDiv);
//     }
// }


function createclassifiedAndLists (plantsData) {
    const plants = JSON.parse(localStorage.getItem('plants'));

    let rowDiv;
    plants.map((plant, index) => {
        let classifiedPlant = Object.assign(new Plant(), plant);

        // 1行ごとに3つのカードが表示されるように3で割った余りが0のときのみrow用のDivを作成する。
        if (index % 3 === 0) {
            rowDiv = classifiedPlant.createRowDiv();
        }

        const card = classifiedPlant.createCard(classifiedPlant);

        const colDiv = classifiedPlant.createColDiv();

        colDiv.appendChild(card);
        rowDiv.appendChild(colDiv);

        cardsContainer.appendChild(rowDiv);

        plantsData.push(classifiedPlant);
    });

    return plantsData;
}


window.onload = async () => {
    const isUserLoggedIn = sessionStorage.getItem('login_user');

    // Temporary commented out.
    //// ログインしていない場合、ログインページにリダイレクト
    // if (!isUserLoggedIn) {
    //     window.location.href = '/login.html';
    // }

    // Temporary, automatically login.
    sessionStorage.setItem('login_user', 'test@mail.com');


    await storeSamplePlantsDataToLocalStorage();

    const classifiedPlants = createclassifiedAndLists([]);


    console.log('Plants data from local storage and cleassified as Plant class:');
    console.log(classifiedPlants);

}