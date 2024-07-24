import fetchData from "./utils/fetchJson.js";
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';
import { createPlantClassByKey } from "./utils/createPlantClassByKey.js";
import { getFormattedDate } from "./utils/getFormattedDate.js";

const carouselItems = document.querySelectorAll('.carousel-item');
const purchaseHistoryCards = document.querySelector('#purchase-history-cards');
const numberOfPurchaseHistory = document.querySelector('#number-of-purchase-history');
const purchaseHistorySection = document.querySelector('#purchase-history-section');

/**
 * 植物サンプルデータをセッションストレージに保存し、データを返す関数。
 */
async function storeSamplePlantsData() {

    const plantsData = await fetchData('/data/PlantsSample.json');

    sessionStorage.setItem('plants', JSON.stringify(plantsData));

    return plantsData;
}

/**
 * 金額を3桁区切りにする関数
 */
function addCommaToPrice(price) {
    return price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
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
            img.classList.add('rounded-full', 'img-in-carousel');

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

    const totalPrice = classfiedPlant.addCommaToPrice(classfiedPlant.calculateTotalPrice());
    const price = classfiedPlant.addCommaToPrice();

    return `
        <div class="d-flex flex-row w-100 mb-1 rounded rounded-1 border-bottom border-1">
            <div class="purchase-item list-group-item flex-grow-1 border-0">
                <div class="card-title">商品名: ${classfiedPlant.japanese_name}</div>
                <div class="card-text">購入数: ${classfiedPlant.quantity}</div>
                <div class="card-text">価格: ${price}円 - 計: ${totalPrice}円</div>
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
    const indexForDisplay = String(index + 1).padStart(2, '0');
    try {
        let itemsHTML = '';
        let allOfTotalPrice = 0;
        // kyesメソッドを使って、dateのキーデータを取得する。dateキーは1つしかないがArrayになる。例：["1719375844616"]
        const date = Object.keys(items);
        date.forEach(date => {
            items[date].forEach(itemData => {
                console.log('this is itemData: ', itemData);
                const classifiedPlant = createPlantClassByKey(itemData.name, 'name');
                console.log('this is classifiedPlant: ', classifiedPlant);
                itemsHTML += generatePurchaseItemHTML(classifiedPlant, itemData);
                allOfTotalPrice += classifiedPlant.calculateTotalPrice();
            })
        });
        // 「01. 2024-04-10」のように表示するように。
        const dateForDisplay = getFormattedDate(date[0], 1);

        return `
            <div class="purchase-data card ">
                <h3 class="card-header bg-transparent">${indexForDisplay + '. ' + dateForDisplay + ' - ' + addCommaToPrice(allOfTotalPrice) + '円'}</h3>
                <div class="card-body">
                    <div class="list-group list-group-flush">
                        ${itemsHTML}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        // 商品名が変更されている場合に起こるエラーをコンソールログに表示する。
        console.log(indexForDisplay + '番目の購入データにエラーが発生しました。');
        return null;
    }
}

/**
 * 読み込まれた購入履歴の数を表示する関数。
 */
function displayNumberOfPurchaseHistory(numberOfProcessedData) {
    numberOfPurchaseHistory.textContent = ` (直近${numberOfProcessedData}件のデータ)`;
}

/**
 * 購入履歴が存在しない場合に表示するHTMLを生成する関数。
 */
function generateErrorPurchaseHistoryHTML() {
    return `
        <h3 class="card-header bg-transparent">購入履歴がまだありません。</h3>
    `;
}

/**
 * ユーザの購入履歴データを表示する関数。
 * @param {*} user 
 */
function displayPurchaseHistory(user) {
    const purchaseHistory = user.purchase_history;
    const orderdPurchaseHistory = purchaseHistory.sort((a, b) => Object.keys(b) - Object.keys(a));

    let purchaseHistoryHTML = '';
    let numberOfProcessedData = 0;

    orderdPurchaseHistory.forEach((data, index) => {
        if (!data) {
            purchaseHistoryHTML += generateErrorPurchaseHistoryHTML();
            return;
        }

        // 購入履歴を3件まで表示するように。
        if (index > 2) return;
        if (generatePurchaseDateHTML(data, index) === null) {
            purchaseHistoryHTML += '';
        } else {
            purchaseHistoryHTML += generatePurchaseDateHTML(data, index);
            numberOfProcessedData++;
        }
    });

    if (numberOfProcessedData > 0) {
        displayNumberOfPurchaseHistory(numberOfProcessedData);
    }

    purchaseHistoryCards.innerHTML = purchaseHistoryHTML;

    // 購入履歴セクションのDIVを表示する。
    purchaseHistorySection.classList.remove('d-none');
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