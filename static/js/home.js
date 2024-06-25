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

            const anchor = item.querySelector('a');
            if (anchor) {
                anchor.href = `detail.html?slug=${plant.slug}`;
            }
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
 * 購入アイテムの画像とリンクを生成する関数
 */
function generatePurchaseItemImgAndLink(classfiedPlant) {

    return `
        <a href="detail.html?slug=${classfiedPlant.slug}">
            <img 
                src="${classfiedPlant.image_url}" 
                class="rounded rounded-1 border border-0"
                alt="${classfiedPlant.name}"
                style="width: 100px; height: 100px;"
            >
        </a>
    `;
}

/**
 * 購入アイテムごとのHTMLを生成する関数。
 * @param {*} item
 * @returns 
 */
function generatePurchaseItemHTML(classfiedPlant, item) {
    if (!classfiedPlant || !item) {
        return generateErrorPurchaseItemHTML();
    };

    classfiedPlant.quantity = item.quantity;
    if (!classfiedPlant.name || !classfiedPlant.quantity || !classfiedPlant.price) {
        return generateErrorPurchaseItemHTML();
    }

    return `
        <div class="d-flex flex-row w-100 mb-1 rounded rounded-1 border-bottom border-1">
            <div class="purchase-item list-group-item flex-grow-1 border-0">
                <div class="card-title">Product Name: ${classfiedPlant.japanese_name}</div>
                <div class="card-text">Quantity: ${classfiedPlant.quantity}</div>
                <div class="card-text">Price: $${classfiedPlant.price}</div>
            </div>
            <div>
                ${classfiedPlant.image_url ? generatePurchaseItemImgAndLink(classfiedPlant) : ''}
            </div>
        </div>
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
    // 「01. 2024-04-10」のように表示するように。
    const indexForDisplay = String(index + 1).padStart(2, '0');

    return `
        <div class="purchase-date card border-secondary">
            <h3 class="card-header bg-transparent">${indexForDisplay + '. ' + date[0]}</h3>
            <div class="card-body">
                <div class="list-group list-group-flush">
                    ${itemsHTML}
                </div>
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
    const orderdPurchaseHistory = purchaseHistory.sort((a, b) => new Date(Object.keys(b)) - new Date(Object.keys(a)));

    let purchaseHistoryHTML = '';

    orderdPurchaseHistory.forEach((data, index) => {
        // 購入履歴を3件まで表示するように。
        if (index > 2) return;
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
        displayPurchaseHistory(classfiedUser);
    }

    // 植物サンプルデータをセッションストレージに保存する関数を呼出し、データを保持。
    const plantsData = await storeSamplePlantsData();

    // ローカルストレージにユーザデータがあれば、いいね数でソートした植物データを表示する。
    const sortedPlants = plantsData.sort((a, b) => b.number_of_liked - a.number_of_liked);

    console.log(sortedPlants);

    displayPlantsOnCarousel(sortedPlants);
}