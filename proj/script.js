const puzzleContainer = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");
const facil = document.getElementById("butFacil");
const medio = document.getElementById("butMedio");
const dificil = document.getElementById("butDificil");
const recordMaior = document.getElementById("recordeMaior");
const recordMenor = document.getElementById("recordeMenor");

let facCheck = true;
let medCheck = false;
let difCheck = false;

let contCerto = 0;
let quantCerto;

let imagens = [];
let attempts = 0;
let solving = false;
let index = 0;
let mouseDentro = false;
let dificuldadeAtual = "facil";

// Recordes separados por dificuldade
let recordes = {
  facil: { maior: 0, menor: Infinity },
  medio: { maior: 0, menor: Infinity },
  dificil: { maior: 0, menor: Infinity }
};

function getDificuldade() {
  return facCheck ? "facil" : medCheck ? "medio" : "dificil";
}

function gerarImagens() {
  const certo = { src: "imagens/certo.jpg", correto: true };
  const certo2 = { src: "imagens/certo.png", correto: true };
  const certo3 = { src: "imagens/certo2.png", correto: true };
  const certo4 = { src: "imagens/CERTO3.png", correto: true };
  const errado2 = { src: "imagens/erado2.jpg", correto: false };

  if (facCheck) {
    imagens = [certo, certo2, errado2];
  } else if (medCheck) {
    imagens = [certo, certo2, errado2, certo3, errado2, certo4];
  } else {
    imagens = [certo];
    for (let i = 0; i < 11; i++) {
      imagens.push({ src: i % 2 === 0 ? "imagens/erado.jpg" : "imagens/erado2.jpg", correto: false });
    }
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function renderImagens(arr) {
  puzzleContainer.innerHTML = "";
  if(facCheck)
    quantCerto = 2;
  else if(medCheck)
    quantCerto = 4;
  arr.forEach(obj => {
    const img = document.createElement("img");
    img.src = obj.src;
    img.className = "bloco-imagem";
    img.addEventListener("click", () => {
      if (obj.correto) {
        contCerto++;
        if(contCerto == quantCerto)
        {
          statusText.textContent = `Você clicou na imagens corretas! 🎉`;
          solving = false;
          atualizarRecordes();
          img.style.border = "4px solid green";
        }
      }
    });
    puzzleContainer.appendChild(img);
  });
}

function atualizarRecordes() {
  let tipo = getDificuldade();
  let rec = recordes[tipo];

  if (attempts > rec.maior) rec.maior = attempts;
  if (attempts < rec.menor) rec.menor = attempts;

  recordMaior.textContent = `Recorde de maior (${tipo}): ${rec.maior}`;
  recordMenor.textContent = `Recorde de menor (${tipo}): ${rec.menor}`;
}

function bogoSortVisual() {
  if (!mouseDentro || !solving) return;

  if (getDificuldade() !== dificuldadeAtual) {
    solving = false;
    statusText.textContent = "Dificuldade alterada. Algoritmo interrompido.";
    return;
  }

  if (index >= 5) {
    solving = false;
    return;
  }

  shuffle(imagens);
  attempts++;
  index++;
  renderImagens(imagens);
  statusText.textContent = `Tentativas: ${attempts}`;
  setTimeout(bogoSortVisual, 100);
}

puzzleContainer.addEventListener("mouseenter", () => {
  if (solving) return;
  solving = true;
  mouseDentro = true;
  attempts = 0;
  index = 0;
  dificuldadeAtual = getDificuldade();

  gerarImagens();
  bogoSortVisual();
});

function pararSeEstiverRodando() {
  if (solving) {
    solving = false;
    mouseDentro = false;
  }
}

facil.addEventListener("click", () => {
  pararSeEstiverRodando();
  facCheck = true;
  medCheck = false;
  difCheck = false;
  statusText.textContent = "";
  recordMaior.textContent = "";
  recordMenor.textContent = "";
  gerarImagens();
  renderImagens(imagens);
});

medio.addEventListener("click", () => {
  pararSeEstiverRodando();
  facCheck = false;
  medCheck = true;
  difCheck = false;
  statusText.textContent = "";
  recordMaior.textContent = "";
  recordMenor.textContent = "";
  gerarImagens();
  renderImagens(imagens);
});

dificil.addEventListener("click", () => {
  pararSeEstiverRodando();
  facCheck = false;
  medCheck = false;
  difCheck = true;
  statusText.textContent = "";
  recordMaior.textContent = "";
  recordMenor.textContent = "";
  gerarImagens();
  renderImagens(imagens);
});

gerarImagens();
renderImagens(imagens);
