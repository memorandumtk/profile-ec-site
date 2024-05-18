/**
 * JSONファイルのデータを取得するための関数。
 * @param string fileName パスを含めて指定
 * @returns 
 */
export default async function fetchData(fileName = '/data/CustomersSample.json') {
    try {
        // JSONデータ向けのリクエストを送信。
        const response = await fetch(fileName);

        if (!response.ok) {
            // もしもレスポンスがエラーならば、エラーObjectを作成。
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        // JSONデータを取得。
        const data = await response.json();

        return data;

    } catch (error) {
        console.log('Fetch error:', error.message);
        return null;
    }
}