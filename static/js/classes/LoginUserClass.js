import fetchUserData  from "../utils/fetchJson.js";
class LoginUser {

    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.user_id = null
    }

    async login() {
        // awaitを使ってfetchUserData()メソッドの処理が終わるまで待つように。
        const data = await fetchUserData();
        console.log(data);

        return this.verifyUser(data);
    }

    verifyUser(data) {
        // ユーザーが認証されたかどうかを示すフラグを作成。
        let isLoginSuccessful = false;
        // データを反復処理し、ユーザーが存在するかどうかを確認。
        for (let user of data) {
            if (user.email === this.email && user.password === this.password) {
                isLoginSuccessful = true;
                this.user_id = user.id; 
                break;
            }
        }
    
        if (!isLoginSuccessful) {
            console.log('Email or password is incorrect');
            }
        return isLoginSuccessful;
    }

    storeSession() {
        // セッションストレージにユーザーのメールアドレスを保存。
        const sessionKey = `user_${this.user_id}`;
        sessionStorage.setItem(sessionKey, this.email);
    }
}

export default LoginUser;