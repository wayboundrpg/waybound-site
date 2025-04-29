// scripts/npc.js

// 1) Load JSON data once
let names = [];
let traits = [];

async function loadData() {
  const [namesRes, traitsRes] = await Promise.all([
    fetch('../data/names.json'),
    fetch('../data/traits.json'),
  ]);
  names = await namesRes.json();
  traits = await traitsRes.json();
}

// 2) Utility: pick random item
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 3) Render an NPC into the #npcResult div
function renderNPC() {
  const name  = randomItem(names);
  const trait = randomItem(traits);

  const html = `
    <h3 class="text-2xl font-bold dark:text-white">${name}</h3>
    <p class="mt-2 dark:text-gray-300"><strong>Trait:</strong> ${trait}</p>
  `;

  document.getElementById('npcResult').innerHTML = html;
}

// 4) Setup button handler
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();

  const btn = document.getElementById('generateBtn');
  btn.addEventListener('click', () => {
    renderNPC();
  });

  // Optionally generate once on load:
  renderNPC();
});
