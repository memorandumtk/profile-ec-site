import User from '../classes/UserClass.js';

/**
 * ローカルストレージに保存されているユーザーデータからemailを検索してユーザー情報を取得。
 * 取得したユーザデータを元にUserクラスのインスタンスを生成する。
 * @param {*} email 
 * @returns 
 */
export function createUserClassFromEmail(email) {
    const userData = JSON.parse(localStorage.getItem('users'));

    // ローカルストレージにユーザーデータがある場合、ユーザーデータからemailを検索してユーザー情報を取得
    if (userData) {
        const user = userData.find(user => user.email === email);

        if (user){
            return Object.assign(new User(), user);
        } else {
            console.log('User not found');
        }
    }

    return null;
}