# 🎯 Artale 命中率計算器（MapleStory Accuracy Calculator）

這是一款專為《Artale》懷舊楓之谷玩家打造的命中率計算工具，支援物理與魔法職業的命中公式切換，可根據角色等級、屬性、目標怪物進行即時命中率試算與需求評估。

> 計算邏輯已根據玩家社群實測與巴哈討論串整理，並與遊戲內實際命中機制對應驗證。

---

## 🔧 功能特色

* ✅ 怪物列表自動載入與搜尋
* ✅ 支援物理職業與法師獨立命中計算公式
* ✅ 即時輸入角色屬性、回饋命中結果
* ✅ 支援自訂命中率門段（如：60%、80%、100%）
* ✅ 顏色提示命中是否達標（綠：成功，橙：接近，紅：未達）
* ✅ 怪物圖片顯示與屬性資訊一覽

---

## 🔠 命中率公式說明

### 物理職業（劍士、盜賊、弓手、海盜）

* **100% 命中需求公式：**

  ```
  (MonsterAvoid × (55 + 2 × 等級差)) ÷ 15
  ```

* **命中率計算：**

  ```
  實際命中 = ((命中 - 需求命中的一半) ÷ 一半) × 100%
  ```

---

### 法師職業

* **魔法命中值計算：**

  ```
  魔法命中 = floor((INT + LUK) × 0.1)
  ```

* **100% 命中需求：**

  ```
  (MonsterAvoid + 1) × (1 + 0.04 × 等級差)
  ```

* **命中率推估公式（曲線修正）：**

  ```
  實際命中 = (-0.7011 × x^2 + 1.7021 × x) × 100%
  ```

---

## 📁 專案結構

```
maplestory-artale-hitrate/
├── index.html          # 主頁面
├── main.css            # 樣式檔（顏色、片段樣式）
├── hitrate.js          # 命中率計算邏輯與職業切換
├── Monsters/
│   └── artale_all_zh.json  # 怪物資料
├── image/
│   ├── 青蛇.png
│   ├── 綠水靈.png
│   └── default.png
```

---

## 🥺 使用方法

1. 打開 `index.html`（不需網站服務器）
2. 確保 `Monsters/` 與 `image/` 圖片路徑正確
3. 輸入角色資料、選擇怪物，即可顯示命中率

---

## 🧐 參考資料來源

* [https://github.com/MrSoupman/Maple-ACC-calculator](https://github.com/MrSoupman/Maple-ACC-calculator)
* [https://github.com/a2983456456](https://github.com/a2983456456)
* [Artale 怪物資料 Google Sheet](https://docs.google.com/spreadsheets/d/1xb6FhSGcM6EIj7aDcUmxZA9zVxLEw8xxXxxej5Tcrt4)
* [巴哈姆特楓之谷懷舊板公式討論串](https://forum.gamer.com.tw/C.php?bsn=79354&snA=1321)

---

## 📜 License

MIT License. 使用者可自由修改、引用本命中率計算器。若有錯誤歡迎 PR 或於 Discord 反饋建議 🙌

---

> Maintained by [artale.fun](https://artale.fun)· [楓之谷.online](https://楓之谷.online)
