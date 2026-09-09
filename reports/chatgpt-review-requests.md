# ChatGPT review requests

## Review target

1. `index.html` の Concept セクションと、Concept本文のモバイル表示ルールだけが変更されていること
2. 指定文の句読点・表記が保持されていること
3. スマホで横書き・左寄せ・14pxになっていること
4. Concept以外のCSS、アニメーション、フォーム、FAQ、その他の文章に変更がないこと

## Review evidence

- Concept本文のブラウザDOMテキストは指定文と一致
- Concept内の `br` は11個、全て `class="pc-br"`
- 390x844でページ横幅のはみ出しなし
- 320x568でもページ横幅のはみ出しなし
- デスクトップでは縦書き・16pxを維持
- 1440x900でもページ横幅のはみ出しなし
- 表示時のJavaScript errorなし
