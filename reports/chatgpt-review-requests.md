# ChatGPT review requests

## Review target

1. Concept、Artists、Contact、FAQ、Access、フォーム文言の表示ルールだけが変更されていること
2. 指定文の句読点・表記が保持されていること
3. 対象テキストが横書き・左寄せ、フォントサイズが12〜14pxのclampになっていること
4. FVロゴ、Scroll、nav、通常のボタン文字、アニメーション、フォーム送信処理、その他の文章に変更がないこと

## Review evidence

- Concept本文のブラウザDOMテキストは指定文と一致
- Concept内の `br` は11個、全て `class="pc-br"`
- 390x844で対象テキストの表示とページ横幅のはみ出しなし
- 320x568でもページ横幅のはみ出しなし
- 375/376/480/481/1335/1336pxの境界を確認
- 1440x900でも横書き・左寄せ・ページ横幅のはみ出しなし
- 表示時のJavaScript errorなし
