
import Plant from './classes/PlantClass.js';
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import User from './classes/UserClass.js';

const cartProduct = document.querySelector('#cart-products');

/**
 * 植物のすべての情報を取得する関数
 * @param {Array} plantsData
 */
function createclassifiedData(plantsData) {
    const plants = JSON.parse(localStorage.getItem('plants'));

    plants.map((plant, index) => {
        let classifiedPlant = Object.assign(new Plant(), plant);

        plantsData.push(classifiedPlant);
    });

    return plantsData;
}


/**
 * ローカルストレージから取得したログインユーザーのカートに商品を追加し、ローカルストレージに再度保存する。
 */
function updateUsersData(user) {
    const users = JSON.parse(localStorage.getItem('users'));
    const index = users.findIndex(user => user.email === user.email);
    users[index] = user;
    localStorage.setItem('users', JSON.stringify(users));

}

/**
 * 「購入」ボタンをクリックしたときに実行される関数で、ユーザの`puprchase_history`に商品を追加する。
 * detailが参考にできるよ*******
 */
function handlePurchase(user) {

}

/**
 * `products_in_cart`にある商品をカート商品用のDIVに表示する関数
 */
function displayCartProducts(user) {
    const products = user.products_in_cart || [];

    products.map((product, index) => {
    
        const productDiv = document.createElement('div');
        productDiv.classList.add('row', 'justify-content-center', 'align-items-center', 'p-2');

        // イメージ用DIV
        const productImageDiv = document.createElement('div');
        productImageDiv.classList.add('col-4');
        // イメージ
        const productImage = document.createElement('img');
        productImage.src = product.image_url;
        productImage.classList.add('rounded', 'img-fluid');

        productImageDiv.appendChild(productImage);

        // 商品情報DIV
        const productInfoDiv = document.createElement('div');
        productInfoDiv.classList.add('col-8');
        // 商品名
        const productName = document.createElement('p');
        productName.textContent = product.japanese_name;

        // 価格等の下の部分のDIV
        const productInfoBottomDiv = document.createElement('div');
        productInfoBottomDiv.classList.add('row');

        // 価格
        const productPrice = document.createElement('div');
        productPrice.textContent = '価格： ' + product.price;
        productPrice.classList.add('col');

        // 数量
        const productQuantityDiv = document.createElement('div');
        productQuantityDiv.classList.add('col');
        const productQuantityInsideDiv = document.createElement('div');
        productQuantityInsideDiv.classList.add('row');
        const productQuantityLabel = document.createElement('label');
        productQuantityLabel.setAttribute('for', 'quantity');
        productQuantityLabel.textContent = '数量';
        productQuantityLabel.classList.add('col');
        const productQuantity = document.createElement('input');
        productQuantity.value = product.quantity;
        productQuantity.type = 'number';
        productQuantity.classList.add('form-control');
        productQuantity.classList.add('col');
        productQuantity.addEventListener('change', () => {});
        productQuantityInsideDiv.appendChild(productQuantityLabel);
        productQuantityInsideDiv.appendChild(productQuantity);
        productQuantityDiv.appendChild(productQuantityInsideDiv);

        // 合計金額
        const totalPrice = document.createElement('div');
        totalPrice.textContent = product.price * product.quantity;
        totalPrice.classList.add('col');

        // 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.classList.add('col');

        productInfoBottomDiv.appendChild(productPrice);
        productInfoBottomDiv.appendChild(productQuantityDiv);
        productInfoBottomDiv.appendChild(totalPrice);
        productInfoBottomDiv.appendChild(deleteButton);

        productInfoDiv.appendChild(productName);
        productInfoDiv.appendChild(productInfoBottomDiv);


        // すべて結合し、HTMLファイルに元からあるDIVに追加する。
        productDiv.appendChild(productImageDiv);
        productDiv.appendChild(productInfoDiv);

        cartProduct.appendChild(productDiv);
    });
}


/**
 * ページが読み込まれたときに実行される関数
 */
window.addEventListener('load', () => {

    // ログインしているユーザーを取得し、クラス化したユーザーを取得する。
    const loginUserEmail = sessionStorage.getItem('login_user') || 'test@mail.com';
    const classfiedUser = createUserClassFromEmail(loginUserEmail);

    console.log(classfiedUser)

    displayCartProducts(classfiedUser);


    const purchaseButton = document.querySelector('#purchase-button');
    purchaseButton.addEventListener('click', () => {

    });


});
