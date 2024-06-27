
import { createUserClassFromEmail } from './utils/createUserClassFromEmail.js';

const elementsForLoggedIn = document.querySelectorAll('.logged-in');
const elementsForNotLoggedIn = document.querySelectorAll('.not-logged-in');

const logoutAnchor = document.querySelector('#logout');
const dropdownOfUser = document.querySelector('.user-email-dropdown');
const dropdownOfLiElement = document.querySelector('#user-email-dropdown-li');

/**
 * ユーザがログインしているかによって、ヘッダーの表示を変える関数
 */
const headerDisplay = (user) => {
    if (user && user.is_logged_in) {
        elementsForLoggedIn.forEach(element => {
            element.classList.remove('d-none');
        });
        elementsForNotLoggedIn.forEach(element => {
            element.classList.add('d-none');
        });
        dropdownOfLiElement.classList.remove('d-none');

        // ドロップダウンにユーザのメールアドレスを表示する。
        dropdownOfUser.textContent = user.email;

    } else {
        elementsForLoggedIn.forEach(element => {
            element.classList.add('d-none');
        });
        elementsForNotLoggedIn.forEach(element => {
            element.classList.remove('d-none');
        });
        dropdownOfLiElement.classList.add('d-none');
    }
}

/**
 * ログアウトボタンがクリックされたときに実行される関数
 */
const handleLogout = (user) => {
    user.logout();
}

/**
 * ページが読み込まれたときに実行される関数
 */
window.addEventListener('load', () => {

    // ログインしているユーザーを取得し、クラス化したユーザーを取得する。
    const loginUserEmail = sessionStorage.getItem('login_user');
    const classfiedUser = createUserClassFromEmail(loginUserEmail);

    console.log(classfiedUser)

    headerDisplay(classfiedUser);
    
    logoutAnchor.addEventListener('click', () => {
        handleLogout(classfiedUser);
    });
    
});
