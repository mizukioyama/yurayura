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

作業開始前に次を読む。

1. `AGENTS.md`
2. `YURAYURA_MASTER_SPEC.md`
3. `SITE_MAP.md`
4. `DESIGN_SYSTEM.md`
5. `QA_CHECKLIST.md`
6. `ROADMAP.md`

内容が競合した場合の優先順位は、
ユーザーの最新指示 > 確認済み事実 > MASTER_SPEC > DESIGN_SYSTEM / SITE_MAP > ROADMAP > 既存実装。

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

必要に応じて `ROADMAP.md` を更新する。
監査で得た証拠・分類・判断理由は `AUDIT_LOG.md` に記録し、ROADMAPを監査メモで肥大化させない。

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

AI側の実装・監査が完了した後、ユーザーが最終デザイン調整を行う。

そのため最終整理では：
- 主要な調整値をsemantic CSS variablesへ集約する
- ユーザーが触る入口を `assets/css/user-settings.css` に統一する
- 意味不明な略称だけを残さない
- 各変数に日本語コメントを付ける
- hard-coded repeated valuesを可能な範囲で変数化する
- レイアウト構造用の危険な値と、調整用の安全な値を分離する
- `CSS_VARIABLES_GUIDE.md` を最終状態へ更新する

既存値を維持し、Visual Regressionを確認しながら段階移行する。
