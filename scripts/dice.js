// scripts/dice.js

// Handle dice selection
let selectedDice = 20; // Default to D20

document.addEventListener('DOMContentLoaded', function () {
    const diceButtons = document.querySelectorAll('[data-dice]');
    const rollButton = document.getElementById('roll-button');
    const resultDisplay = document.getElementById('result-display');
    const historyList = document.getElementById('roll-history');
    const clearHistoryButton = document.getElementById('clear-history');

    diceButtons.forEach(button => {
        button.addEventListener('click', () => {
            diceButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedDice = parseInt(button.getAttribute('data-dice'));
        });
    });

    rollButton.addEventListener('click', () => {
        const roll = Math.floor(Math.random() * selectedDice) + 1;
        resultDisplay.textContent = `🎲 ${roll}`;

        const historyItem = document.createElement('li');
        historyItem.textContent = `Rolled D${selectedDice}: ${roll}`;
        historyList.prepend(historyItem);
    });

    clearHistoryButton.addEventListener('click', () => {
        historyList.innerHTML = '';
    });
});
