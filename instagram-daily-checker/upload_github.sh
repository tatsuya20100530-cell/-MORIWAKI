#!/bin/zsh
export LANG=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8

TOKEN=$(security find-generic-password -a "$USER" -s "MORIWAKI_GITHUB_TOKEN" -w 2>/dev/null)

REPO="tatsuya20100530-cell/-MORIWAKI"
REMOTE_PATH="instagram-daily-checker/reports/latest.txt"
FILE="$HOME/MORIWAKI_Instagram/reports/latest.txt"
API="https://api.github.com/repos/$REPO/contents/$REMOTE_PATH"

CONTENT=$(base64 < "$FILE" | tr -d '\n')

META=$(curl -sS \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "$API?ref=main")

SHA=$(printf '%s' "$META" | tr -d '\n' | sed -nE 's/.*"sha"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p')

if [ -n "$SHA" ]; then
  PAYLOAD=$(printf '{"message":"Update Instagram daily report","content":"%s","sha":"%s","branch":"main"}' "$CONTENT" "$SHA")
else
  PAYLOAD=$(printf '{"message":"Create Instagram daily report","content":"%s","branch":"main"}' "$CONTENT")
fi

RESPONSE=$(curl -sS -X PUT "$API" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

if echo "$RESPONSE" | grep -q '"content"'; then
  echo "GitHubアップロードOK"
else
  echo "GitHubアップロード失敗"
  echo "$RESPONSE"
  exit 1
fi
