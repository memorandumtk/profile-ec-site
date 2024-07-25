import Plant from './classes/PlantClass.js';
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import User from './classes/UserClass.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';

const productImage = document.querySelector('#product-image');
const productName = document.querySelector('#product-name');
const productPrice = document.querySelector('#product-price');
const totalPrice = document.querySelector('#total-price');
const totalPriceDiv = document.querySelector('#total-price-div');
const productQuantity = document.querySelector('#product-quantity');
const productDescription = document.querySelector('#product-description');
const productCode = document.querySelector('#product-code');
const productLikedIcon = document.querySelector('#liked-icon');
const twitterShareButton = document.querySelector('#twitter-share-button');
const facebookShareButton = document.querySelector('#facebook-share-button');
const lineShareButton = document.querySelector('#line-share-button');


/**
 * クエリパラメータを取得する関数
 * @param {string} param 
 * @returns {string}
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * 植物のすべての情報を取得する関数
 * @param {Array} plantsData
 */
function createclassifiedData(plantsData) {
    const plants = JSON.parse(localStorage.getItem('plants'));

    plants.map((plant, index) => {
        let classifiedPlant = new Plant()

        Object.assign(classifiedPlant, plant);

        plantsData.push(classifiedPlant);
    });

    return plantsData;
}

/**
 * URLを取得する関数
 */
function getUrl() {
    const url = window.location.href;
    return url;
}

/**
 * SNSシェア用リンクを作成し埋め込む関数 Twitter
 */
function createLinkToShareTwitter() {
    const anchor = twitterShareButton.querySelector('a');
    anchor.href = `https://twitter.com/share?url=${getUrl()}&text=この商品がおすすめ!:${productName.textContent}`;
    anchor.target = '_blank';
}
/**
 * SNSシェア用リンクを作成し埋め込む関数 Facebook
 */
function createLinkToShareFacebook() {
    const anchor = facebookShareButton.querySelector('a');
    anchor.href = `https://www.facebook.com/sharer/sharer.php?u=${getUrl()}`;
    anchor.target = '_blank';
}
/**
 * SNSシェア用リンクを作成し埋め込む関数 LINE
 */
function createLinkToShareLINE() {
    const anchor = lineShareButton.querySelector('a');
    anchor.href = `https://social-plugins.line.me/lineit/share?url=${getUrl()}&text=この商品がおすすめ!${productName.textContent}`;
    anchor.target = '_blank';
}


/**
 * いいね（スターアイコン）がクリックされたときに実行される関数
 */
function handleLikeIconClick(user) {
    if (productLikedIcon.classList.contains('fa-star')) {
        productLikedIcon.classList.remove('fa-star');
        productLikedIcon.classList.add('fa-star-o');
        // textContentはstring型なので、Number型に変換する。
        user.liked_products = user.liked_products.filter(product => product !== Number(productCode.textContent));
    } else {
        productLikedIcon.classList.remove('fa-star-o');
        productLikedIcon.classList.add('fa-star');
        // textContentはstring型なので、Number型に変換する。
        user.liked_products.push(Number(productCode.textContent));
    }
    updateUserDataOnLocalStorage(user);
    console.log(user);
}

/**
 * 商品の情報をHTMLのエレメントに表示する関数
 */
function displayProductInfo(plant, user) {
    console.log(plant.japanese_name);
    productImage.src = plant.image_url;
    productName.textContent = plant.japanese_name;
    if (user.liked_products.includes(plant.id)) {
        productLikedIcon.classList.add('fa', 'fa-star');
        console.log('liked');
    } else {
        productLikedIcon.classList.add('fa', 'fa-star-o');
        console.log('not liked');
    }
    productLikedIcon.addEventListener('click', () => {
        handleLikeIconClick(user);
    });
    productDescription.textContent = plant.description;
    productQuantity.value = 1;
    totalPrice.textContent = plant.addYenMarkToPrice(plant.addCommaToPrice(plant.price * productQuantity.value));
    productPrice.textContent = plant.addYenMarkToPrice();
    productCode.textContent = plant.id;

    productQuantity.addEventListener('change', () => {
        if (productQuantity.value < 1) {
            totalPriceDiv.classList.add('d-none');
        } else if (productQuantity.value >= 1) {
            totalPriceDiv.classList.remove('d-none');
        }
        totalPrice.textContent = plant.addYenMarkToPrice(plant.addCommaToPrice(plant.price * productQuantity.value));
    })
}


/**
 * カートに商品を追加する関数で、「カートに入れる」ボタンをクリックしたときに実行される。
 */
function addToCart(plant, user) {
    // Plantクラスのメソッドを使い、カートに追加する商品の情報を作成する
    const cartItem = plant.createCartItem(productQuantity.value);

    console.log('this is cartItem', cartItem);

    const cart = user.products_in_cart || [];
    // カートに商品が存在するかどうかを確認
    let isExist = false;
    // カートに商品が存在する場合、数量を更新する
    cart.forEach((product, index) => {
        if (product.id === plant.id) {
            product.quantity = parseInt(product.quantity) + parseInt(cartItem.quantity);
            isExist = true;
            return;
        }
    })
    if (!isExist) cart.push(cartItem); // カートに商品が存在しない場合、商品を追加する
    console.log(user);

    // ユーザ情報の更新
    updateUserDataOnLocalStorage(user);

    // カートページにリダイレクト
    window.location.href = '/cart.html';
}


/**
 * ページが読み込まれたときに実行される関数
 */
window.addEventListener('load', () => {

    // クエリパラメータを取得
    const slugValue = getQueryParam('slug');
    console.log(slugValue);

    // ログインしているユーザーを取得し、クラス化したユーザーを取得する。
    const loginUserEmail = sessionStorage.getItem('login_user') || 'test@mail.com';
    const classfiedUser = createUserClassFromEmail(loginUserEmail);
    console.log('User data from local storage and cleassified as User class:');
    console.log(classfiedUser)


    const classifiedPlants = createclassifiedData([]);

    // plantは既にクラス化されている状態。
    const plant = classifiedPlants.find(plant => plant.slug === slugValue);
    console.log(plant);
    displayProductInfo(plant, classfiedUser);

    const cartButton = document.querySelector('#cart-button');
    cartButton.addEventListener('click', () => {
        addToCart(plant, classfiedUser);
    });

    // SNSシェア用リンクを作成し、リンクをanchorタグに設定する
    createLinkToShareTwitter();
    createLinkToShareFacebook(); 
    createLinkToShareLINE();
});
