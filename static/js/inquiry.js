import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';
import { checkDarkMode } from './utils/checkDarkMode.js';

const inquiryName = document.querySelector('#inquiry-name');
const inquiryEmail = document.querySelector('#inquiry-email');
const inquiryText = document.querySelector('#inquiry-text');
const inquiryForm = document.querySelector('#inquiry-form');
const inquiryButton = document.querySelector('#inquiry-button');

/**
 * お問い合わせフォームの入力内容をユーザがログインしているかによって変える関数
 * @param {*} user 
 */
const formDisplay = (user) => {
    if (user.is_logged_in) {
        const fullName = user.first_name + ' ' + user.last_name;
        inquiryName.value = fullName;
        inquiryEmail.value = user.email;
        
        const inquiry_history = user.inquiry_history;
        if (inquiry_history[inquiry_history.length - 1].status === "draft") {
            inquiryText.value = inquiry_history[inquiry_history.length - 1].inquiry_content;
        }
    }
}

/**
 * お問い合わせフォームが送信されたときに実行される関数
 * ***現在は、お問い合わせ内容が空でも送信されるようになっている。***
 */
const handleInquiryFormSubmit = (event, user) => {
    let formData = new FormData(inquiryForm);
    formData.append('status', 'sent');
    for (let entry of formData) {
        console.log(entry);
    }
    user.inquiry_history.push(Object.fromEntries(formData));
    updateUserDataOnLocalStorage(user);
    inquiryText.value = '';
    console.log(user);
    alert('お問い合わせを受け付けました。');
}

const adjustButtonColor = () => {
    if (checkDarkMode()) {
        inquiryButton.classList.add('btn-outline-dark');
    } else {
        inquiryButton.classList.add('btn-outline-secondary');
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

    if (classfiedUser && classfiedUser.is_logged_in) {
        formDisplay(classfiedUser);
    }

    inquiryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleInquiryFormSubmit(event, classfiedUser);
    });

    adjustButtonColor();
});
