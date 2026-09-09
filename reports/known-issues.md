# Known issues

## Existing validation notices

`tidy` のHTML4互換検査では、既存コードの `canvas`、`main`、`section`、`article` などのHTML5要素と、既存の `&display` 表記が警告・エラーとして出力されます。今回のConcept本文差し替えによる新規警告ではありません。

## Acceptance boundary

実機スマートフォンでのユーザー受入確認は未実施です。localhostのブラウザ検証では、Conceptテキスト全体の横書き・左寄せ・レスポンシブサイズ・横はみ出しを確認済みです。

320x568のブラウザ検証でも、Concept本文の横書き・左寄せ・14px・横はみ出しなしを確認済みです。

今回の作業ではファイル削除を行っていません。復元用コピーは `backups/` に保持しています。
