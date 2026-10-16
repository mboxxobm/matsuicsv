# 2026-10-15 ソース照合・計算条件

- GitHub固定コミット：`84d90293f5e5f8bec33e6707bfa5d2d654be7113`。原本を変更せず別フォルダで作成。
- 本人確認：実況のフジクラは同じPaper Trading。平均4,715円・400株、4,688円決済、実現−10,800円。口頭の4,712円は100株の買い1件に一致し、平均価格と異なる。
- 15秒足は歩み値全行から集計。出来高は各区間の株数、同秒の同値約定も保持。欠測を補間しない。9:00から表示し、寄りが遅れた区間は空白。
- 推定DELTAは上昇ティック＋、下落−、同値は直前方向、寄りと引け板寄せは未分類。真の約定方向フラグなし。
- 30秒などの上位足は完成した基本足からだけ集計。形成中は形成中と表示。
- 板情報はPUSH/REST_BOARDの市場項目だけ抽出、観測時刻が再生時刻以下に限る。板数量差を出来高やDELTAへ加算しない。
- OANDAの2分足・20分足は末尾の完成を確認できないため末尾を除外。OANDAの出来高は未収録。
- Axioryのtime_utcはJSTへ変換。US100は更新停止、H1は08:00までの完成区間。午後へ補間しない。
- OANDA H1のBB20・2σは設定を仮定した参考再計算。本人の599・641を検証したことにしない。
- Axiory価格をOANDA Paperや別口座のCashの約定照合に流用しない。
- 実口座の実現損益、本人の体調・点数は未取得。

## 監査データ

```json
{
  "paper": {
    "fills": [
      {
        "t": 1792024690.0,
        "time": "2026-10-15 09:38:10",
        "price": 4718.0,
        "qty": 100.0,
        "kind": "ENTRY",
        "direction": "LONG",
        "account": "Paper Trading",
        "id": "3675406715"
      },
      {
        "t": 1792024757.0,
        "time": "2026-10-15 09:39:17",
        "price": 4713.0,
        "qty": 100.0,
        "kind": "ENTRY",
        "direction": "LONG",
        "account": "Paper Trading",
        "id": "3675406483"
      },
      {
        "t": 1792024764.0,
        "time": "2026-10-15 09:39:24",
        "price": 4712.0,
        "qty": 100.0,
        "kind": "ENTRY",
        "direction": "LONG",
        "account": "Paper Trading",
        "id": "3675407692"
      },
      {
        "t": 1792024780.0,
        "time": "2026-10-15 09:39:40",
        "price": 4717.0,
        "qty": 100.0,
        "kind": "ENTRY",
        "direction": "LONG",
        "account": "Paper Trading",
        "id": "3675411671"
      },
      {
        "t": 1792025119.0,
        "time": "2026-10-15 09:45:19",
        "price": 4688.0,
        "qty": 400.0,
        "kind": "EXIT",
        "direction": "LONG",
        "account": "Paper Trading",
        "id": "3675407694"
      }
    ],
    "average": 4715.0,
    "quantity": 400.0,
    "exit_price": 4688.0,
    "realized_jpy": -10800.0,
    "fees_jpy": 0,
    "oral_average": 4712,
    "oral_calculated_loss": -9600,
    "difference_vs_oral": -1200,
    "user_confirmation": "本人が実況のフジクラは同じPaper Tradingと確認。",
    "lc_price": 4687,
    "lc_available": 1792024709.0,
    "tp": null,
    "rr": null,
    "final_position_lc_risk": 11200.0,
    "final_risk_multiple": -0.9642857142857143,
    "history_aggregated_average": [
      4715.0
    ],
    "live_account": "実口座の履歴は未受領。"
  },
  "tape_5803_2026-10-15": {
    "code": "5803",
    "date": "2026-10-15",
    "ticks": 85467,
    "bars": 1266,
    "shares": 48846000,
    "open": 4850.0,
    "opening_time": "2026-10-15T09:09:00+09:00",
    "high": 4858.0,
    "low": 4531.0,
    "close": 4540.0,
    "last": "2026-10-15T15:30:00+09:00",
    "unclassified_volume": 5164800,
    "source": "R2 authenticated GET",
    "previous_close": 5200.0,
    "change_pct": -12.692307692307692,
    "gap_pct": -6.730769230769229
  },
  "tape_5803_2026-10-14": {
    "code": "5803",
    "date": "2026-10-14",
    "ticks": 67333,
    "bars": 1302,
    "shares": 29302000,
    "open": 5128.0,
    "opening_time": "2026-10-14T09:00:00+09:00",
    "high": 5307.0,
    "low": 5114.0,
    "close": 5200.0,
    "last": "2026-10-14T15:30:00+09:00",
    "unclassified_volume": 2243400,
    "source": "HDD GEMINIGravity"
  },
  "board_5803": {
    "files": [
      "5803_20261015_084205.jsonl.gz",
      "5803_20261015_122505.jsonl.gz"
    ],
    "snapshots": 1331,
    "first": "2026-10-15T09:09:00+09:00",
    "last": "2026-10-15T15:31:00+09:00",
    "last_cumulative": 48846000.0,
    "volume_difference": 0.0
  },
  "tape_285A_2026-10-15": {
    "code": "285A",
    "date": "2026-10-15",
    "ticks": 137137,
    "bars": 1276,
    "shares": 79013300,
    "open": 13790.0,
    "opening_time": "2026-10-15T09:06:40+09:00",
    "high": 13825.0,
    "low": 12675.0,
    "close": 12880.0,
    "last": "2026-10-15T15:30:00+09:00",
    "unclassified_volume": 6001400,
    "source": "R2 authenticated GET",
    "previous_close": 14690.0,
    "change_pct": -12.321307011572502,
    "gap_pct": -6.126616746085778
  },
  "tape_285A_2026-10-14": {
    "code": "285A",
    "date": "2026-10-14",
    "ticks": 95407,
    "bars": 1302,
    "shares": 53857300,
    "open": 15500.0,
    "opening_time": "2026-10-14T09:00:00+09:00",
    "high": 15655.0,
    "low": 14570.0,
    "close": 14690.0,
    "last": "2026-10-14T15:30:00+09:00",
    "unclassified_volume": 2951800,
    "source": "HDD GEMINIGravity"
  },
  "board_285A": {
    "files": [
      "285A_20261015_084205.jsonl.gz",
      "285A_20261015_122505.jsonl.gz"
    ],
    "snapshots": 1340,
    "first": "2026-10-15T09:06:40+09:00",
    "last": "2026-10-15T15:30:59+09:00",
    "last_cumulative": 79013300.0,
    "volume_difference": 0.0
  },
  "tape_6857_2026-10-15": {
    "code": "6857",
    "date": "2026-10-15",
    "ticks": 84508,
    "bars": 1278,
    "shares": 26184300,
    "open": 38500.0,
    "opening_time": "2026-10-15T09:06:00+09:00",
    "high": 39020.0,
    "low": 34000.0,
    "close": 34340.0,
    "last": "2026-10-15T15:30:00+09:00",
    "unclassified_volume": 2347600,
    "source": "R2 authenticated GET",
    "previous_close": 40380.0,
    "change_pct": -14.957899950470532,
    "gap_pct": -4.655770183259033
  },
  "tape_6857_2026-10-14": {
    "code": "6857",
    "date": "2026-10-14",
    "ticks": 55022,
    "bars": 1299,
    "shares": 16637800,
    "open": 40000.0,
    "opening_time": "2026-10-14T09:00:00+09:00",
    "high": 41430.0,
    "low": 39980.0,
    "close": 40380.0,
    "last": "2026-10-14T15:30:00+09:00",
    "unclassified_volume": 1121700,
    "source": "HDD GEMINIGravity"
  },
  "board_6857": {
    "files": [
      "6857_20261015_084205.jsonl.gz",
      "6857_20261015_122505.jsonl.gz"
    ],
    "snapshots": 1342,
    "first": "2026-10-15T09:06:00+09:00",
    "last": "2026-10-15T15:30:59+09:00",
    "last_cumulative": 26184300.0,
    "volume_difference": 0.0
  },
  "tape_6976_2026-10-15": {
    "code": "6976",
    "date": "2026-10-15",
    "ticks": 91704,
    "bars": 1289,
    "shares": 29621300,
    "open": 10400.0,
    "opening_time": "2026-10-15T09:03:00+09:00",
    "high": 10705.0,
    "low": 9785.0,
    "close": 9864.0,
    "last": "2026-10-15T15:30:00+09:00",
    "unclassified_volume": 1240000,
    "source": "R2 authenticated GET",
    "previous_close": 10970.0,
    "change_pct": -10.082041932543294,
    "gap_pct": -5.1959890610756565
  },
  "tape_6976_2026-10-14": {
    "code": "6976",
    "date": "2026-10-14",
    "ticks": 62537,
    "bars": 1302,
    "shares": 26376100,
    "open": 10745.0,
    "opening_time": "2026-10-14T09:00:00+09:00",
    "high": 11525.0,
    "low": 10700.0,
    "close": 10970.0,
    "last": "2026-10-14T15:30:00+09:00",
    "unclassified_volume": 955600,
    "source": "HDD GEMINIGravity"
  },
  "board_6976": {
    "files": [
      "6976_20261015_084205.jsonl.gz",
      "6976_20261015_122505.jsonl.gz"
    ],
    "snapshots": 1355,
    "first": "2026-10-15T09:03:00+09:00",
    "last": "2026-10-15T15:31:00+09:00",
    "last_cumulative": 29621300.0,
    "volume_difference": 0.0
  },
  "tape_9984_2026-10-15": {
    "code": "9984",
    "date": "2026-10-15",
    "ticks": 96044,
    "bars": 1264,
    "shares": 75165400,
    "open": 4951.0,
    "opening_time": "2026-10-15T09:09:38+09:00",
    "high": 4983.0,
    "low": 4800.0,
    "close": 4852.0,
    "last": "2026-10-15T15:30:00+09:00",
    "unclassified_volume": 15002000,
    "source": "R2 authenticated GET",
    "previous_close": 5351.0,
    "change_pct": -9.325359745841899,
    "gap_pct": -7.475238273219964
  },
  "tape_9984_2026-10-14": {
    "code": "9984",
    "date": "2026-10-14",
    "ticks": 75613,
    "bars": 1302,
    "shares": 43075000,
    "open": 5395.0,
    "opening_time": "2026-10-14T09:00:00+09:00",
    "high": 5519.0,
    "low": 5348.0,
    "close": 5351.0,
    "last": "2026-10-14T15:30:00+09:00",
    "unclassified_volume": 4745600,
    "source": "HDD GEMINIGravity"
  },
  "board_9984": {
    "files": [
      "9984_20261015_084205.jsonl.gz",
      "9984_20261015_122505.jsonl.gz"
    ],
    "snapshots": 1329,
    "first": "2026-10-15T09:09:38+09:00",
    "last": "2026-10-15T15:31:00+09:00",
    "last_cumulative": 75165400.0,
    "volume_difference": 0.0
  },
  "tape_1570_2026-10-15": {
    "code": "1570",
    "date": "2026-10-15",
    "ticks": 74908,
    "bars": 1278,
    "shares": 5373128,
    "open": 69350.0,
    "opening_time": "2026-10-15T09:06:00+09:00",
    "high": 69490.0,
    "low": 65060.0,
    "close": 66130.0,
    "last": "2026-10-15T15:30:00+09:00",
    "unclassified_volume": 281621,
    "source": "HDD GEMINIGravity",
    "previous_close": 73060.0,
    "change_pct": -9.485354503148102,
    "gap_pct": -5.078018067341916
  },
  "tape_1570_2026-10-14": {
    "code": "1570",
    "date": "2026-10-14",
    "ticks": 33274,
    "bars": 1302,
    "shares": 2368236,
    "open": 73160.0,
    "opening_time": "2026-10-14T09:00:00+09:00",
    "high": 74350.0,
    "low": 72480.0,
    "close": 73060.0,
    "last": "2026-10-14T15:30:00+09:00",
    "unclassified_volume": 70412,
    "source": "HDD GEMINIGravity"
  },
  "board_1570": {
    "files": [
      "1570_20261015_084205.jsonl.gz",
      "1570_20261015_122505.jsonl.gz"
    ],
    "snapshots": 1343,
    "first": "2026-10-15T09:06:00+09:00",
    "last": "2026-10-15T15:31:00+09:00",
    "last_cumulative": 5373128.0,
    "volume_difference": 0.0
  },
  "tape_1321_2026-10-15": {
    "code": "1321",
    "date": "2026-10-15",
    "ticks": 22520,
    "bars": 1290,
    "shares": 51144120,
    "open": 687.0,
    "opening_time": "2026-10-15T09:03:00+09:00",
    "high": 688.9,
    "low": 667.6,
    "close": 673.1,
    "last": "2026-10-15T15:30:00+09:00",
    "unclassified_volume": 6003050,
    "source": "R2 authenticated GET",
    "previous_close": 706.4,
    "change_pct": -4.714043035107585,
    "gap_pct": -2.746319365798411
  },
  "tape_1321_2026-10-14": {
    "code": "1321",
    "date": "2026-10-14",
    "ticks": 12060,
    "bars": 1291,
    "shares": 16036730,
    "open": 706.5,
    "opening_time": "2026-10-14T09:00:00+09:00",
    "high": 712.3,
    "low": 703.3,
    "close": 706.4,
    "last": "2026-10-14T15:30:00+09:00",
    "unclassified_volume": 686670,
    "source": "HDD GEMINIGravity"
  },
  "board_1321": {
    "files": [
      "1321_20261015_084205.jsonl.gz",
      "1321_20261015_122505.jsonl.gz"
    ],
    "snapshots": 1354,
    "first": "2026-10-15T09:03:00+09:00",
    "last": "2026-10-15T15:30:59+09:00",
    "last_cumulative": 51144120.0,
    "volume_difference": 0.0
  },
  "tape_7974_2026-10-15": {
    "code": "7974",
    "date": "2026-10-15",
    "ticks": 24909,
    "bars": 1293,
    "shares": 9835700,
    "open": 8233.0,
    "opening_time": "2026-10-15T09:00:00+09:00",
    "high": 8335.0,
    "low": 8134.0,
    "close": 8228.0,
    "last": "2026-10-15T15:30:00+09:00",
    "unclassified_volume": 3332500,
    "source": "R2 authenticated GET",
    "previous_close": 8278.0,
    "change_pct": -0.6040106305870929,
    "gap_pct": -0.5436095675283914
  },
  "tape_7974_2026-10-14": {
    "code": "7974",
    "date": "2026-10-14",
    "ticks": 15508,
    "bars": 1271,
    "shares": 5915600,
    "open": 8165.0,
    "opening_time": "2026-10-14T09:00:00+09:00",
    "high": 8318.0,
    "low": 8105.0,
    "close": 8278.0,
    "last": "2026-10-14T15:30:00+09:00",
    "unclassified_volume": 1561300,
    "source": "HDD GEMINIGravity"
  },
  "tape_7203_2026-10-15": {
    "code": "7203",
    "date": "2026-10-15",
    "ticks": 16416,
    "bars": 1281,
    "shares": 32262800,
    "open": 2987.0,
    "opening_time": "2026-10-15T09:00:00+09:00",
    "high": 3046.0,
    "low": 2975.0,
    "close": 3029.0,
    "last": "2026-10-15T15:30:00+09:00",
    "unclassified_volume": 12129300,
    "source": "R2 authenticated GET",
    "previous_close": 3011.0,
    "change_pct": 0.5978080371969341,
    "gap_pct": -0.7970773829292566
  },
  "tape_7203_2026-10-14": {
    "code": "7203",
    "date": "2026-10-14",
    "ticks": 10883,
    "bars": 1281,
    "shares": 19149000,
    "open": 2988.0,
    "opening_time": "2026-10-14T09:00:00+09:00",
    "high": 3022.0,
    "low": 2972.5,
    "close": 3011.0,
    "last": "2026-10-14T15:30:00+09:00",
    "unclassified_volume": 6192700,
    "source": "HDD GEMINIGravity"
  },
  "macro_JP225_D1": {
    "last_bar_start": "2026-10-14 09:00",
    "last_bar_end": "2026-10-15T09:00:00+09:00",
    "last_close": 66322.91,
    "ma": 67433.4005,
    "wr15": -75.32245256458067,
    "source": "JP225_D1.csv",
    "price_series": "Axiory",
    "stale": false
  },
  "macro_US100_D1": {
    "last_bar_start": "2026-10-13 09:00",
    "last_bar_end": "2026-10-14T09:00:00+09:00",
    "last_close": 30574.61,
    "ma": 30495.23,
    "wr15": -63.072736461532344,
    "source": "US100_D1.csv",
    "price_series": "Axiory",
    "stale": true
  },
  "macro_JP225_H1": {
    "last_bar_start": "2026-10-15 18:00",
    "last_bar_end": "2026-10-15T19:00:00+09:00",
    "last_close": 64584.6,
    "ma": 65676.18,
    "wr15": -82.76701757014945,
    "source": "OANDA_JP225YJPY, 20_92e90.csv",
    "price_series": "OANDA",
    "stale": false
  },
  "macro_US100_H1": {
    "last_bar_start": "2026-10-15 07:00",
    "last_bar_end": "2026-10-15T08:00:00+09:00",
    "last_close": 29982.79,
    "ma": 30412.749499999998,
    "wr15": -86.50082081070826,
    "source": "US100_H1.csv",
    "price_series": "Axiory",
    "stale": true
  },
  "macro_JP225_M5": {
    "last_bar_start": "2026-10-15 19:15",
    "last_bar_end": "2026-10-15T19:20:00+09:00",
    "last_close": 64558.13,
    "ma": 64669.40153608157,
    "wr15": -34.883720930232556,
    "source": "JP225_M5.csv",
    "price_series": "Axiory",
    "stale": false
  },
  "macro_US100_M5": {
    "last_bar_start": "2026-10-15 08:35",
    "last_bar_end": "2026-10-15T08:40:00+09:00",
    "last_close": 29942.31,
    "ma": 30027.464951892278,
    "wr15": -89.34434286837688,
    "source": "US100_M5.csv",
    "price_series": "Axiory",
    "stale": true
  },
  "macro_JP225_W1": {
    "last_bar_start": "2026-10-04 09:00",
    "last_bar_end": "2026-10-11T09:00:00+09:00",
    "last_close": 68881.78,
    "ma": 66838.962,
    "wr15": -26.644123023057475,
    "source": "JP225_W1.csv",
    "price_series": "Axiory",
    "stale": false
  },
  "macro_US100_W1": {
    "last_bar_start": "2026-10-04 09:00",
    "last_bar_end": "2026-10-11T09:00:00+09:00",
    "last_close": 30901.3,
    "ma": 29594.1855,
    "wr15": -11.169228144832068,
    "source": "US100_W1.csv",
    "price_series": "Axiory",
    "stale": true
  },
  "bb_reference": {
    "method": "OANDA H1、終値20本・±2σ・母標準偏差を仮定した参考再計算。本人の指標設定との一致は未確認。",
    "minimum_before_open": {
      "t": 1791939600,
      "label": "2026-10-14 10:00",
      "o": 68033.9,
      "h": 68191.4,
      "l": 67901.4,
      "c": 68161.4,
      "complete": true,
      "ma": 67915.9,
      "wr": -5.286343612334802,
      "bbWidth": 476.0525181111849
    },
    "reported_widths": [
      641,
      599
    ],
    "exact_reported_width_confirmed": false
  },
  "5803_context": {
    "last_completed_before_entry": {
      "t": 1792024665,
      "end": 1792024680,
      "o": 4719.0,
      "h": 4723.0,
      "l": 4716.0,
      "c": 4716.0,
      "v": 35900,
      "d": -3100,
      "u": 0,
      "vw": 4757.8179,
      "complete": true,
      "instant": false
    },
    "holding_window_overlapping_15s_high": 4727.0,
    "after_exit_low": 4531.0,
    "after_exit_low_time": "2026-10-15T15:23:30+09:00",
    "interval_note": "ENTRY後に開始しEXIT時刻までに開始した15秒足の参考高値。EXITをまたぐ形成中の区間を含み、保有中の約定単位の最高値ではない。",
    "csv_compare": {
      "compared_30s_bars": 999,
      "ohlc_differences": 76,
      "first_differences": [
        {
          "t": "2026-10-14T11:29:30+09:00",
          "r2": {
            "o": 5224.0,
            "h": 5224.0,
            "l": 5222.0,
            "c": 5222.0
          },
          "tv": {
            "t": 1791944970,
            "o": 5224.0,
            "h": 5224.0,
            "l": 5221.0,
            "c": 5221.0,
            "v": null,
            "d": null,
            "vw": null,
            "complete": true
          }
        },
        {
          "t": "2026-10-14T12:43:00+09:00",
          "r2": {
            "o": 5231.0,
            "h": 5233.0,
            "l": 5227.0,
            "c": 5230.0
          },
          "tv": {
            "t": 1791949380,
            "o": 5231.0,
            "h": 5233.0,
            "l": 5227.0,
            "c": 5228.0,
            "v": null,
            "d": null,
            "vw": null,
            "complete": true
          }
        },
        {
          "t": "2026-10-14T12:43:30+09:00",
          "r2": {
            "o": 5229.0,
            "h": 5229.0,
            "l": 5222.0,
            "c": 5227.0
          },
          "tv": {
            "t": 1791949410,
            "o": 5229.0,
            "h": 5230.0,
            "l": 5222.0,
            "c": 5227.0,
            "v": null,
            "d": null,
            "vw": null,
            "complete": true
          }
        }
      ]
    }
  }
}
```

[GitHub資料](sources_manifest.json) / [R2・歩み値](r2_sources_manifest.json) / [HDD板ログ](local_board_sources_manifest.json)

## ローカル表示と成果物

- 本人が実況とCSVのフジクラを同じPaper Tradingと確認。
- 完成品：HTML・Markdown・銘柄別メモ10本・対話チャート8系列・上位足PNG9枚・銘柄チャートPNG8枚。
- 板は時刻以前の市場項目だけを抽出。最良気配、上位5本の合計・5本内最大数量を表示。板の厚みだけで約定方向・支持を断定しない。
- 15秒／30秒等の区間株数を線形表示。RVOLは過去30本、形成中・寄り後2分・引け板寄せを確定マークから除外。急増のマークは出来高棒の枠だけ。
- 時刻再生欄の将来情報を抑え、全日振り返り・タグの損益欄は再生欄より下へ分離。
- Paper4回のENTRYとEXIT、LC価格・保有数量・平均価格、当日9時開始、前営業日の移動、11:30・15:30の時刻を表示確認。
- PC・390pxスマホ表示を保存。JavaScriptのページエラー0、スマホ横はみ出しなし。
- 画像(4)は1×1の空白、clipboardは(5)と同画面のため重複掲載を省略。
- TVの5803の30秒足との比較999本中76本にOHLC差。再生はR2歩み値へ統一。原因の切り分け未完了で、同秒内順序や配信処理等の仮説は未確認。
- 全日出来高の照合は板の最終累積数量との一致であり、すべての区間の完全性や約定方向を保証するものではない。
- 参考の市場資料内でリンクされたM1の巨大CSVは今回未取得。使用した8本の上位足CSVを保存。
- 日誌とタグ索引のローカル保存まで。GitHubへ更新・FTPアップロードは実施していない。

[PC表示](preview_5803_desktop.png) / [スマホ表示](preview_5803_mobile.png) / [表示記録](display_review.json) / [リンク確認](link_review.json)

## 指数のBB COMP・SELL仮説追記

- 最新mainを再確認し、既取得コミット84d90293f5e5f8bec33e6707bfa5d2d654be7113と一致。
- 本人の本日分類を「BB COMP後の下降トレンド継続の日」と明記。
- JP225とUS100のH1原本から、20SMA・±2σ（母標準偏差）・%R15・BB幅を再計算。本文のH1・5分足・日足を初期表示。週足とOANDA補足図は開閉式。
- 23:00開始のH1は翌00:00、00:00開始は01:00に確定。足の開始時刻を観測可能時刻と混同しない。
- 本人が観察した599・641と、今回の参考再計算を区別する。
- JP225 H1に09:00足がないAxioryへOANDAの始値線を混ぜない。補足OANDA図に09:00始値65,823.9円→翌日09:00を維持。
- US100 H1は08:00の期間境界までの資料。午後の継続を確認したことにしない。
- 本人のフジクラ「キリ番での大衆狩りを狙うSELLの方が期待値が高いのでは」を支持失敗SELLの仮説として保存。売買主体の意図・統計的期待値は未確認。仮想ENTRY・LC・TP・利益は確定しない。
- 09:42の4,700円割れ→回復→09:43台に維持失敗、09:48の安値更新を30秒足で比較。ジャンプは完了時刻へ移動。
- 現在の対話チャート8系列と約定記録は維持。指数の静的な全日チャートと再生時点の情報を区分。FTPは別工程。

[指数解説](index_trade_review.md) / [再計算値](indices_review_facts.json) / [PC表示](index_JP225_desktop.png) / [スマホ表示](index_JP225_mobile.png)

## 前日接続と株式の取引時間軸

- ユーザー指定により、日本株・ETFの夜間・休日・昼休みを横軸から省略。前日終盤＋当日9:00からを初期表示にした。
- 日付の切替を縦線と日付ラベルで表示。深夜03時や早朝07時へスクロールして空白になる状態を修正。
- 表示座標だけを取引時間へ変換し、足・約定・板は元の時刻で参照判定。数量・OHLC・VWAP・DELTAの値は変更しない。
- 寄りが9:09のフジクラの09:00〜09:09は未約定として保持。取引時間中の欠測を補間・省略しない。
- 前日全体、前日＋当日全体、当日9時からを切替可能。再生時刻は当日で、前日は履歴として表示。
- 7銘柄×2日（10/14・10/15）をdata/chart_history/stocks/へ保存。日付と銘柄で重複を避け、株数合計・出典・SHA256を記録。短い途中データで終日を削除しない。
- rendererはarchive_payloadを呼び、過去の取得済み日を接続する。他の作成ツールにも同じ処理を使う手順を保存。定期実行・FTPは実施していない。
- 指数CFDの夜間はこの省略の対象外。指数のBB分析・US100の資料時点は維持。

[前日終盤＋当日](session_connected_initial.png) / [前日全体](session_previous_full.png) / [当日のみ](session_today_only.png) / [操作・表示記録](session_display_review.json) / [履歴照合](history_archive_review.json)

## 指数5分足のMTF標準

- 本人の指定に従い、日経225・US100の5分足へ、5分足60期間EMA（緑）と同一配信元H1 20期間SMA（黄・MTF）を重ねた。
- 表示は標準で前日21:00 JSTから。朝07:00・保存範囲全体も選択可能。EMAは表示範囲より前を含む元CSV全履歴で計算。
- MTFはH1の終了時刻が各5分足の開始時刻以下のものだけ。黄色線を階段状に維持し、形成中H1の値を過去へ描き戻さない。
- 両銘柄の全履歴で、参照H1終了時刻がM5開始時刻より後になるケースは0。
- JP225：M5は19:20まで、EMA60約64,669.40、参照H1は19:00確定・SMA20約66,131.76。
- US100：M5は08:40まで、EMA60約30,027.46、参照H1は08:00確定・SMA20約30,412.75。9時以降を補間しない。
- 5分足に価格データのない09:00〜10:00などの区間は、ローソク・EMA・MTFを補間しない。09:00の縦線は時刻の目印で、始値の価格線ではない。
- 共通設定templates/index_mtf_chart.json、共通処理scripts/diary_index_mtf.pyを追加。日誌テンプレート・詳細ルール・引き継ぎメモへ標準として反映。
- PCの2枚を描画して色・階段表示・範囲を確認。スマホの横はみ出しなし。

[MTF再計算](mtf_facts.json) / [JP225 5分足](macro_4.png) / [US100 5分足](macro_5.png)


## 時間足ボタンへの表示整理（2026-10-15）

- JP225・US100各1枠、1時間足・5分足・日足・週足の4ボタンへ整理。H1に%R(15)・BB・BB幅を含め、5分足に60EMA（緑）と確定H1 20SMA（黄）を表示。
- 同じ画像を直下へ再掲する「画像を表示」を撤去。拡大ボタンは共通ビューアを使用。
- 5分足は前日21:00から表示。US100の朝だけの表示を前夜からの値動きへ広げたが、元データは10/15 08:40で終了しており、それ以降を生成していない。GitHub mainを再確認しても更新なし。
- JP225の09:00〜10:00はAxiory元CSVに足がない区間。灰色の帯と説明を添えた。休止・収集欠落の原因までは確定していない。別配信元OANDAのネイティブ2分足は「9時台の補足」から表示でき、Axioryへ混在させない。
- 日足ボタンは完成足履歴。09:00・15:30の当日形成中日足の比較資料は未取得で、同じ完成足を複製して比較とはしていない。
- 正本ルール・引き継ぎメモ・日誌テンプレート・共通JSON設定へ同じ表示構成を保存。

[画面切替の記録](index_buttons_review.json) / [JP225 5分足表示](switch_JP225_m5_desktop.png) / [US100 5分足表示](switch_US100_m5_desktop.png)


## 時間足ボタン・BEFORE/AFTER・再生の追加（2026-10-15）

- JP225・US100を各1枠に集約。1時間足／5分足／日足／週足の切替。H1に%R(15)・BB・BB幅を含める。M5は60EMA（緑）と確定H1 20SMA（黄）、D1は20SMA（赤）、W1は20SMA（紫）。
- BEFORE=当日09:00、AFTER=当日15:30、資料の最終時点をボタンで選択。再生・停止、前後移動、速度1/4/12倍、時刻スライダーを追加。基本は完成した5分足の順で進める。
- H1と日足の形成中部分は、表示時刻までに完成した同一配信元M5の取得範囲から暫定OHLCを計算。指標も直前の完成足＋暫定終値から再計算する。完成後の全高安・終値は不使用。
- Axioryの09:00〜10:00は元CSVに足がない。灰色の空白として維持し、休止・取得漏れのどちらかは未確認。形成中日足では10時からの取得範囲のみであり、9時始値や一日全体の高安とは確定しない。
- 10/14の不足していたM5・US100週足と、比較用のAxiory H1は10/15取得のGitHub履歴から復元。10/14は15:30までに区切った後日の復習用資料。OANDA H1の9:00始値線は補足メニューに保持。
- 10/15 US100はM5 08:40、確定H1 08:00まで。9時・15:30を選んでも未取得と明示し、その後の値動きを生成しない。8時台の形成中H1と10/14の形成中日足は08:40までの保存M5による暫定値。
- 今回の修正はローカル保存。FTPアップロードは別工程。

[復元用ソースと時刻上限](index_replay_sources.json) / [表示画像・操作記録](index_snapshot_capture.json) / [BEFORE 5分足](index_M5_before.png) / [AFTER 5分足](index_M5_after.png)
