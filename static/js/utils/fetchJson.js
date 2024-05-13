export default async function fetchUserData() {
    try {
        // JSONデータ向けのリクエストを送信。
        const response = await fetch('/data/customers.json');

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