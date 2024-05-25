import Plant from './classes/PlantClass.js';
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import User from './classes/UserClass.js';

const productImage = document.querySelector('#product-image');
const productName = document.querySelector('#product-name');
const productPrice = document.querySelector('#product-price');
const totalPrice = document.querySelector('#total-price');
const numberOfPurchase = document.querySelector('#number-of-purchase');
const productDescription = document.querySelector('#product-description');
const productCode = document.querySelector('#product-code');


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
        let classifiedPlant = Object.assign(new Plant(), plant);

        plantsData.push(classifiedPlant);
    });

    return plantsData;
}


/**
 * 商品の情報をHTMLのエレメントに表示する関数
 */
function displayProductInfo(plant) {
    console.log(plant.japanese_name);
    productImage.src = plant.image_url;
    productName.textContent = plant.japanese_name;
    productPrice.textContent = plant.price;
    productDescription.textContent = plant.description;
    totalPrice.textContent = plant.price;
    productPrice.textContent = plant.price;
    productCode.textContent = plant.id;

    numberOfPurchase.value = 1;
    numberOfPurchase.addEventListener('change', () => {
        totalPrice.textContent = plant.price * numberOfPurchase.value;
    })
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
 * カートに商品を追加する関数で、「カートに入れる」ボタンをクリックしたときに実行される。
 * カートに同じ商品があるときの処理も後で必要 *******
 */
function addToCart(user) {
    const product = {
        id: productCode.textContent,
        japanese_name: productName.textContent,
        price: productPrice.textContent,
        quantity: numberOfPurchase.value,
        image_url: productImage.src,
    }

    const cart = user.products_in_cart || [];
    cart.push(product);
    console.log(user);

    // ユーザ情報の更新
    updateUsersData(user);

    // カートページにリダイレクト
    window.location.href = '/cart.html';
}


/**
 * ページが読み込まれたときに実行される関数
 */
window.addEventListener('load', () => {

    const slugValue = getQueryParam('slug');
    console.log(slugValue);

    const classifiedPlants = createclassifiedData([]);

    // plantは既にクラス化されている状態。
    const plant = classifiedPlants.find(plant => plant.slug === slugValue);
    console.log(plant);
    displayProductInfo(plant);

    // ログインしているユーザーを取得し、クラス化したユーザーを取得する。
    const loginUserEmail = sessionStorage.getItem('login_user') || 'test@mail.com';
    const classfiedUser = createUserClassFromEmail(loginUserEmail);


    const cartButton = document.querySelector('#cart-button');
    cartButton.addEventListener('click', () => {
        addToCart(classfiedUser);
    });

    console.log('User data from local storage and cleassified as User class:');
    console.log(classfiedUser)

});
