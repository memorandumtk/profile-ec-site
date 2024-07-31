import { createUserClassFromEmail } from "./utils/createUserClassFromEmail.js";
import User from "/static/js/classes/UserClass.js";
import fetchData from "/static/js/utils/fetchJson.js";

/**
 * ログイン処理を行う関数
 */
const userLogIn = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Userクラスのインスタンスを作成し、login()メソッドを呼び出す。
    const user = new User(email, password);
    user.login();
}

/**
 * ログインフォームが送信されたときに実行される関数
 */
document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    userLogIn();
})

/**
 * サンプルユーザーデータをローカルストレージに保存する関数
 */
const storeSampleUserData = async () => {
    const data = await fetchData();
    localStorage.setItem('users', JSON.stringify(data));
}

window.onload = () => {

    const sampleUserData = localStorage.getItem('users');

    // ログイン時にローカルストレージにサンプルユーザーデータがない場合、データを保存。
    if (!sampleUserData) {
        storeSampleUserData();
    }

}