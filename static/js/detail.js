import Plant from './classes/PlantClass.js';

/**
 * クエリパラメータを取得する関数
 * @param {string} param 
 * @returns {string}
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * 植物のすべての情報を取得する関数
 * @param {Array} plantsData
 */
function createclassifiedData (plantsData) {
    const plants = JSON.parse(localStorage.getItem('plants'));

    plants.map((plant, index) => {
        let classifiedPlant = Object.assign(new Plant(), plant);

        plantsData.push(classifiedPlant);
    });

    return plantsData;
}


window.addEventListener('load', () => {
    sessionStorage.setItem('login_user', 'test@mail.com');

    const slugValue = getQueryParam('slug');
    console.log(slugValue);

    const classifiedPlants = createclassifiedData([]);

    // plantは既にクラス化されている状態。
    const plant = classifiedPlants.find(plant => plant.slug === slugValue);
    console.log(plant);


});
