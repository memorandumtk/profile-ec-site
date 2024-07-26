import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';
import { updateUserDataOnLocalStorage } from './utils/updateUserDataOnLocalStorage.js';
import { checkDarkMode } from './utils/checkDarkMode.js';

const inquiryName = document.querySelector('#inquiry_name');
const inquiryEmail = document.querySelector('#inquiry_email');
const inquiryText = document.querySelector('#inquiry_text');
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
        
        const inquiryHistory = user.inquiry_history;
        if (inquiryHistory && inquiryHistory[inquiryHistory.length - 1].status === "draft") {
            inquiryText.value = inquiryHistory[inquiryHistory.length - 1].inquiry_content;
        }
    }
}

/**
 * お問い合わせフォームが送信されたときに実行される関数
 */
const handleInquiryFormSubmit = (event, user) => {

    // ユーザがログインしていない場合は、フォームの内容を保存できないため、お問い合わせを受け付けたイメージで、アラートを表示する
    if (!user) {
        alert('お問い合わせを受け付けました。');
        return;
    }

    // FormDataにinquiryFormを引数として指定することで、フォームの内容を格納する
    let formData = new FormData(inquiryForm);
    // お問い合わせ内容が空の場合は送信しない
    if (formData.get('inquiry_text') === '') {
        alert('お問い合わせ内容を入力してください。');
        return;
    
    }
    // お問い合わせ内容を送信した場合、statusを'sent'に変更する
    formData.append('status', 'sent');
    for (let entry of formData) {
        console.log(entry);
    }
    if (!user.inquiry_history) {
        user.inquiry_history = [];
    }
    user.inquiry_history.push(Object.fromEntries(formData));
    updateUserDataOnLocalStorage(user);
    inquiryText.value = '';
    console.log(user);
    alert('お問い合わせを受け付けました。');
}

/**
 * お問い合わせボタンの色を調整する関数
 */
const adjustButtonColor = () => {
    if (checkDarkMode()) {
        inquiryButton.classList.add('btn-light');
    } else {
        inquiryButton.classList.add('btn-secondary', 'text-white');
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
