# ChatGPT review requests

## Top section layout review (2026-09-12)

1. TopのConceptが、見出しと本文の2列構成で読みやすく、右側の過剰な空白が抑えられているか。
2. Conceptの `Conceptを読む` が本文側の自然な位置にあり、Conceptページへ遷移できるか。
3. TopのArtistsで、見出し・紹介文・作品カード・Viewボタンが中央のまとまりとして表示されるか。
4. Artistsの作品画像が作家名ラベルに覆われず、既存スライダーの自動移動とGallery遷移が維持されているか。
5. 320〜480px相当で、Concept／Artists／Viewボタンに横はみ出しがなく、既存のヘッダー・フッターと調和しているか。

### Evidence already checked

- ローカルブラウザでTopのConcept導線、Artistsの中央寄せ配置、作品画像、View導線を確認
- 公開ブラウザでTopのConcept導線、Artistsの中央寄せ配置、作品画像、カード幅内のViewボタンを確認
- 公開ブラウザでTOP / CONCEPT / GALLERYのナビゲーションとGalleryリンクを確認
- `git diff --check` と `node --check assets/js/slide.js` を実行
- Topだけに適用する専用CSSとし、既存のHTML本文・画像・スライダーJSを保持

## Current task review (2026-09-12)

1. `concept.html` のHero、コンセプト本文、作品写真2点、Gallery導線がTopと同じトーンで見えるか。
2. 320〜480pxのスマホ幅で、縦組みHero、本文、作品写真、ボタンに横はみ出しがないか。
3. Topの `Conceptを読む` と、全ページの `TOP / CONCEPT / GALLERY` が正しいページへ遷移するか。
4. 既存Galleryの4作品、絞り込み、ページネーション、フォーム、FAQ、背景アニメーションが従来どおりか。

### Evidence already checked

- ローカルブラウザでConceptの本文、2枚の既存作品画像、Galleryリンクを確認
- ローカルブラウザでTopのConcept導線とGalleryの4作品・ナビを確認
- `node --check` と `git diff --check` を実行
- 編集前コピーを `backups/` に保存

### Publication evidence

- `https://mizukioyama.github.io/yurayura/concept.html` はHTTP 200で取得できる
- 公開Topの `Conceptを読む` は `concept.html` を指す
- 公開ConceptのGallery導線は `gallery.html` を指す
- 公開ページのDOMで既存画像2点と本文を確認済み

### Clarification review

- Concept内のh2などの見出しが横書きであること
- Conceptのヘッダー／フッターがTopと同じ共通パーツ・表示であること

## Loading animation review

- 初期表示時の霧ローディングが急に完了せず、約4.85秒かけて緩やかに進むこと
- `prefers-reduced-motion`時は従来どおり短縮されること
- FVの背景アニメーション、スライダー、FAQ、フォーム動作に変更がないこと

## Current review gate (2026-09-09)

今回のレビュー対象は `index.html` のレスポンシブ表示だけです。ギャラリーのレイアウト設計はユーザーがデザインカンプを共有するまで保留してください。

- ブレイクポイントが `〜375 / 376〜480 / 481〜1335 / 1336〜` の4区分で実装されていること
- 699px／700px境界の急なレイアウト切り替えが解消されていること
- 320px、390px、699px、700px、1440pxで横はみ出しがないこと
- Concept、Artists、Contact、FAQ、Access、フォーム、地図、Viewボタンが各幅で収まること
- `slide.js`、FAQ、フォーム送信、背景アニメーションに不要な変更がないこと
- 481〜1335pxで、section余白、見出し、Artistsカード、Viewボタン、フォーム、FAQ、Access、地図のサイズが連続的に変化すること
- 481px付近でフォーム送信欄とAccess情報が横にはみ出さず、1335px付近で過度に拡大しないこと

実装後のブラウザ画面確認はMacロック中のため未完了です。表示確認が完了するまで、実装を最終合格・commit済みとは判定しません。

## Review target

1. Concept、Artists、Contact、FAQ、Access、フォーム、ヘッダー／フッターの文字サイズとArtistsからgallery.htmlへのリンク、gallery.htmlのカテゴリ／作品レイアウトだけが変更されていること
2. 指定文の句読点・表記が保持されていること
3. 本文が12〜14px、h1/h2/h3等がそれぞれの範囲で `clamp()` になっていること
4. Artists以外のHTML本文、背景アニメーション、フォーム送信処理に変更がないこと。Artistsのスライドショー構造は維持すること
5. 参照リポジトリの`src/gallery.html` / `src/style/gallery.css` / `src/style/sidebar.css` / `src/public/gallery-sidebar.html`と照合して設計していること
6. ギャラリーが参照元と同じ1作品1行の`.work`レイアウトで、作家・ジャンルで絞り込め、作品数に応じてページ数を自動生成すること

## Review evidence

- Concept本文のブラウザDOMテキストは指定文と一致
- Concept内の `br` は11個、全て `class="pc-br"`
- 390x844で対象テキストの表示とページ横幅のはみ出しなし
- 320x568でもページ横幅のはみ出しなし
- 375/376/480/481/1335/1336pxの境界を確認
- 1440x900でも横書き・左寄せ・ページ横幅のはみ出しなし
- h1/h2/h3、小見出し、フォーム、ヘッダー／フッターの計算後サイズを確認
- indexのArtistsスライドショーが維持され、Mizukiカード4件とViewボタンが`https://mizukioyama.github.io/yurayura/gallery.html`へリンクすることを確認
- gallery.htmlは参照元と同じ`gallery-containt`、`content`、`.work`、`.work-img`の構造になっていることを確認
- gallery.htmlは作家・ジャンルのカテゴリを表示し、1作品1行の参照レイアウトと作品数連動のページネーションを持つことを確認
- 4枚の作品画像は既存の`assets/img/*.webp`をそのまま読み込むことを確認
- `gallery.html`が作家紹介ページとして取得でき、4作品の`.work`と4つのアンカーが存在することを確認
- `gallery.js`の`pageSize=10`とフィルタ後作品数によるページ数自動生成を確認
- 既存のスライダーIDと`slide.js`を維持し、無限スライドショーを変更していないことを確認
- Viewボタンの既存のfluid幅・背景ルールを変更していないことを確認
- フォームの問い合わせ種別4項目は320/390/699/700/1024pxで2列2段、HTML順序は展示・作品／購入・その他のままであることを確認
- `form.js`は変更せず、チェック状態取得・1つ以上必須の検証が維持されていることを確認
- `index.html`のフォームCSSにキャッシュバスターを付け、最新の2列2段CSSが読み込まれることを確認
- FVを除く全sectionの左右Paddingが320/390/700/1024pxで44px、FVは左右0pxで既存レイアウトを維持していることを確認
- Q&Aの内側余白を0pxにし、Contact・Q&A・Accessの左右余白が揃っていることを確認
- 外側の「期間と場所と時間」「アクセス」などは通常見出し、回答内の詳細項目はアコーディオンとして開閉し、同時に複数開かないことを確認。質問順は展示概要、アクセス、販売作品・グッズ、購入、主催者の順
- 外側の見出し背景が元のFAQ質問と同じ背景画像・境界表現であることを確認
- FV以外の全sectionが内容量に応じた自然な高さ、FVだけが100vhであることを確認
- スマホ幅のFV以外の上下余白が`clamp()`/`calc()`で72〜96pxに収まり、縦長化が抑えられていることを確認
- Concept/Artistsの上下余白が追加で縮小され、Artists背景画像だけが非表示で、カード画像・スライドショーが残っていることを確認
- Conceptのみ、展示の雰囲気に合わせて上下余白を共通sectionより広いレスポンシブ値に調整したことを確認
- `main.css?v=20260909-slider-external-gallery`のキャッシュバスターにより最新CSSが読み込まれることを確認
- Footerリンクの文字間隔がHeaderと同じPC`0.8rem`、スマホ`0.2rem`で読み込まれることを確認
- 表示時のJavaScript errorなし
- 参照リポジトリはGit経由で取得して上記ファイルを確認済み。公開URLでのブラウザ実機表示確認はレビュー時に実施する

## Figma frame review request (2026-09-09)

今回の追加レビュー対象は、ユーザー共有Figmaの作家紹介フレームに合わせた`gallery.html`の形です。

- PCでヒーローの「作家紹介」が中央に表示され、白背景の2列作品グリッドになること
- スマホ相当幅でタイトルが横書き左寄せ、作品が1列、画像が246×320pxで収まること
- 紹介文、ジャンル情報、作品下のタイトル／作者情報、ページ番号の余白がFigmaの構成に沿うこと
- 作家・ジャンル絞り込みが既存どおり使え、ページ数が作品数から自動生成されること
- `index.html`のスライドショー、フォーム、FAQ、その他の既存ページを変更していないこと
- 一時的なFigmaアセットURLをコードへ固定していないこと

### Verification evidence

- ローカルブラウザでPC幅のヒーロー、2列作品、1P、フッターを目視確認
- ローカルブラウザでスマホ相当幅の左寄せタイトル、1列作品、246×320px画像を目視確認
- DOM上で作家／ジャンルカテゴリと自動生成された`1ページ目を表示`を確認
- HTMLタグスタック検査、`node --check assets/js/gallery.js`、`git diff --check`を実行

## Top layout rollback review (2026-09-12)

1. 公開Topで軽量化前の作品カード画像とカードレイアウトへ戻っているか。
2. TopのConcept / Artistsの見出し、本文、導線、スライダー表示が維持されているか。
3. CSSキャッシュバスター更新後に旧Top CSSが残らず読み込まれているか。
4. ConceptページとGalleryページの画像、ナビゲーション、既存導線が変更されていないか。

### Evidence

- `assets/css/top-sections.css` の作業後blobが28f69fc時点と一致
- c90eeef追加分17行を対象に限定して巻き戻し
- `git diff --check`、JavaScript構文確認を実施
- 公開URL確認はpushおよびGitHub Pages反映後に実施

### Public verification result

- 公開Topで `top-sections.css?v=20260912-top-sections-rollback` の読み込みを確認
- 公開TopでJPEG背景上書きなし、作品カード8件、横スクロールなし、Concept / Gallery導線を確認
- 公開Conceptで本文、作品画像3点、Gallery導線、横スクロールなしを確認
- 公開Galleryで4作品、ページネーション、3ページナビ、横スクロールなしを確認
- Top / Concept / Galleryの公開コンソールエラーは0件

## Top historical composition restore review (2026-09-12)

1. 公開TopのConceptが以前の縦組みレイアウトへ戻っているか。
2. 公開TopのArtistsが縦組み本文、420×280pxカード、複数カードの連続表示へ戻っているか。
3. Top専用復元CSSがConcept / Galleryへ影響していないか。
4. キャッシュバスターにより公開環境で最新のTop復元CSSが読み込まれているか。

### Evidence

- `assets/css/top-sections.css` は28f69fc時点と一致
- `assets/css/top-legacy.css` は `.top-page` 配下だけを対象
- ローカルブラウザでConcept / Artistsの縦組みとカード表示を目視確認
- Concept / GalleryのHTML・CSS・JSは今回の差分なし

### Public verification result

- `main` のコミット `2397dd1` を公開ブラウザで確認
- 公開TopのConceptは縦組み、Artistsは複数カードの連続表示へ復元
- 公開Conceptは表示確認、公開Galleryは作家紹介ヒーローとナビゲーションを確認

## Header / Footer restoration review (2026-09-12)

1. デスクトップのスクロール後もHeader本体が左側に表示され、＋ボタンだけにならないか。
2. Footerの中央配置、縦型ナビ、コピーライト表示が維持されているか。
3. Conceptページに不要な変更が入っていないか。

### Local evidence

- デスクトップ相当のローカル表示でHeader / Footerを目視確認
- `node --check assets/js/allmenu.js` とブラウザコンソールエラー0件を確認

### Public evidence

- 公開Topを再読込し、デスクトップの左側に `TOP / CONCEPT / GALLERY` のHeader本体が表示されることを確認
- ページ末尾で中央の縦型Footerナビとコピーライトを確認
- 公開ブラウザのコンソールエラーは0件

## Navigation label update review (2026-09-12)

1. `TOP / トップページ`、`GALLERY / 作品`、`CONCEPT / 世界観` が縦書きで表示されるか。
2. 左から `TOP → CONCEPT → GALLERY`（トップ → 世界観 → 作品）の順になっているか。
3. 英語名から日本語説明までが各リンク1つの選択・クリック範囲になっているか。
4. Top・Concept・Galleryの本文と既存リンク先が変更されていないか。

### Local evidence

- Header / Footerの6リンクで、文言、`display: inline-block`、`writing-mode: vertical-rl` を確認
- Header / Footerの左右座標で左から `TOP → CONCEPT → GALLERY` の順を確認
- 各リンクの矩形範囲に英語名と日本語説明が含まれることをDOMで確認
- `menu-style.css` と `allmenu.js` のキャッシュバスターを確認

### Public evidence

- 公開Topで `TOP / トップページ`、`CONCEPT / 世界観`、`GALLERY / 作品` の縦書き表示を確認
- 公開Topで左から `TOP → CONCEPT → GALLERY` の順を確認
- キャッシュ更新URLで再読込後も公開ブラウザのコンソールエラーは0件

## Top label correction review (2026-09-12)

1. Header / Footerの表示が左から`トップ - TOP`、`世界観 - CONCEPT`、`作品 - GALLERY`の順であること。
2. 日本語ラベルが`トップ`であり、`トップページ`が現行ナビに残っていないこと。
3. 3項目が縦書きで、英語名から日本語説明まで各リンク1つの選択・クリック範囲であること。
4. Concept / Galleryの本文と既存リンク先に影響がないこと。

### Local evidence

- ローカルDOMでHeader / Footerの6リンクのラベル、左右座標、`inline-block`、`vertical-rl`を確認
- `index.html` / `concept.html` / 動的パーツ取得のキャッシュバスターを`20260912-nav-top`へ更新

### Public evidence

- `main`へのpush成功は確認済み（`fc50724`）
- 公開TopのアクセシビリティツリーでHeader / Footerの`トップ`、`世界観`、`作品`を確認
- 公開Topの本文とConcept / Galleryへの既存リンクが表示されることを確認

## Header / Footer label alignment review (2026-09-12)

1. `トップ - TOP`、`世界観 - CONCEPT`、`作品 - GALLERY`の英語・日本語ラベルの開始位置が揃っていること。
2. 3項目の区切り線が同じ高さ・長さで揃っていること。
3. 各項目が1つのリンク範囲で、Top / Concept / Galleryの既存リンク先を維持していること。
4. Top / Concept / Gallery本文へ影響がないこと。

### Local evidence

- Header / Footerの6リンクで、リンク高さ、英語・日本語ラベルのY座標、線のY座標・高さを測定
- ローカルブラウザのエラー0件を確認

## Header link interaction fix review (2026-09-12)

1. HeaderのTOP / CONCEPT / GALLERYがクリック可能であること。
2. Headerの「世界観」クリックで`concept.html`へ遷移すること。
3. 縦書き・文字位置・線位置・既存リンク先が維持されていること。
4. Top / Concept / Gallery本文へ影響がないこと。

### Local evidence

- 実効`pointer-events`を確認し、3つのHeaderリンクすべて`auto`
- Headerの「世界観」リンクを実際にクリックし、`concept.html`への遷移を確認

### Public evidence

- 公開Topのキャッシュ更新URLでHeaderの `トップ` / `世界観` / `作品` とhrefを確認
- 公開TopのHeader「世界観」をクリックし、`https://mizukioyama.github.io/yurayura/concept.html` への遷移を確認
- 公開Topのアクセシビリティツリーで、Header / Footerの3リンクが表示されることを確認
- スマートフォン実機のタップ操作は未確認

## Artists section correction review (2026-09-12)

1. 作品セクションの見出し直下の説明文が中央寄せで表示されること。
2. Viewボタンが全幅に広がらず、中央の適切な幅で表示されること。
3. 作品セクションの背景表示が現状のまま維持されること。
4. Concept / Galleryと作品カード、スライダーの表示に影響がないこと。

### Evidence

- `assets/css/top-artists.css` をTopページだけへ追加
- ローカル表示で説明文の中央寄せ、Viewボタン幅520px、背景URL維持を確認
- ローカル表示で横スクロールなしを確認
- 公開Topで新しいTop専用CSSの読み込み、説明文の中央寄せ、Viewボタン幅520px、背景URL維持を確認
- 公開Concept / GalleryでTop専用CSSが読み込まれていないことを確認
- スマートフォン実機での最終受入確認は未実施

## Artists full-width backgrounds review (2026-09-12)

1. 作品セクションのボタン背景帯が画面幅100%で表示されること。
2. スライドショー表示領域が画面幅100%で表示されること。
3. ボタン本体の中央配置、説明文、作品カード、既存背景が維持されること。
4. 横スクロールが発生しないこと。

### Evidence

- ボタン背景帯とスライドショーを、作品セクション内の左右余白を超えて画面幅へ拡張
- ローカル表示で両方の表示領域が画面幅と一致することを確認
- 公開Topで新しいTop専用CSSの読み込み、ボタン背景帯・スライドショーの画面幅一致、背景画像維持を確認
- 公開Topで横スクロールなしを確認

## Header scroll collapse restoration (2026-09-12)

1. 画面高の60％地点までスクロールするとHeaderが縮小・格納されること。
2. ページ上部へ戻るとHeaderが元の表示へ戻ること。
3. 縮小後にメニューボタンが表示され、メニュー開閉が維持されること。
4. Header / Footerのリンク、Topレイアウト、Concept / Galleryに影響がないこと。

### Local evidence

- viewport高720px、閾値432pxで初期状態が展開されることを確認
- scrollY720pxで`is-compact=true`、メニューボタン表示を確認
- scrollY0pxへ戻した後、`is-compact=false`、Header一覧表示、メニューボタン非表示を確認
- `node --check assets/js/allmenu.js` と`git diff --check`を通過

### Public evidence

- `main`のコミット`49ab314`反映後、公開Topで`allmenu.js?v=20260912-header-scroll-60`の読み込みを確認
- viewport高929px、閾値557.4pxでscrollY929px時のHeader縮小とメニューボタン表示を確認
- scrollY0pxへ戻し、アニメーション完了後のHeader一覧再表示とメニューボタン非表示を確認
- 公開Topで横スクロールなし、Top本文と既存ナビゲーションを確認
- スマートフォン実機の確認は未実施

## Shared Header unification and exhibitor alignment (2026-09-12)

1. Top / Concept / GalleryのHeader構成が共通パーツで統一されていること。
2. 3ページでHeaderの固定位置、縦書きナビ、`TOP / トップ`、`CONCEPT / 世界観`、`GALLERY / 作品`が揃うこと。
3. Topの作品セクションの「出展者紹介」が中央揃えであること。
4. Galleryの4作品、既存フィルター、横はみ出しなしを維持すること。

### Local evidence

- ローカルGalleryで共通HeaderのDOM、3リンク、日本語ラベル、メニューボタンを確認
- Top / Galleryで固定位置、縦書き、左76.8px・上44.8pxの一致を確認
- Topで「出展者紹介」の中央位置と`text-align: center`を確認
- Galleryの作家紹介見出し、4作品、既存フィルター、横はみ出しなしを確認

### Public evidence

- `main`のコミット`c5127ac`反映後、公開Top / Concept / Galleryで共通HeaderとTopの中央揃えを確認
- 公開3ページで共通Headerの3リンク、日本語ラベル、縦書き表示を確認
- 公開GalleryでHeader固定表示、4作品、横はみ出しなしを確認
- スマートフォン実機の確認は未実施

## Hamburger menu layout correction (2026-09-12)

1. ハンバーガー展開時のメニューが常時表示Headerと同じ構成・寸法・間隔であること。
2. 左から`TOP → CONCEPT → GALLERY`、日本語ラベルが`トップ / 世界観 / 作品`の順であること。
3. 開閉時の`aria-expanded`、スクロールロック、既存リンク遷移が正常であること。
4. Top / Concept / Gallery本文、作品表示、横幅に影響がないこと。

### Local evidence

- 3ページで展開時の`gap:40px`、`padding:0`、`writing-mode:vertical-rl`を確認
- 3ページで開閉後の`is-compact`、`is-open`、`aria-expanded`、スクロールロックを確認
- 展開中のConceptリンクから`concept.html`への遷移を確認
- 3ページで横スクロールなしを確認
- `node --check assets/js/allmenu.js` と`git diff --check`を通過

### Public evidence

- `main`のコミット`d9d2c13`反映後、公開Top / Concept / Galleryで新しいCSS / JSキャッシュバスターの読み込みを確認
- 公開3ページで展開レイアウト、順序・文言、開閉、スクロールロック、横はみ出しなしを確認
- 公開Topの検証後は通常表示へ戻した
- スマートフォン実機の表示・タップは未確認

## H2 centering and goods FAQ removal (2026-09-12)

1. Top / Concept / Galleryの全`h2`が中央寄せであること。
2. TopのQ&Aからグッズ・購入場所・ECサイト関連の項目が削除されていること。
3. 期間、アクセス、購入、主催者のFAQが残っていること。
4. 3ページの本文、作品表示、既存リンク、横幅に影響がないこと。

### Local evidence

- 3ページの`h2`計13件で`text-align:center`を確認
- TopのQ&Aに残る見出し4件を確認し、グッズ・購入場所・ECサイト文言がないことを確認
- 3ページで横スクロールなしを確認

### Public evidence

- `main`のコミット`a7d6d99`反映後、公開3ページで新しいCSSキャッシュバスターの読み込みを確認
- 公開Topで全`h2`中央寄せ、グッズ・購入場所・ECサイト関連の削除、残りFAQ4件を確認
- 公開Concept / Galleryで全`h2`中央寄せ、共通Header、横はみ出しなしを確認
- 公開Topの検証後は通常表示へ戻した
- スマートフォン実機の表示確認は未確認

## FAQ title and answer revision (2026-09-12)

1. 「よくある質問」の見出しが中央寄せであること。
2. 期間・アクセス・購入・主催者のFAQ分類が残っていること。
3. 会場住所がアクセスFAQに追加されていること。
4. 回答の誤字・表現が修正され、既存の事実関係が保たれていること。
5. グッズ関連FAQがなく、3ページの既存表示に影響がないこと。

### Local evidence

- `よくある質問`の中央寄せを確認
- FAQ4分類、回答11項目、会場住所を確認
- 開催時間、購入方法、支払い、発送、領収書、企画背景の修正文を確認
- Topでグッズ・ECサイト・購入場所の文言がないことを確認
- Topで横スクロールなしを確認

### Public evidence

- `main`のコミット`7c67b28`反映後、公開Topで`main.css?v=20260912-faq-copy`の読み込みを確認
- 公開TopでFAQ見出し中央寄せ、4分類・11項目、会場住所、修正文、グッズ関連FAQなしを確認
- 公開Topで横スクロールなしを確認
- スマートフォン実機の表示確認は未確認

## Breakpoint and font-size calibration (2026-09-12)

1. モバイル`767px以下`、タブレット`768px〜1199px`、デスクトップ`1200px以上`の境界が揃っていること。
2. 本文・見出し・Galleryカテゴリの文字サイズが画面幅に応じて過度に小さくならないこと。
3. Top / Concept / Galleryの既存の縦書き・横書き・カード配置が保たれていること。
4. 3ページに横スクロールが発生しないこと。

### Local evidence

- 3ページで新キャッシュバスター`responsive-calibration`の読み込みを確認
- Top / Concept / Galleryのh2計13件が中央寄せであることを確認
- Top本文・FAQ本文の最小値14px、通常表示で16pxを確認
- Galleryカテゴリ見出し、紹介文、作品名・作者名のサイズを確認
- JavaScript構文、差分空白、レビューZIP整合性を確認

### Public evidence

- `main`のコミット`6c49c2f`反映後、公開3ページで`responsive-calibration`の読み込みを確認
- 公開Top / Concept / Galleryで文字サイズ、h2中央寄せ、横幅を確認
- 公開Galleryでカテゴリ見出し15px、紹介文18px、作品情報16pxを確認
- スマートフォン実機の表示・タップ確認は未確認

## Concept feeling copy and Contact glass update (2026-09-12)

1. Conceptの「A MOMENT TO FEEL／感じるということ」で、ラベル・見出し・本文が左揃えになっていること。
2. Contactの「内容を送信する」ボタンに、TopのViewと同じ液晶ガラス表現が適用されていること。
3. Contactボタンの通常表示が半透明・ぼかし・反射・陰影を持ち、ホバー／フォーカス時に背景色が変化すること。
4. Contactの入力項目、FAQ、共通Header／Footer、Concept／Galleryへのリンクが維持されていること。

### Evidence

- ローカルConceptで対象コピーの左揃えを確認
- 公開Conceptで対象セクションを確認
- ローカルおよび公開TopのContact下部で送信ボタンのガラス表示を目視確認
- 公開Topのフォーム・FAQ・共通ナビをAXツリーで確認
- スマートフォン実機の表示・タップは未確認

## Glass effect restore and arrow glyph update (2026-09-12)

レビュー時に以下を確認してください。

1. Top／Concept／GalleryのCTAと操作ボタンに液晶ガラスの半透明・ぼかし・反射枠・陰影があること。
2. CTAの矢印が`＞`表記になっていること。
3. ホバー／キーボードフォーカス時に背景色が濃くなり、矢印が右へ移動すること。
4. Galleryの絞り込み・ページ移動、FAQ、問い合わせ、モーダルの操作を維持していること。
5. ハンバーガーメニューの構造と表示を変更していないこと。
6. PC幅とスマートフォン幅でガラス表現、ボタンの折り返し、タップ領域を確認すること。

実装コミットは`0b0075c`です。公開ページは`glass-arrow-v1-verify-20260912-r2`で確認済みですが、スマートフォン実機確認は未実施です。

## Button background removal and hover update (2026-09-12)

レビュー時に以下を確認してください。

1. Top／Concept／Galleryのボタンが通常時は背景なしで表示されること。
2. Topの作品導線が`View →`で表示されること。
3. ホバー／キーボードフォーカス時に背景色が変化し、矢印が右へ移動すること。
4. Galleryの絞り込み・ページ移動、FAQ、問い合わせ、モーダルの操作を維持していること。
5. ハンバーガーメニューの構造と表示を変更していないこと。
6. PC幅とスマートフォン幅でボタンの折り返し、タップ領域、視認性を確認すること。

実装コミットは`dd95d86`です。公開ページは`button-hover-v1-verify-20260912-r2`で確認済みですが、スマートフォン実機確認は未実施です。

## All content buttons liquid unification (2026-09-12)

1. TopのConcept導線がTopのViewと同じ`liquid-button`構成であること。
2. Galleryの絞り込み・ページ移動が液晶グラス表示になっていること。
3. FAQ開閉、問い合わせ送信、モーダル操作の機能が維持されていること。
4. ConceptのGallery CTAと共通Header／Footerが維持されていること。
5. ハンバーガーのメニュー開閉を含む既存の専用操作が壊れていないこと。

### Evidence

- ローカルTopのConcept導線・FAQ、Galleryの操作ボタンを表示確認
- ローカル3ページでリンク、作品一覧、FAQ構造、共通ナビを確認
- `liquid-button.js`でネイティブ操作ボタンへ共通反応を付与し、既存の操作要素は保持
- `git diff --check`、JavaScript構文、編集前バックアップを確認
- スマートフォン実機の表示・タップ確認は未確認

### Public addendum

- push後、公開TopのConcept導線と公開Galleryの絞り込みボタンを新しい液晶グラス表示で確認
- 公開3ページのリンク、作品一覧、FAQ構造、共通ナビを確認

## Concept FV label removal (2026-09-12)

1. ConceptページFV中央の「Concept」ラベルだけが削除されていること。
2. 「ゆらゆら」とFV本文の縦書きが維持されていること。
3. 左側の共通ナビにある「CONCEPT」とHeader／Footerのリンクが維持されていること。
4. FV以外のConcept本文・見出し・CTAが維持されていること。
5. 公開ページで削除後のHTMLが配信されていること。

### Evidence

- ローカルConceptのAXツリーでFV中央ラベルがなく、タイトル・本文・リンクが残ることを確認
- 公開ConceptのAXツリーとスクリーンショットで同内容を確認
- `git diff --check`、編集前バックアップを確認
- スマートフォン実機の表示・タップ確認は未確認

## Concept FV vertical restore (2026-09-12)

1. ConceptページのFV（CONCEPT、タイトル、FV本文）が縦書きであること。
2. FV以外のConcept本文・見出し・Gallery CTAが横書き／中央寄せのままであること。
3. 共通Header／Footerの縦書きメニューとリンクが維持されていること。
4. Conceptページの既存文章・画像・Galleryリンクが維持されていること。
5. 公開ページで新しいConcept CSSが読み込まれていること。

### Evidence

- ローカルConceptでFVの縦書き表示と、FV以外の本文・CTAを確認
- 公開Conceptで安定表示後のFV、共通ナビ、本文、Gallery CTAを確認
- `git diff --check`、JavaScript構文、編集前バックアップを確認
- スマートフォン実機の表示・タップ確認は未確認

## Body font-size range update (2026-09-12)

1. 本文の指定範囲がモバイル`12〜14px`、タブレット`13〜15px`、デスクトップ`14〜16px`であること。
2. 各本文サイズが`clamp()`で画面幅に応じて変化すること。
3. h2、h3、Gallery固有文字が本文との階層を保っていること。
4. 既存のFAQ、中央寄せ、リンク、横幅に影響がないこと。

### Local evidence

- `font-scale-v2`の読み込みを3ページで確認
- Top本文15.1px、h2 29.3px、FAQ見出し18.2pxを確認
- Concept本文16px、Galleryカテゴリ約14.6pxを確認
- 3ページで横スクロールなし、h2中央寄せを確認

### Public evidence

- `main`のコミット`b72deb2`反映後、公開3ページで`font-scale-v2`の読み込みを確認
- 公開Top / Concept / Galleryで文字サイズ、h2中央寄せ、横幅を確認
- 公開Topの本文15.7px、公開Galleryのカテゴリ15px・紹介文18px・作品情報15.7pxを確認
- スマートフォン実機の表示・タップ確認は未確認

## Concept horizontal text and liquid button update (2026-09-12)

1. ConceptページのFVに縦書きが残っておらず、ラベル・ロゴ・説明文が横書きで中央に揃っていること。
2. Conceptページ内の見出し・本文・説明ラベル・導線が中央寄せであること。
3. 「Galleryへ」ボタンがTopのViewと同じリキッドグラスの見た目・動作であること。
4. Conceptページの既存文章・画像・共通Header／Footer・Galleryリンクが維持されていること。
5. ハンバーガーの開閉とページ遷移を壊していないこと。

### Evidence

- ローカルConceptで横書き、中央寄せ、`liquid-button`を確認
- 公開Conceptで`Galleryへ ↗`リンク、既存コンテンツ、共通ナビを確認
- `liquid.css`、`liquid-button.js`の読み込み、JavaScript構文、差分空白を確認
- スマートフォン実機の表示・タップ確認は未確認

## Top Concept spacing update (2026-09-12)

1. TOPのConcept見出しが本文ブロックに対して中央に配置されていること。
2. 本文の行間が広すぎず、PC／スマホで読みやすく保たれていること。
3. 見出しサイズ・字間・見出し下余白が画面幅に応じて自然に変化すること。
4. Concept導線、作品セクション、FAQ、Access、共通ナビに影響がないこと。
5. TOPの横スクロールや本文の重なりが発生しないこと。

### Evidence

- 実効対象の`top-legacy.css`を更新し、TOPのConcept見出し・本文・導線をローカルで確認
- 公開Topを`top-concept-spacing-v2`クエリで読み込み、本文・導線・後続コンテンツを確認
- Concept／Galleryの公開コンテンツと共通ナビを確認
- `git diff --check`、JavaScript構文、編集前バックアップ、レビューZIPを確認
- スマートフォン実機の表示・タップ確認は未確認

## Writing direction update (2026-09-12)

1. FVのロゴ・説明文・Conceptラベル・Galleryの「作家紹介」が縦書きになっていること。
2. Header／Footerの全メニューが縦書きのまま維持されていること。
3. FV以外のTop／Concept／Galleryの見出し・本文・FAQ・作品情報・ボタンが横書きになっていること。
4. GalleryのPC／スマホ相当幅でFV見出しが画面内に収まり、本文のレイアウトが崩れないこと。
5. 3ページのリンク、作品一覧、FAQ、既存JS動作に影響がないこと。

### Evidence

- ローカル3ページで新しいwriting-mode指定と共通ナビ・本文・作品一覧を確認
- 公開3ページを`writing-mode-v1`クエリで読み込み、コンテンツとリンクを確認
- `git diff --check`、JavaScript構文、編集前バックアップを確認
- スマートフォン実機の表示・タップ確認は未確認

## FAQ flat surface and Contact glass correction (2026-09-12)

1. Contactの「内容を送信する」ボタンに、半透明・ぼかし・反射・陰影のガラス表現があること。
2. FAQの各アコーディオン行からガラス効果が外れ、平面表示になっていること。
3. FAQの開閉、Contactフォーム、共通Header／Footer、他ページへのリンクが維持されていること。

### Evidence

- ローカルTopで送信ボタンを確認
- ローカルおよび公開TopでFAQの平面表示を確認
- 公開TopのFAQボタンがアクセシブルなボタン要素として残っていることを確認
- スマートフォン実機の表示・タップは未確認

## Contact cursor-position hover correction (2026-09-12)

1. Contact送信ボタンのホバー時に、カーソル位置を中心として背景色の濃淡が変化すること。
2. Contact送信ボタンのガラス表現（半透明、ぼかし、反射、陰影）が維持されていること。
3. FAQアコーディオン行にガラス効果が戻っていないこと。

### Evidence

- `--mx`／`--my`を使用したContactホバー背景をソースで確認
- ローカルおよび公開TopのContact／FAQを確認
- スマートフォン実機の表示・タップは未確認

## Square arrow and extended Top Concept copy (2026-09-12)

1. CTAの`＞`が正方形の枠内に表示されていること。
2. TopのConcept本文が追加文を含み、読みやすく表示されていること。
3. Concept／Galleryのボタン、共通ナビ、FAQ、Contactフォームの機能が維持されていること。

### Evidence

- ローカルTopで正方形矢印と追加文を確認
- 公開Topで正方形矢印と追加文を確認
- 公開Topのリンク、FAQ、Contact構造を確認
- スマートフォン実機の表示・タップは未確認

## CSS chevron arrow correction (2026-09-12)

1. ボタンの矢印が、同じ幅・高さの正方形領域に右辺・下辺の2辺だけを描き、角度を回転したCSSシェブロンになっていること。
2. 文字の`＞`や外周を囲む正方形枠ではないこと。
3. ホバー／フォーカス時に矢印の角度を保ったまま右へ移動すること。
4. ボタンの読み上げ名、リンク、Concept本文が維持されていること。

### Evidence

- ローカルTopでCSSシェブロンと追加文を確認
- 公開TopでCSSシェブロンと追加文を確認
- AXツリーでボタン名が矢印文字を重複しないことを確認
- スマートフォン実機の表示・タップは未確認

## FAQ content creation (2026-09-12)

1. FAQに「期間と場所と時間」「アクセス（駐車場と最寄り駅）」「展示について」「お問い合わせ」「主催者（企画背景、コンセプト）」の5カテゴリが表示されること。
2. FAQ内に購入方法、支払い方法、発送について、領収書について、および購入カテゴリが残っていないこと。
3. 「展示について」「お問い合わせ」の質問を開くと、追加した回答が表示されること。
4. 既存のFAQ質問を開閉でき、同時に1項目だけが開く挙動と`aria-expanded`が維持されていること。
5. Contactフォームの既存構造、Concept／Galleryリンク、共通Header／Footerに影響がないこと。

### Evidence

- ローカルFAQで5カテゴリと追加回答を確認
- 公開TopのFAQで新内容を確認
- ローカルおよび公開Topで追加質問の開閉と`aria-expanded`を確認
- スマートフォン実機の表示・タップは未確認

## FAQ answer wording and contact category removal (2026-09-12)

1. FAQが「期間と場所と時間」「アクセス（駐車場と最寄り駅）」「展示について」「主催者（企画背景、コンセプト）」の4カテゴリで表示されること。
2. FAQ内の「お問い合わせ」カテゴリと質問・回答が残っていないこと。
3. FAQの全回答が、日付・交通・駐車場・住所を含む説明文として表示されること。
4. FAQの開閉機能、`aria-expanded`、Contactフォーム、Concept／Galleryリンクが維持されていること。

### Evidence

- ローカルFAQで4カテゴリと説明口調の回答を確認
- 公開TopのFAQで4カテゴリ、回答文、「お問い合わせ」カテゴリの削除を確認
- 公開TopでFAQ項目を開き、`aria-expanded="true"`を確認
- スマートフォン実機の表示・タップは未確認

## FAQ answer font-size reduction (2026-09-12)

1. FAQ回答だけが、変更前の共通本文サイズから2px小さくなっていること。
2. FAQの質問行と見出しの文字サイズが変更されていないこと。
3. 回答のレスポンシブ指定が`clamp`で維持され、表示が崩れていないこと。
4. FAQの開閉、Contactフォーム、Concept／Galleryリンク、共通Header／Footerが維持されていること。

### Evidence

- 公開Topで回答と質問行の計算フォントサイズを実測
- 公開Topで回答を開き、説明文の表示を確認
- ソースで`.faq-sub-txt`だけに2px縮小指定があることを確認
- スマートフォン実機の表示・タップは未確認

## Verified access information addition (2026-09-13)

1. 会場情報に横浜市営バスの案内が表示され、「元町」停留所から徒歩約2分と読めること。
2. FAQのアクセス欄に「横浜市営バスで行けますか？」と、21・101・105・106系統の説明が表示されること。
3. 回答に、運行状況や時刻を来場前に確認する注意書きが含まれること。
4. 既存の鉄道・駐車場・住所のFAQ、FAQ内の「お問い合わせ」カテゴリなし、アコーディオン開閉が維持されていること。
5. Concept／Galleryの表示と共通ナビに影響がないこと。

### Evidence

- 会場の公開アクセス案内（https://bizhorizon.sakura.ne.jp/charlotte.usagi/access/）に記載されたバス情報を使用
- ローカルおよび公開TopでFAQと会場情報を確認
- 公開Topでバス質問を開き、`aria-expanded="true"`を確認
- 公開Concept／Galleryのタイトル、本文、作品一覧、共通ナビを確認
- スマートフォン実機の表示・タップは未確認

## FAQ emphasis and additional map guidance (2026-09-13)

1. 展示日、開催時間、駅・出口・徒歩時間、住所、バス停・系統など、重要情報だけが太字で表示されること。
2. FAQのアクセス欄に「地図や経路を確認できますか？」が追加され、回答が説明口調で表示されること。
3. FAQの4カテゴリ、既存の鉄道・駐車場・住所・バス案内、「お問い合わせ」カテゴリなしが維持されていること。
4. FAQのアコーディオン開閉と`aria-expanded`が維持されていること。
5. 入場料・予約、撮影可否、車いす・ベビーカー対応、混雑・滞在時間など、未確認情報が推測で追加されていないこと。
6. Concept／Gallery、共通Header／Footer、Contactフォームに影響がないこと。

### Evidence

- 会場の公開アクセス案内（https://bizhorizon.sakura.ne.jp/charlotte.usagi/access/）を検索・確認
- ローカルおよび公開Topで太字表示、地図FAQ、FAQ開閉を確認
- 公開ブラウザで重要箇所の計算フォントウェイト`700`を確認
- 公開Concept／Galleryのタイトル、本文、作品一覧、共通ナビを確認
- スマートフォン実機とキーボード操作は未確認

## Opening hours exception update (2026-09-13)

1. FAQの開催時間に、初日（10/06）は13:00から、最終日（10/12）は13:00までと表示されること。
2. その他の日が11:30〜20:00、LightUpが20:00〜21:00として表示されること。
3. 下部の会場情報が「通常日」「初日」「最終日」「LightUp」の4行で、FAQと同じ案内になっていること。
4. 初日・最終日・通常日の時間が太字で目立ち、FAQのアコーディオン開閉が維持されていること。
5. FAQ4カテゴリ、アクセス案内、FAQ内の「お問い合わせ」カテゴリなし、Concept／Gallery、共通Header／Footer、Contactフォームが維持されていること。

### Evidence

- ローカルおよび公開Topで開催時間と会場情報を確認
- 公開Topで「開催時間」を開き、`aria-expanded="true"`と更新後の回答を確認
- ローカルおよび公開ブラウザで重要時間の太字表示を確認
- Concept／Galleryの公開表示を確認
- スマートフォン実機とキーボード操作は未確認

## Mobile header/footer shared layout and mobile-first calibration (2026-09-13)

1. Top・Concept・Galleryすべてで、Header／Footerが同じ共有構造になっていること。
2. スマートフォン幅で、左から「トップ - TOP」「世界観 - CONCEPT」「作品 - GALLERY」の順に縦書き表示され、文字の高さ・線の位置・余白が揃っていること。
3. 先頭では共通ナビ、スクロール後は既存の収納とハンバーガーが表示され、開いたメニューの3項目が375px幅の画面内に収まること。
4. Footerのロゴ・会期・ナビ・コピーライトがスマートフォンで切れず、横方向スクロールが発生しないこと。
5. PC幅では既存のHeader／Footerの位置・寸法・縦書き構成が変わらず、Galleryにも旧専用Footerが残っていないこと。
6. `clamp()`による文字サイズ・余白の流動調整が、狭い画面で過度に詰まらず、広い画面でPC構成を崩さないこと。
7. 実機スマートフォン／タブレット、各ブラウザのフォント表示、キーボード操作は別途確認すること。

### Evidence

- ローカル375px幅および1280px幅で計算寸法・横方向オーバーフロー・ナビ順序を確認
- 公開Topを375px幅で表示し、スクロール収納・ハンバーガー開閉・Footerを確認
- 公開Top・Concept・Galleryの共有Header／FooterとCSSキャッシュバスターを確認
- 実機スマートフォン／タブレットの表示・タップは未確認

## Page-navigation CTA margin unification and Top responsive refinement (2026-09-13)

1. ページ遷移用CTAだけ（Topの「Conceptを読む」「View」、ConceptのGallery遷移）の上マージンが同じ基準で揃っていること。
2. 送信ボタン、FAQアコーディオン、ハンバーガーメニュー、Galleryの絞り込み・作品操作の余白や動作が、今回の統一対象に含まれていないこと。
3. Topをタブレット幅（768px／1024px程度）で開き、本文・作品カード・Viewボタンが重ならず、横スクロールが発生しないこと。
4. Topをスマートフォン幅（390px／430px程度）で開き、FV・Concept・作品カード・ページ遷移CTAが画面内に収まり、横スクロールが発生しないこと。
5. TopのConcept／View、ConceptページのGallery遷移が正常にページ遷移し、既存のガラス効果とホバー表現が維持されていること。
6. Conceptの見出し・本文・画像、Galleryの見出し・4作品・共通ナビに今回のTop調整が影響していないこと。

### Evidence

- ローカル狭幅・広幅の計算マージンと横方向オーバーフローを確認
- 公開Topで新しいCSSキャッシュバスターとページ遷移CTAのマージンを確認
- 公開ConceptのGallery CTAと公開Galleryの構造・作品数・共通ナビを確認
- タブレット実機／実ブラウザ幅とスマートフォン実機、キーボード操作は未確認

## Tablet header/footer smartphone-equivalent layout and spacing (2026-09-13)

1. 630px幅のTop・Concept・Galleryで、スマートフォンと同じ縦書き3列のHeader／Footerが表示されること。
2. 768〜1199px幅でもPC用の大きなリンクへ戻らず、Top・Concept・Galleryのナビ順序と縦書き方向が揃うこと。
3. タブレットでは画面端・内部・Footer上下の余白がスマートフォンより広く、`clamp()`で幅に応じて自然に変化すること。
4. 375px幅のスマートフォン表示、1280px幅のPC表示が今回の変更で変わらないこと。
5. スクロール収納後のハンバーガー開閉、3項目の画面内配置、横方向オーバーフローなしが維持されること。
6. Concept本文・画像、Galleryの見出し・4作品・共通Footerに影響がないこと。
7. 実機タブレット／スマートフォンとキーボード操作は別途確認すること。

### Evidence

- ローカル630px／768px／1024px／375px／1280pxで計算寸法と`scrollWidth`を確認
- ローカルTopでスクロール収納後にメニューを開き、`aria-expanded`、画面高内の3リンク、横幅一致を確認
- 公開Top・Concept・Galleryの630pxで新CSSキャッシュバスター、共通Header／Footer、横方向オーバーフローなしを確認
- 公開Topの768pxと1280pxでタブレット／PC回帰を確認
- 実機タブレット／スマートフォンの表示・タップ、キーボード操作は未確認

## Menu label order and English scale (2026-09-13)

### Acceptance criteria

1. 常時表示のHeader／Footer、スクロール後のハンバーガー展開メニュー、Top・Concept・Galleryのすべてで、左から「トップ - TOP」「世界観 - CONCEPT」「作品 - GALLERY」の並びになっていること。
2. 各メニュー項目が日本語を上段、区切り線を中央、英語を下段に表示し、文字の高さと線の位置が項目間で揃っていること。
3. 英語の計算フォントサイズが、同じ項目の日本語より正確に3px小さいこと。狭幅では最小値、タブレット／PCでは流動値になっても差分は3pxを維持すること。
4. 375px、630px、1024px、1280px相当で、メニューが画面内に収まり、横方向スクロールが発生しないこと。
5. スクロール後のハンバーガー開閉、既存のリンク先、Header／Footerの共有構造が維持されていること。
6. Concept／Galleryの本文・画像・作品一覧に影響がなく、共通メニューだけが同じ規則で更新されていること。
7. 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作は別途確認すること。

### Evidence

- ローカルと公開Topの375／630／1024／1280pxで、DOM順序、計算フォントサイズ、位置、横方向オーバーフローを確認。
- 公開Topの630pxでスクロール収納後のハンバーガーを開き、`aria-expanded`と3リンクの同じ表示規則を確認。
- 公開Concept／Galleryの630pxでHeader／Footer各3リンクと、本文・作品表示の継続を確認。
- `index.html`、`concept.html`、`gallery.html`の共通CSSキャッシュバスター更新と、編集前バックアップを確認。

## Tablet access layout matched to smartphone (2026-09-13)

1. 481〜1199pxのアクセスセクションで、経路案内・地図・住所・問合せ・営業時間がスマートフォンと同じ1列で表示されること。
2. 住所・問合せ・営業時間が横並びにならず、各情報が同じ左端から順に縦へ並ぶこと。
3. 地図がアクセス内側の幅100%で表示され、情報欄・地図に横方向のはみ出しがないこと。
4. タブレットの情報欄の上下線と内側余白が読みやすく、狭いスマホ表示とPCの既存3列表示を壊していないこと。
5. 公開Topで更新後の`main.css`が読み込まれ、630px／768px／1024px相当で同じ縦積みになること。
6. Concept／Galleryの本文・画像・ナビ・既存動作に影響がないこと。
7. 実機タブレット／スマートフォン、キーボード操作、主要ブラウザのフォント表示は別途確認すること。

### Evidence

- ローカル630px／768px／1024pxで情報3件の同一x座標、縦方向配置、横方向オーバーフローなしを確認
- ローカル375pxと1280pxでスマホ／PCの回帰を確認
- 公開Topの630px／768px／1024pxで更新CSS、縦積み、横方向オーバーフローなしを確認
- 公開Topの375px／1280pxで回帰を確認
- CSSセレクターを`.section--access`内に限定し、Concept／Gallery固有ファイルを変更していないことを確認
- 実機タブレット／スマートフォンとキーボード操作は未確認

## Menu Japanese-first labels, centered borders, and compact spacing (2026-09-13)

### Acceptance criteria

1. 常時表示のHeader／Footer、スクロール後のハンバーガー展開メニュー、Top・Concept・Galleryのすべてで、左から「トップ - TOP」「世界観 - CONCEPT」「作　品 - GALLERY」になっていること。
2. 各リンクが日本語、`.menu-border`、英語の順で、装飾線が日本語と英語の間の中央にあること。
3. 3項目の日本語・英語の上端／下端と線の位置が揃い、上下の余白が過去の広い状態へ戻っていないこと。
4. 英語がソース上は`clamp()`で日本語より3px小さく、375／630／1024／1280pxで横方向オーバーフローがないこと。
5. スクロール収納後のハンバーガー開閉、既存のリンク先、Header／Footerの共有構造が維持されていること。
6. Concept／Galleryの本文・画像・作品一覧に影響がなく、共通メニューだけが更新されていること。
7. 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作は別途確認すること。

### Evidence

- ローカル375／630／1024／1280pxで、ラベル順、`作　品`、DOM順、中央線、英語3px、横方向オーバーフローなしを確認
- 公開v5の375／630／1024／1280pxで、ラベル順、中央線、余白、画面内収まり、横方向オーバーフローなしを確認
- 公開v5の630pxでスクロール収納後のハンバーガーを開閉し、`aria-expanded`と3リンクを確認
- 公開v5のConcept／Galleryで共通Header／Footerと本文・作品表示の継続を確認
- 公開Chromeプロファイルの最小フォントサイズが12pxのため、狭幅の実効英語サイズ差は別途オーナー環境で確認が必要

## Relative English menu sizing correction (2026-09-13)

### Acceptance criteria

1. 英語のフォントサイズを固定値にせず、各幅で日本語の現在サイズから3px下げること。
2. CSSの指定が`calc(var(--menu-label-jp-size) - 3px)`となり、スマートフォン／タブレット／PCで同じ相対関係を保つこと。
3. ラベル順「トップ - TOP」「世界観 - CONCEPT」「作　品 - GALLERY」、中央の`.menu-border`、詰めた余白を維持すること。
4. Concept／Galleryの本文・画像・作品一覧に影響がないこと。

### Evidence

- ローカル375／630／1024／1280pxで日本語の計算サイズ−英語の計算サイズが3pxになることを確認
- 公開v6のTopで相対指定を含むCSSの読み込み、ラベル順、中央線、余白、横方向オーバーフローなしを確認
- 公開Concept／Galleryで共通メニューと本文・作品表示の継続を確認
- 公開確認用Chromeの最小フォントサイズ12pxが狭幅の実効値に影響するため、通常設定の実機／ブラウザで最終確認が必要

## Menu English size range 10–12px (2026-09-13)

### Acceptance criteria

1. 全端末の英語メニュー文字が`clamp(10px, ..., 12px)`で最小10px・最大12pxになること。
2. 375／630／1024／1280pxで、レイアウト・ラベル順・中央線・余白・横方向オーバーフローなしを維持すること。
3. Concept／Gallery本文・画像・作品一覧に影響がないこと。
4. 公開確認ブラウザの最小フォントサイズが実効値に影響する場合は、通常設定の実機／ブラウザで最終確認すること。

### Evidence

- ローカル375／630／1024／1280pxで英語10／10.52／12／12pxを確認
- 公開v7の同幅でラベル、中央線、余白、画面内収まり、横方向オーバーフローなしを確認
- 公開v7の630pxで収納後のハンバーガーメニューを開閉し、3リンクの順序と中央線を確認
- 公開v7のConcept／Galleryで共通Header／Footer、本文・作品表示を確認
- 公開確認用Chromeの最小フォントサイズが12pxのため、実効10px表示は通常設定の実機／ブラウザで追加確認が必要

## Smartphone menu spacing tightened (2026-09-13)

### Acceptance criteria

1. スマホ幅のHeader／Footer／収納後ハンバーガーメニューの項目間余白が、従来の8〜10pxから4〜6pxへ狭くなること。
2. 各リンクの`width`、日本語・中央線・英語の構造、ラベル順、タップ可能領域を維持すること。
3. 320／375／480pxで横方向オーバーフローがなく、PC幅の既存配置を変更しないこと。
4. Concept／Galleryの共通メニュー、本文、画像、作品一覧に影響がないこと。

### Evidence

- ローカル320／375／480pxでgap4／4.00125／5.1216pxと画面内収まりを確認
- 公開v8のTopで同幅のgap、ラベル順、横方向オーバーフローなしを確認
- 公開v8の375pxで収納後ハンバーガーの開閉を確認
- 公開v8のConcept／Galleryで共通メニュー、本文・作品表示を確認
- 公開Topの1280pxで既存gap40pxの回帰を確認
- 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作は追加確認が必要

## iPhone SE menu left alignment (2026-09-13)

### Acceptance criteria

1. SE幅（375px以下）で、メニュー上部のHeader／Footerテキストと日本語ラベル、区切り線、英語ラベルの左端が揃うこと。
2. メニュー項目のwidth／height、gap、文字サイズ、リンク先、タップ領域を変更しないこと。
3. 376／480／768／1280pxでは従来の中央配置を維持し、横方向オーバーフローを発生させないこと。
4. Concept／Galleryの共通メニュー、本文、画像、作品一覧に影響がないこと。

### Evidence

- ローカル375pxでHeaderテキストと各メニュー要素の左端が約19.99pxで一致し、横方向オーバーフローなしを確認
- ローカル376／480／768／1280pxで既存配置、width、gap、横方向オーバーフローなしを確認
- 公開Topで`menu-style.css?v=20260913-se-menu-align-v10`と`main.css?v=20260913-se-menu-align-v10`の読み込み、左端一致、ラベル順を確認
- 公開Concept／Galleryでv10共通メニュー、本文／作品表示、横方向オーバーフローなしを確認
- 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作は追加確認が必要

## Smartphone menu width adjusted (2026-09-13)

### Acceptance criteria

1. スマホ幅のメニュー項目`width`が36〜40pxの流動値となり、前回の項目間gap4〜6pxと組み合わさって表示幅が狭くなること。
2. 日本語・中央線・英語の構造、ラベル順、リンク先、収納後ハンバーガーの動作を維持すること。
3. 320／375／480pxで横方向オーバーフローがなく、1280pxのPC配置に影響しないこと。
4. Concept／Galleryの共通メニュー、本文、画像、作品一覧に影響がないこと。

### Evidence

- ローカル320／375／480pxでリンク幅36／40／40px、メニュー幅116／128／130.234pxを確認
- 公開v9のTopで同幅、gap、ラベル順、横方向オーバーフローなしを確認
- 公開v9の375pxで収納後ハンバーガーを開閉確認
- 公開v9のConcept／Galleryで共通メニュー、本文・作品表示を確認
- 公開v9の1280pxで既存リンク幅58pxとgap40pxを確認
- 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作は追加確認が必要

## Menu link padding removed (2026-09-13)

### Acceptance criteria

1. Header／Footerのメニューリンク内側`padding`が0になり、`width`と`height`は維持されること。
2. 日本語ラベル、中央ボーダー、英語ラベルの配置、SE幅の`li`全体移動、リンク先、タップ領域を維持すること。
3. 375px以下、376px以上の各幅で横方向オーバーフローがないこと。
4. Top／Concept／GalleryでCSS v12が読み込まれ、本文・画像・作品表示に影響がないこと。

### Evidence

- ローカル375pxでHeaderリンクのcomputed paddingが`0px`、width40px・height220px、SEの`li`位置と横方向オーバーフローなしを確認
- ローカル1280pxでcomputed paddingが`0px`、width58px、既存配置と横方向オーバーフローなしを確認
- ローカルConcept／Galleryの375pxでv12 CSS、padding0px、見出し・本文・作品表示を確認
- 公開Top／Concept／Galleryの375pxでv12 CSS、padding0px、共通メニュー、横方向オーバーフローなしを確認
- 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作は追加確認が必要

## iPhone SE whole-li menu alignment correction (2026-09-13)

### Acceptance criteria

1. 375px以下で、Header／Footerの各`ul > li`全体が上部テキストの開始位置へまとまって左移動すること。
2. 各`li`内部の日本語ラベル、中央ボーダー、英語ラベルが同じグループとして移動し、相互の位置関係を崩さないこと。
3. 文字サイズ、リンク幅・高さ、gap、タップ領域、リンク先は変わらないこと。376px以上では従来配置を維持すること。
4. Top／Concept／GalleryでCSS v11が読み込まれ、横方向オーバーフローがないこと。

### Evidence

- ローカル375pxで、先頭`li`のx座標が約19.99pxから約9.99pxへ移動し、子要素も同じ約10px分移動することを確認
- ローカル320／375／376／480／768／1280pxで配置と横方向オーバーフローを確認
- ローカルConcept／Galleryの375pxでv11 CSS、共通メニュー、見出し・本文・作品表示を確認
- 公開Top／Concept／Galleryの375pxでv11 CSS、`li`全体の位置、ラベル順、横方向オーバーフローなしを確認
- 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作は追加確認が必要

## All-device button typography and spacing (2026-09-14)

### Acceptance criteria

1. Top／Conceptのページ遷移ボタンが、全端末幅で`clamp()`による文字サイズ・余白・高さになっていること。
2. ボタン矢印が2辺ボーダーを回転した正方形で、計算上ボタン文字サイズより4px小さいこと。
3. Topの送信、Galleryの絞り込み・ページ移動ボタンにも同じモバイルファーストの文字サイズ・余白調整が適用されること。
4. タブレットのHeader／Footerリンク内側paddingが0pxで、リンク幅・高さ・タップ領域・メニュー順を維持すること。
5. Top／Concept／Galleryの表示、既存のガラス効果、リンク、横幅に影響がないこと。

### Evidence

- ローカル320／375／480／768／1024／1280pxでCTAの`clamp()`計算値、矢印差分4px、native controlの文字サイズ・余白を確認
- ローカルConcept／Galleryで新キャッシュバスター、CTA、Galleryコントロール、見出し・本文・作品表示、横方向オーバーフローなしを確認
- 公開Topの375pxと768pxでCTA、送信ボタン、メニューpadding0px、横方向オーバーフローなしを確認
- 公開Concept／Galleryの375pxでCTA／Galleryコントロール、本文、作品表示、横方向オーバーフローなしを確認
- `git diff --check`、`node --check assets/js/liquid-button.js`、`node --check assets/js/allmenu.js`、`unzip -tq`を実施
- ソース反映コミットは`85f5f7b`。編集前コピーは`backups/20260914_before_button_size_spacing/`に保存

### Remaining acceptance

- 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作での見え方・タップ確認

## Header menu right alignment and Concept mobile refinement (2026-09-14)

### Review points

1. Header／Footerの常時表示メニューがTop／Concept／Galleryで右端基準になり、タイトル・開催期間の左側配置を崩していないか。
2. 60%スクロール後のハンバーガーが右側から表示され、クリック時に全画面メニューを開けるか。
3. Top／Conceptのコンセプト本文が文末の「。」ごとに読みやすく改行されているか。
4. Conceptページの`EXHIBITION STATEMENT`と「〜 ゆらぎの間で 〜」の間隔が重ならず、スマホ・タブレットで本文が画面内に収まっているか。

### Evidence prepared

- ローカル375／768／1024／1440pxで右端配置、見出し間隔、横方向オーバーフローなしを確認しました。
- 公開Top／Concept／Galleryの375／768pxでv14／Concept v2の読み込みと表示を確認しました。
- 公開Topの375pxでスクロール収納、ハンバーガー開閉、全画面メニュー、リンク先を確認しました。
- 編集前バックアップは`backups/20260914_before_menu_right_concept_mobile/`に保存しています。

### Remaining owner acceptance

- 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作による最終確認。

## Whole Header right-edge alignment (2026-09-14)

### Review points

1. Top／Concept／Galleryで、タイトル・開催期間・ナビゲーションを含む`.header`全体が同じ右端基準になっているか。
2. 375／768pxで`.header`、`.header-txt`、通常表示メニューが画面内に収まり、横方向オーバーフローがないか。
3. Gallery固有CSSの後勝ちルールと`gallery.css` v3キャッシュバスターが公開版で読み込まれているか。
4. 60%スクロール相当の収納、ハンバーガー開閉、全画面メニューに影響がないか。

### Evidence prepared

- ローカルTop 375／768／1440px、ローカルGallery 375pxで右端と横幅を測定しました。
- 公開Top／Concept／Galleryの375／768pxで右端一致と`scrollWidth=clientWidth`を確認しました。
- 公開Galleryで`gallery.css?v=20260914-header-whole-right-v3`の読み込みを確認しました。
- 公開Topの375pxで`scrollY=401`後の`is-compact`、ハンバーガー開閉、全画面メニューを確認しました。
- 編集前バックアップは`backups/20260914_before_header_whole_right/`に保存しています。

### Remaining owner acceptance

- 実機スマートフォン／タブレット、Safari・Firefox・Edgeなど主要ブラウザ、キーボード操作による最終確認。

## Header and menu overlap correction (2026-09-15)

### Review points

1. Top／Concept／Galleryで、タイトル・開催期間と縦書きメニューが重ならず、メニューがテキスト領域の下に配置されているか。
2. `.header`・タイトル／開催期間・メニューの右端基準が維持されているか。
3. 375／768／1440pxで画面内に収まり、横方向オーバーフローが発生していないか。
4. 収納後のハンバーガー開閉と全画面メニューに影響がないか。

### Evidence prepared

- ローカルTop／Concept／Galleryの375／768／1440pxで、テキストと各メニュー項目の矩形交差を確認しました。
- 公開Top／Concept／Galleryの375／768px、および公開Topの1280pxで同じ確認を行いました。
- 公開版で`main.css?v=20260914-header-overlap-fix-v16`、Galleryで`gallery.css?v=20260914-header-overlap-fix-v4`を確認しました。
- 公開Topの375pxでスクロール収納、ハンバーガー開閉、全画面メニューを確認しました。
- 編集前バックアップは`backups/20260914_before_header_overlap_fix/`に保存しています。

### Remaining owner acceptance

- 実機スマートフォン／タブレット、Safari・Firefox・Edgeなど主要ブラウザ、キーボード操作による最終確認。

## MD button and arrow size correction (2026-09-14)

### Acceptance criteria

1. `.md`ボタンの文字サイズが`clamp()`で14px〜16pxになること。
2. `.arrow`の幅・高さが`clamp()`で10px〜12pxになり、右辺・下辺のボーダーが1pxになること。
3. `.md`文字サイズと矢印サイズの差分4px、回転した正方形の形状、ホバー時の右移動を維持すること。
4. Top／Concept／Galleryの既存リンク、ガラス効果、レイアウト、横幅に影響がないこと。

### Evidence

- ローカル320／375／480／768／1024／1280pxで`.md`文字、矢印の幅・高さ、ボーダー、差分を確認
- 公開Topの375pxで14px／10px、ボーダー1px、差分4px、v8キャッシュバスターを確認
- 公開Concept／Galleryの375pxでCTA、見出し、本文、作品表示、横方向オーバーフローなしを確認
- 公開Topの768pxで可変値、矢印差分約4px、横方向オーバーフローなしを確認
- ソース反映コミットは`8641adb`。編集前コピーは`backups/20260914_before_arrow_md_size/`に保存

### Remaining acceptance

- 実機スマートフォン／タブレット、主要ブラウザ、キーボード操作での見え方・タップ確認
