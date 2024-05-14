import User from "/static/js/classes/UserClass.js";
import fetchUserData from "/static/js/utils/fetchJson.js";

const userLogIn = async () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Userクラスのインスタンスを作成し、login()メソッドを呼び出す。
    const user = new User(email, password);
    const isTheUserVerified = await user.login();

    // ユーザーが認証されたかどうかを確認。
    if (isTheUserVerified) {
        console.log('User is verified');
        // ユーザーが認証された場合、セッションを保存。
        user.storeUserDataToSession();
        // ログイン後のページにリダイレクト。
        window.location.href = '/home.html';

    } else {
        console.log('User is not verified');
    }
}

document.querySelector('#login-form').addEventListener('submit', e => {
    e.preventDefault();
    userLogIn();
})

const storeSampleUserData = async () => {
    const data = await fetchUserData();
    localStorage.setItem('users', JSON.stringify(data));
}

window.onload = () => {

    const sampleUserData = localStorage.getItem('users');

    // ログイン時にローカルストレージにサンプルユーザーデータがない場合、データを保存。
    if (!sampleUserData) {
        storeSampleUserData();
    }
}