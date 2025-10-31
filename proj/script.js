const puzzleContainer = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");
const startButton = document.getElementById("start-button");

let recordMaior = document.getElementById("recordeMaior");
let recordMenor = document.getElementById("recordeMenor");

let blocks = [1, 3, 2];
let attempts = 0;
let maior = 0;
let menor = 9999999999999;
let solving = false;

function renderBlocks(arr) {
  puzzleContainer.innerHTML = "";
  arr.forEach(num => {
    const block = document.createElement("div");
    block.className = "block";
    block.textContent = num;
    puzzleContainer.appendChild(block);
  });
}

function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function bogoSortVisual() {
  if (isSorted(blocks)) {
    statusText.textContent = `Resolvido em ${attempts} tentativas! 🎉`;
    solving = false;
    startButton.disabled = false;

    if (attempts > maior) maior = attempts;
    if (attempts < menor) menor = attempts;

    recordMaior.textContent = `Recorde de maior: ${maior}`;
    recordMenor.textContent = `Recorde de menor: ${menor}`;
    return;
}
  shuffle(blocks);
  attempts++;
  renderBlocks(blocks);
  statusText.textContent = `Tentativas: ${attempts}`;

  if(attempts > maior)
    maior = attempts;

  setTimeout(bogoSortVisual, 100); // animação visual
}

startButton.addEventListener("click", () => {
  if (solving) return;
  solving = true;
  attempts = 0;
  blocks = [1, 3, 2];
  startButton.disabled = true;
  bogoSortVisual();
});

renderBlocks(blocks);
