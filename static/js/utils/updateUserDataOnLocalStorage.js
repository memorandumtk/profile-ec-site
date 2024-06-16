
/**
 * 引数であるユーザのEmail情報とマッチするローカルストレージのユーザの情報をアップデートし、ローカルストレージに再度保存する。
 * @param {Object} user - ログインユーザー
 */
export function updateUserDataOnLocalStorage(loginUser) {
    const users = JSON.parse(localStorage.getItem('users'));
    const index = users.findIndex(user => loginUser.email === user.email);
    users[index] = loginUser;
    localStorage.setItem('users', JSON.stringify(users));

}