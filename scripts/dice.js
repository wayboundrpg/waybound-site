document.addEventListener("DOMContentLoaded", function() {
    const rollD6Button = document.getElementById("rollD6");
    const diceResult = document.getElementById("diceResult");

    rollD6Button.addEventListener("click", function() {
        const roll = Math.floor(Math.random() * 6) + 1;
        diceResult.textContent = `🎲 You rolled a ${roll}!`;
    });
});
