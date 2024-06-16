
/**
 * 引数であるユーザのEmail情報とマッチするローカルストレージのユーザの情報をアップデートし、ローカルストレージに再度保存する。
 * @param {Object} user - ログインユーザー
 */
export function updateUserDataOnLocalStorage(user) {
    const users = JSON.parse(localStorage.getItem('users'));
    const index = users.findIndex(user => user.email === user.email);
    users[index] = user;
    localStorage.setItem('users', JSON.stringify(users));

}