import fetchData from "./utils/fetchJson.js";
import Plant from "./classes/PlantClass.js";
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';
import { createPlantClassByKey } from "./utils/createPlantClassByKey.js";
import { createClassifiedProducts } from "./utils/createClassifiedProducts.js";

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
 * 入力されたデータからカードに見立てた商品ごとのDIVを作成する関数。
 */
function createCard(plantData, user = null) {
    const card = document.createElement('div');
    card.classList.add('d-grid', 'border-0', 'p-2');

    const anchor = document.createElement('a');
    anchor.href = 'detail.html?slug=' + plantData.slug;
    anchor.style.textDecoration = 'none';
    anchor.style.color = 'black';

    const cardImg = document.createElement('img');
    cardImg.classList.add('object-fit-cover', 'w-100', 'rounded');
    cardImg.style.height = '360px';
    cardImg.style.objectFit = 'cover';
    cardImg.src = plantData.image_url;
    cardImg.alt = plantData.name;

    const cardBody = document.createElement('div');
    cardBody.classList.add('d-flex', 'flex-column', 'align-items-start', 'p-2');

    const cardTitle = document.createElement('h5');
    cardTitle.textContent = plantData.japanese_name;

    const cardText = document.createElement('p');
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
 * メソッドを使いカードに見立てたリストを作成する関数。
 * @param {*} plantsData 
 * @returns 
 */
function createCardLists(plantsData, user = null) {
    plantsData.map((plant, index) => {

        const card = plant.createCard(user);

        // Plantクラスのメソッドを使い、colをクラスに持つdiv要素を作成する。
        const colDiv = plant.createColDiv();

        colDiv.appendChild(card);

        cardsContainer.appendChild(colDiv);
    });
}


window.onload = async () => {

    // ログインしているユーザーを取得し、クラス化したユーザーを取得する。
    const loginUserEmail = sessionStorage.getItem('login_user');
    const classfiedUser = loginUserEmail ? createUserClassFromEmail(loginUserEmail) : null;

    console.log(classfiedUser)

    // サンプルの植物データをローカルストレージから取得する。取得できない場合は、サンプルデータを保存する。
    const plants = JSON.parse(localStorage.getItem('plants'));
    if (!plants) {
        await storeSamplePlantsDataToLocalStorage();
        plants = JSON.parse(localStorage.getItem('plants'));
    }

    // 関数を使って、植物データをPlantクラスのインスタンスに変換する。
    const classifiedPlants = createClassifiedProducts(plants);

    // Plantクラスのメソッドを使い、カードを作成する。
    createCardLists(classifiedPlants, classfiedUser);


    console.log('Plants data from local storage and cleassified as Plant class:');
    console.log(classifiedPlants);

}