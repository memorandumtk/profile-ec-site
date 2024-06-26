

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

}

export default Plant;