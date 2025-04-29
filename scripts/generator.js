// scripts/generator.js

// Utility to fetch JSON
async function fetchJson(path) {
    const res = await fetch(path);
    return res.json();
  }
  
  // Populate dropdown with Random + items
  function populate(id, items) {
    const sel = document.getElementById(id);
    sel.innerHTML = '<option value="">Random</option>' +
      items.map(i => `<option value="${i}">${i}</option>`).join('');
  }
  
  // Pick selected or random
  function pick(sel) {
    if (sel.value) return sel.value;
    const opts = Array.from(sel.options)
      .map(o => o.value)
      .filter(v => v);
    return opts[Math.floor(Math.random() * opts.length)];
  }
  
  // Main init
  document.addEventListener('DOMContentLoaded', async () => {
    const url = location.pathname;
    const isNpcGeneral    = url.endsWith('npc-general.html');
    const isPcGeneral     = url.endsWith('pc-general.html');
    const isNpcAdvanced   = url.endsWith('npc-advanced.html');
    const isPcAdvanced    = url.endsWith('pc-advanced.html');
  
    // Fetch common pools
    const [names, sexes, races, traits] = await Promise.all([
      fetchJson('../data/names.json'),
      fetchJson('../data/sexes.json'),
      fetchJson('../data/races.json'),
      fetchJson('../data/traits.json'),
    ]);
  
    // General pages
    if (isNpcGeneral || isPcGeneral) {
      populate('selName',  names);
      populate('selSex',   sexes);
      populate('selRace',  races);
      populate('selTrait', traits);
  
      document.getElementById('generateBtn').onclick = () => {
        const card = document.getElementById('resultCard');
        card.innerHTML = `
          <h2 class="text-2xl font-bold dark:text-white">${pick(document.getElementById('selName'))}</h2>
          <p class="dark:text-gray-300"><strong>Sex:</strong> ${pick(document.getElementById('selSex'))}</p>
          <p class="dark:text-gray-300"><strong>Race:</strong> ${pick(document.getElementById('selRace'))}</p>
          <p class="dark:text-gray-300"><strong>Trait:</strong> ${pick(document.getElementById('selTrait'))}</p>
        `;
      };
      return; // done
    }
  
    // Advanced pages – load extended pools
    const [
      classes, backgrounds,
      ideals, bonds, flaws,
      hair, eyes, clothing,
      hooks, hdice, scores
    ] = await Promise.all([
      fetchJson('../data/classes.json'),
      fetchJson('../data/backgrounds.json'),
      fetchJson('../data/ideals.json'),
      fetchJson('../data/bonds.json'),
      fetchJson('../data/flaws.json'),
      fetchJson('../data/hair.json'),
      fetchJson('../data/eyes.json'),
      fetchJson('../data/clothing.json'),
      fetchJson('../data/hooks.json'),
      fetchJson('../data/hit-dice.json'),
      fetchJson('../data/ability-scores.json'),
    ]);
  
    // Populate advanced dropdowns
    populate('advName',      names);
    populate('advSex',       sexes);
    populate('advRace',      races);
    populate('advClass',     classes);
    populate('advHD',        hdice);
    populate('advTrait',     traits);
    populate('advIdeal',     ideals);
    populate('advBond',      bonds);
    populate('advFlaw',      flaws);
    populate('advHair',      hair);
    populate('advEyes',      eyes);
    populate('advClothing',  clothing);
    populate('advHook',      hooks);
  
    // Generate Advanced NPC/PC
    document.getElementById('advGenerateBtn').onclick = () => {
      const result = document.getElementById('advResultCard');
  
      // Pick or read values
      const data = {
        Name: pick(document.getElementById('advName')),
        Sex: pick(document.getElementById('advSex')),
        Race: pick(document.getElementById('advRace')),
        Class: pick(document.getElementById('advClass')),
        STR: document.getElementById('statSTR').value || pick({options: scores.map(s=>({value:s}))}),
        DEX: document.getElementById('statDEX').value || pick({options: scores.map(s=>({value:s}))}),
        CON: document.getElementById('statCON').value || pick({options: scores.map(s=>({value:s}))}),
        INT: document.getElementById('statINT').value || pick({options: scores.map(s=>({value:s}))}),
        WIS: document.getElementById('statWIS').value || pick({options: scores.map(s=>({value:s}))}),
        CHA: document.getElementById('statCHA').value || pick({options: scores.map(s=>({value:s}))}),
        HitDice: pick(document.getElementById('advHD')),
        HP: document.getElementById('statHP')?.value || 'Unknown',
        Trait: pick(document.getElementById('advTrait')),
        Ideal: pick(document.getElementById('advIdeal')),
        Bond: pick(document.getElementById('advBond')),
        Flaw: pick(document.getElementById('advFlaw')),
        Hair: pick(document.getElementById('advHair')),
        Eyes: pick(document.getElementById('advEyes')),
        Clothing: pick(document.getElementById('advClothing')),
        Hook: pick(document.getElementById('advHook')),
      };
  
      // Render card
      let html = `<h2 class="text-2xl font-bold dark:text-white">${data.Name}</h2>`;
      html += `<p class="dark:text-gray-300"><strong>${isNpcAdvanced?"NPC":"PC"} Details:</strong></p><ul class="list-disc pl-5 dark:text-gray-300">`;
      Object.entries(data).forEach(([k,v]) => {
        html += `<li><strong>${k}:</strong> ${v}</li>`;
      });
      html += `</ul>`;
  
      result.innerHTML = html;
    };
  
    // Export JSON
    document.getElementById('exportJsonBtn').onclick = () => {
      const text = JSON.stringify(data, null, 2);
      const blob = new Blob([text], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${data.Name || 'character'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };
  
    // TODO: Export PDF via jsPDF or similar
  });
  