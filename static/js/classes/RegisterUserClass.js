class RegisterUser {

    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    async register() {
        const data = await fetchUserData();
        console.log(data);
    }

    setName(name) {
        this.name = name;
    }

    setEmail(email) {
        this.email = email;
    }

    setPassword(password) {
        this.password = password;
    }

    getName() {
        return this.name;
    }

    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }
}

export default RegisterUser;