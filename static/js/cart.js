
import Plant from './classes/PlantClass.js';
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import User from './classes/UserClass.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';

const cartProduct = document.querySelector('#cart-products');
const cartSummaryDiv = document.querySelector('#cart-summary');
const totalPriceSpan = document.querySelector('#total-price');

// let products = [];

/**
 * 商品をクラス化する関数 (1つの商品)
 */
function createClassifiedProduct(product) {
    let classifiedProduct = new Plant();
    classifiedProduct = Object.assign(classifiedProduct, product)

    return classifiedProduct;
} 

/**
 * 商品をクラス化する関数 (Arrayごと)
 */
function createClassifiedProducts(productsData) {
    let classifiedProducts = [];
    productsData.map((product, index) => {
        // 1つずつ商品をクラス化
        const classifiedProduct = createClassifiedProduct(product);
        classifiedProducts.push(classifiedProduct);
    });
    // クラス化した商品のArrayを返す
    return classifiedProducts;
}

/**
 * 金額を3桁区切りにする関数
 */
function addCommaToPrice(price) {
    return price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

/**
 * 「数量」が変更されたときに実行される関数で、カート内の商品の数量を変更する。
 */
function handleQuantityChange(user, product, quantity) {
    product.quantity = Number(quantity);
    if (user.products_in_cart.some(p => p.id === product.id)) {
        user.products_in_cart = user.products_in_cart.map((p) => {
            if (p.id === product.id) {
                return product;
            }
            return p;
        });
    } else {
        user.products_in_cart.push(product);
    }
    console.log(user);
    updateUserDataOnLocalStorage(user);
    redisplayCartList(user);
}

/**
 * 「削除」ボタンをクリックしたときに実行される関数で、カートから商品を削除する。
 */
function handleDeleteProductFromCart(user, product, products){
    const newProducts = products.filter(p => p.id !== product.id);
    user.products_in_cart = newProducts;
    console.log(user);
    updateUserDataOnLocalStorage(user);
    redisplayCartList(user);
}

/**
 * 「購入」ボタンをクリックしたときに実行される関数で、ユーザの`puprchase_history`に商品を追加する。
 */
function handlePurchase(user, products) {
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
function displayCartList(user, products) {

    if (products.length === 0) {
        const emptyCart = document.createElement('p');
        emptyCart.textContent = '現在カートに商品がありません。';
        cartSummaryDiv.appendChild(emptyCart);
        return;
    }

    const cartListUl = document.createElement('ul');
    cartListUl.classList.add('list-group', 'list-group-numbered');

    let totalPrice = 0;

    products.map((product, index) => {
        const productLi = document.createElement('li');
        productLi.classList.add('list-group-item', 'd-flex', 'justify-content-start', 'align-items-center');
        
        const liDiv = document.createElement('div');
        liDiv.classList.add('ms-2', 'me-auto'); // スペースが数字との間に必要。
        // Plantクラス内のメソッドを使い、カート内の商品の合計金額を計算する。(productはPlantクラスのインスタンス)
        const liText = `${product.japanese_name} ${product.addCommaToPrice()}円 x ${product.quantity}個 ・・・ ${product.addCommaToPrice(product.calculateTotalPrice())}円`;
        liDiv.textContent = liText;

        totalPrice += product.calculateTotalPrice();
        
        productLi.appendChild(liDiv);
        cartListUl.appendChild(productLi);

    });

    cartSummaryDiv.appendChild(cartListUl);

    totalPriceSpan.textContent = `${addCommaToPrice(totalPrice)}円`;
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
function displayCartProducts(user, classifiedProducts) {

    console.log(classifiedProducts);
    classifiedProducts.map((product, index) => {

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
        productPrice.textContent = `小売価格: ${product.addCommaToPrice()} 円`;
        productPrice.classList.add('col');

        // 数量
        const productQuantityDiv = document.createElement('div');
        productQuantityDiv.classList.add('col', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'gap-2', 'flex-md-row');
        const productQuantityLabel = document.createElement('label');
        productQuantityLabel.setAttribute('for', 'quantity');
        productQuantityLabel.textContent = '数量';
        const productQuantity = document.createElement('input');
        productQuantity.value = product.quantity;
        productQuantity.type = 'number';
        productQuantity.classList.add('form-control');
        productQuantity.classList.add('col');
        productQuantity.addEventListener('change', (event) => {
            handleQuantityChange(user, product, event.target.value);
        });
        productQuantityDiv.appendChild(productQuantityLabel);
        productQuantityDiv.appendChild(productQuantity);

        // 合計金額
        const totalPrice = document.createElement('div');
        totalPrice.textContent = `合計: ${product.addCommaToPrice(product.price * product.quantity)} 円`;
        totalPrice.classList.add('col');

        // 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('btn', 'btn-outline-danger');
        deleteButton.classList.add('col');
        deleteButton.addEventListener('click', () => {
            handleDeleteProductFromCart(user, product, classifiedProducts);
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

    let products = classfiedUser.products_in_cart || [];
    const classifiedProducts = createClassifiedProducts(products);

    displayCartProducts(classfiedUser, classifiedProducts);

    displayCartList(classfiedUser, classifiedProducts);

    const purchaseButton = document.querySelector('#purchase-button');
    purchaseButton.addEventListener('click', () => {
        handlePurchase(classfiedUser, classifiedProducts);
    });


});
