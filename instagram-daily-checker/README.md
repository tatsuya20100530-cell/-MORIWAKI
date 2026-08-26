# MORIWAKI Instagram Daily Checker

Instagram日次管理の正式運用ディレクトリです。

## 役割分担

- GitHub Actions（毎朝07:00 JST）: Meta/Instagram API取得、前日差分計算、日別CSV保存、latest更新、テキストレポート生成、Excel生成
- ChatGPT Work Scheduled Task（毎朝07:20 JST）: GitHubの当日完成データを読み込み、20名分を店舗別に要約してユーザーへ報告
- Codex: コード修正、テスト、保守、障害調査

ChatGPT側のInstagram用Scheduled Taskは1本だけ使用します。

## データ

- `data/YYYY-MM-DD.csv`: 当日の確定取得データ
- `data/latest.csv`: 最新の確定取得データ

前日比は必ず実行日の前日 `data/YYYY-MM-DD.csv` だけを比較基準にします。前日ファイルがない場合、古い日付を代用せず「算出不可」とします。

## 前日比表記

- 増加: `+N`
- 変動なし: `+0`
- 減少: `-N`
- 前日または当日が取得不可: `算出不可`

ChatGPTで表示する場合は、投稿前日比を `+0件`、フォロワー前日比を `+0人` のように単位付きで表示します。

## レポート

- `reports/YYYY-MM-DD.txt`: 日別テキストレポート
- `reports/latest.txt`: 最新テキストレポート
- `reports/YYYY-MM-DD.xlsx`: 日別Excelレポート
- `reports/latest.xlsx`: 最新Excelレポート

## 対象

6店舗・20アカウント。取得できないアカウントは推測せず `取得不可` として保存します。

## 自動処理

GitHub Actions: `.github/workflows/instagram-daily.yml`

1. Pythonセットアップ
2. openpyxlインストール
3. `check_instagram_actions.py` 実行
4. `create_excel.py` 実行
5. `data/` と `reports/` をGitHubへコミット
