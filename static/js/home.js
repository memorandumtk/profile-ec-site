import fetchData from "./utils/fetchJson.js";

const cardsContainer = document.getElementById('cards-container');

/**
 * 植物サンプルデータをセッションストレージに保存し、データを返す関数。
 */
async function storeSamplePlantsData() {

    const plantsData = await fetchData('/data/PlantsSample.json');
    console.log(plantsData);

    sessionStorage.setItem('plants', JSON.stringify(plantsData));

    return plantsData;
}

/**
 * 入力されたデータからカード（Bootstrap）を作成する関数。
 */
function createCard(plantData) {
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
    cardText.textContent = plantData.discription;

    const cardButton = document.createElement('a');
    cardButton.classList.add('btn', 'btn-primary');
    cardButton.href = '#';
    cardButton.textContent = 'Detail';

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardButton);

    card.appendChild(cardImg);
    card.appendChild(cardBody);

    return card;
}

/**
 * colをクラスに持つdiv要素を作成する関数。
 */
function createColDiv() {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col');

    return colDiv;
}

/**
 * rowをクラスに持つdiv要素を作成する関数。
 */
function createRowDiv() {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    return rowDiv;
}


window.onload = async () => {
    const isUserLoggedIn = sessionStorage.getItem('login_user');

    // Temporary commented out.
    //// ログインしていない場合、ログインページにリダイレクト
    // if (!isUserLoggedIn) {
    //     window.location.href = '/login.html';
    // }

    // Temporary, automatically login.
    sessionStorage.setItem('login_user', 'test@mail.com');


    // 植物サンプルデータをセッションストレージに保存する関数を呼出し、データを保持。
    const plantsData = await storeSamplePlantsData();

    console.log(plantsData);
    // 植物データからカードを作成。
    let rowDiv;
    for (let i = 0; i < plantsData.length; i++) {

        // 1行ごとに3つのカードが表示されるようにする。
        if (i % 3 === 0) {
            rowDiv = createRowDiv();
        }

        const card = createCard(plantsData[i]);
        const colDiv = createColDiv();
        colDiv.appendChild(card);

        rowDiv.appendChild(colDiv);

        cardsContainer.appendChild(rowDiv);
    }

}