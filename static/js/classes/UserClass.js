import fetchUserData  from "../utils/fetchJson.js";

class User {

    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.user_id = null;
    }

    // ユーザーを登録するためのメソッド。
    register() {
        // inputデータからユーザデータを作成。
        const data = {
            email: this.email,
            password: this.password
        };

        try {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            // ユーザーが存在しない場合、新しいユーザーを追加。
            if (!this.verifyUser(users)) {
                users.push({email: this.email, password: this.password});
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
        return this.verifyUser(data);
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