import fetchData from "./utils/fetchJson.js";
import Plant from "./classes/PlantClass.js";
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';
import { createPlantClassByKey } from "./utils/createPlantClassByKey.js";

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
 * 入力されたデータからカード（Bootstrap）を作成する関数。
 */
function createCard(plantData, user = null) {
    const card = document.createElement('div');
    card.classList.add('card');

    const anchor = document.createElement('a');
    anchor.href = 'detail.html?slug=' + plantData.slug;
    anchor.style.textDecoration = 'none';
    anchor.style.color = 'black';

    const cardImg = document.createElement('img');
    cardImg.classList.add('card-img-top');
    cardImg.style.height = '360px';
    cardImg.style.objectFit = 'cover';
    cardImg.src = plantData.image_url;
    cardImg.alt = plantData.name;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = plantData.japanese_name;

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = plantData.description;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    if (user && user.is_logged_in) {
        const cardButton = document.createElement('button');
        // ユーザーがいいねをしているかどうかでボタンのテキストを変更する。
        if (user.liked_products.includes(plantData.id)) {
            cardButton.classList.add('btn', 'btn-outline-danger');
            cardButton.textContent = 'お気に入りから削除';
        } else {
            cardButton.classList.add('btn', 'btn-outline-primary');
            cardButton.textContent = 'お気に入りに追加';
        }
        cardButton.onclick = (e) => {
            // クラス内のtoggleLikeメソッドを使い、いいねの数を増やす。
            plantData.toggleLike(e);
            // ログインしている場合、いいねの情報を更新するメソッドを呼び出す。
            user.toggleLike(plantData.id);
        }
        cardBody.appendChild(cardButton);
    }

    anchor.appendChild(cardImg);
    anchor.appendChild(cardBody);
    card.appendChild(anchor);

    return card;
}

/**
 * 植物データをローカルストレージから取得し、Plantクラスのインスタンスを作成し、メソッドを使いカードを作成する関数。
 * @param {*} plantsData 
 * @returns 
 */
function createClassifiedPlandAndLists(plantsData, user = null) {
    const plants = JSON.parse(localStorage.getItem('plants'));

    let rowDiv;
    plants.map((plant, index) => {
        let classifiedPlant = Object.assign(new Plant(), plant);

        // // 1行ごとに3つのカードが表示されるように、3で割った余りが0のときのみrow用のDivを作成する。
        // if (index % 3 === 0) {
        //     rowDiv = classifiedPlant.createRowDiv();
        // }

        const card = createCard(classifiedPlant, user);

        const colDiv = classifiedPlant.createColDiv();

        colDiv.appendChild(card);
        // rowDiv.appendChild(colDiv);

        // cardsContainer.appendChild(rowDiv);
        cardsContainer.appendChild(colDiv);

        plantsData.push(classifiedPlant);
    });

    return plantsData;
}


window.onload = async () => {

    // ログインしているユーザーを取得し、クラス化したユーザーを取得する。
    const loginUserEmail = sessionStorage.getItem('login_user');
    const classfiedUser = loginUserEmail ? createUserClassFromEmail(loginUserEmail) : null;

    console.log(classfiedUser)

    await storeSamplePlantsDataToLocalStorage();

    const classifiedPlants = createClassifiedPlandAndLists([], classfiedUser);


    console.log('Plants data from local storage and cleassified as Plant class:');
    console.log(classifiedPlants);

}