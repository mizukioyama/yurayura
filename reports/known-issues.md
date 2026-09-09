# Known issues

## Existing validation notices

`tidy` のHTML4互換検査では、既存コードの `canvas`、`main`、`section`、`article` などのHTML5要素と、既存の `&display` 表記が警告・エラーとして出力されます。今回の変更による新規警告ではありません。

## Acceptance boundary

実機スマートフォンでのユーザー受入確認は未実施です。localhostのブラウザ検証では、対象セクションとフォーム文言の横書き・左寄せ・clampによるレスポンシブサイズ・横はみ出しを確認済みです。

320〜1440pxのブラウザ検証で、対象テキストの横書き・左寄せ・clamp計算値・横はみ出しなしを確認済みです。

スライドショーはローカルブラウザで、スマホ時に親セクションへ設定された左右40px paddingを相殺し、表示領域と1枚のカードをviewport幅に揃えました。320/375/390/480/768/1336/1440pxでleft 0・right viewport、bodyの横スクロールなし、内部トラックの無限ループ動作を確認済みです。

ArtistsのViewボタン背景も同じ親padding補正を適用し、390pxで背景wrapperをviewport幅に揃えました。Galleryの既存ボタンは変更していません。

今回の作業ではファイル削除を行っていません。復元用コピーは `backups/` に保持しています。
