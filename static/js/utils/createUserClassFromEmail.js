import { User } from '../classes/User.js';

/**
 * ローカルストレージに保存されているユーザーデータからemailを検索してユーザー情報を取得。
 * 取得したユーザデータを元にUserクラスのインスタンスを生成する。
 * @param {*} email 
 * @returns 
 */
export function createUserClassFromEmail(email) {
    userData = JSON.parse(localStorage.getItem('userData'));

    // ローカルストレージにユーザーデータがある場合、ユーザーデータからemailを検索してユーザー情報を取得
    if (userData) {
        const user = userData.find(user => user.email === email);
        return user;
    }

}