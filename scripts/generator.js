// scripts/generator.js

// Confirm script is running
console.log("🔧 generator.js loaded!");

// Helper: fetch JSON, throw on non-200
async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  return res.json();
}

// Populate a <select> with a "Random" option + items[]
function populate(id, items) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML =
    '<option value="">Random</option>' +
    items.map(i => `<option value="${i}">${i}</option>`).join("");
}

// Pick selected.value or random from select.options
function pick(selOrOpts) {
  let opts;
  if (selOrOpts.options) {
    opts = Array.from(selOrOpts.options).map(o => o.value).filter(v => v);
  } else {
    // if called with {options:[{value:x},…]}
    opts = selOrOpts.options.map(o => o.value);
  }
  return opts[Math.floor(Math.random() * opts.length)];
}

document.addEventListener("DOMContentLoaded", async () => {
  const path = location.pathname;
  const isQuick  = path.endsWith("npc-general.html") || path.endsWith("pc-general.html");
  const isAdvNpc = path.endsWith("npc-advanced.html");
  const isAdvPc  = path.endsWith("pc-advanced.html");

  // 1) Core pools
  const [
    names, sexes, races, traits,
    classes, backgrounds,
    ideals, bonds, flaws,
    hair, eyes, clothing,
    hooks, hdice, scores,
    // PC-only
    skills, tools, langs, spells,
    // NPC-only
    crList, acList, speedList,
    resistances, senses,
    actionsList, reactionsList,
    legendaryList, lairList
  ] = await Promise.all([
    fetchJson("/data/names.json"),
    fetchJson("/data/sexes.json"),
    fetchJson("/data/races.json"),
    fetchJson("/data/traits.json"),

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
    fetchJson("/data/ability-scores.json"),

    fetchJson("/data/skills.json"),
    fetchJson("/data/tools.json"),
    fetchJson("/data/langs.json"),
    fetchJson("/data/spells.json"),

    fetchJson("/data/cr.json"),
    fetchJson("/data/ac.json"),
    fetchJson("/data/speed.json"),
    fetchJson("/data/resistances.json"),
    fetchJson("/data/senses.json"),

    fetchJson("/data/actions.json"),
    fetchJson("/data/reactions.json"),
    fetchJson("/data/legendary.json"),
    fetchJson("/data/lair.json"),
  ]);

  // === Quick (NPC & PC) ===
  if (isQuick) {
    populate("selName",  names);
    populate("selSex",   sexes);
    populate("selRace",  races);
    populate("selTrait", traits);

    populate("batchCount", [1,5,10]); // new batch dropdown

    document.getElementById("generateBtn").onclick = () => {
      const n = parseInt(document.getElementById("batchCount").value, 10) || 1;
      const container = document.getElementById("resultCard");
      container.innerHTML = "";

      for (let i = 0; i < n; i++) {
        const html = `
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded shadow">
            <h2 class="text-xl font-bold dark:text-white mb-2">
              ${pick(document.getElementById("selName"))}
            </h2>
            <ul class="list-disc pl-5 dark:text-gray-300 text-sm">
              <li><strong>Sex:</strong> ${pick(document.getElementById("selSex"))}</li>
              <li><strong>Race:</strong> ${pick(document.getElementById("selRace"))}</li>
              <li><strong>Trait:</strong> ${pick(document.getElementById("selTrait"))}</li>
            </ul>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
      }
    };
    return;
  }

  // === Advanced (NPC & PC) ===
  // Populate shared advanced fields
  populate("advName",     names);
  populate("advSex",      sexes);
  populate("advRace",     races);
  populate("advClass",    classes);
  populate("advHD",       hdice);
  populate("advTrait",    traits);
  populate("advIdeal",    ideals);
  populate("advBond",     bonds);
  populate("advFlaw",     flaws);
  populate("advHair",     hair);
  populate("advEyes",     eyes);
  populate("advClothing", clothing);
  populate("advHook",     hooks);

  // NPC-only selects
  populate("advCR",       crList);
  populate("advAC",       acList);
  populate("advSpeed",    speedList);
  populate("advResist",   resistances);
  populate("advSenses",   senses);

  // PC-only selects
  populate("advSkills",   skills);
  populate("advTools",    tools);
  populate("advLangs",    langs);
  populate("advSpells",   spells);

  // Advanced “Generate” button
  document.getElementById("advGenerateBtn").onclick = () => {
    const data = {
      Name:    pick(document.getElementById("advName")),
      Sex:     pick(document.getElementById("advSex")),
      Race:    pick(document.getElementById("advRace")),
      Class:   pick(document.getElementById("advClass")),
      HP:      document.getElementById("advHP")?.value || "N/A",
      HitDice: pick(document.getElementById("advHD")),
      STR:     document.getElementById("statSTR")?.value || pick({options:scores.map(s=>({value:s}))}),
      DEX:     document.getElementById("statDEX")?.value || pick({options:scores.map(s=>({value:s}))}),
      CON:     document.getElementById("statCON")?.value || pick({options:scores.map(s=>({value:s}))}),
      INT:     document.getElementById("statINT")?.value || pick({options:scores.map(s=>({value:s}))}),
      WIS:     document.getElementById("statWIS")?.value || pick({options:scores.map(s=>({value:s}))}),
      CHA:     document.getElementById("statCHA")?.value || pick({options:scores.map(s=>({value:s}))}),
      Trait:   pick(document.getElementById("advTrait")),
      Ideal:   pick(document.getElementById("advIdeal")),
      Bond:    pick(document.getElementById("advBond")),
      Flaw:    pick(document.getElementById("advFlaw")),
      Hair:    pick(document.getElementById("advHair")),
      Eyes:    pick(document.getElementById("advEyes")),
      Clothing:pick(document.getElementById("advClothing")),
      Hook:    pick(document.getElementById("advHook")),

      // NPC-only
      CR:      pick(document.getElementById("advCR")),
      AC:      pick(document.getElementById("advAC")),
      Speed:   pick(document.getElementById("advSpeed")),
      Resistances: pick({options:resistances.map(r=>({value:r}))}),
      Senses:     pick(document.getElementById("advSenses")),

      // PC-only
      Skills:  Array.from(document.getElementById("advSkills")?.selectedOptions||[]).map(o=>o.value).join(", "),
      Tools:   Array.from(document.getElementById("advTools")?.selectedOptions||[]).map(o=>o.value).join(", "),
      Languages: Array.from(document.getElementById("advLangs")?.selectedOptions||[]).map(o=>o.value).join(", "),
      Spells:    Array.from(document.getElementById("advSpells")?.selectedOptions||[]).map(o=>o.value).join(", "),

      // Textareas: random pick if empty
      Actions:     document.getElementById("advActions").value 
                   || pick({options:actionsList.map(a=>({value:a}))}),
      Reactions:   document.getElementById("advReactions").value
                   || pick({options:reactionsList.map(r=>({value:r}))}),
      Legendary:   document.getElementById("advLegendary").value
                   || pick({options:legendaryList.map(l=>({value:l}))}),
      Lair:        document.getElementById("advLair").value
                   || pick({options:lairList.map(l=>({value:l}))}),
    };

    // Render the result card
    const card = document.getElementById("advResultCard");
    let html = `<h2 class="text-2xl font-bold dark:text-white">${data.Name}</h2><ul class="list-disc pl-5 dark:text-gray-300">`;
    for (const [k, v] of Object.entries(data)) {
      html += `<li><strong>${k}:</strong> ${v}</li>`;
    }
    html += `</ul>`;
    card.innerHTML = html;

    // Enable export buttons
    document.getElementById("exportJsonBtn").disabled = false;
    document.getElementById("exportPdfBtn").disabled  = false;
  };

  // Export JSON
  document.getElementById("exportJsonBtn").onclick = () => {
    const lis = document.getElementById("advResultCard").querySelectorAll("li");
    const obj = Array.from(lis).reduce((acc, li) => {
      const [key, ...rest] = li.textContent.split(": ");
      acc[key] = rest.join(": ");
      return acc;
    }, {});
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `character.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF export stub (will fill in Phase 3 end)
  document.getElementById("exportPdfBtn").onclick = () => {
    console.warn("PDF export coming soon!");
  };
});
