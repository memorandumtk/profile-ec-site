import { createClassifiedProduct, createClassifiedProducts } from './createClassifiedProducts.js';
import { updateUserDataOnLocalStorage } from './updateUserDataOnLocalStorage.js';

/**
 * カートの商品をユーザの`puprchase_history`に商品を追加する関数。
 */
function addProductsToPurchaseHistory(user, products) {

    const currentDate = new Date().valueOf();
    const purchaseObject = { [currentDate]: products };
    if (!user.purchase_history) {
        user.purchase_history = [];
    }
    user.purchase_history.push(purchaseObject);
    console.log(user);

    updateUserDataOnLocalStorage(user);
}

/**
 * 購入確定ボタンが押された時に起動する関数
 */
function handlePurchase(user, purchaseList) {

    addProductsToPurchaseHistory(user, purchaseList);

    // カートの中身を空にする
    user.products_in_cart = [];
    updateUserDataOnLocalStorage(user);

    alert('購入が完了しました。');
    // ホーム画面に戻る
    window.location.href = '/views/html/home.html';
}

/**
 * 購入情報の確認Modalを表示する関数
 */
export function displayPurchaseModal(user, purchaseList) {

    const modal = document.getElementById('purchase-modal');
    modal.innerHTML = '';
    modal.classList.remove('d-none');
    modal.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');


    const modalContent = document.createElement('div');
    modalContent.classList.add('d-flex', 'flex-col', 'justify-content-center', 'align-items-center', 'w-100');

    // 支払いメソッドを表示する。
    const paymentMethod = document.createElement('div');
    paymentMethod.classList.add('my-3');

    const paymentMethodTitle = document.createElement('h5');
    paymentMethodTitle.textContent = '支払い方法のご確認';

    const paymentMethodType = document.createElement('p');
    paymentMethodType.textContent = '現在登録されているお支払い方法: ';

    const paymentMethodContent = document.createElement('p');
    paymentMethodContent.textContent = user.payment_method === 'card' ? 'クレジットカード' : '代金引換';
    paymentMethodContent.classList.add('ms-2', 'fw-bold');

    paymentMethodType.appendChild(paymentMethodContent);

    paymentMethod.appendChild(paymentMethodTitle);
    paymentMethod.appendChild(paymentMethodType);
    
    if (user.payment_method === 'card') {
        const cardInfo = user.card_information;

        const cardInfoParagraph = document.createElement('p');
        cardInfoParagraph.textContent = '現在登録されているカード番号: ';

        const cardInfoContent = document.createElement('p');
        cardInfoContent.textContent = `${cardInfo.card_number.substring(0, 4)} **** **** ${cardInfo.card_number.substring(12, 16)}`;
        cardInfoContent.classList.add('ms-2', 'fw-bold');

        cardInfoParagraph.appendChild(cardInfoContent);
        paymentMethod.appendChild(cardInfoParagraph);
    }

    modalContent.appendChild(paymentMethod);

    // ボタン用のdiv
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'gap-3');

    // モダルを閉じるボタン
    const modalCloseButton = document.createElement('button');
    modalCloseButton.addEventListener('click', () => {
        modal.classList.add('d-none');
    });
    modalCloseButton.textContent = '購入画面に戻る';
    modalCloseButton.classList.add('btn', 'btn-outline-primary');

    // 購入確定ボタン
    const purchaseButtonElement = document.createElement('button');
    purchaseButtonElement.addEventListener('click', () => {
        handlePurchase(user, purchaseList);
    });
    purchaseButtonElement.textContent = '購入を確定する';
    purchaseButtonElement.classList.add('btn', 'btn-outline-success');

    buttonDiv.appendChild(purchaseButtonElement);
    buttonDiv.appendChild(modalCloseButton);

    modal.appendChild(modalContent);
    modal.appendChild(buttonDiv);

    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modal.classList.add('d-none');
        }
    });
}
