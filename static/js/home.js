import fetchData from "./utils/fetchJson.js";
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';
import { createPlantClassByKey } from "./utils/createPlantClassByKey.js";

const carouselItems = document.querySelectorAll('.carousel-item');
const purchaseHistoryCards = document.querySelector('#purchase-history-cards');

/**
 * 植物サンプルデータをセッションストレージに保存し、データを返す関数。
 */
async function storeSamplePlantsData() {

    const plantsData = await fetchData('/data/PlantsSample.json');

    sessionStorage.setItem('plants', JSON.stringify(plantsData));

    return plantsData;
}

/**
 * カルーセルアイテムに植物データを表示する関数。
 */
function displayPlantsOnCarousel(plants) {
    carouselItems.forEach((item, index) => {
        if (index < 3) {
            const plant = plants[index];
            const img = item.querySelector('img');

            img.src = plant.image_url;
        }
    });
}

/**
 * 購入アイテムがclass化できなかった場合に表示するHTMLを生成する関数。
 */
function generateErrorPurchaseItemHTML() {
    return `
        <li class="purchase-item list-group-item">
            <div class="card-title">
                データが見つかりませんでした。
            </div>
        </li>
    `;
}

/**
 * 購入アイテムごとのHTMLを生成する関数。
 * @param {*} item
 * @returns 
 */
function generatePurchaseItemHTML(classfiedPlant, item) {
    console.log('classsified', classfiedPlant);
    console.log('purchase item', item)
    if (!classfiedPlant || !item) {
        return generateErrorPurchaseItemHTML();
    };

    classfiedPlant.quantity = item.quantity;
    if (!classfiedPlant.name || !classfiedPlant.quantity || !classfiedPlant.price) {
        return generateErrorPurchaseItemHTML();
    }

    return `
        <li class="purchase-item list-group-item">
            <div class="card-title">Product Name: ${item.name}</div>
            <div class="card-text">Quantity: ${item.quantity}</div>
            <div class="card-text">Price: $${item.price}</div>
        </li>
    `;
}

/**
 * 購入したデータの日付ごとにHTMLを生成する関数。
 * Bootstrapのカードを使用。
 * @param {*} items 
 * @param {*} index 
 * @returns 
 */
function generatePurchaseDateHTML(items, index) {
    let itemsHTML = '';
    // dateのキーデータを取得する。dateキーは1つしかないがArrayになる。例：["2024-01-02"]
    const date = Object.keys(items);
    date.forEach(date => {
        items[date].forEach(itemData => {
            const classifiedPlant = createPlantClassByKey(itemData.product_name, 'name');
            itemsHTML += generatePurchaseItemHTML(classifiedPlant, itemData);
        })
    });

    return `
        <div class="purchase-date card border-secondary mb-3">
            <h3 class="card-header">${date[0]}</h3>
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    ${itemsHTML}
                </ul>
            </div>
        </div>
    `;
}

/**
 * ユーザの購入履歴データを表示する関数。
 * @param {*} user 
 */
function displayPurchaseHistory(user) {
    const purchaseHistory = user.purchase_history;

    let purchaseHistoryHTML = '';

    purchaseHistory.forEach((data, index) => {
        purchaseHistoryHTML += generatePurchaseDateHTML(data, index);
    });

    purchaseHistoryCards.innerHTML = purchaseHistoryHTML;
}

/**
 * ページが読み込まれたときに実行される関数。
 */
window.onload = async () => {

    // ログインしているユーザーを取得し、クラス化したユーザーを取得する。
    const loginUserEmail = sessionStorage.getItem('login_user');
    const classfiedUser = loginUserEmail ? createUserClassFromEmail(loginUserEmail) : null;

    console.log(classfiedUser)

    // ユーザがログインしていれば購入履歴を表示する関数を呼び出す。
    if (classfiedUser && classfiedUser.is_logged_in) {
        // displayPurchaseHistory(classfiedUser);
        displayPurchaseHistory(classfiedUser);
    }

    // 植物サンプルデータをセッションストレージに保存する関数を呼出し、データを保持。
    const plantsData = await storeSamplePlantsData();

    // ローカルストレージにユーザデータがあれば、いいね数でソートした植物データを表示する。
    const sortedPlants = plantsData.sort((a, b) => b.number_of_liked - a.number_of_liked);

    console.log(sortedPlants);

    displayPlantsOnCarousel(sortedPlants);
}