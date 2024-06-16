import fetchData from "./utils/fetchJson.js";

const carouselItems = document.querySelectorAll('.carousel-item');

/**
 * 植物サンプルデータをセッションストレージに保存し、データを返す関数。
 */
async function storeSamplePlantsData() {

    const plantsData = await fetchData('/data/PlantsSample.json');

    sessionStorage.setItem('plants', JSON.stringify(plantsData));

    return plantsData;
}

/**
 * カルーセルアイテムに植物データを表示する関数。
 */
function displayPlantsOnCarousel(plants) {
    carouselItems.forEach((item, index) => {
        if (index < 3) {
            const plant = plants[index];
            const img = item.querySelector('img');

            img.src = plant.image_url;
        }
    });
}

/**
 * ページが読み込まれたときに実行される関数。
 */
window.onload = async () => {

    // 植物サンプルデータをセッションストレージに保存する関数を呼出し、データを保持。
    const plantsData = await storeSamplePlantsData();

    const sortedPlants = plantsData.sort((a, b) => b.number_of_liked - a.number_of_liked);

    console.log(sortedPlants);

    displayPlantsOnCarousel(sortedPlants);
}