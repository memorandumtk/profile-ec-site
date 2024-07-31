import User from "./classes/UserClass.js";

const registerUser = async () => {
    // inputデータを変数化。
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phoneNumber = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // バリデーション
    if (email === '' || password === '' || firstName === '' || lastName === '' || phoneNumber === '' || address === '') {
        alert('全ての項目を入力してください。');
        return;
    }

    const user = new User(email, password, firstName, lastName, phoneNumber, address);

    user.register();

    console.log('User registered successfully');

    user.login();
}

document.getElementById('register-form').addEventListener('submit', e => {
    e.preventDefault();
    registerUser();
})