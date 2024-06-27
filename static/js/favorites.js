import fetchData from "./utils/fetchJson.js";
import Plant from "./classes/PlantClass.js";
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';
import { storeSamplePlantsDataToLocalStorage } from './utils/storeSamplePantsDataToLocalStorage.js';
import { createClassifiedProducts } from "./utils/createClassifiedProducts.js";
import { createPlantClassByKey } from "./utils/createPlantClassByKey.js";

const cardsContainer = document.getElementById('cards-container');

/**
 * お気に入り商品がなかった場合にその旨のメッセージを表示する関数。
 */
function displayNoFavoritesMessage() {
    const noFavoritesMessage = document.createElement('h2');
    noFavoritesMessage.textContent = 'お気に入りに登録されている商品がありません。';
    noFavoritesMessage.classList.add('text-center', 'text-muted', 'mt-5', 'w-100');
    cardsContainer.appendChild(noFavoritesMessage);
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
    const classfiedUser = createUserClassFromEmail(loginUserEmail);

    console.log(classfiedUser)

    // サンプルの植物データをローカルストレージから取得する。取得できない場合は、サンプルデータを保存する。
    const plants = JSON.parse(localStorage.getItem('plants'));
    if (!plants) {
        await storeSamplePlantsDataToLocalStorage();
        plants = JSON.parse(localStorage.getItem('plants'));
    }

    let classifiedPlantsOfFavorites = [];
    if (classfiedUser.liked_products.length > 0) {

        // 関数を使って、植物データをPlantクラスのインスタンスに変換する。
        classfiedUser.liked_products.forEach((likedProduct) => {
            classifiedPlantsOfFavorites.push(createPlantClassByKey(likedProduct, 'id'));
        });

        // Plantクラスのメソッドを使い、カードを作成する関数を呼び出す。
        createCardLists(classifiedPlantsOfFavorites, classfiedUser);

    } else {
        displayNoFavoritesMessage();
    }

    console.log('Favorites plants data and cleassified as Plant class:');
    console.log(classifiedPlantsOfFavorites);

}