# Known issues

## Existing validation notices

`tidy` のHTML4互換検査では、既存コードの `canvas`、`main`、`section`、`article` などのHTML5要素と、既存の `&display` 表記が警告・エラーとして出力されます。今回のConcept本文差し替えによる新規警告ではありません。

## Acceptance boundary

実機スマートフォンでのユーザー受入確認は未実施です。localhostの390x844ブラウザ検証では、縦書き・横はみ出し・Concept本文の高さを確認済みです。

320x568のブラウザ検証でもConcept本文の横はみ出しがないことを確認済みです。
