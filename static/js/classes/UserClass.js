import fetchUserData from "../utils/fetchJson.js";

class User {

    constructor(email, password, firstName = null, lastName = null, phoneNumber = null, address = null) {
        this.email = email;
        this.password = password;
        this.user_id = null;
        this.first_name = firstName;
        this.last_name = lastName;
        this.phone_number = phoneNumber;
        this.address = address;
    }

    /**
     * ユーザーを登録するためのメソッド。
     */
    register() {

        try {
            let users = JSON.parse(localStorage.getItem('users')) || [];

            // ユーザーが存在しない場合、新しいユーザーを追加。ログインでも使うverifyUserメソッドを使って、ユーザーが存在するかどうかを確認。verifyUserがfalseを返す場合、emailは存在しないため、新しいユーザーを追加できる。
            if (!this.verifyUser(users)) {

                const newUser = {
                    id: users.length + 1,
                    email: this.email,
                    password: this.password,
                    first_name: this.first_name,
                    last_name: this.last_name,
                    phone_number: this.phone_number,
                    address: this.address,
                    liked_products: [],
                    purchase_method: null,
                    products_in_cart: [],
                };
                console.log(newUser);
                // newUserをusers Arrayに追加。
                users.push(newUser);
                console.log(users);
                localStorage.setItem('users', JSON.stringify(users));

                console.log("User registered successfully");
            } else {
                throw new Error("User already exists");
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * ユーザーがログインできるかどうかを確認するためのメソッド。
     */
    async login() {
        const data = JSON.parse(localStorage.getItem('users'));
        console.log(data);

        let isTheUserVerified = this.verifyUser(data);

        // ユーザーが認証されたかどうかを確認。
        if (isTheUserVerified) {
            console.log('User is verified');
            // ユーザーが認証された場合、セッションを保存。
            this.storeUserDataToSession();
            // ログイン後のページにリダイレクト。
            window.location.href = '/home.html';

        } else {
            console.log('User is not verified');
        }

    }

    /**
     * ユーザ情報の認証を行うためのメソッド。
     * @param {*} data 
     * @returns 
     */
    verifyUser(data) {
        // ユーザーが認証されたかどうかを示すフラグを作成。
        let isVerifiyingSuccessful = false;
        // データを反復処理し、ユーザーが存在するかどうかを確認。
        for (let user of data) {
            if (user.email === this.email && user.password === this.password) {
                isVerifiyingSuccessful = true;
                this.user_id = user.id;
                break;
            }
        }

        if (!isVerifiyingSuccessful) {
            console.log('Email or password is incorrect or user does not exist.');
        }

        return isVerifiyingSuccessful;
    }

    /**
     * セッションストレージにユーザデータを挿入する。
     */
    storeUserDataToSession() {
        // セッションストレージにユーザーのメールアドレスを保存。
        sessionStorage.setItem('login_user', this.email);
    }

}

export default User;