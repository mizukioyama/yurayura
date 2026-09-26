# ゆらゆら Official Website - AI / Development Rules

## 1. Purpose

このリポジトリは、グループ展「ゆらゆら」の公式Webサイトを管理する。

今後の作業では、見た目だけの変更ではなく、
- 展示情報を正確に伝える
- 「理解する」より「体感する」という企画思想を守る
- 初めて訪れる人が迷わず展示・作家・作品・会場情報へ到達できる
- モバイルを含め快適に閲覧できる
- 公開サイトを壊さず継続改善できる

ことを優先する。

## 2. Source of Truth

資料の正本は、内容ごとに次のように分ける。

| Document | 正本とする内容 |
|---|---|
| `AGENTS.md` | 開発・変更・安全ルール |
| `YURAYURA_MASTER_SPEC.md` | 企画・機能・恒久仕様 |
| `DESIGN_SYSTEM.md` | 視覚・レイアウト・animation方針 |
| `SITE_MAP.md` | ページ・URL・index・canonical・公開分類 |
| `QA_CHECKLIST.md` | 検証基準・リリース前確認 |
| `CSS_VARIABLES_GUIDE.md` | ユーザー本人が最終調整するためのCSS操作ガイド |

作業開始時はこの資料を確認し、続いて `README.md` の参照順に従って対象作業に関係する正本を読む。
一時的な作業計画・監査ログは恒久仕様の正本とせず、作業開始の必須資料にしない。レビュー資料と監査証拠はrepo外のlocal reportとして管理し、Public repositoryへ継続蓄積しない。

判断が競合した場合は、ユーザーの最新指示と確認済み事実を優先し、続いて該当分野の正本を参照する。実装状態の確認では、実際のsource・配信ページ・設定を照合し、「現在掲載されている」ことだけで事実の正しさを断定しない。

### Evidence hierarchy
事実確認では以下を区別する。
1. ユーザーが明示的に確定した情報
2. 現在の公式公開ページに掲載されている情報
3. `main` の実装
4. 過去ファイル / backup / report
5. 外部情報

「現在掲載されている」ことと「正しいこと」は同一視しない。
開催情報・作家情報などに不一致がある場合は、推測で統一せず差分を報告する。

## 3. Loop Engineering

すべての作業は以下の順序で行う。

Discover → Plan → Execute → Verify → Iterate

### Discover
- 現在の `main` と公開サイトを確認する。
- 対象ページだけでなく共有CSS / JS / header / footerへの影響を確認する。
- 既存実装、重複実装、未使用候補を先に調べる。

### Plan
- 変更対象ファイルを明確にする。
- 既存デザインを維持する部分と変更する部分を分ける。
- 大規模変更は小さな検証可能単位へ分割する。

### Execute
- 必要最小限の変更を優先する。
- 既存構成を理由なく全面書き換えしない。
- 同じ機能を別実装で重複させない。

### Verify
最低限、
- desktop / tablet / mobile
- console error
- resource error
- horizontal overflow
- navigation
- text wrapping
- animation
- form / modal
- public URL
を確認する。

### Iterate
問題があれば原因を特定して修正し、再検証する。
見た目だけを合わせる場当たり的な上書きを積み重ねない。

## 4. Safety / Change Policy

### 原則維持
ユーザーから変更指示がない限り、以下を勝手に変更しない。
- 展示コンセプト
- 開催日・時間
- 会場情報
- 作家名・作品情報
- 問い合わせ先
- 主要ビジュアル
- 既存の世界観
- 公開URL

### 削除
ファイル削除前に必ず、
1. HTML参照
2. CSS / JS参照
3. header / footer参照
4. sitemap / robots
5. 公開URL
6. GitHub Pages設定
を確認する。

`backups/`、`reports/`、`test.html`、`top.html`、`github-manual.html`、`.DS_Store` 等は整理候補だが、監査前に削除しない。

### 外部操作
問い合わせ送信など、実データを外部へ送るテストは原則モックで行う。
本番送信が必要な場合はユーザー確認を取る。

## 5. Content Rules

- 未確認の事実を追加しない。
- 作家プロフィール、作品情報、価格、在廊予定等を推測しない。
- 日付・曜日・時間・住所は公開前に再確認する。
- 文章の意味を変える修正はユーザー承認を優先する。
- 「ゆらゆら」の静けさ、余白、体感性を保つ。

## 6. Design Rules

詳細は `DESIGN_SYSTEM.md` を参照。

原則：
- 余白を詰めすぎない。
- 読みやすさより演出を優先しない。
- アニメーションは目的を持たせる。
- 重いCanvas / WebGLは必要性を検証する。
- `prefers-reduced-motion` を尊重する。
- スマホでPC表現を無理に再現しない。

## 7. Responsive Verification

基本確認幅：
- 1440px
- 1280px
- 1024px
- 768px
- 430px
- 390px
- 375px

重要変更では可能な限り全幅を確認する。

## 8. Git / Delivery

- 原則として小さな変更単位でコミットする。
- 大きな変更は専用branch → PR → 検証 → mergeを優先する。
- 公開後はGitHub Pages上の実URLを確認する。
- 「ローカルで動く」だけで完了扱いにしない。

## 9. Completion Report

作業完了時は最低限、
- 何を変更したか
- 変更ファイル
- 実施した検証
- 残課題
- 次の優先作業
を報告する。

恒久的な判断は該当分野の正本へ反映する。一時監査の証拠・作業状況・レビュー資料はrepo外のlocal reportとして管理し、Public repositoryへ継続蓄積しない。Gitの変更履歴はcommitで確認する。

## 10. Status Classification

ファイル・URL監査では原則として以下の状態を使う。

- `CANONICAL`：正式な公開・編集対象
- `SUPPORTING`：正式ページを支えるasset / component / data
- `LEGACY`：旧実装。公開維持理由がなければ整理候補
- `DEV_ONLY`：テスト・手順・開発専用
- `BACKUP`：履歴保管用。Git履歴で代替可能か確認
- `UNKNOWN`：証拠不足。削除禁止

## 11. Definition of Done

タスク完了は「修正した」ではなく、次を満たした状態とする。

- 変更目的を満たす
- 共有部分へのregressionがない
- 必要なviewportで確認済み
- console / resource errorに新規問題がない
- 公開URLで確認できる
- 文書と実装が矛盾していない
- 残る不確実性を明記している


## 12. User Final Adjustment Handoff

最終的なレイアウト・サイズ・余白・フォントサイズ等の視覚調整はユーザー本人が行う。

その前に、cleanup、runtime問題、CSS依存、404、security、repository整理など、技術作業によって表示が変わり得る作業を完了させる。技術作業による視覚変化の可能性がほぼなくなった時点で、

`READY FOR USER FINAL LAYOUT / SIZE ADJUSTMENT`

と報告して停止する。この状態を最終調整完了とは扱わない。以後、ユーザーから依頼されない限り、AI側で最終デザインを変更しない。

最終調整用のCSS変数・未集約の例外・現在のruntime依存は `CSS_VARIABLES_GUIDE.md` を正本として確認する。既存値を維持した技術移行が必要な場合は、別途before / afterを比較してから行う。
