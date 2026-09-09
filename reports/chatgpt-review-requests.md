# ChatGPT review requests

## Review target

1. `index.html` の Concept セクションだけが変更されていること
2. 指定文の句読点・表記が保持されていること
3. `pc-br` を維持したまま、スマホで縦方向が過度に伸びていないこと
4. 既存のCSS、アニメーション、フォーム、FAQ、その他の文章に変更がないこと

## Review evidence

- Concept本文のブラウザDOMテキストは指定文と一致
- Concept内の `br` は11個、全て `class="pc-br"`
- 390x844でページ横幅のはみ出しなし
- 1440x900でもページ横幅のはみ出しなし
- 表示時のJavaScript errorなし
