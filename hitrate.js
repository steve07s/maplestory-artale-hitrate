let loadedjson = {};

function elementChecker(array) {
  const types = ["冰", "雷", "火", "毒", "聖"];
  return (
    array
      ?.map((v, i) => (v ? types[i] : null))
      .filter(Boolean)
      .join(", ") || "-"
  );
}

function dmgType(typeText) {
  document.getElementById("dmgType").innerText = typeText;
  const lukInput = document.getElementById("luk");
  const block = document.getElementById("lukBlock");
  const isMagical = typeText === "智力:";
  lukInput.disabled = !isMagical;
  block.style.display = isMagical ? "block" : "none";
}

function mobSelect(mobName) {
  const mob = loadedjson[mobName];
  if (!mob) return;
  document.getElementById("monster-section").style.display = "block";
  const mobPic = document.getElementById("mobPic");
  mobPic.src = `image/${mobName}.png`;
  mobPic.onerror = () => {
    mobPic.src = "image/default.png";
  };
  document.getElementById("mobLevel").innerText = mob.level;
  document.getElementById("mobAvoid").innerText = mob.avoid;
  document.getElementById("HP").innerText = mob.hp;
  document.getElementById("EXP").innerText = mob.exp;
  document.getElementById("weak").innerText = elementChecker(mob.weak);
  document.getElementById("strong").innerText = elementChecker(mob.strong);
  document.getElementById("immune").innerText = elementChecker(mob.immune);
  doSomeMath();
}

function doSomeMath() {
    const mob = loadedjson[document.getElementById("mobs").value];
    if (!mob) return;
  
    const monLevel = mob.level;
    const monAvoid = mob.avoid;
    const charLevel = parseInt(document.getElementById("level").value);
    const charMain = parseInt(document.getElementById("mainstat").value);
    const charLuk = parseInt(document.getElementById("luk").value || "0");
    const targetRatePercent = parseFloat(document.getElementById("targetRate").value);
  
    let diff = Math.max(monLevel - charLevel, 0);
    let acc100, accTarget;
  
    const applyRateColor = (rate) => {
      const rateDisplay = document.getElementById("mobRate");
      rateDisplay.classList.remove("low", "mid", "high");
      if (rate < targetRatePercent) {
        rateDisplay.classList.add("low");
      } else if (rate < 99.9) {
        rateDisplay.classList.add("mid");
      } else {
        rateDisplay.classList.add("high");
      }
    };
  
    if (document.getElementById("physical").checked) {
      acc100 = (monAvoid * (55 + 2 * diff)) / 15;

      const actualRate = 100 * ((charMain - acc100 * 0.5) / (acc100 * 0.5));
      const finalRate = Math.max(0, Math.min(100, actualRate));

      accTarget = acc100 * 0.5 * (1 + (targetRatePercent / 100));
      const neededStat = Math.max(acc100 * 0.5 + 1, Math.min(acc100, accTarget));

      document.getElementById("mob1acc").value = neededStat.toFixed(2);
      document.getElementById("mob100acc").value = acc100.toFixed(2);
      const rateDisplay = document.getElementById("mobRate");
      rateDisplay.innerText = finalRate.toFixed(2) + "%";
      applyRateColor(finalRate);
      return;
    }
  
    const curAcc = Math.floor((charMain + charLuk) * 0.1);
    acc100 = (monAvoid + 1) * (1 + 0.04 * diff);
  
    const acc1 = 0.41 * acc100;
    const accPart = Math.min(Math.max((curAcc - acc1 + 1) / (acc100 - acc1 + 1), 0), 1);
    const actualRate = (-0.7011618132 * Math.pow(accPart, 2) + 1.702139835 * accPart) * 100;
    const finalRate = Math.max(0, Math.min(100, actualRate));

    accTarget = (1.702139835 - Math.sqrt(2.89728001789 - 2.8046472528 * (targetRatePercent / 100))) / 1.4023236264;
    const neededStat = Math.max(acc1, Math.min(acc100, accTarget * (acc100 - acc1 + 1) + acc1 - 1));

    document.getElementById("mob1acc").value = neededStat.toFixed(2);
    document.getElementById("mob100acc").value = acc100.toFixed(2);
    const rateDisplay = document.getElementById("mobRate");
    rateDisplay.innerText = finalRate.toFixed(2) + "%";
    applyRateColor(finalRate);
  }
  

document.getElementById("search").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const options = document.querySelectorAll("#mobs option");
  options.forEach((opt) => {
    opt.style.display = opt.textContent.toLowerCase().includes(keyword)
      ? ""
      : "none";
  });
});

["level", "mainstat", "luk", "targetRate"].forEach((id) => {
  document.getElementById(id).addEventListener("input", doSomeMath);
});

["physical", "magical"].forEach((id) => {
  document.getElementById(id).addEventListener("change", () => {
    dmgType(document.getElementById("magical").checked ? "智力:" : "命中:");
    doSomeMath();
  });
});

document.getElementById("mobs").addEventListener("change", function () {
  const selected = this.value;
  mobSelect(selected);
});

fetch("Monsters/artale_all_zh.json")
  .then((res) => res.json())
  .then((data) => {
    loadedjson = data;
    const mobSelectBox = document.getElementById("mobs");
    const entries = Object.entries(data).sort(
      (a, b) => a[1].level - b[1].level
    );
    entries.forEach(([name, val]) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = `(${val.level}) ${name}`;
      mobSelectBox.appendChild(option);
    });
    // 預設選第一隻
    if (entries.length > 0) {
      mobSelectBox.value = entries[0][0];
      mobSelect(entries[0][0]);
    }
  });
