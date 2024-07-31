import fetchData from "./utils/fetchJson.js";
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';
import { createPlantClassByKey } from "./utils/createPlantClassByKey.js";
import { getFormattedDate } from "./utils/getFormattedDate.js";

const carouselItems = document.querySelectorAll('.carousel-item');
const purchaseHistoryCards = document.getElementById('purchase-history-cards');
const numberOfPurchaseHistory = document.getElementById('number-of-purchase-history');
const purchaseHistorySection = document.getElementById('purchase-history-section');

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
    return price.toLocaleString();
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
    const error = document.createElement('li');
    error.classList.add('purchase-item', 'list-group-item');
    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.classList.add('card-title');
    errorMessageDiv.textContent = 'データが見つかりませんでした。';
    error.appendChild(errorMessageDiv);
    return error
}

/**
 * 購入アイテムの画像とリンクを生成する関数
 */
function generatePurchaseItemImgAndLink(classfiedPlant) {

    const anchor = document.createElement('a');
    anchor.href = `detail.html?slug=${classfiedPlant.slug}`;
    const img = document.createElement('img');
    img.src = classfiedPlant.image_url;
    img.classList.add('rounded', 'rounded-1', 'border', 'border-0');
    img.style.width = '100px';
    img.style.height = '100px';
    anchor.appendChild(img);
    
    return anchor;
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

    const purchaseItemDiv = document.createElement('div');
    purchaseItemDiv.classList.add('d-flex', 'flex-row', 'w-100', 'mb-1', 'rounded', 'rounded-1', 'border-bottom', 'border-1');
    const purchaseItem = document.createElement('div');
    purchaseItem.classList.add('purchase-item', 'list-group-item', 'flex-grow-1', 'border-0');
    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = `商品名: ${classfiedPlant.japanese_name}`;
    const numberOfPurchase = document.createElement('div');
    numberOfPurchase.classList.add('card-text');
    numberOfPurchase.textContent = `購入数: ${classfiedPlant.quantity}`;
    const priceOfPurchase = document.createElement('div');
    priceOfPurchase.classList.add('card-text');
    priceOfPurchase.textContent = `価格: ${price}円 - 計: ${totalPrice}円`;
    purchaseItem.appendChild(cardTitle);
    purchaseItem.appendChild(numberOfPurchase);
    purchaseItem.appendChild(priceOfPurchase);
    purchaseItemDiv.appendChild(purchaseItem);

    if (classfiedPlant.image_url) {
        const imgDiv = document.createElement('div');
        const imgAndLink = classfiedPlant.image_url ? generatePurchaseItemImgAndLink(classfiedPlant) : '';
        imgDiv.appendChild(imgAndLink);
        purchaseItemDiv.appendChild(imgDiv);
    }
    
    return purchaseItemDiv;
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
        const listGroup = document.createElement('div');
        let allOfTotalPrice = 0;
        // kyesメソッドを使って、dateのキーデータを取得する。dateキーは1つしかないがArrayになる。例：["1719375844616"]
        const date = Object.keys(items);
        date.forEach(date => {
            items[date].forEach(itemData => {
                console.log('this is itemData: ', itemData);
                const classifiedPlant = createPlantClassByKey(itemData.id, 'id');
                listGroup.appendChild(generatePurchaseItemHTML(classifiedPlant, itemData));
                allOfTotalPrice += classifiedPlant.calculateTotalPrice();
            })
        });
        // 「01. 2024-04-10」のように表示するように。
        const dateForDisplay = getFormattedDate(date[0], 1);

        const purchaseCard = document.createElement('div');
        purchaseCard.classList.add('purchase-data', 'card');
        const cardHeader = document.createElement('h3');
        cardHeader.classList.add('card-header', 'bg-transparent');
        cardHeader.textContent = `${indexForDisplay}. ${dateForDisplay} - ${addCommaToPrice(allOfTotalPrice)}円`;
        const purchaseCardBody = document.createElement('div');
        purchaseCardBody.classList.add('card-body');
        listGroup.classList.add('list-group', 'list-group-flush');

        purchaseCard.appendChild(cardHeader);
        purchaseCard.appendChild(purchaseCardBody);
        purchaseCardBody.appendChild(listGroup);

        return purchaseCard;
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
 * ユーザの購入履歴データを表示する関数。
 * @param {*} user 
 */
function displayPurchaseHistory(user) {
    const purchaseHistory = user.purchase_history;
    const orderdPurchaseHistory = purchaseHistory.sort((a, b) => Object.keys(b) - Object.keys(a));

    let numberOfProcessedData = 0;

    orderdPurchaseHistory.forEach((data, index) => {
        if (!data) {
            purchaseHistoryCards.textContent = '購入履歴がまだありません。';
            return;
        }

        // 購入履歴を3件まで表示するように。
        if (index > 2) return;
        if (generatePurchaseDateHTML(data, index) === null) {
            return;
        } else {
            purchaseHistoryCards.appendChild(generatePurchaseDateHTML(data, index));
            numberOfProcessedData++;
        }
    });

    if (numberOfProcessedData > 0) {
        displayNumberOfPurchaseHistory(numberOfProcessedData);
    }

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

    // ユーザがログインしている且つ、購入履歴がある場合に購入履歴を表示する関数を呼び出す。
    if (classfiedUser && classfiedUser.is_logged_in && classfiedUser.purchase_history) {
        displayPurchaseHistory(classfiedUser);
    }

    // 植物サンプルデータをセッションストレージに保存する関数を呼出し、データを保持。
    const plantsData = await storeSamplePlantsData();

    // ローカルストレージにユーザデータがあれば、いいね数でソートした植物データを表示する。
    const sortedPlants = plantsData.sort((a, b) => b.number_of_liked - a.number_of_liked);

    console.log(sortedPlants);

    displayPlantsOnCarousel(sortedPlants);
}