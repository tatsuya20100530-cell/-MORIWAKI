#!/bin/zsh
export LANG=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8

BASE="$HOME/MORIWAKI_Instagram"
DATA="$BASE/data"
REPORTS="$BASE/reports"

TOKEN=$(security find-generic-password -a "$USER" -s "MORIWAKI_INSTAGRAM_PAGE_TOKEN" -w 2>/dev/null)
IG_ID="17841401126524039"

TODAY=$(date '+%Y-%m-%d')
NOW=$(date '+%Y-%m-%d %H:%M:%S')
NOW_EPOCH=$(date +%s)

CURRENT="$DATA/$TODAY.csv"
LATEST="$REPORTS/latest.txt"

PREV=$(find "$DATA" -type f -name '*.csv' ! -name "$TODAY.csv" 2>/dev/null | sort | tail -1)

echo 'store,staff,username,result,followers,posts,latest,days,status,checked_at' > "$CURRENT"

while IFS='|' read -r store staff username
do
  [ -z "$username" ] && continue

  FIELDS="business_discovery.username(${username}){username,followers_count,media_count,media.limit(1){timestamp}}"

  RESPONSE=$(curl -sG "https://graph.facebook.com/v26.0/$IG_ID" \
    --data-urlencode "fields=$FIELDS" \
    --data-urlencode "access_token=$TOKEN")

  if echo "$RESPONSE" | grep -q '"business_discovery"'; then

    FOLLOWERS=$(echo "$RESPONSE" | sed -nE 's/.*"followers_count":([0-9]+).*/\1/p')
    POSTS=$(echo "$RESPONSE" | sed -nE 's/.*"media_count":([0-9]+).*/\1/p')
    TIMESTAMP=$(echo "$RESPONSE" | sed -nE 's/.*"timestamp":"([^"]+)".*/\1/p')

    RESULT="OK"

    if [ -n "$TIMESTAMP" ]; then
      POST_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%S%z" "$TIMESTAMP" +%s 2>/dev/null)

      if [ -n "$POST_EPOCH" ]; then
        DAYS=$(( (NOW_EPOCH - POST_EPOCH) / 86400 ))

        if [ "$DAYS" -ge 7 ]; then
          STATUS="🔴"
        elif [ "$DAYS" -ge 3 ]; then
          STATUS="🟡"
        else
          STATUS="🟢"
        fi
      else
        DAYS="-"
        STATUS="⚪"
      fi
    else
      TIMESTAMP="-"
      DAYS="-"
      if [ "$POSTS" = "0" ]; then
        STATUS="🔴"
      else
        STATUS="⚪"
      fi
    fi

  else
    RESULT="取得不可"
    FOLLOWERS="-"
    POSTS="-"
    TIMESTAMP="-"
    DAYS="-"
    STATUS="⚪"
  fi

  echo "$store,$staff,$username,$RESULT,$FOLLOWERS,$POSTS,$TIMESTAMP,$DAYS,$STATUS,$NOW" >> "$CURRENT"

done <<'ACCOUNTS'
交野店|kuroki|kuro_rina
交野店|kurogi|oo_o___co_c
宮之阪店|myojin|myojin_moriwaki
宮之阪店|uga|serika_hair
宮之阪店|ueno|by.puiko
宮之阪店|morimoto|kaz5_129
宮之阪店|yamakawa|u.ne.assistant
凪店|hatano|kento_hair
凪店|moritani|mayumi.m
凪店|joyama|ayumi__ulf
東寝屋川店|yamamoto|kumi.yamamoto_
東寝屋川店|maesawa|moriwaki34maesawa
藤が尾店|moriwaki|mokoko_0227
藤が尾店|nishiguchi|yudai_nishiguchi
藤が尾店|masaoka|eri_msok
藤が尾店|nagashima|n_itta_22
河内磐船店|taira|ta.i.ra0417_iwafune
河内磐船店|oka|yu_chan1992
河内磐船店|yamade|iwafune_yamadeayumi
河内磐船店|ogawa|moko_ogawa1124
ACCOUNTS

SUCCESS=$(awk -F',' 'NR>1 && $4=="OK"{n++} END{print n+0}' "$CURRENT")

{
  echo "MORIWAKI Instagram 日次チェック"
  echo "$NOW"
  echo
  echo "取得成功：$SUCCESS / 20"
  echo
  printf "%-10s %-12s %-26s %8s %10s %8s %10s\n" \
    "店舗" "スタッフ" "Instagram" "投稿数" "投稿前日比" "フォロワー" "フォロワー前日比"

  while IFS=',' read -r store staff username result followers posts latest days state checked
  do
    [ "$store" = "store" ] && continue

    DPOST="-"
    DFOLLOW="-"

    if [ -n "$PREV" ] && [ "$result" = "OK" ]; then
      OLD=$(awk -F',' -v u="$username" '$3==u {print $5","$6}' "$PREV")

      if [ -n "$OLD" ]; then
        OLDFOLLOW=${OLD%,*}
        OLDPOST=${OLD#*,}

        if [[ "$OLDFOLLOW" == <-> && "$OLDPOST" == <-> ]]; then
          DFOLLOW=$(( followers - OLDFOLLOW ))
          DPOST=$(( posts - OLDPOST ))

          [ "$DFOLLOW" -gt 0 ] && DFOLLOW="+$DFOLLOW"
          [ "$DPOST" -gt 0 ] && DPOST="+$DPOST"
        fi
      fi
    elif [ "$result" = "OK" ]; then
      DPOST="基準"
      DFOLLOW="基準"
    fi

    printf "%-10s %-12s %-26s %8s %10s %8s %10s %s\n" \
      "$store" "$staff" "$username" "$posts" "$DPOST" "$followers" "$DFOLLOW" "$state"

  done < "$CURRENT"

  echo
  echo "🟢 直近3日未満　🟡 3〜6日　🔴 7日以上　⚪ API取得不可"

} > "$LATEST"

cp "$LATEST" "$REPORTS/$TODAY.txt"

echo
echo "=============================="
echo "Instagramチェック完了"
echo "取得成功：$SUCCESS / 20"
echo "レポート：$LATEST"
echo "=============================="
cat "$LATEST"

"/Users/myoujintatsuya/MORIWAKI_Instagram/upload_github.sh"
