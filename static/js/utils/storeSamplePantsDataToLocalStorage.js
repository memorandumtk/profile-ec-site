
/**
 * 植物サンプルデータをローカルストレージに保存する関数。
 */
export async function storeSamplePlantsDataToLocalStorage() {

    const plantsData = await fetchData('/data/PlantsSample.json');
    console.log('This is the sample data of plants:')
    console.log(plantsData);

    localStorage.setItem('plants', JSON.stringify(plantsData));
}

