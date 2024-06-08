import { createUserClassFromEmail } from "./utils/createUserClassFromEmail.js";
import User from "/static/js/classes/UserClass.js";
import fetchData from "/static/js/utils/fetchJson.js";

const LogoutButton = document.querySelector('#logout-button');

const userLogIn = async () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Userクラスのインスタンスを作成し、login()メソッドを呼び出す。
    const user = new User(email, password);
    user.login();
}

document.querySelector('#login-form').addEventListener('submit', e => {
    e.preventDefault();
    userLogIn();
})

const storeSampleUserData = async () => {
    const data = await fetchData();
    localStorage.setItem('users', JSON.stringify(data));
}

const createLogoutButton = (user) => {
    LogoutButton.attributes.removeNamedItem('hidden');
    LogoutButton.addEventListener('click', () => {
        user.logout();
    })
}

window.onload = () => {

    const sampleUserData = localStorage.getItem('users');

    // ログイン時にローカルストレージにサンプルユーザーデータがない場合、データを保存。
    if (!sampleUserData) {
        storeSampleUserData();
    }

    // ログインユーザーが存在する場合、ログアウトボタンを表示
    if (sessionStorage.getItem('login_user')) {
        const classfiedUser = createUserClassFromEmail(sessionStorage.getItem('login_user'));
        createLogoutButton(classfiedUser);
    }
    
}