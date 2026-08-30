#!/usr/bin/env python3
"""Collect first-party Instagram insights for the owned MORIWAKI account.

The script is intentionally tolerant of per-metric API differences. Unsupported
metrics are recorded as unavailable without failing the existing daily checker.
No access token or request URL is ever written to reports.
"""

import csv
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


BASE = Path(__file__).resolve().parent
INSIGHTS = BASE / "insights"
REPORTS = BASE / "reports"
INSIGHTS.mkdir(exist_ok=True)
REPORTS.mkdir(exist_ok=True)

JST = ZoneInfo("Asia/Tokyo")
NOW = datetime.now(JST)
TODAY = NOW.strftime("%Y-%m-%d")
NOW_TEXT = NOW.strftime("%Y-%m-%d %H:%M:%S")

TOKEN = os.environ.get("MORIWAKI_INSTAGRAM_PAGE_TOKEN", "").strip()
IG_ID = os.environ.get("MORIWAKI_IG_ID", "17841401126524039").strip()
API_VERSION = os.environ.get("MORIWAKI_GRAPH_API_VERSION", "v26.0").strip()

MEDIA_FIELDS = (
    "id,caption,media_type,media_product_type,timestamp,permalink,"
    "like_count,comments_count"
)
METRICS = (
    "views",
    "reach",
    "total_interactions",
    "saved",
    "shares",
)


def graph_get(path, params):
    query = dict(params)
    query["access_token"] = TOKEN
    url = f"https://graph.facebook.com/{API_VERSION}/{path}?{urllib.parse.urlencode(query)}"
    req = urllib.request.Request(url, headers={"User-Agent": "MORIWAKI-Insights/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            return json.loads(response.read().decode("utf-8")), None
    except urllib.error.HTTPError as exc:
        return None, f"HTTP {exc.code}"
    except Exception as exc:
        return None, exc.__class__.__name__


def metric_value(payload):
    if not payload:
        return None
    data = payload.get("data") or []
    if not data:
        return None
    item = data[0]
    total_value = item.get("total_value")
    if isinstance(total_value, dict) and "value" in total_value:
        return total_value["value"]
    values = item.get("values") or []
    if values and isinstance(values[0], dict):
        return values[0].get("value")
    return None


def collect_media():
    payload, error = graph_get(
        f"{IG_ID}/media",
        {"fields": MEDIA_FIELDS, "limit": 10},
    )
    if error or not payload:
        return [], error or "empty_response"

    media_rows = []
    for media in payload.get("data") or []:
        row = {
            "id": media.get("id", ""),
            "caption": (media.get("caption") or "").replace("\n", " ")[:160],
            "media_type": media.get("media_type", ""),
            "media_product_type": media.get("media_product_type", ""),
            "timestamp": media.get("timestamp", ""),
            "permalink": media.get("permalink", ""),
            "like_count": media.get("like_count"),
            "comments_count": media.get("comments_count"),
            "metrics": {},
            "unavailable_metrics": [],
        }
        for metric in METRICS:
            result, metric_error = graph_get(
                f"{row['id']}/insights",
                {"metric": metric},
            )
            value = metric_value(result)
            if metric_error or value is None:
                row["unavailable_metrics"].append(metric)
            else:
                row["metrics"][metric] = value
        media_rows.append(row)
    return media_rows, None


def numeric(value):
    return value if isinstance(value, (int, float)) else 0


def post_score(row):
    metrics = row.get("metrics") or {}
    interactions = numeric(metrics.get("total_interactions"))
    if not interactions:
        interactions = (
            numeric(row.get("like_count"))
            + numeric(row.get("comments_count"))
            + numeric(metrics.get("saved"))
            + numeric(metrics.get("shares"))
        )
    reach = numeric(metrics.get("reach"))
    return interactions / reach if reach else interactions


def write_outputs(media_rows, media_error):
    available = sorted({key for row in media_rows for key in row["metrics"]})
    result = "success" if media_rows and available else "unavailable"
    document = {
        "date": TODAY,
        "checked_at": NOW_TEXT,
        "account": "myojin_moriwaki",
        "result": result,
        "media_error": media_error,
        "media_count": len(media_rows),
        "available_metrics": available,
        "media": media_rows,
    }

    for path in (INSIGHTS / f"{TODAY}.json", INSIGHTS / "latest.json"):
        path.write_text(json.dumps(document, ensure_ascii=False, indent=2), encoding="utf-8")

    columns = [
        "date", "timestamp", "media_type", "media_product_type", "permalink",
        "caption", "views", "reach", "total_interactions", "saved", "shares",
        "like_count", "comments_count", "unavailable_metrics",
    ]
    flat_rows = []
    for row in media_rows:
        metrics = row["metrics"]
        flat_rows.append({
            "date": TODAY,
            "timestamp": row["timestamp"],
            "media_type": row["media_type"],
            "media_product_type": row["media_product_type"],
            "permalink": row["permalink"],
            "caption": row["caption"],
            **{metric: metrics.get(metric, "") for metric in METRICS},
            "like_count": row["like_count"],
            "comments_count": row["comments_count"],
            "unavailable_metrics": ",".join(row["unavailable_metrics"]),
        })
    for path in (INSIGHTS / f"{TODAY}.csv", INSIGHTS / "latest.csv"):
        with path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=columns)
            writer.writeheader()
            writer.writerows(flat_rows)

    ranked = sorted(media_rows, key=post_score, reverse=True)[:5]
    lines = [
        "myojin_moriwaki Instagramインサイト",
        NOW_TEXT,
        "",
        f"取得結果：{result}",
        f"対象投稿：{len(media_rows)}件",
        f"取得できた指標：{', '.join(available) if available else 'なし'}",
    ]
    if media_error:
        lines.append(f"取得エラー：{media_error}")
    lines += ["", "反応上位投稿："]
    for index, row in enumerate(ranked, 1):
        metrics = row["metrics"]
        lines.append(
            f"{index}. {row['timestamp']} | {row['media_product_type'] or row['media_type']} | "
            f"reach={metrics.get('reach', '取得不可')} views={metrics.get('views', '取得不可')} "
            f"saved={metrics.get('saved', '取得不可')} shares={metrics.get('shares', '取得不可')} | "
            f"{row['permalink']}"
        )
    report = "\n".join(lines) + "\n"
    (REPORTS / f"insights-{TODAY}.txt").write_text(report, encoding="utf-8")
    (REPORTS / "insights-latest.txt").write_text(report, encoding="utf-8")
    print(report)


def main():
    daily_path = INSIGHTS / f"{TODAY}.json"
    if daily_path.exists():
        try:
            existing = json.loads(daily_path.read_text(encoding="utf-8"))
            if existing.get("result") == "success" and existing.get("media_count", 0) > 0:
                print(f"Insights already collected for {TODAY}; keeping the first successful result.")
                return
        except Exception:
            pass
    if not TOKEN:
        write_outputs([], "token_not_configured")
        return
    media_rows, media_error = collect_media()
    write_outputs(media_rows, media_error)


if __name__ == "__main__":
    main()
