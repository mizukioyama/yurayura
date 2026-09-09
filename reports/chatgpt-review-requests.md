# ChatGPT review requests

## Review target

1. Concept、Artists、Contact、FAQ、Access、フォーム、ヘッダー／フッターの文字サイズとArtistsスライドショー・ボタン背景の表示幅だけが変更されていること
2. 指定文の句読点・表記が保持されていること
3. 本文が12〜14px、h1/h2/h3等がそれぞれの範囲で `clamp()` になっていること
4. HTML本文、アニメーション動作、フォーム送信処理、画像に変更がないこと

## Review evidence

- Concept本文のブラウザDOMテキストは指定文と一致
- Concept内の `br` は11個、全て `class="pc-br"`
- 390x844で対象テキストの表示とページ横幅のはみ出しなし
- 320x568でもページ横幅のはみ出しなし
- 375/376/480/481/1335/1336pxの境界を確認
- 1440x900でも横書き・左寄せ・ページ横幅のはみ出しなし
- h1/h2/h3、小見出し、フォーム、ヘッダー／フッターの計算後サイズを確認
- Artistsスライドショーは、スマホ時の親セクション左右40px paddingを相殺したうえで、表示領域・1枚のカードが各viewport幅になり、内部トラックが無限ループ幅であることを確認
- 320/375/390/480/768/1336/1440pxでsliderのleftが0、rightがviewport幅、bodyの横スクロールなしを確認
- 390pxで深緑背景の親要素が利用可能領域の100%、左右15px padding、host・Shadow DOM内背景wrapperが280pxで中央配置されることを確認
- 390pxでカード上Mizukiボタン背景がカードと同じ幅390px、right 0を確認
- Viewボタンはスマホ最大280px、PC700px以上で480〜520pxの範囲になることを320〜1600pxで確認。背景親は常にwidth:100%を維持
- `liquid-button.js`の`fluid`属性監視とShadow DOM内wrapperのレスポンシブ幅適用を確認
- Gallery側の既存liquid-buttonはfluid属性なし、md幅280pxを維持していることを確認
- 表示時のJavaScript errorなし
