const puzzleContainer = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");
const facil = document.getElementById("butFacil");
const medio = document.getElementById("butMedio");
const recordMaior = document.getElementById("recordeMaior");
const recordMenor = document.getElementById("recordeMenor");
const instrucao = document.getElementById("instrucao");

let facCheck = true;
let medCheck = false;

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
  medio: { maior: 0, menor: Infinity }
};

function getDificuldade() {
  return facCheck ? "facil" : "medio";
}

function gerarImagens() {
  imagens = [];
  
  if (facCheck) {
    for (let i = 1; i <= 9; i++) {
      const num = i.toString().padStart(3, '0');
      imagens.push({ src: `3x3/${num}.png`, correto: false });
    }
    puzzleContainer.style.gridTemplateColumns = "repeat(3, 150px)"; /*ajustando o tamanho das imagens dinamicamente*/
    document.documentElement.style.setProperty('--tamanho-bloco', '150px');
    
  } else if (medCheck) {
    for (let i = 1; i <= 25; i++) {
      const num = i.toString().padStart(3, '0');
      imagens.push({ src: `5x5/${num}.png`, correto: false });
    }
    puzzleContainer.style.gridTemplateColumns = "repeat(5, 120px)"; /*ajustando o tamanho das imagens dinamicamente*/
    document.documentElement.style.setProperty('--tamanho-bloco', '120px');
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
  instrucao.textContent = "Encontre os elefantes";
  statusText.textContent = "";
  recordMaior.textContent = "";
  recordMenor.textContent = "";
  document.body.style.backgroundImage = "url('3x3/savana.png')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
  gerarImagens();
  renderImagens(imagens);
});

medio.addEventListener("click", () => {
  pararSeEstiverRodando();
  facCheck = false;
  medCheck = true;
  instrucao.textContent = "Encontre os macacos";
  statusText.textContent = "";
  recordMaior.textContent = "";
  recordMenor.textContent = "";
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = "#f0f8ff";
  gerarImagens();
  renderImagens(imagens);
});

gerarImagens();
renderImagens(imagens);