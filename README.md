# EC Site
### [仕様書リンク](https://docs.google.com/document/d/1KiefDXuoXpakCo7yuf127dwxzC6yLg81RVRhmBFg3-8/edit)
### [設計書リンク](https://docs.google.com/spreadsheets/d/1gL0qZ5nkARnwHfqiKx_gQFJBnHYZO9y1kT6b-fCjQfU/edit?gid=1191905279#gid=1191905279)


## 各ページ概要
### ログイン(login.html)
1. ページアクセス時に、ユーザデータがローカルストレージにない場合、`fetchData`関数を用いてサンプルユーザデータである`data\UsersSample.json`をローカルストレージに格納する。
2. 「email」と「passuword」が入力された時に、Userクラスを作成し、`login`メソッドを呼び出す。ローカルストレージにあるデータ（users）と`verifyUser`関数を使い合致するかどうか確認し、OKの場合ログインを許可する。その後、home.htmlにリダイレクト。
3. ログアウト機能は、ユーザがログインしていれば表示し、ユーザクラスを使って`logout`メソッドを呼び出す。

### ユーザ登録(register.html)
1. フォームから入力されたデータからユーザクラスを作り、`resister`メソッドを呼び出す。
2. `verifyUser`メソッドを使い同じメールアドレスを持っているユーザがいるかどうかをチェックする。
3. ローカルストレージの(users)のデータに新しくユーザデータを追加する。

### HOME画面
1. いいね数上位3位の商品が表示されるようなカルーセルを`displayPlantsOnCarousel`関数によって作成する。カルーセル自体はhtmlとbootstrapを使って表示し、データはjsで制御。
2. `displayPurchaseHistory`関数を使って、ユーザの購入履歴から直近3件の購入データを表示するように設定。データは、ローカルストレージに保存されているものを使用するように設定。その中で`createPlantClassByKey`関数を使って、購入アイテムをクラス化するように設定している。
3. カルーセルをクリックするとクリックした画像の詳細画面にジャンプするようにリンクを設定。

### 商品一覧画面(lists.html)
1. `storeSamplePlantsDataToLocalStorage`関数を使い、`data\PlantsSample.json`のサンプルデータを呼び出し、ローカルストレージに保存する。
2. `createclassifiedAndLists`関数を使い、ローカルストレージから取得したサンプルの植物データを、クラス化し、クラスのメソッドを使い、BootStrapのカードを作成する。また、クラス化したデータをArrayにしたものを返す。
3. PlantクラスとUserクラスにそれぞれお気に入り登録を制御する`toggleLike`メソッドを設定し、それを利用してお気に入り登録・解除ができるように設定。商品詳細画面でもお気に入り登録ができるボタン（スターボタン）があるが、そのボタンが押された時にIDが保存されるようになっており、そのIDのタイプをNumber型に統一。


### 商品詳細画面(detail.html)
1. この画面は商品の「詳細」ボタンを押したときにナビゲートされる想定のページのため、「詳細」ボタンが押された時は、URLのクエリに商品の`slug`がついた状態になっている。そこで、その`slug`の値をまず取得する。
2. ローカルストレージに保存されている(plants)のデータを取得し、1.の手順で取得した`slug`の値を元に一つの対象のデータを抜き出す。そしてそれをクラス化する。
3. クラス化したデータから`displayProductInfo`関数でデータをHTMLエレメントに挿入していく。
4. 「数量」は、inputエレメントにして数量が変わるようにし、その値に合わせて「合計金額」も変わるように設定。
5. 「カートに入れる」ボタンを押すとまず、Plantクラスの`createCartItem`メソッドを呼び出しカートに追加するためのオブジェクトを作成する。
6. その後ユーザの`products_in_cart`に5で作成されたデータがpushされ、アップデートされた`products_in_cart`のユーザ情報がローカルストレージ上でもアップデートされる。
7. カート一覧ページにリダイレクトする。

### カート一覧画面(cart.html)
1. ログインしているユーザのカート情報`products_in_cart`を読み込み、その情報を元にHTMLページのエレメント情報をJS側で作り挿入していく。※`displayCartProducts`関数をそのために使用しているが、長いので見なくてもよい。
2. 削除ボタンを押すと、その商品のデータは消えるようにし、消した後のカートの情報でユーザのカート情報をアップデートする。`handleDeleteProductFromCart`
3. 数量を変更するとその変更後の値がログイン中のユーザのデータに反映される。`handleQuantityChange`
4. `displayCartList`関数によってカート内の情報を要約したリストが表示される。
5. もしも、数量の変更や商品の削除が行われた場合は、`redisplayCartList`関数が呼び出され、カートの内容をまとめた表示部分がアップデートされる。
6. 購入ボタンを押すと、「現在の日付のタイムスタンプをKeyに持つ、カート内の商品をValueに持つオブジェクト」を生成する。
7. 6の後に、`displayPurchaseModal`関数でModalを表示させ、Modal内には登録されているお支払情報を表示する。Modal内の`購入を確定する`ボタンを押すと、6で作成したオブジェクトをArrayである`purchase_history`に購入履歴として保存する。
その後ユーザ情報を更新し、ホーム画面に戻る。

### お問い合わせ画面(inquiry.html)
1. `formDisplay`関数を使って、もしもユーザがログインしていたら、名前とEmail用inputにフルネームとEmailを入力するようにする。
2. `handleInquiryFormSubmit`関数でフォームがサブミットされた場合の処理を行う。関数内で`updateUserDataOnLocalStorage`を呼出し、フォームに入力された内容でローカルストレージのユーザ情報をアップデートするようにする。また、`new FormData()`コンストラクタを使用してform内の各nameとvalueの情報をkey-valueペアの形で取得できるようにしている。
3. ログインしていない場合は、アラートを表示させページを更新するように設定。（ログインしていない場合は、バックグラウンドのデータ保存がないと実装が難しい。）

### お気に入り画面(favorites.html)
1. ベースは`商品一覧画面(lists.html)`と一緒の仕様。まず、ログインユーザデータを取得し、そのユーザデータの`liked_products`を取得する。
2. 1のデータを基準にplantsデータをフィルタし取得したデータのみで、Plantクラスのメソッドを使いカードを表示させる。
3. もしもお気に入りデータが取得できない場合は、その旨を示すメッセージを表示させる。

### マイページ画面(mypage.html)
1. `formDisplay`関数を使って、各inputに対応するユーザ情報を入力するようにする。
2. `handleMypageFormSubmit`関数でフォームがサブミットされた場合の処理を行う。関数内で`updateUserDataOnLocalStorage`を呼出し、フォームに入力された内容でローカルストレージのユーザ情報をアップデートするようにする。また、`new FormData()`コンストラクタを使用してform内の各nameとvalueの情報をkey-valueペアの形で取得できるようにしている。
3. `handleMypageFormSubmit`関数の中で、お支払情報を選択するラジオボタンを設けている。「現金支払い」が選択された時は、`payment_method`に`cash`と保存され、「カード支払い」が選択された時は`card`が保存される。
4. 「カード支払い」が選択された時は、「カード情報入力画面へ」というリンクが表示されるようになり、カード情報入力画面にジャンプする。

### カード情報入力画面(card-form-page.html)
1. カード名義、カードナンバー、有効期限、CVVを入力するフォームを設定している。
2. カード名義が空欄でない、カードナンバーは16桁の数字、CVVは3桁の数字でないとフォームがsubmitできないようにしている。
3. CVVの数字をマスクするために、Inputを2つ重ねて表示するようにして、上にあるInputにダミーの値を表示させ、下にあるInputに実際のValueを格納するようにしている。

## 全体に関する概要
### ヘッダー(各html, header.js)
1. `headerDisplay`関数を使って、logged-inかnot-logged-inクラスを持つエレメントの表示を調整する。
2. ログアウトリンクには、clickのイベントリスナーを付け、クリックされた時はuserクラスのlogoutメソッドを呼び出すようにする。


### 素材引用元
- himawari.jpg: https://www.photo-ac.com/main/detail/29961263&title=%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A%EF%BC%91%EF%BC%94

- sedam.jpg: https://www.photo-ac.com/main/detail/30203663&title=%E3%82%BB%E3%83%80%E3%83%A0%E3%82%A2%E3%83%88%E3%83%A9%E3%83%B3%E3%83%86%E3%82%A3%E3%82%B9

- anslium.jpg: https://www.photo-ac.com/main/detail/30401170&title=%E3%82%A2%E3%83%B3%E3%82%B9%E3%83%AA%E3%82%A6%E3%83%A0

- kapoc.jpg: https://www.photo-ac.com/main/detail/29565548&title=%E5%BA%AD%E3%81%AE%E3%82%AB%E3%83%9D%E3%83%83%E3%82%AF%EF%BC%88%E3%82%B7%E3%82%A7%E3%83%95%E3%83%AC%E3%83%A9%EF%BC%89#goog_rewarded

- matsubagiku.jpg: https://www.photo-ac.com/main/detail/30050149&title=%E3%83%94%E3%83%B3%E3%82%AF%E8%89%B2%E3%81%AE%E3%83%9E%E3%83%84%E3%83%90%E3%82%AE%E3%82%AF#goog_rewarded

- bromeria.jpg: https://www.photo-ac.com/main/detail/29685303&title=%E3%83%96%E3%83%AD%E3%83%A1%E3%83%AA%E3%82%A2%E3%81%AE%E9%AE%AE%E3%82%84%E3%81%8B%E3%81%AA%E8%BC%9D%E3%81%8D

- biora.jpg: https://www.photo-ac.com/main/detail/30392318&title=%E3%83%93%E3%82%AA%E3%83%A9%E3%81%AE%E8%8A%B1#goog_rewarded

- daria.jpg: https://www.photo-ac.com/main/detail/29985844&title=%E9%BB%84%E8%89%B2%E3%81%84%E3%83%80%E3%83%AA%E3%82%A2

- unbelata.jpg: https://www.photo-ac.com/main/detail/30105616&title=%E6%97%A5%E3%81%AE%E5%85%89%E3%82%92%E6%B5%B4%E3%81%B3%E3%82%8B%E3%82%A6%E3%83%B3%E3%83%99%E3%83%A9%E3%83%BC%E3%83%80%E3%81%AE%E6%8C%BF%E3%81%97%E6%9C%A8%EF%BC%92%EF%BC%91

- monstela.jpg: https://www.photo-ac.com/main/detail/30211285&title=%E3%83%A2%E3%83%B3%E3%82%B9%E3%83%86%E3%83%A9#goog_rewarded

- dulanta.jpg: https://www.photo-ac.com/main/detail/30405215&title=%E3%83%87%E3%83%A5%E3%83%A9%E3%83%B3%E3%82%BF%EF%BC%88%E3%83%9B%E3%83%AF%E3%82%A4%E3%83%88%E3%83%A9%E3%83%96%E3%83%BB%E3%82%A2%E3%83%AB%E3%83%90%EF%BC%8910#goog_rewarded:

- giboushi.jpg: https://www.photo-ac.com/main/detail/29959710&title=%E3%82%AE%E3%83%9C%E3%82%A6%E3%82%B7%E2%91%A0#goog_rewarded

- hagoromo-jasmin.jpg: https://www.photo-ac.com/main/detail/29629988&title=%E3%83%8F%E3%82%B4%E3%83%AD%E3%83%A2%E3%82%B8%E3%83%A3%E3%82%B9%E3%83%9F%E3%83%B3#goog_rewarded

- peperomea.jpg: https://www.photo-ac.com/main/detail/29832539&title=%E7%AA%93%E9%9A%9B%E3%81%AE%E3%83%9A%E3%83%9A%E3%83%AD%E3%83%9F%E3%82%A2

- potos.jpg: https://www.photo-ac.com/main/detail/29929333&title=%E3%83%9D%E3%83%88%E3%82%B9%E3%81%AE%E8%83%8C%E6%99%AF 

- mint.jpg: https://www.photo-ac.com/main/detail/30254913&title=%E3%83%9F%E3%83%B3%E3%83%88#goog_rewarded

- saboten.jpg: https://www.photo-ac.com/main/detail/29583337&title=%E6%A4%8D%E6%9C%A8%E9%89%A2%E3%81%AE%E3%82%B5%E3%83%9C%E3%83%86%E3%83%B3%EF%BC%93%E3%81%A4#goog_rewarded

- agabe.jpg: https://www.photo-ac.com/main/detail/30096988&title=%E5%B0%8F%E9%89%A2%E3%81%AB%E6%A4%8D%E3%81%88%E3%82%89%E3%82%8C%E3%81%9F%E5%B0%8F%E8%8B%97%E3%81%AE%E8%A6%B3%E8%91%89%E6%A4%8D%E7%89%A9%EF%BC%88%E3%82%A2%E3%82%AC%E3%83%99%EF%BC%89#goog_rewarded

- ajisai.jpg: https://www.photo-ac.com/main/detail/30067441&title=%E5%88%9D%E5%A4%8F%E3%81%AE%E8%8A%B1%E3%80%80%E9%AE%AE%E3%82%84%E3%81%8B%E3%81%AA%E8%B5%A4%E7%B4%AB%E8%89%B2%E3%81%AE%E3%82%A2%E3%82%B8%E3%82%B5%E3%82%A4#goog_rewarded

- katoleya.jpg: https://www.photo-ac.com/main/detail/29923825&title=%E7%B4%AB%E8%89%B2%E3%81%AE%E3%82%AB%E3%83%88%E3%83%AC%E3%83%A4#goog_rewarded
