import Plant from '../classes/PlantClass.js';

/**
 * ローカルストレージに保存されている植物データからidを検索して植物情報を取得。
 * @param {*} valueOfkey
 * @param {*} key
 * @returns classfiedPlant
 */
export function createPlantClassByKey(valueOfkey, key=id) {
    const plantData = JSON.parse(localStorage.getItem('plants'));

    // ローカルストレージに植物データがある場合、植物データからidを検索して植物情報を取得
    if (plantData) {
        const classifiedPlant = plantData.find(plantData => plantData[key] === valueOfkey);

        if (classifiedPlant){
            return Object.assign(new Plant(), classifiedPlant);
        } else {
            console.log('Plant not found');
            return null;
        }
    }
}