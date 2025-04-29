// scripts/dice.js

document.addEventListener('DOMContentLoaded', () => {
    const diceButtons = document.querySelectorAll('.dice-selection button');
    const rollButton = document.getElementById('roll-button');
    const resultDisplay = document.getElementById('result-display');
    const historyList = document.getElementById('roll-history');
    const clearHistoryButton = document.getElementById('clear-history');
  
    let selectedDice = 20; // Default to D20
  
    diceButtons.forEach(button => {
      button.addEventListener('click', () => {
        diceButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedDice = parseInt(button.dataset.dice);
      });
    });
  
    rollButton.addEventListener('click', () => {
        const roll = Math.floor(Math.random() * selectedDice) + 1;
    
        // Bounce the result dynamically
        resultDisplay.innerHTML = `<span class="rolled-number">${roll}</span>`;
        const rolledNumber = resultDisplay.querySelector('.rolled-number');
        rolledNumber.classList.remove('animate-bounce');
        void rolledNumber.offsetWidth; // Force reflow
        rolledNumber.classList.add('animate-bounce');
    
        // Update roll history
        const historyItem = document.createElement('li');
        historyItem.textContent = `🎲 D${selectedDice}: ${roll}`;
        historyList.prepend(historyItem);
    });
    
  
    clearHistoryButton.addEventListener('click', () => {
      historyList.innerHTML = '';
    });
  });
  