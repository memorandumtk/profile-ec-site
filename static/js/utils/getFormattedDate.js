/**
 * 現在の日付をYYYY-MM-DD形式で返す
 * @option 
 * 0: 現在の日付を返す
 * 1: timestampからdesiredDataのDateオブジェクトを生成しフォーマット
 */
export function getFormattedDate(desiredDate = null, option = 0) {
    let date;
    switch (option) {
        case 1:
            date = new Date(desiredDate);
        default:
            date = new Date();
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}