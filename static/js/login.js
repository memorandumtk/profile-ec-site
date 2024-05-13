import LoginUser from "/static/js/classes/LoginUser.js";

const userLogIn = async () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Userクラスのインスタンスを作成し、login()メソッドを呼び出す。
    const user = new LoginUser(email, password);
    const isTheUserVerified = await user.login();

    // ユーザーが認証されたかどうかを確認。
    if (isTheUserVerified) {
        console.log('User is verified');
        // ユーザーが認証された場合、セッションを保存。
        user.storeSession();
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