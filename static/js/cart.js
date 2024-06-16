
import Plant from './classes/PlantClass.js';
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import User from './classes/UserClass.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';

const cartProduct = document.querySelector('#cart-products');
const cartSummaryDiv = document.querySelector('#cart-summary');
const totalPriceSpan = document.querySelector('#total-price');

let products = [];

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
 * 「数量」が変更されたときに実行される関数で、カート内の商品の数量を変更する。
 */
function handleQuantityChange(user, productId, quantity) {
    const newProducts = products.map(product => {
        if (product.id === productId) {
            product.quantity = quantity;
        }
        return product;
    });
    user.products_in_cart = newProducts;
    console.log(user);
    updateUserDataOnLocalStorage(user);
    redisplayCartList(user);
}

/**
 * 「削除」ボタンをクリックしたときに実行される関数で、カートから商品を削除する。
 */
function handleDeleteProductFromCart(user, productId){
    const newProducts = products.filter(product => product.id !== productId);
    user.products_in_cart = newProducts;
    console.log(user);
    updateUserDataOnLocalStorage(user);
    redisplayCartList(user);
}

/**
 * 「購入」ボタンをクリックしたときに実行される関数で、ユーザの`puprchase_history`に商品を追加する。
 */
function handlePurchase(user) {
    const purchaseList = []; // 今回の購入リスト

    products.map((product, index) => {
        const purchase = {
            id: product.id,
            japanese_name: product.japanese_name,
            price: product.price,
            quantity: product.quantity,
            image_url: product.image_url,
        };
    
        purchaseList.push(purchase);
    })

    const history = user.puprchase_history || [];
    history.push(purchaseList);
    user.purchase_history = history;
    console.log(user);

    // ユーザ情報の更新
    updateUserDataOnLocalStorage(user);
}

/**
 * 購入内容を表示するためコンテンツを作るための関数
 */
function displayCartList(user) {

    if (products.length === 0) {
        const emptyCart = document.createElement('p');
        emptyCart.textContent = 'カートに商品がありません。';
        cartSummaryDiv.appendChild(emptyCart);
        return;
    }

    const cartListUl = document.createElement('ul');
    cartListUl.classList.add('list-group', 'list-group-numbered');

    let totalPrice = 0;

    products.map((product, index) => {
        const productLi = document.createElement('li');
        productLi.classList.add('list-group-item', 'd-flex', 'justify-content-start', 'align-items-center');
        let sumPrice = product.price * product.quantity;
        totalPrice += sumPrice;
        let liText = `${product.japanese_name} ${product.price}円 x ${product.quantity}個 ・・・ ${sumPrice}円`;
        productLi.textContent = liText;
        cartListUl.appendChild(productLi);
    });
    cartSummaryDiv.appendChild(cartListUl);

    totalPriceSpan.textContent = `${totalPrice}円`;
}

/**
 * 購入内容が変更された場合に再度表示させる関数
 */
function redisplayCartList(user) {
    window.location.reload();
    cartSummaryDiv.innerHTML = '';
    displayCartList(user);
    console.log('cart list is redisplayed');
}


/**
 * `products_in_cart`にある商品をカート商品用のDIVに表示する関数
 */
function displayCartProducts(user) {

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
        productInfoDiv.classList.add('col-8', 'd-grid', 'gap-2');
        // 商品名
        const productName = document.createElement('p');
        productName.textContent = product.japanese_name;
        productName.classList.add('h3');

        // 価格等の下の部分のDIV
        const productInfoBottomDiv = document.createElement('div');
        productInfoBottomDiv.classList.add('row', 'justify-content-center', 'align-items-center');

        // 価格
        const productPrice = document.createElement('div');
        productPrice.textContent = `小売価格: ${product.price} 円`;
        productPrice.classList.add('col');

        // 数量
        const productQuantityDiv = document.createElement('div');
        productQuantityDiv.classList.add('col');
        const productQuantityInsideDiv = document.createElement('div');
        productQuantityInsideDiv.classList.add('col');
        const productQuantityLabel = document.createElement('label');
        productQuantityLabel.setAttribute('for', 'quantity');
        productQuantityLabel.textContent = '数量';
        productQuantityLabel.classList.add('col');
        const productQuantity = document.createElement('input');
        productQuantity.value = product.quantity;
        productQuantity.type = 'number';
        productQuantity.classList.add('form-control');
        productQuantity.classList.add('col');
        productQuantity.addEventListener('change', (event) => {
            handleQuantityChange(user, product.id, event.target.value);
        });
        productQuantityInsideDiv.appendChild(productQuantityLabel);
        productQuantityInsideDiv.appendChild(productQuantity);
        productQuantityDiv.appendChild(productQuantityInsideDiv);

        // 合計金額
        const totalPrice = document.createElement('div');
        totalPrice.textContent = `合計: ${product.price * product.quantity} 円`;
        totalPrice.classList.add('col');

        // 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.classList.add('col');
        deleteButton.addEventListener('click', () => {
            handleDeleteProductFromCart(user, product.id);
        });

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

    products = classfiedUser.products_in_cart || [];

    displayCartProducts(classfiedUser);

    displayCartList(classfiedUser);

    const purchaseButton = document.querySelector('#purchase-button');
    purchaseButton.addEventListener('click', () => {
        handlePurchase(classfiedUser);
    });


});
