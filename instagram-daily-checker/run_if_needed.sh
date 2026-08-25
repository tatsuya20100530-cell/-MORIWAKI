#!/bin/zsh

BASE="$HOME/MORIWAKI_Instagram"
TODAY=$(date '+%Y-%m-%d')
TODAY_FILE="$BASE/data/$TODAY.csv"
DONE_FILE="$BASE/data/$TODAY.done"

# 正常完了済みなら何もしない
if [ -f "$DONE_FILE" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') 今日は正常完了済み"
  exit 0
fi

# ネット接続を最大2分待つ
for i in {1..12}; do
  if curl -fsS --max-time 5 https://api.github.com >/dev/null 2>&1; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') ネット接続確認OK"
    break
  fi

  echo "$(date '+%Y-%m-%d %H:%M:%S') ネット接続待機中 ($i/12)"
  sleep 10
done

# まだネット未接続なら失敗として終了
if ! curl -fsS --max-time 5 https://api.github.com >/dev/null 2>&1; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') ネット接続できず終了"
  exit 1
fi

echo "$(date '+%Y-%m-%d %H:%M:%S') Instagram日次チェック開始"

# 取得＋GitHubアップロード成功時だけ完了マーク
if "$BASE/check_instagram.sh"; then
  touch "$DONE_FILE"
  echo "$(date '+%Y-%m-%d %H:%M:%S') 正常完了"
  exit 0
else
  rm -f "$TODAY_FILE"
  echo "$(date '+%Y-%m-%d %H:%M:%S') 失敗。次回再実行対象"
  exit 1
fi
