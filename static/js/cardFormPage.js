import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';

const cardNameInput = document.querySelector('#card-name');
const cardNumberInput = document.querySelector('#card-number');
const expirationDateInput = document.querySelector('#card-expiration-date');
const cvvInput = document.querySelector('#card-cvv');
const cardForm = document.querySelector('#card-form');
const inputForMasking = document.querySelector('#card-cvv-masking-input');
const meesageElement = document.querySelector('#card-form-page-massage');

/**
 * クレジットカード画面の各フォームにイベントリスナーを追加する関数
 */
const createForm = (user) => {
    cardNumberInput.addEventListener('input', function (event) {
        let input = event.target.value.replace(/\D/g, '');
        input = input.substring(0, 16); // Limit to 16 digits
        input = input.replace(/(.{4})/g, '$1 '); // Add a space every 4 digits
        event.target.value = input.trim();
    });

    cvvInput.addEventListener('input', function (event) {
        // ２つのInputを重ねて、実際のInputは非表示にして、マスク用のInputを表示する。
        let input = event.target;
        const actualValue = input.value.replace(/\D/g, '').substring(0, 3); // Limit to 3 digits
        let maskValue = actualValue.replace(/./g, '#');

        console.log('actualValue: ', actualValue);
        input.value = actualValue; 
        inputForMasking.textContent = maskValue;
    });
}

/**
 * クレジットカードフォームが送信されたときに実行される関数
 */
const handleMypageFormSubmit = (event, user) => {
    try {
        let formData = new FormData(cardForm);
        for (let entry of formData) {
            console.log(entry);
        }
        if (cardNameInput.value === '' || cardNumberInput.value === '' || expirationDateInput.value === '' || cvvInput.value === '') {
            throw new Error('クレジットカード情報を全て入力してください。');
        }
        let cardInfo;
        cardInfo = {
            holder_name: cardNameInput.value,
            card_number: cardNumberInput.value.trim().replace(/\s/g, ''),
            expiration_date: expirationDateInput.value,
            cvv: cvvInput.value
        }
        if (cardInfo.card_number.length !== 16) {
            throw new Error('カード番号は16桁で入力してください。');
        }
        if (cardInfo.cvv.length !== 3) {
            throw new Error('セキュリティコードは3桁で入力してください。');
        }
        if (cardInfo.holder_name.length < 1) {
            throw new Error('カード名義を入力してください。');
        }
        user.card_information = cardInfo;
        user.payment_method = 'card';
        updateUserDataOnLocalStorage(user);
        alert('クレジットカード情報を更新しました。');
        window.location.href = '/views/html/mypage.html';
    } catch (error) {
        console.error(error);
        alert('クレジットカード情報の更新に失敗しました。');
    }
}


/**
 * ページが読み込まれたときに実行される関数
 */
window.addEventListener('load', () => {

    // ログインしているユーザーを取得し、クラス化したユーザーを取得する。
    const loginUserEmail = sessionStorage.getItem('login_user');
    const classfiedUser = createUserClassFromEmail(loginUserEmail);

    console.log(classfiedUser)

    if (classfiedUser.is_logged_in) {

        createForm(classfiedUser);

        cardForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleMypageFormSubmit(event, classfiedUser);
        });

        meesageElement.textContent = `${classfiedUser.last_name} ${classfiedUser.first_name} さんのカード情報入力画面`
    }

});
