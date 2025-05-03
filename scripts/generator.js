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
function pick(sel) {
  if (sel.value) return sel.value;
  const opts = Array.from(sel.options)
    .map(o => o.value)
    .filter(v => v);
  return opts[Math.floor(Math.random() * opts.length)];
}

// Main entry
document.addEventListener("DOMContentLoaded", async () => {
    // DEBUG #1: what page are we on?
    console.log("🔥 DOMContentLoaded, pathname:", location.pathname);
  
    // DEBUG #2: what <select> IDs exist on this page right now?
    console.log("📝 selects on page:", 
      Array.from(document.querySelectorAll("select")).map(s => s.id)
    );
  
    const isNpcGeneral  = location.pathname.endsWith("npc-general.html");
    const isPcGeneral   = location.pathname.endsWith("pc-general.html");
    const isNpcAdvanced = location.pathname.endsWith("npc-advanced.html");
    const isPcAdvanced  = location.pathname.endsWith("pc-advanced.html");
  
    // DEBUG #3: which branch are we in?
    console.log({
      isNpcGeneral, isPcGeneral,
      isNpcAdvanced, isPcAdvanced
    });
  
    // …the rest of your code unchanged…
  
  // 1) Load core pools (for both general & advanced)
  const [names, sexes, races, traits] = await Promise.all([
    fetchJson("/data/names.json"),
    fetchJson("/data/sexes.json"),
    fetchJson("/data/races.json"),
    fetchJson("/data/traits.json"),
  ]);

  // === General Generator (Quick NPC/PC) ===
  if (isNpcGeneral || isPcGeneral) {
    populate("selName",  names);
    populate("selSex",   sexes);
    populate("selRace",  races);
    populate("selTrait", traits);

    document.getElementById("generateBtn").onclick = () => {
      const card = document.getElementById("resultCard");
      const html = `
        <h2 class="text-2xl font-bold dark:text-white">
          ${pick(document.getElementById("selName"))}
        </h2>
        <ul class="list-disc pl-5 dark:text-gray-300">
          <li><strong>Sex:</strong> ${pick(document.getElementById("selSex"))}</li>
          <li><strong>Race:</strong> ${pick(document.getElementById("selRace"))}</li>
          <li><strong>Trait:</strong> ${pick(document.getElementById("selTrait"))}</li>
        </ul>
      `;
      card.innerHTML = html;
    };

    return; // done with general
  }

  // === Advanced Generator (Detailed NPC/PC) ===
  console.log("ADVANCED BRANCH: location=", location.pathname);
  const [
    classes, backgrounds,
    ideals, bonds, flaws,
    hair, eyes, clothing,
    hooks, hdice, scores
  ] = await Promise.all([
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
  ]);

  // Populate all advanced selects
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

  // Advanced “Generate” button
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
    };

    // Render the result card
    let html = `<h2 class="text-2xl font-bold dark:text-white">${data.Name}</h2>`;
    html += `<ul class="list-disc pl-5 dark:text-gray-300">`;
    Object.entries(data).forEach(([k,v]) => {
      html += `<li><strong>${k}:</strong> ${v}</li>`;
    });
    html += `</ul>`;

    document.getElementById("advResultCard").innerHTML = html;
  };

  // Export JSON
  document.getElementById("exportJsonBtn").onclick = () => {
    const text = JSON.stringify(
      Array.from(document.getElementById("advResultCard").querySelectorAll("li"))
        .reduce((acc, li) => {
          const [key,text] = li.textContent.split(": ");
          acc[key] = text;
          return acc;
        }, {}),
      null, 2
    );
    const blob = new Blob([text], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href    = url;
    a.download = `character.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // (PDF export will go here later)
});
