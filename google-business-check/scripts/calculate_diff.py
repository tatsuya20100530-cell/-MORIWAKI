#!/usr/bin/env python3
import csv
import sys
from pathlib import Path


def load_rows(path: str):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return {row["店舗"]: row for row in csv.DictReader(f)}


def format_diff(current: int, previous: int) -> str:
    diff = current - previous
    return f"+{diff}件" if diff >= 0 else f"{diff}件"


def main(previous_path: str, current_path: str):
    previous = load_rows(previous_path)
    current = load_rows(current_path)

    print("店舗,前日口コミ数,現在口コミ数,口コミ前日比")
    for store in ["交野店", "宮之阪店", "凪店", "東寝屋川店", "藤が尾店", "河内磐船店"]:
        p = previous.get(store, {})
        c = current.get(store, {})
        pv = p.get("口コミ数", "").strip()
        cv = c.get("口コミ数", "").strip()
        if not cv:
            diff = "当日値取得不可のため算出不可"
        elif not pv:
            diff = "前日値取得不可のため算出不可"
        else:
            diff = format_diff(int(cv), int(pv))
        print(f"{store},{pv},{cv},{diff}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: calculate_diff.py PREVIOUS.csv CURRENT.csv")
    main(sys.argv[1], sys.argv[2])
