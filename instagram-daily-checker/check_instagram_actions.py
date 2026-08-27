#!/usr/bin/env python3
import csv
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
REPORTS = BASE / "reports"
DATA.mkdir(exist_ok=True)
REPORTS.mkdir(exist_ok=True)

JST = ZoneInfo("Asia/Tokyo")
NOW = datetime.now(JST)
TODAY = NOW.strftime("%Y-%m-%d")
YESTERDAY = (NOW.date() - timedelta(days=1)).isoformat()
NOW_TEXT = NOW.strftime("%Y-%m-%d %H:%M:%S")
CURRENT = DATA / f"{TODAY}.csv"
PREVIOUS = DATA / f"{YESTERDAY}.csv"
LATEST_CSV = DATA / "latest.csv"
LATEST_REPORT = REPORTS / "latest.txt"
DAILY_REPORT = REPORTS / f"{TODAY}.txt"

TOKEN = os.environ.get("MORIWAKI_INSTAGRAM_PAGE_TOKEN", "").strip()
IG_ID = os.environ.get("MORIWAKI_IG_ID", "17841401126524039").strip()
if not TOKEN:
    print("ERROR: MORIWAKI_INSTAGRAM_PAGE_TOKEN secret is not set.", file=sys.stderr)
    sys.exit(2)

ACCOUNTS = [
    ("交野店", "kuroki", "kuro_rina"),
    ("交野店", "kurogi", "oo_o___co_c"),
    ("宮之阪店", "myojin", "myojin_moriwaki"),
    ("宮之阪店", "uga", "serika_hair"),
    ("宮之阪店", "ueno", "by.puiko"),
    ("宮之阪店", "morimoto", "kaz5_129"),
    ("宮之阪店", "yamakawa", "u.ne.assistant"),
    ("凪店", "hatano", "kento_hair"),
    ("凪店", "moritani", "mayumi.m"),
    ("凪店", "joyama", "ayumi__ulf"),
    ("東寝屋川店", "yamamoto", "kumi.yamamoto_"),
    ("東寝屋川店", "maesawa", "moriwaki34maesawa"),
    ("藤が尾店", "moriwaki", "mokoko_0227"),
    ("藤が尾店", "nishiguchi", "yudai_nishiguchi"),
    ("藤が尾店", "masaoka", "eri_msok"),
    ("藤が尾店", "nagashima", "n_itta_22"),
    ("河内磐船店", "taira", "ta.i.ra0417_iwafune"),
    ("河内磐船店", "oka", "yu_chan1992"),
    ("河内磐船店", "yamade", "iwafune_yamadeayumi"),
    ("河内磐船店", "ogawa", "moko_ogawa1124"),
]

FIELDS = ["store", "staff", "username", "result", "followers", "posts", "latest", "days", "status", "checked_at"]


def load_csv(path):
    result = {}
    if not path.exists():
        return result
    with path.open(encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            result[row.get("username", "")] = row
    return result


def write_csv(path, rows):
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)


def graph_lookup(username, attempts=3):
    fields = f"business_discovery.username({username}){{username,followers_count,media_count,media.limit(1){{timestamp}}}}"
    params = urllib.parse.urlencode({"fields": fields, "access_token": TOKEN})
    url = f"https://graph.facebook.com/v26.0/{IG_ID}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "MORIWAKI-Instagram-Daily/1.1"})
    last_error = None

    for attempt in range(1, attempts + 1):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                payload = json.loads(r.read().decode("utf-8"))
            bd = payload.get("business_discovery")
            if bd:
                return bd, None
            last_error = json.dumps(payload, ensure_ascii=False)
        except Exception as e:
            last_error = str(e)

        if attempt < attempts:
            print(f"WARN: {username} API attempt {attempt}/{attempts} failed; retrying...", file=sys.stderr)
            time.sleep(attempt * 3)

    return None, last_error


def parse_timestamp(value):
    if not value or value == "-":
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception:
        return None


def status_for(posts, timestamp):
    dt = parse_timestamp(timestamp)
    if dt:
        now_utc = NOW.astimezone(timezone.utc)
        days = max(0, int((now_utc - dt.astimezone(timezone.utc)).total_seconds() // 86400))
        if days >= 7:
            return days, "🔴"
        if days >= 3:
            return days, "🟡"
        return days, "🟢"
    if posts == 0:
        return "-", "🔴"
    return "-", "⚪"


def delta(new, old):
    try:
        d = int(new) - int(old)
        return f"{d:+d}"
    except Exception:
        return "算出不可"


prev = load_csv(PREVIOUS)
previous_day_available = PREVIOUS.exists()
rows = []

for store, staff, username in ACCOUNTS:
    bd, err = graph_lookup(username)
    if bd is None:
        if err:
            print(f"WARN: {username} unavailable after retries: {err}", file=sys.stderr)
        rows.append({
            "store": store, "staff": staff, "username": username,
            "result": "取得不可", "followers": "-", "posts": "-",
            "latest": "-", "days": "-", "status": "⚪", "checked_at": NOW_TEXT,
        })
        continue

    followers = bd.get("followers_count", "-")
    posts = bd.get("media_count", "-")
    media = bd.get("media") or {}
    media_data = media.get("data") or []
    timestamp = media_data[0].get("timestamp") if media_data else "-"
    days, state = status_for(posts if isinstance(posts, int) else -1, timestamp)
    rows.append({
        "store": store, "staff": staff, "username": username,
        "result": "OK", "followers": followers, "posts": posts,
        "latest": timestamp, "days": days, "status": state, "checked_at": NOW_TEXT,
    })

write_csv(CURRENT, rows)
write_csv(LATEST_CSV, rows)

success = sum(1 for r in rows if r["result"] == "OK")
lines = [
    "MORIWAKI Instagram 日次チェック",
    NOW_TEXT,
    "",
    f"取得成功：{success} / 20",
    f"比較基準：{YESTERDAY}" if previous_day_available else f"比較基準：{YESTERDAY} の保存記録なし",
    "",
    f"{'店舗':<10} {'スタッフ':<12} {'Instagram':<26} {'投稿数':>8} {'投稿前日比':>12} {'フォロワー':>10} {'フォロワー前日比':>14}",
]

for r in rows:
    dpost = "算出不可"
    dfollow = "算出不可"
    if r["result"] == "OK" and previous_day_available:
        old = prev.get(r["username"])
        if old and old.get("result") == "OK":
            dpost = delta(r["posts"], old.get("posts"))
            dfollow = delta(r["followers"], old.get("followers"))
    lines.append(
        f"{r['store']:<10} {r['staff']:<12} {r['username']:<26} {str(r['posts']):>8} {dpost:>12} {str(r['followers']):>10} {dfollow:>14} {r['status']}"
    )

lines += [
    "",
    "前日比表記：増加=+N、変動なし=+0、減少=-N。前日または当日の取得不可は算出不可。",
    "🟢 直近3日未満　🟡 3〜6日　🔴 7日以上　⚪ API取得不可",
    "",
]
text = "\n".join(lines)
LATEST_REPORT.write_text(text, encoding="utf-8")
DAILY_REPORT.write_text(text, encoding="utf-8")
print(text)
