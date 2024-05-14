import User from "./classes/UserClass.js";

const registerUser = async () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const user = new User(email, password);

    user.register();
}

document.querySelector('#register-form').addEventListener('submit', e => {
    e.preventDefault();
    registerUser();
})