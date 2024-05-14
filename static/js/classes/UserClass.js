import fetchUserData  from "../utils/fetchJson.js";

class User {

    constructor(email,password, firstName = null, lastName = null, phoneNumber = null, address = null) {
        this.email = email;
        this.password = password;
        this.user_id = null;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    // ユーザーを登録するためのメソッド。
    register() {
        // inputデータからユーザデータを作成。

        try {
            let users = JSON.parse(localStorage.getItem('users')) || [];

            // ユーザーが存在しない場合、新しいユーザーを追加。ログインでも使うverifyUserメソッドを使って、ユーザーが存在するかどうかを確認。
            if (!this.verifyUser(users)) {

                const newUser = {
                    id: users.length + 1,
                    email: this.email,
                    password: this.password,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    phoneNumber: this.phoneNumber,
                    address: this.address,
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

    // ユーザーがログインできるかどうかを確認するためのメソッド。
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

    storeUserDataToSession() {
        // セッションストレージにユーザーのメールアドレスを保存。
        sessionStorage.setItem('login_user', this.email);
    }
}

export default User;