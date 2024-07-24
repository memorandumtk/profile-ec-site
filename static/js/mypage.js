
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';

const lastNameInput = document.querySelector('#last-name');
const firstNameInput = document.querySelector('#first-name');
const phoneNumberInput = document.querySelector('#phone');
const addressInput = document.querySelector('#address');
const emailInput = document.querySelector('#email');
const paymentMethodCashRadio = document.querySelector('#payment-method-cash');
const paymentMethodCardRadio = document.querySelector('#payment-method-card');
const linkToCardForm = document.querySelector('#link-to-card-form');
const mypageForm = document.querySelector('#mypage-form');

/**
 * マイページ画面の各フォームにユーザー情報を表示する関数
 * *** cardInfoInput は未実装。 ***
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
        user.card_infomaion = {};
    }
    updateUserDataOnLocalStorage(user);
    alert('マイページ情報を更新しました。');
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

});
