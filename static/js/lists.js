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
 * 植物データをローカルストレージから取得し、Plantクラスのインスタンスを作成し、メソッドを使いカードを作成する関数。
 * @param {*} plantsData 
 * @returns 
 */
function createclassifiedAndLists (plantsData) {
    const plants = JSON.parse(localStorage.getItem('plants'));

    let rowDiv;
    plants.map((plant, index) => {
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

    // Temporary, automatically login.
    sessionStorage.setItem('login_user', 'test@mail.com');


    await storeSamplePlantsDataToLocalStorage();

    const classifiedPlants = createclassifiedAndLists([]);


    console.log('Plants data from local storage and cleassified as Plant class:');
    console.log(classifiedPlants);

}