import fetchData from "./utils/fetchJson.js";
import Plant from "./classes/PlantClass.js";
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';

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
 * 植物データをローカルストレージから取得し、Plantクラスのインスタンスを作成し、メソッドを使いカードを作成する関数。
 * @param {*} plantsData 
 * @returns 
 */
function createclassifiedAndListsWithFavorites(likedPlants) {
    let plantsData = [];
    const plants = JSON.parse(localStorage.getItem('plants'));

    // お気に入りの植物のみを表示するために、ユーザのliked_productとマッチするお気に入りの植物のみをフィルタリングする。
    const filteredPlants = plants.filter((plant) => {
        return likedPlants.includes(plant.id);
    });

    let rowDiv;
    filteredPlants.map((plant, index) => {
        let classifiedPlant = Object.assign(new Plant(), plant);

        // 1行ごとに3つのカードが表示されるように、3で割った余りが0のときのみrow用のDivを作成する。
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

    // ログインしているユーザーを取得し、クラス化したユーザーを取得する。
    const loginUserEmail = sessionStorage.getItem('login_user');
    const classfiedUser = createUserClassFromEmail(loginUserEmail);

    console.log(classfiedUser)

    // サンプルの植物データをローカルストレージに保存する。
    await storeSamplePlantsDataToLocalStorage();
    let classifiedPlants = [];
    if (classfiedUser.liked_products.length > 0) {
        classifiedPlants = createclassifiedAndListsWithFavorites(classfiedUser.liked_products);
    }

    console.log('Plants data from local storage and cleassified as Plant class:');
    console.log(classifiedPlants);

}