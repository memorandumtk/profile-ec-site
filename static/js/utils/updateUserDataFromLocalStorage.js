
/**
 * ローカルストレージから取得したログインユーザーのカートに商品を追加し、ローカルストレージに再度保存する。
 */
export function updateUserDataFromLocalStorage(user) {
    const users = JSON.parse(localStorage.getItem('users'));
    const index = users.findIndex(user => user.email === user.email);
    users[index] = user;
    localStorage.setItem('users', JSON.stringify(users));

}