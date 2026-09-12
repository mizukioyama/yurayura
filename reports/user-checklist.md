# User checklist

## Top section layout update (2026-09-12)

- [ ] TopのConceptが見出しと本文の2列で表示され、右側の過剰な空白が抑えられている
- [ ] `Conceptを読む` が本文側にあり、Conceptページへ遷移できる
- [ ] TopのArtistsの見出し・紹介文・作品カードが中央にまとまっている
- [ ] Artistsの作品画像が見え、`Mizuki` ラベルが画像全体を覆っていない
- [ ] Viewボタンが作品カードと同程度の幅に収まっている
- [ ] スマートフォン幅で横はみ出しやレイアウト崩れがない
- [x] 公開TopでConcept／Artistsのレイアウトを確認する

## Current task (2026-09-12)

- [ ] 公開URLの `/yurayura/concept.html` が表示される
- [ ] ConceptのHero、本文、余白、霧・揺らぎ演出がTopと調和している
- [ ] Conceptのh2などの見出しが横書きで表示される
- [ ] ConceptのヘッダーとフッターがTopと同じ表示になる
- [ ] Concept内に既存作品写真が2点表示される
- [ ] Topの `Conceptを読む` からConceptへ移動できる
- [ ] TOP / CONCEPT / GALLERY が各ページで正しく遷移する
- [ ] Galleryの既存4作品、絞り込み、ページネーションが維持されている
- [ ] 320〜480px相当で横スクロールや文字・画像の重なりがない
- [ ] 実機スマートフォンで最終確認する

## Top label correction (2026-09-12)

- [x] Header / Footerの日本語ラベルを`トップ`へ変更する
- [x] 左から`トップ - TOP`、`世界観 - CONCEPT`、`作品 - GALLERY`の順を維持する
- [x] 英語名から日本語説明までを各リンク1つの選択範囲にする
- [x] Concept / Galleryの本文と既存リンク先を維持する
- [ ] 実機スマートフォンでタップ範囲を最終確認する
- [x] 公開Topで`トップ`の表示を確認する

## Header / Footer label alignment (2026-09-12)

- [x] 3項目の英語・日本語ラベルの開始位置を揃える
- [x] 3項目の区切り線の位置と高さを揃える
- [x] 各項目を1つのリンク範囲として維持する
- [x] Top / Concept / Galleryの既存リンク先を維持する
- [ ] 公開Topで最終配置を確認する

## Header link interaction fix (2026-09-12)

- [x] Headerリンクをクリック可能にする
- [x] Headerの「世界観」から`concept.html`へ遷移する
- [x] 既存の縦書き・左右順・リンク先を維持する
- [x] 公開TopでHeaderの「世界観」のクリック遷移を確認する
- [ ] スマートフォン実機で各リンクのタップ遷移を確認する

## Header / Footer restoration (2026-09-12)

- [x] デスクトップでスクロール後もHeader本体が表示される
- [x] Footerの中央縦型ナビとコピーライトを維持する
- [x] Concept本体に変更を加えていない
- [x] 公開TopでHeader / Footerを確認する
- [x] `TOP / トップページ`、`CONCEPT / 世界観`、`GALLERY / 作品` を縦書きにする
- [x] 左から `TOP → CONCEPT → GALLERY`（トップ → 世界観 → 作品）の順にする
- [x] 英語名から日本語説明までを各リンクの選択範囲にする
- [x] 公開Topでナビ文言と縦書き表示を確認する
- [x] 公開Topで左からトップ → 世界観 → 作品の順を確認する
- [ ] スマートフォン実機でメニューを確認する

## Top historical composition restore (2026-09-12)

- [x] `assets/css/top-sections.css` が28f69fc時点の内容と一致する
- [x] Top専用復元CSSでConceptの縦組みを復元する
- [x] Top専用復元CSSでArtistsの縦組みと420×280pxカードを復元する
- [x] Concept / Galleryのソース差分を発生させない
- [x] 公開Topで復元後のレイアウトを確認する
- [x] 公開Concept / Galleryに影響がないことを再確認する
- [ ] 実機スマートフォンで最終確認する

公開URLのHTTP 200、Concept表示、Top導線、3ページナビ、Gallery導線は確認済みです。上記チェック欄の未完了項目は、ユーザー側の実機受入確認用です。

## Loading animation

- [ ] 初期表示時のローディングが約4.85秒で緩やかに完了する
- [ ] ローディング後に画面が残ったり、FV表示が遅延したりしない

## Current responsive review

- [ ] ブレイクポイントが`〜375 / 376〜480 / 481〜1335 / 1336〜`の4区分で表示される
- [ ] 699pxと700pxの境界で、レイアウトが急に崩れない
- [ ] タブレット幅（481〜1335px）で余白・見出し・カード・フォーム・FAQ・Access・地図が見やすく収まる
- [ ] タブレット幅でフォーム送信欄とAccess情報が横にはみ出さない
- [ ] 320・375・376・390・480・481・699・700・1335・1336・1440pxで横スクロールが発生しない
- [ ] Macロック解除後にブラウザで実機相当の表示を確認する

- [ ] Concept、Artists、Contact、FAQ、Accessの対象テキストが横書き・左寄せで表示される
- [ ] フォーム文言も横書き・左寄せで表示される
- [ ] 幅に応じて対象テキストサイズが12〜14pxの範囲で変化する
- [ ] h1、h2、h3、小見出し、フォーム、ヘッダー／フッターの文字サイズがclampで変化する
- [ ] 対象テキストが画面横にはみ出さない
- [ ] Artistsスライドショーが従来どおり動作する
- [ ] ArtistsのViewボタン背景がどの端末でも画面幅100%で表示され、ボタン幅は親のpaddingで調整される
- [ ] スマホのViewボタンが最大280px、PCのViewボタンが480〜520px程度で表示される
- [ ] gallery.htmlのカード画像がカード幅100%、カード本文が画像下に表示される
- [ ] Mizukiカードから`yurayura/gallery.html`へ移動できる
- [ ] Viewボタンから`yurayura/gallery.html`へ移動できる
- [ ] ギャラリーで作家・ジャンルのカテゴリを選択できる
- [ ] ギャラリーが参照元と同じ1作品1行レイアウトで表示され、作品数に応じてページ数が自動生成される
- [ ] フォームの問い合わせ種別チェックボックスが2列2段で表示される
- [ ] FVを除く全sectionの左右Paddingが44px、FVは左右0pxで表示される
- [ ] Contact・Q&A・Accessの左右余白が揃って表示される
- [ ] FAQの外側分類が通常見出し、回答内の詳細項目がアコーディオンとして開閉する
- [ ] FAQ外側見出しの背景が元の背景表現に戻っている
- [ ] FV以外のセクションが自然な高さ、FVが100vhで表示される
- [ ] スマホでFV以外のsectionが過度に縦長にならず表示される
- [ ] Concept/Artistsの高さが自然で、Artists背景画像だけが非表示になっている
- [ ] Conceptの上下余白が展示コンセプトに合う広さで表示される
- [ ] 最新の`main.css`がキャッシュされず読み込まれる
- [ ] Footerの文字間隔がHeaderと同じに表示される
- [ ] 文章が指定どおり表示される
- [ ] FVロゴ、Scroll、nav、通常のボタン文字、アニメーション、送信処理が維持されている
- [ ] 公開環境でArtistsスライドショーと`yurayura/gallery.html`の表示を確認する

## Figma gallery frame

- [x] PCでヒーローの「作家紹介」が中央に表示される
- [x] PCで作品が2列、作品下にタイトルと作者情報が表示される
- [x] スマホ相当幅でタイトルが横書き左寄せになる
- [x] スマホ相当幅で作品が1列、画像が246×320pxに収まる
- [x] 紹介文とジャンル情報が作品一覧の前に表示される
- [x] 作家・ジャンルの絞り込みUIを維持する
- [x] 作品数に応じてページ番号を自動生成する
- [x] `index.html`のスライドショーを変更していない
- [x] 編集前バックアップを`backups/`に作成した
- [ ] 実機スマートフォンと公開URLで最終確認する
- [ ] 公開・commit・pushの要否を確認する

## Top layout rollback (2026-09-12)

- [x] `assets/css/top-sections.css` が28f69fc時点の内容と一致する
- [x] c90eeef追加分のTop作品JPEG背景指定4件だけを除去する
- [x] Top CSSのキャッシュバスターを更新する
- [x] Concept / Galleryの後続変更を保持する
- [x] 公開Topで軽量化前のレイアウトへ戻ったことを確認する
- [x] 公開Concept / Galleryの表示と導線に影響がないことを確認する
- [ ] 実機スマートフォンで最終確認する

## Artists section correction (2026-09-12)

- [x] 作品セクションの見出し直下の説明文を中央寄せにする
- [x] Viewボタンを中央の適切な幅に調整する
- [x] 作品セクションの背景を現状維持する
- [x] Concept / Galleryへ影響しないTop専用CSSに限定する
- [x] 公開Topで今回の作品セクションを確認する
- [ ] スマートフォン実機で表示とタップを確認する

## Shared Header unification and exhibitor alignment (2026-09-12)

- [x] Top / Concept / GalleryのHeader構成を共通化する
- [x] Headerの固定位置・縦書きナビ・ラベルを統一する
- [x] Topの「出展者紹介」を中央揃えにする
- [x] Galleryの4作品と既存フィルターを維持する
- [x] 公開Top / Concept / Galleryで今回の変更を確認する
- [ ] スマートフォン実機で表示とタップを確認する

## Artists full-width backgrounds (2026-09-12)

- [x] ボタン背景帯を画面幅100%に合わせる
- [x] スライドショー表示領域を画面幅100%に合わせる
- [x] 既存の背景画像と作品カードを維持する
- [x] 横スクロールを発生させない
- [x] 公開Topで今回の全幅表示を確認する
- [ ] スマートフォン実機で表示を確認する

## Header scroll collapse restoration (2026-09-12)

- [x] 画面高60％地点でHeaderが縮小・格納される
- [x] ページ上部へ戻るとHeaderが元の表示へ戻る
- [x] 縮小後にメニューボタンが表示される
- [x] Topの既存レイアウトとConcept / Galleryを保全する
- [x] 公開Topで今回の縮小・復帰を確認する
- [ ] スマートフォン実機で表示とタップを確認する

## Hamburger menu layout correction (2026-09-12)

- [x] 展開メニューを常時表示Headerと同じ構成・寸法・間隔に揃える
- [x] 左から`TOP → CONCEPT → GALLERY`の順を維持する
- [x] `トップ / 世界観 / 作品`の日本語ラベルを維持する
- [x] 3ページでハンバーガーの開閉とスクロールロックを確認する
- [x] 展開中のConceptリンク遷移を確認する
- [x] 3ページで横スクロールなしを確認する
- [x] push後に公開3ページで展開メニューを確認する
- [ ] スマートフォン実機で表示とタップを確認する

## H2 centering and goods FAQ removal (2026-09-12)

- [x] Top / Concept / Galleryの全`h2`を中央寄せにする
- [x] TopのQ&Aからグッズ・購入場所・ECサイト関連を削除する
- [x] 期間・アクセス・購入・主催者のFAQを維持する
- [x] 3ページで横スクロールがないことを確認する
- [x] push後に公開3ページで見出しとQ&Aを確認する
- [ ] スマートフォン実機で表示を確認する

## FAQ title and answer revision (2026-09-12)

- [x] 「よくある質問」を中央寄せにする
- [x] FAQ回答の誤字・表現を修正する
- [x] アクセスFAQへ会場住所を追加する
- [x] 期間・アクセス・購入・主催者のFAQを維持する
- [x] グッズ関連FAQを追加しない
- [x] push後に公開TopでFAQを確認する
- [ ] スマートフォン実機で表示を確認する

## Breakpoint and font-size calibration (2026-09-12)

- [x] モバイル・タブレット・デスクトップの主境界を統一する
- [x] 本文と見出しの文字サイズを流動値へ調整する
- [x] Galleryのカテゴリ・紹介文・作品情報の文字サイズを調整する
- [x] Top / Concept / Galleryでh2中央寄せと横幅を確認する
- [x] 公開3ページで新CSSの読み込みを確認する
- [ ] スマートフォン実機で表示とタップを確認する

## Body font-size range update (2026-09-12)

- [x] 本文をモバイル12〜14pxにする
- [x] 本文をタブレット13〜15pxにする
- [x] 本文をデスクトップ14〜16pxにする
- [x] h2・h3・補助見出しを調整する
- [x] Gallery固有文字を調整する
- [x] 公開3ページで`font-scale-v2`の読み込みを確認する
- [ ] スマートフォン実機で表示とタップを確認する

## Writing direction update (2026-09-12)

- [x] FVのロゴ・説明文・Conceptラベル・Galleryの「作家紹介」が縦書きになっている
- [x] Header／Footerの全メニューが縦書きである
- [x] FV以外のTop／Concept／Galleryの内容が横書きである
- [x] GalleryのPC／スマホ相当幅用FV指定を更新した
- [x] 公開Top／Concept／Galleryで内容とリンクを確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機で表示・タップを確認する

## FAQ flat surface and Contact glass correction (2026-09-12)

- [x] Contact送信ボタンのガラス効果を確認した
- [x] FAQアコーディオン行のガラス効果を削除した
- [x] FAQの開閉機能を維持した
- [x] 公開TopのContactとFAQを確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機・キーボード操作で表示とフォーカスを確認する

## Contact cursor-position hover correction (2026-09-12)

- [x] 送信ボタンのホバー背景をカーソル位置基準にした
- [x] 送信ボタンのガラス効果を維持した
- [x] FAQの平面表示を維持した
- [x] 公開TopでContactとFAQを確認した
- [ ] スマートフォン実機でホバー相当操作とフォーカスを確認する

## Concept feeling copy and Contact glass update (2026-09-12)

- [x] 「A MOMENT TO FEEL／感じるということ」のラベル・見出し・本文を左揃えにした
- [x] Contact送信ボタンに液晶ガラス効果を適用した
- [x] 半透明、ぼかし、反射、陰影を確認した
- [x] 公開Conceptと公開Contactを確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機・キーボード操作で表示とフォーカスを確認する

## Glass effect restore and arrow glyph update (2026-09-12)

- [x] ボタンの液晶ガラス効果を維持した
- [x] CTAの矢印を`＞`表記へ統一した
- [x] ホバー／フォーカス時の背景色変化を維持した
- [x] 矢印が右へ移動するアニメーションを維持した
- [x] FAQ、問い合わせ、モーダル、Gallery操作を維持した
- [x] 公開Top／Concept／Galleryで反映を確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機でガラス表現、表示、ホバー相当のタップ、折り返しを確認する

## Button background removal and hover update (2026-09-12)

- [x] 通常時の全ページ内ボタン背景とガラス効果を削除した
- [x] Topの作品導線を`View →`へ変更した
- [x] ホバー／フォーカス時の背景色変化を追加した
- [x] 矢印が右へ移動するアニメーションを追加した
- [x] Galleryの選択中状態を背景なしで表示した
- [x] FAQ、問い合わせ、モーダル、Gallery操作を維持した
- [x] 公開Top／Concept／Galleryで反映を確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機で表示、ホバー相当のタップ、折り返しを確認する

## All content buttons liquid unification (2026-09-12)

- [x] TopのConcept導線をViewと同じ`liquid-button`にした
- [x] Galleryの絞り込み・ページ移動を液晶グラス表示にした
- [x] FAQ・問い合わせ・モーダル操作の機能を維持した
- [x] ConceptのGallery CTAと共通ナビを維持した
- [x] 編集前バックアップとレビューZIPを更新した
- [x] 公開Top／Concept／Galleryの最終表示を確認した
- [ ] スマートフォン実機で表示・タップを確認する

## Concept FV label removal (2026-09-12)

- [x] FV中央の「Concept」ラベルを削除した
- [x] 「ゆらゆら」とFV本文の縦書きを維持した
- [x] 共通ナビの「CONCEPT」とHeader／Footerを維持した
- [x] 公開Conceptで削除状態を確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機で表示・タップを確認する

## Concept FV vertical restore (2026-09-12)

- [x] ConceptページのFVを縦書きへ戻した
- [x] FV以外のConcept本文・見出し・CTAを横書き／中央寄せのまま維持した
- [x] 共通Header／Footerの縦書きメニューを維持した
- [x] 公開ConceptでFVの縦書き表示を確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機で表示・タップを確認する

## Top Concept spacing update (2026-09-12)

- [x] TOP Conceptの見出しが本文に対して中央配置されている
- [x] 本文の行間が画面幅に応じて調整されている
- [x] 見出しサイズ・字間・見出し下余白が調整されている
- [x] Concept導線と作品セクションを維持している
- [x] 公開Topで本文・導線・後続コンテンツを確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機で行間・折り返し・タップを確認する

## Concept horizontal text and liquid button update (2026-09-12)

- [x] ConceptページFVの縦書きを削除した
- [x] FVのラベル・ロゴ・説明文を横書きにした
- [x] Conceptページ内の文字を中央寄せにした
- [x] 「Galleryへ」ボタンをTopのViewと同じ`liquid-button`にした
- [x] 既存の文章・画像・リンク・共通Header／Footerを維持した
- [x] 公開Conceptで反映を確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機で表示・タップを確認する

## Square arrow and extended Top Concept copy (2026-09-12)

- [x] ボタンの`＞`を正方形枠内にした
- [x] TopのConcept本文を追加した
- [x] 公開Topで表示を確認した
- [x] 編集前バックアップを保存した
- [ ] スマートフォン実機で表示・タップを確認する
