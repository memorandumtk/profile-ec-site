

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
     * 入力されたデータからカード（Bootstrap）を作成する関数。
     */
    createCard(plantData) {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardImg = document.createElement('img');
        cardImg.classList.add('card-img-top');
        cardImg.src = plantData.image_url;
        cardImg.alt = plantData.name;

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = plantData.japanese_name;

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = plantData.description;

        const cardButton = document.createElement('a');
        cardButton.classList.add('btn', 'btn-primary');
        cardButton.href = 'detail.html?slug=' + plantData.slug;
        cardButton.textContent = '詳細';

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardButton);

        card.appendChild(cardImg);
        card.appendChild(cardBody);

        return card;
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


}

export default Plant;