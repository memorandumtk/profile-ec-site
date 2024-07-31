
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';
import { checkDarkMode } from './utils/checkDarkMode.js';

const lastNameInput = document.getElementById('last-name');
const firstNameInput = document.getElementById('first-name');
const phoneNumberInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const emailInput = document.getElementById('email');
const paymentMethodCashRadio = document.getElementById('payment-method-cash');
const paymentMethodCardRadio = document.getElementById('payment-method-card');
const linkToCardForm = document.getElementById('link-to-card-form');
const mypageForm = document.getElementById('mypage-form');
const saveButton = document.getElementById('save-button');

/**
 * マイページ画面の各フォームにユーザー情報を表示する関数
 */
const formDisplay = (user) => {
    if (user.is_logged_in) {
        lastNameInput.value = user.last_name;
        firstNameInput.value = user.first_name;
        phoneNumberInput.value = user.phone_number;
        addressInput.value = user.address;
        emailInput.value = user.email;
        paymentMethodCardRadio.addEventListener('change', () => {
            linkToCardForm.classList.remove('d-none');
        });
        paymentMethodCashRadio.addEventListener('change', () => {
            linkToCardForm.classList.add('d-none');
        });

        if (user.payment_method === 'card') {
            paymentMethodCardRadio.checked = true;
            linkToCardForm.classList.remove('d-none');
        } else {
            paymentMethodCashRadio.checked = true;
        }
    }
}

/**
 * マイページフォームが送信されたときに実行される関数
 */
const handleMypageFormSubmit = (event, user) => {
    let formData = new FormData(mypageForm);
    for (let entry of formData) {
        console.log(entry);
    }
    user.last_name = formData.get('last-name');
    user.first_name = formData.get('first-name');
    user.phone_number = formData.get('phone');
    user.address = formData.get('address');
    user.email = formData.get('email');
    user.payment_method = formData.get('payment-method');
    // cash(現金払い)が選択された時は、クレジットカードのCVV情報を削除する。
    if (user.payment_method === 'cash') {
        user.card_information = {};
    }
    updateUserDataOnLocalStorage(user);
    alert('マイページ情報を更新しました。');
}

/**
 * 送信ボタンの色を調整する関数
 */
const adjustButtonColor = () => {
    if (checkDarkMode()) {
        saveButton.classList.add('btn-light');
    } else {
        saveButton.classList.add('btn-secondary', 'text-white');
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

    formDisplay(classfiedUser);

    mypageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleMypageFormSubmit(event, classfiedUser);
    });

    adjustButtonColor();
});
