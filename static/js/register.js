import RegisterUser from "./classes/RegisterUserClass";

const registerUser = async () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const user = new RegisterUser(email, password);

    console.log(user.getName());
    console.log(user.getEmail());
    console.log(user.getPassword());

}

document.querySelector('#register-form').addEventListener('submit', e => {
    e.preventDefault();
    registerUser();
})