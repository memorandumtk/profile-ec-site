/**
 * TrefleAPIを使い、植物データをFetchする関数
 */
async function fetchPlantDataFromTrefle() {
    try {
        // TrefleAPIへのリクエストを送信。
        const response = await fetch('https://trefle.io/api/v1/plants?