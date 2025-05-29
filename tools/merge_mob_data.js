const fs = require('fs');

const allZH = JSON.parse(fs.readFileSync('all_zh_filtered_no_english_korean.json', 'utf8'));
const mobRaw = JSON.parse(fs.readFileSync('mob.json', 'utf8'));
const dropData = JSON.parse(fs.readFileSync('drop_data.json', 'utf8'));

const defaultArray = [false, false, false, false, false];

const finalMerged = {};       // 主輸出：包含 drop 欄位
const artaleAllZH = {};       // 副輸出：不含 drop 欄位
const addedFromDropOnly = [];


// 🧩 第一階段：以 allZH 為主體，屬性從 mob.json 補
for (const monster of Object.keys(allZH)) {
  const mob = mobRaw[monster];
  const original = allZH[monster];

  const base = {
    id: mob ? monster : (original.id || monster),
    level: mob?.[0] ?? original.level ?? null,
    hp: mob?.[1] ?? original.hp ?? null,
    avoid: mob?.[6] ?? original.avoid ?? null,
    exp: mob?.[3] ?? original.exp ?? null,
    weak: mob?.[10] ?? original.weak ?? defaultArray,
    strong: mob?.[11] ?? original.strong ?? defaultArray,
    immune: mob?.[12] ?? original.immune ?? defaultArray,
  };
  
  artaleAllZH[monster] = { ...base };
  finalMerged[monster] = {
    ...base,
    drop: dropData[monster] ?? [],
  };
}


// 🧩 第二階段：補進 allZH 缺少，但 mob + drop 有的
for (const monster of Object.keys(dropData)) {
  if (finalMerged[monster]) continue; // 已處理過
  const mob = mobRaw[monster];
  if (!mob) continue;

  const base = {
    id: monster,
    level: mob[0],
    hp: mob[1],
    avoid: mob[6],
    exp: mob[3],
    weak: mob[10] ?? defaultArray,
    strong: mob[11] ?? defaultArray,
    immune: mob[12] ?? defaultArray,
  };

  finalMerged[monster] = {
    ...base,
    drop: dropData[monster],
  };
  artaleAllZH[monster] = base;

  addedFromDropOnly.push(`./images/${monster}.png`);

}

// 🧾 輸出
fs.writeFileSync('mob_final_merged.json', JSON.stringify(finalMerged, null, 2), 'utf8');
fs.writeFileSync('artale_all_zh.json', JSON.stringify(artaleAllZH, null, 2), 'utf8');

console.log(`✅ 完成：mob_final_merged.json（${Object.keys(finalMerged).length} 筆）`);
console.log(`📁 完成：artale_all_zh.json（${Object.keys(artaleAllZH).length} 筆）`);

console.log("\n🧩 以下是從 dropData + mobRaw 補進的怪物圖片路徑：");
addedFromDropOnly.forEach(path => console.log(path));

const onlyInAllZH = [];

for (const monster of Object.keys(allZH)) {
  const hasMob = !!mobRaw[monster];
  const hasDrop = !!dropData[monster];

  if (!hasMob && !hasDrop) {
    onlyInAllZH.push(`./images/${allZH[monster].id || monster}.png`);
  }
}

console.log("\n🕵️ 以下怪物僅存在 all_zh 中，mob 和 drop 都沒有：");
onlyInAllZH.forEach(path => console.log(path));
