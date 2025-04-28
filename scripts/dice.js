// scripts/dice.js

window.rollDice = function() {
    const diceType = document.getElementById('diceType').value;
    const numberOfDice = parseInt(document.getElementById('numberOfDice').value);
    const resultDiv = document.getElementById('diceResult');
  
    if (isNaN(numberOfDice) || numberOfDice <= 0) {
      resultDiv.innerHTML = '<p>Please enter a valid number of dice.</p>';
      return;
    }
  
    const results = [];
    let total = 0;
  
    for (let i = 0; i < numberOfDice; i++) {
      const roll = Math.floor(Math.random() * diceType) + 1;
      results.push(roll);
      total += roll;
    }
  
    resultDiv.innerHTML = `
      <p class="text-xl mb-2 font-bold">Total: ${total}</p>
      <p class="text-gray-400 text-sm">Rolls: ${results.join(', ')}</p>
    `;
  }
  