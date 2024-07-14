

class Plant {
    constructor(id, name, japanese_name, description, image_url, price, stock, slug, number_of_liked) {
        this.id = id;
        this.name = name;
        this.japanese_name = japanese_name;
        this.description = description;
        this.image_url = image_url;
        this.price = price;
        this.stock = stock;
        this.slug = slug;
        this.number_of_liked = number_of_liked;
        this.quantity = 1;
    }


    /**
     * colをクラスに持つdiv要素を作成するメソッド。
     */
    createColDiv() {
        const colDiv = document.createElement('div');
        colDiv.classList.add('col');

        return colDiv;
    }

    /**
     * rowをクラスに持つdiv要素を作成するメソッド。
     */
    createRowDiv() {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        return rowDiv;
    }

    /**
     * いいねの数を追加するメソッド。
     */
    addLike() {
        this.number_of_liked += 1;
    }

    /**
     * いいねの数を減らすメソッド。
     */
    removeLike() {
        this.number_of_liked -= 1;
    }

    /**
     * いいねボタンのトグルメソッド。
     */
    toggleLike(event) {
        event.preventDefault();
        const likeButton = event.target;
        if (likeButton.classList.contains('btn-primary')) {
            likeButton.classList.remove('btn-primary');
            likeButton.classList.add('btn-danger');
            likeButton.textContent = 'お気に入りから削除';
            this.addLike();
        } else {
            likeButton.classList.remove('btn-danger');
            likeButton.classList.add('btn-primary');
            likeButton.textContent = 'お気に入りに追加';
            this.removeLike();
        }
    }

    /**
     * 商品の値段にカンマ区切りをつけるメソッド。
     */
    addCommaToPrice(price = this.price) {
        return price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }

    /**
     * 商品の値段に￥マークをつけるメソッド。
     */
    addYenMarkToPrice(price = this.addCommaToPrice()) {
        return `¥${price}`;
    }

    /**
     * 商品をカートに追加するときにカートに入れるオブジェクトを作成するメソッド。
     */
    createCartItem(quantity = 1) {
        return {
            id: this.id,
            name: this.name,
            japanese_name: this.japanese_name,
            price: this.price,
            image_url: this.image_url,
            quantity: quantity,
        }
    }

    /**
     * 商品が購入された時に購入履歴に追加するオブジェクトを作成するメソッド。
     * createCartItemと2024/6/25時点では同じだが、後々区別化できるかもしれないので別メソッドとして定義。quantityのデフォルト値はcreateCartItemと異なる。
     */
    createPurchaseItem(quantity = this.quantity) {
        return {
            id: this.id,
            name: this.name,
            japanese_name: this.japanese_name,
            price: this.price,
            image_url: this.image_url,
            quantity: quantity,
        }
    }

    /**
     * 商品の合計金額を計算するメソッド。
     */
    calculateTotalPrice(quantity = this.quantity) {
        return this.price * quantity;
    }

    
    /**
     * 入力されたデータからカードに見立てた商品ごとのDIVを作成するメソッド。
     */
    createCard(user = null) {
        const card = document.createElement('div');
        card.classList.add('d-grid', 'border-0', 'rounded', 'card', 'plant-card-div');
        // // カードの背景色を透明がかった白に設定する。
        // card.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';

        const anchor = document.createElement('a');
        anchor.href = 'detail.html?slug=' + this.slug;
        anchor.style.textDecoration = 'none';
        anchor.style.color = 'black';

        const cardImg = document.createElement('img');
        cardImg.classList.add('object-fit-cover', 'w-100', 'rounded');
        cardImg.style.height = '360px';
        cardImg.style.objectFit = 'cover';
        cardImg.src = this.image_url;
        cardImg.alt = this.name;

        const cardBody = document.createElement('div');
        cardBody.classList.add('d-flex', 'flex-column', 'align-items-start', 'p-3');

        const cardTitle = document.createElement('h5');
        cardTitle.textContent = this.japanese_name;

        const cardText = document.createElement('p');
        cardText.textContent = this.description;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        if (user && user.is_logged_in) {
            const cardButton = document.createElement('button');
            // ユーザーがいいねをしているかどうかでボタンのテキストを変更する。
            if (user.liked_products.includes(this.id)) {
                cardButton.classList.add('btn', 'btn-outline-danger');
                cardButton.textContent = 'お気に入りから削除';
            } else {
                cardButton.classList.add('btn', 'btn-outline-primary');
                cardButton.textContent = 'お気に入りに追加';
            }
            cardButton.onclick = (e) => {
                // クラス内のtoggleLikeメソッドを使い、いいねの数を増やす。
                this.toggleLike(e);
                // ログインしている場合、いいねの情報を更新するメソッドを呼び出す。
                user.toggleLike(this.id);
                // いいね押下を反映させるためにページをリロードする。
                window.location.reload();
            }
            cardBody.appendChild(cardButton);
        }

        anchor.appendChild(cardImg);
        anchor.appendChild(cardBody);
        card.appendChild(anchor);

        return card;
    }
}

export default Plant;