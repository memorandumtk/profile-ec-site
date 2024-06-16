# EC Site
### [仕様書リンク](https://docs.google.com/document/d/1KiefDXuoXpakCo7yuf127dwxzC6yLg81RVRhmBFg3-8/edit)
### [設計書リンク](https://docs.google.com/spreadsheets/d/1gL0qZ5nkARnwHfqiKx_gQFJBnHYZO9y1kT6b-fCjQfU/edit?gid=1191905279#gid=1191905279)

## ログイン(login.html)
1. ページアクセス時に、ユーザデータがローカルストレージにない場合、`fetchData`関数を用いてサンプルユーザデータを格納する。
2. 「email」と「passuword」が入力された時に、Userクラスを作成し、`login`メソッドを呼び出す。ローカルストレージにあるデータ（users）と`verifyUser`関数を使い合致するかどうか確認し、OKの場合ログインを許可する。その後、home.htmlにリダイレクト。
3. ログアウト機能は、ユーザがログインしていれば表示し、ユーザクラスを使って`logout`メソッドを呼び出す。

## ユーザ登録(register.html)
1. フォームから入力されたデータからユーザクラスを作り、`resister`メソッドを呼び出す。
2. `verifyUser`メソッドを使い同じメールアドレスを持っているユーザがいるかどうかをチェックする。
3. ローカルストレージの(users)のデータに新しくユーザデータを追加する。

## HOME画面
まだ未実装

## 商品一覧画面(lists.html)
1. `storeSamplePlantsDataToLocalStorage`関数を使い、data\PlantsSample.jsonのサンプルデータを呼び出し、ローカルストレージに保存する。
2. `createclassifiedAndLists`関数を使い、ローカルストレージから取得したサンプルの植物データを、クラス化し、クラスのメソッドを使い、BootStrapのカードを作成する。また、クラス化したデータをArrayにしたものを返す。

## 商品一覧画面(detail.html)
1. この画面は商品の「詳細」ボタンを押したときにナビゲートされる想定のページのため、「詳細」ボタンが押された時は、URLのクエリに商品の`slug`が就いた状態になっている。そこで、その`slug`の値をまず取得する。
2. ローカルストレージに保存されている(plants)のデータを取得し、1.の手順で取得した`slug`の値を元に一つの対象のデータを抜き出す。そしてそれをクラス化する。
3. クラス化したデータから`displayProductInfo`関数でデータをHTMLエレメントに挿入していく。
4. 「数量」は、inputエレメントにして数量が変わるようにし、その値に合わせて「合計金額」も変わるように。
5. 「カートに入れる」ボタンを押すとユーザの`products_in_cart`に```id, japanese_name, price, quantity, image_url```のデータがJSONで保存され、アップデートされた`products_in_cart`のユーザ情報がローカルストレージ上でもアップデートされる。
6. カート一覧ページにリダイレクトする。

## カート一覧画面(cart.html)
1. ログインしているユーザのカート情報`products_in_cart`を読み込み、その情報を元にHTMLページのエレメント情報をJS側で作り挿入していく。＊`displayCartProducts`関数をそのために使用しているが、長いので見なくてもよい。
2. 削除ボタンを押すと、その商品のデータは消えるようにし、消した後のカートの情報でユーザのカート情報をアップデートする。`handleDeleteProductFromCart`
3. 購入ボタンを押すと`purchase_history`に購入履歴として保存され、HOME画面に戻る。Home画面に戻る仕様はテストのため、まだ未実装。
4. 数量を変更するとその変更後の値がログイン中のユーザのデータに反映される。`handleQuantityChange`
5. `displayCartList`関数によってカート内の情報を要約したリストが表示される。
6. もしも、数量の変更や商品の削除が行われた場合は、`redisplayCartList`関数が呼び出され、カートの内容をまとめた表示部分がアップデートされる。

## お問い合わせ画面(inquiry.html)
1. `formDisplay`関数を使って、もしもユーザがログインしていたら、名前とEmail用inputにフルネームとEmailを入力するようにする。
2. `handleInquiryFormSubmit`関数でフォームがサブミットされた場合の処理を行う。関数内で`updateUserDataOnLocalStorage`を呼出し、フォームに入力された内容でローカルストレージのユーザ情報をアップデートするようにする。また、`new FormData()`コンストラクタを使用してform内の各nameとvalueの情報をkey-valueペアの形で取得できるようにしている。

## マイページ画面(mypage.html)
1. `formDisplay`関数を使って、各inputに対応するユーザ情報を入力するようにする。
2. `handleMypageFormSubmit`関数でフォームがサブミットされた場合の処理を行う。関数内で`updateUserDataOnLocalStorage`を呼出し、フォームに入力された内容でローカルストレージのユーザ情報をアップデートするようにする。また、`new FormData()`コンストラクタを使用してform内の各nameとvalueの情報をkey-valueペアの形で取得できるようにしている。