// scripts/generator.js
console.log("🔧 generator.js loaded!");

// fetch helper
async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

// populate a <select> (if present)
function populate(id, items) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = [
    `<option value="">Random</option>`,
    ...items.map(i => `<option value="${i}">${i}</option>`)
  ].join("");
}

// pick either selected.value or a random option
function pick(sel) {
  if (!sel) return "N/A";
  if (sel.value) return sel.value;
  const opts = Array.from(sel.options).map(o => o.value).filter(v => v);
  return opts[Math.floor(Math.random() * opts.length)];
}

document.addEventListener("DOMContentLoaded", async () => {
  const page = location.pathname.split("/").pop();
  console.log("🔥 Running on:", page);

  const isNpcQuick = page === "npc-general.html";
  const isPcQuick  = page === "pc-general.html";
  const isNpcAdv   = page === "npc-advanced.html";
  const isPcAdv    = page === "pc-advanced.html";

  // 1) core pools
  const [names, sexes, races, traits] = await Promise.all([
    fetchJson("/data/names.json"),
    fetchJson("/data/sexes.json"),
    fetchJson("/data/races.json"),
    fetchJson("/data/traits.json")
  ]);

  // 2) QUICK NPC/PC
  if (isNpcQuick || isPcQuick) {
    populate("selName",  names);
    populate("selSex",   sexes);
    populate("selRace",  races);
    populate("selTrait", traits);

    document.getElementById("generateBtn").onclick = () => {
      const card = document.getElementById("resultCard");
      card.innerHTML = `
        <h2 class="text-2xl font-bold dark:text-white">
          ${pick(document.getElementById("selName"))}
        </h2>
        <ul class="list-disc pl-5 dark:text-gray-300">
          <li><strong>Sex:</strong>  ${pick(document.getElementById("selSex"))}</li>
          <li><strong>Race:</strong> ${pick(document.getElementById("selRace"))}</li>
          <li><strong>Trait:</strong>${pick(document.getElementById("selTrait"))}</li>
        </ul>
      `;
    };
    return; // done!
  }

  // 3) ADVANCED NPC or PC
  console.log("🔍 loading advanced pools…");
  const advancedFetches = [
    fetchJson("/data/classes.json"),
    fetchJson("/data/backgrounds.json"),
    fetchJson("/data/ideals.json"),
    fetchJson("/data/bonds.json"),
    fetchJson("/data/flaws.json"),
    fetchJson("/data/hair.json"),
    fetchJson("/data/eyes.json"),
    fetchJson("/data/clothing.json"),
    fetchJson("/data/hooks.json"),
    fetchJson("/data/hit-dice.json"),
    fetchJson("/data/ability-scores.json")
  ];

  // PC-only pools
  if (isPcAdv) {
    advancedFetches.push(
      fetchJson("/data/alignments.json"),
      fetchJson("/data/skills.json"),
      fetchJson("/data/tools.json"),
      fetchJson("/data/langs.json"),
      fetchJson("/data/spells.json")
    );
  }

  // wait for all of them
  const results = await Promise.all(advancedFetches);
  const [
    classes, backgrounds,
    ideals, bonds, flaws,
    hair, eyes, clothing,
    hooks, hdice, scores,
    alignment, skills, tools, langs, spells
  ] = results;

  // populate all shared advanced selects
  populate("advName",      names);
  populate("advSex",       sexes);
  populate("advRace",      races);
  populate("advClass",     classes);
  populate("advHD",        hdice);
  populate("advTrait",     traits);
  populate("advIdeal",     ideals);
  populate("advBond",      bonds);
  populate("advFlaw",      flaws);
  populate("advHair",      hair);
  populate("advEyes",      eyes);
  populate("advClothing",  clothing);
  populate("advHook",      hooks);
  populate("advBackground", backgrounds);

  // populate PC-only selects
  if (isPcAdv) {
    populate("advAlignment", alignment);
    populate("advSkill1",    skills);
    populate("advSkill2",    skills);
    populate("advTools",     tools);
    populate("advLangs",     langs);
    populate("advSpells",    spells);
  }

  // generate button (both NPC & PC advanced)
  document.getElementById("advGenerateBtn").onclick = () => {
    const data = {
      Name:      pick(document.getElementById("advName")),
      Sex:       pick(document.getElementById("advSex")),
      Race:      pick(document.getElementById("advRace")),
      Class:     pick(document.getElementById("advClass")),
      HitDice:   pick(document.getElementById("advHD")),
      HP:        document.getElementById("advHP")?.value || "N/A",
      STR:       document.getElementById("statSTR")?.value || pick({options: scores.map(s=>({value:s}))}),
      DEX:       document.getElementById("statDEX")?.value || pick({options: scores.map(s=>({value:s}))}),
      CON:       document.getElementById("statCON")?.value || pick({options: scores.map(s=>({value:s}))}),
      INT:       document.getElementById("statINT")?.value || pick({options: scores.map(s=>({value:s}))}),
      WIS:       document.getElementById("statWIS")?.value || pick({options: scores.map(s=>({value:s}))}),
      CHA:       document.getElementById("statCHA")?.value || pick({options: scores.map(s=>({value:s}))}),
      Trait:     pick(document.getElementById("advTrait")),
      Ideal:     pick(document.getElementById("advIdeal")),
      Bond:      pick(document.getElementById("advBond")),
      Flaw:      pick(document.getElementById("advFlaw")),
      Hair:      pick(document.getElementById("advHair")),
      Eyes:      pick(document.getElementById("advEyes")),
      Clothing:  pick(document.getElementById("advClothing")),
      Hook:      pick(document.getElementById("advHook")),
      Background:pick(document.getElementById("advBackground"))
    };

    // PC-only additions:
    if (isPcAdv) {
      data.Alignment = pick(document.getElementById("advAlignment"));
      data.Skill1    = pick(document.getElementById("advSkill1"));
      data.Skill2    = pick(document.getElementById("advSkill2"));
      data.Tools     = pick(document.getElementById("advTools"));
      data.Languages = pick(document.getElementById("advLangs"));
      data.Spells    = pick(document.getElementById("advSpells"));
    }

    // render the card
    let html = `<h2 class="text-2xl font-bold dark:text-white">${data.Name}</h2>`;
    html += `<ul class="list-disc pl-5 dark:text-gray-300">`;
    for (let [k,v] of Object.entries(data)) {
      html += `<li><strong>${k}:</strong> ${v}</li>`;
    }
    html += `</ul>`;
    document.getElementById("advResultCard").innerHTML = html;
  };

  // JSON export
  document.getElementById("exportJsonBtn")?.addEventListener("click", () => {
    const out = {};
    document.querySelectorAll("#advResultCard li").forEach(li => {
      const [key,val] = li.textContent.split(": ");
      out[key] = val;
    });
    const blob = new Blob([JSON.stringify(out,null,2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href    = URL.createObjectURL(blob);
    a.download = `${page.replace(".html","")}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // PDF stub
  document.getElementById("exportPdfBtn")?.addEventListener("click", () => {
    alert("PDF export coming soon!");
  });
});
