# 2026-10-14 日誌：ソース照合と計算条件

- GitHub固定コミット：`9b12e8feb3b4209d030e398dbcd9cdc5a45ea649`
- 取得：日誌1、CSV15、画像7。全ファイルをGit blob SHAで照合。元ファイルは変更しない。
- 本人確認：昼の225Cashロングは11:21のOANDA Paper Tradingと同じ取引。
- 当日Paper約定2本・11単位。平均68,201.945454545円。取得時点含み益1,963円。決済記録なし。実口座の約定・損益は未受領。
- ファイル名04:38:18.443ZをJSTへ変換し、ポジション取得13:38:18.443と記録。注文CSVの11:21は画像のUTC+9時計と約定通知に整合。
- 6857はBUY指値40,650 / LC40,400 / TP41,400 / 100株、09:34:38発注、10:36:33取消。未約定。計画R:R 1:3。
- OHLCVのtimeはUnix秒をJSTへ変換。元のTSE30秒、米株1分、OANDA20分を保持。285A・6857は追加R2歩み値から15秒足を生成。
- Volume列は2本あっても同値の1本だけ使用。Volume MA、Regular Ratio、Cumulative Ratioを区間出来高・DELTAに使わない。
- 元のOHLCV CSVにDELTAなし。R2歩み値を追加した285A・6857はティック方向による推定DELTAを表示。他の銘柄は未取得。陰陽だけからDELTAは作らない。
- OANDA20分CSVはVolume列なし。MT5のTickVOLをOANDAの出来高へ流用しない。
- OANDA・米株CSVの末尾は完成未確認のため除外。R2の285A・6857歩み値は15:30まで取得し、引け板寄せを含む完成区間を再生。
- 7枚目の板読み画像は10/14に撮影されているが、画面内の対象データは10/13。前日参考画像として分離。
- 元のMT5書き出しCSVは時刻帯未記載のまま保存。上位足は追加Axiory time_utc系列とOANDA Unix秒を日本時間へ変換。追加コミットはmarket_context_sources_manifest.jsonに記録。日足20SMAは赤、週足20SMAは紫、H1は黄。225 H1はOANDA 09:00始値線を翌日09:00まで延長。US100の09:00データは未取得。
- 285A・6857の15秒足はR2歩み値から生成。当日の板スナップショットはHDDの285A・6857前後場ログから追加。5分足60EMAは未取得。US100日足・H1は追加Axiory系列を使用。写真・本人の観察として記録し、再計算と区別。

## 数量・指標監査

```json
{
  "TSE_285A, 30S_412e9.csv": {
    "rows": 1015,
    "native_seconds": 30,
    "first_jst": "2026-10-09T13:51:30+09:00",
    "last_start_jst": "2026-10-14T10:36:30+09:00",
    "volume_columns": [
      14,
      18
    ],
    "duplicate_volume_columns_equal": true,
    "volume_sum": 91876800.0,
    "last_bar": "完成未確認。再生は末尾を除く完成足のみ、末尾OHLCVは別表。",
    "delta": "未取得。OHLCVの陽陰からDELTAを作らない。"
  },
  "OANDA_JP225YJPY, 20_e281b.csv": {
    "rows": 303,
    "native_seconds": 1200,
    "first_jst": "2026-10-08T03:40:00+09:00",
    "last_start_jst": "2026-10-14T13:20:00+09:00",
    "volume_columns": [],
    "duplicate_volume_columns_equal": false,
    "volume_sum": 0,
    "last_bar": "完成未確認。再生は末尾を除く完成足のみ、末尾OHLCVは別表。",
    "delta": "未取得。OHLCVの陽陰からDELTAを作らない。"
  },
  "BATS_SNDK, 1_4e4dc.csv": {
    "rows": 512,
    "native_seconds": 60,
    "first_jst": "2026-10-13T02:58:00+09:00",
    "last_start_jst": "2026-10-14T04:59:00+09:00",
    "volume_columns": [
      14,
      18
    ],
    "duplicate_volume_columns_equal": true,
    "volume_sum": 746671.0,
    "last_bar": "完成未確認。再生は末尾を除く完成足のみ、末尾OHLCVは別表。",
    "delta": "未取得。OHLCVの陽陰からDELTAを作らない。"
  },
  "BATS_SNDK, 1_a08a5.csv": {
    "rows": 354,
    "native_seconds": 60,
    "first_jst": "2026-10-13T23:06:00+09:00",
    "last_start_jst": "2026-10-14T04:59:00+09:00",
    "volume_columns": [
      14,
      18
    ],
    "duplicate_volume_columns_equal": true,
    "volume_sum": 464930.0,
    "last_bar": "完成未確認。再生は末尾を除く完成足のみ、末尾OHLCVは別表。",
    "delta": "未取得。OHLCVの陽陰からDELTAを作らない。"
  },
  "BATS_SNDK, 2_6d0af.csv": {
    "rows": 570,
    "native_seconds": 120,
    "first_jst": "2026-10-09T23:00:00+09:00",
    "last_start_jst": "2026-10-14T04:58:00+09:00",
    "volume_columns": [
      14,
      18
    ],
    "duplicate_volume_columns_equal": true,
    "volume_sum": 1633988.0,
    "last_bar": "完成未確認。再生は末尾を除く完成足のみ、末尾OHLCVは別表。",
    "delta": "未取得。OHLCVの陽陰からDELTAを作らない。"
  },
  "BATS_TSLA, 1_57ea8.csv": {
    "rows": 1173,
    "native_seconds": 60,
    "first_jst": "2026-10-09T04:57:00+09:00",
    "last_start_jst": "2026-10-14T04:59:00+09:00",
    "volume_columns": [
      14,
      18
    ],
    "duplicate_volume_columns_equal": true,
    "volume_sum": 8330008.0,
    "last_bar": "完成未確認。再生は末尾を除く完成足のみ、末尾OHLCVは別表。",
    "delta": "未取得。OHLCVの陽陰からDELTAを作らない。"
  },
  "SNDK_overlap": {
    "identical_ohlcv_rows": 354,
    "merged_rows": 512,
    "method": "同じ1分足の2ファイルを時刻で統合。同じOHLCVは1回だけ計上。指標列をDELTAとして使わない。"
  },
  "PaperTrading": {
    "filled_entries": [
      {
        "time": "2026-10-14 11:21:18",
        "t": 1791944478,
        "price": 68197.4,
        "qty": 1.0,
        "id": "3670399796",
        "kind": "ENTRY",
        "direction": "LONG",
        "account": "Paper Trading"
      },
      {
        "time": "2026-10-14 11:21:22",
        "t": 1791944482,
        "price": 68202.4,
        "qty": 10.0,
        "id": "3670400003",
        "kind": "ENTRY",
        "direction": "LONG",
        "account": "Paper Trading"
      }
    ],
    "quantity": 11.0,
    "average": 68201.94545454545,
    "quote_at_export": 68380.4,
    "unrealized_jpy": 1963.000000005,
    "snapshot_jst": "2026-10-14T13:38:18.443+09:00",
    "closed_records_today": 0,
    "realized_jpy_in_provided_today_records": 0,
    "live_account": "実口座の約定履歴は未受領。Paper Tradingへ実績を混ぜない。",
    "user_confirmation": "昼の225Cashロングは、この11:21のPaper Tradingと同じ取引と本人が確認。"
  },
  "6857_unfilled_plan": {
    "entry": 40650,
    "lc": 40400,
    "tp": 41400,
    "quantity": 100,
    "placed_jst": "2026-10-14T09:34:38+09:00",
    "cancelled_jst": "2026-10-14T10:36:33+09:00",
    "risk_width": 250,
    "reward_width": 750,
    "planned_rr": 3,
    "filled": false,
    "source": "注文履歴3行＋アクティビティログのBUY with SL/TP"
  },
  "volume_examples": {
    "285A_094030": {
      "t": 1791938430,
      "o": 15495.0,
      "h": 15570.0,
      "l": 15495.0,
      "c": 15565.0,
      "v": 257600.0,
      "d": null,
      "vw": 15533.593039922662,
      "complete": true
    },
    "285A_094630": {
      "t": 1791938790,
      "o": 15535.0,
      "h": 15535.0,
      "l": 15475.0,
      "c": 15475.0,
      "v": 188700.0,
      "d": null,
      "vw": 15533.508500129969,
      "complete": true
    },
    "285A_100600": {
      "t": 1791939960,
      "o": 15210.0,
      "h": 15235.0,
      "l": 15185.0,
      "c": 15195.0,
      "v": 184300.0,
      "d": null,
      "vw": 15481.372228146036,
      "complete": true
    },
    "SNDK_0100_1m": {
      "t": 1791907200,
      "o": 1442.41,
      "h": 1445.0,
      "l": 1441.75,
      "c": 1444.58,
      "v": 7623.0,
      "d": null,
      "vw": 1438.1947619229848,
      "complete": true
    },
    "SNDK_0100_2m": {
      "t": 1791907200,
      "o": 1442.41,
      "h": 1448.1,
      "l": 1441.75,
      "c": 1448.1,
      "v": 16365.0,
      "d": null,
      "vw": 1438.6114441567756,
      "complete": true
    },
    "SNDK_0226": {
      "t": 1791912360,
      "o": 1443.98,
      "h": 1443.98,
      "l": 1442.0,
      "c": 1443.06,
      "v": 1648.0,
      "d": null,
      "vw": 1441.5140193772265,
      "complete": true
    },
    "TSLA_0351": {
      "t": 1791917460,
      "o": 373.68,
      "h": 373.68,
      "l": 372.72,
      "c": 373.06,
      "v": 31874.0,
      "d": null,
      "vw": 374.74157468930554,
      "complete": true
    },
    "TSLA_0352": {
      "t": 1791917520,
      "o": 373.04,
      "h": 373.64,
      "l": 373.0,
      "c": 373.48,
      "v": 27865.0,
      "d": null,
      "vw": 374.7122581700178,
      "complete": true
    }
  },
  "Axiory_JP225_W1.csv": {
    "rows": 196,
    "completed": 196,
    "source_commit": "8576d47ce4c80955279ca1c4feef0ba4f4fde0f9",
    "first_jst": "2023-01-08 09:00",
    "last_completed": {
      "t": 1791072000,
      "label": "2026-10-04 09:00",
      "o": 69668.42,
      "h": 71331.13,
      "l": 67831.56,
      "c": 68881.78,
      "ma": 66838.962,
      "wr": -26.644123023057475,
      "tickVolume": 442466,
      "complete": true
    },
    "timezone": "UTC explicitly stated in time_utc; converted to JST",
    "09_open_rays": []
  },
  "Axiory_JP225_D1.csv": {
    "rows": 977,
    "completed": 977,
    "source_commit": "8576d47ce4c80955279ca1c4feef0ba4f4fde0f9",
    "first_jst": "2023-01-03 09:00",
    "last_completed": {
      "t": 1791849600,
      "label": "2026-10-13 09:00",
      "o": 68232.69,
      "h": 68305.19,
      "l": 67070.19,
      "c": 67945.19,
      "ma": 67337.5135,
      "wr": -50.923742374839044,
      "tickVolume": 105237,
      "complete": true
    },
    "timezone": "UTC explicitly stated in time_utc; converted to JST",
    "09_open_rays": []
  },
  "Axiory_US100_D1.csv": {
    "rows": 977,
    "completed": 977,
    "source_commit": "8576d47ce4c80955279ca1c4feef0ba4f4fde0f9",
    "first_jst": "2023-01-03 09:00",
    "last_completed": {
      "t": 1791849600,
      "label": "2026-10-13 09:00",
      "o": 30676.68,
      "h": 30698.93,
      "l": 30385.74,
      "c": 30574.61,
      "ma": 30495.23,
      "wr": -63.072736461532344,
      "tickVolume": 441539,
      "complete": true
    },
    "timezone": "UTC explicitly stated in time_utc; converted to JST",
    "09_open_rays": []
  },
  "Axiory_JP225_H1.csv": {
    "rows": 9005,
    "completed": 9005,
    "source_commit": "8576d47ce4c80955279ca1c4feef0ba4f4fde0f9",
    "first_jst": "2025-04-07 10:00",
    "last_completed": {
      "t": 1791950400,
      "label": "2026-10-14 13:00",
      "o": 68007.91,
      "h": 68167.91,
      "l": 67877.91,
      "c": 68137.91,
      "ma": 67890.73400000001,
      "wr": -5.238161754434966,
      "tickVolume": 8458,
      "complete": true
    },
    "timezone": "UTC explicitly stated in time_utc; converted to JST",
    "09_open_rays": []
  },
  "Axiory_US100_H1.csv": {
    "rows": 8980,
    "completed": 8980,
    "source_commit": "8576d47ce4c80955279ca1c4feef0ba4f4fde0f9",
    "first_jst": "2025-04-07 10:00",
    "last_completed": {
      "t": 1791950400,
      "label": "2026-10-14 13:00",
      "o": 30607.4,
      "h": 30643.41,
      "l": 30568.65,
      "c": 30638.92,
      "ma": 30534.9385,
      "wr": -2.735305416827752,
      "tickVolume": 23612,
      "complete": true
    },
    "timezone": "UTC explicitly stated in time_utc; converted to JST",
    "09_open_rays": []
  }
}
```

[当初取得ファイル一覧](sources_manifest.json) / [追加Axioryデータ一覧](market_context_sources_manifest.json)


## 追加のR2取得と本人振り返り

- R2公開URLはHTTP403。設定済み認証でGET・一覧取得のみを実行し、10/13・10/14の285A・6857歩み値4ファイルを取得。板ログの公開マニフェストは10/4生成で、10/14の板ログなし。
- 全約定数量を15秒区間に集計し、15/30秒足へ再集計。重複する同値約定も削除しない。引け15:30の板寄せは時刻イベントとして含める。前日終値はR2でも285A 15,180円。
- DELTAはティック価格変化方向による推定。真の約定方向・板の数量差ではない。寄り・引け板寄せは未分類。
- 225の9:00線はOANDA H1（20分足3本から集計）の始値67,891.4円。US100の9:00足は追加Axiory CSVにないため水平線未設定、本人が後で用意する予定。

```json
{
  "6857": {
    "status": "エントリーできなかったトレード／実損益に加算しない",
    "reported_context": "9:25頃に出来高を伴う陰線。その発生価格帯を9:34:30の大出来高陽線が上抜け、上昇2波の調整後にロング3波を狙う。10:10頃までの高値更新を取れた可能性という振り返り。",
    "wanted_entry": 40630,
    "wanted_entry_source": "本人が40,630円と訂正・確認",
    "reported_profit": "「480」「100株」「4万千円程度」。480の意味・利益額は未確定、仮想損益未計算。",
    "csv_order_entry": 40650
  },
  "285A": {
    "status": "エントリーできなかった売り候補／指数逆行で採用件数に数えない",
    "reported_context": "9:40:30の出来高を伴う陽線から、9:46:30の大出来高陰線へのデイロールリバーサル。転換後の下落1波を売り、前日終値付近を狙う候補。",
    "reported_volume_094030": 250000,
    "reported_volume_094630": 380000,
    "actual_30s_volume_094030": 257600,
    "actual_30s_volume_094630": 188700,
    "reported_tp": 15175,
    "reported_tp_time": "10:06頃",
    "previous_close_from_sources": 15180,
    "source_100600_low": 15185,
    "source_100600_close": 15195,
    "time_note": "9:40:30→9:46:30は6分。発話の「30秒後」は30秒足との取り違えの可能性があるが、断定せず両時刻を保持。",
    "target_note": "本人候補15,175と資料の前日終値15,180を併記。10:06足L15,185のため、この足で15,175へ到達したとは記さない。"
  }
}
```

[R2入力一覧](r2_sources_manifest.json)


## HDDの当日板ログを追加

- 保存先：`[local path omitted]
- 最良買い／売り気配・板数量・API VWAP・累積出来高を再生時点で表示。表示は観測時刻以下に限定。
- 板ログは9:02頃から収録。区間出来高と推定DELTAは全行を集計できるR2歩み値を使用し、板の累積数量と二重加算しない。
- 元ログは変更せず、日誌には市場項目だけを抽出したJSONを使用。

```json
{
  "285A": {
    "source": "HDD BoardReadTools",
    "files": [
      "285A_20261014_090216.jsonl.gz",
      "285A_20261014_122506.jsonl.gz"
    ],
    "market_records": 116176,
    "display_snapshots": 1357,
    "first_observed_jst": "2026-10-14T09:02:18.625+09:00",
    "last_observed_jst": "2026-10-14T15:30:59.284+09:00",
    "first_cumulative_volume": 2520400.0,
    "last_cumulative_volume": 53857300.0,
    "walk_full_day_volume": 53857300,
    "volume_difference": 0.0,
    "stale_lower_volume_records_skipped": 2,
    "sampling": "表示用は15秒区間で最後に観測した板を保持。観測時刻が再生時刻以下のスナップショットだけを表示。寄り09:00〜09:02頃は板ログ未収録、出来高は歩み値で補う。"
  },
  "6857": {
    "source": "HDD BoardReadTools",
    "files": [
      "6857_20261014_090216.jsonl.gz",
      "6857_20261014_122506.jsonl.gz"
    ],
    "market_records": 88750,
    "display_snapshots": 1357,
    "first_observed_jst": "2026-10-14T09:02:18.690+09:00",
    "last_observed_jst": "2026-10-14T15:30:59.530+09:00",
    "first_cumulative_volume": 975900.0,
    "last_cumulative_volume": 16637800.0,
    "walk_full_day_volume": 16637800,
    "volume_difference": 0.0,
    "stale_lower_volume_records_skipped": 0,
    "sampling": "表示用は15秒区間で最後に観測した板を保持。観測時刻が再生時刻以下のスナップショットだけを表示。寄り09:00〜09:02頃は板ログ未収録、出来高は歩み値で補う。"
  }
}
```

[HDD板ログ参照一覧](local_board_sources_manifest.json)


## 時間足ボタン・BEFORE/AFTER・再生の追加（2026-10-15）

- JP225・US100を各1枠に集約。1時間足／5分足／日足／週足の切替。H1に%R(15)・BB・BB幅を含める。M5は60EMA（緑）と確定H1 20SMA（黄）、D1は20SMA（赤）、W1は20SMA（紫）。
- BEFORE=当日09:00、AFTER=当日15:30、資料の最終時点をボタンで選択。再生・停止、前後移動、速度1/4/12倍、時刻スライダーを追加。基本は完成した5分足の順で進める。
- H1と日足の形成中部分は、表示時刻までに完成した同一配信元M5の取得範囲から暫定OHLCを計算。指標も直前の完成足＋暫定終値から再計算する。完成後の全高安・終値は不使用。
- Axioryの09:00〜10:00は元CSVに足がない。灰色の空白として維持し、休止・取得漏れのどちらかは未確認。形成中日足では10時からの取得範囲のみであり、9時始値や一日全体の高安とは確定しない。
- 10/14の不足していたM5・US100週足と、比較用のAxiory H1は10/15取得のGitHub履歴から復元。10/14は15:30までに区切った後日の復習用資料。OANDA H1の9:00始値線は補足メニューに保持。
- 10/15 US100はM5 08:40、確定H1 08:00まで。9時・15:30を選んでも未取得と明示し、その後の値動きを生成しない。8時台の形成中H1と10/14の形成中日足は08:40までの保存M5による暫定値。
- 今回の修正はローカル保存。FTPアップロードは別工程。

[復元用ソースと時刻上限](index_replay_sources.json) / [表示画像・操作記録](index_snapshot_capture.json) / [BEFORE 5分足](index_M5_before.png) / [AFTER 5分足](index_M5_after.png)
