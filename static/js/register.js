import User from "./classes/UserClass.js";

const registerUser = async () => {
    // inputデータを変数化。
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const firstName = document.querySelector('#first-name').value;
    const lastName = document.querySelector('#last-name').value;
    const phoneNumber = document.querySelector('#phone').value;
    const address = document.querySelector('#address').value;

    const user = new User(email, password, firstName, lastName, phoneNumber, address);

    user.register();

    console.log('User registered successfully');

    user.login();
}

document.querySelector('#register-form').addEventListener('submit', e => {
    e.preventDefault();
    registerUser();
})