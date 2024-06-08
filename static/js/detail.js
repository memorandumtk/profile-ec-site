import Plant from './classes/PlantClass.js';
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import User from './classes/UserClass.js';
import { updateUserDataFromLocalStorage } from './utils/updateUserDataFromLocalStorage.js';

const productImage = document.querySelector('#product-image');
const productName = document.querySelector('#product-name');
const productPrice = document.querySelector('#product-price');
const totalPrice = document.querySelector('#total-price');
const productQuantity = document.querySelector('#product-quantity');
const productPriceAndQuantity = document.querySelector('#product-price-and-quantity');
const productDescription = document.querySelector('#product-description');
const productCode = document.querySelector('#product-code');
const productLikedIcon = document.querySelector('#liked-icon');



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
 * いいね（スターアイコン）がクリックされたときに実行される関数
 */
function handleLikeIconClick(user) {
    if (productLikedIcon.classList.contains('fa-star')) {
        productLikedIcon.classList.remove('fa-star');
        productLikedIcon.classList.add('fa-star-o');
        user.liked_products = user.liked_products.filter(product => product !== productCode.textContent);
    } else {
        productLikedIcon.classList.remove('fa-star-o');
        productLikedIcon.classList.add('fa-star');
        user.liked_products.push(productCode.textContent);
    }
    updateUserDataFromLocalStorage(user);
    console.log(user);
}

/**
 * 商品の情報をHTMLのエレメントに表示する関数
 */
function displayProductInfo(plant, user) {
    console.log(plant.japanese_name);
    productImage.src = plant.image_url;
    productName.textContent = plant.japanese_name;
    if (user.liked_products.includes(plant.id.toString())) {
        productLikedIcon.classList.add('fa', 'fa-star');
        console.log('liked');
    } else {
        productLikedIcon.classList.add('fa', 'fa-star-o');
        console.log('not liked');
    }
    productLikedIcon.addEventListener('click', () => {
        handleLikeIconClick(user);
    });
    productPrice.textContent = plant.price;
    productDescription.textContent = plant.description;
    totalPrice.textContent = plant.price;
    productPrice.textContent = plant.price;
    productCode.textContent = plant.id;
    productPriceAndQuantity.classList.add('d-flex', 'justify-content-center', 'align-items-center')

    productQuantity.value = 1;
    productQuantity.addEventListener('change', () => {
        totalPrice.textContent = plant.price * productQuantity.value;
    })
}


/**
 * カートに商品を追加する関数で、「カートに入れる」ボタンをクリックしたときに実行される。
 */
function addToCart(user) {
    const product = {
        id: productCode.textContent,
        japanese_name: productName.textContent,
        price: productPrice.textContent,
        quantity: productQuantity.value,
        image_url: productImage.src,
    }

    const cart = user.products_in_cart || [];
    // カートに商品が存在するかどうかを確認
    let isExist = false;
    // カートに商品が存在する場合、数量を更新する
    cart.map((product, index) => {
        if (product.id === productCode.textContent) {
            product.quantity = parseInt(product.quantity) + parseInt(productQuantity.value);
            isExist = true;
            return;
        }
    })
    if (!isExist) cart.push(product); // カートに商品が存在しない場合、商品を追加する
    console.log(user);

    // ユーザ情報の更新
    updateUserDataFromLocalStorage(user);

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
        addToCart(classfiedUser);
    });

});
