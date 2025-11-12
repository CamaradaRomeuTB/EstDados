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
let shuffleInterval = null;
let dificuldadeAtual = "facil";

// Recordes separados por dificuldade
let recordes = {
  facil: { maior: 0, menor: Infinity },
  medio: { maior: 0, menor: Infinity }
};

function getDificuldade() {
  return facCheck ? "facil" : "medio";
}

// Gera o array de imagens baseado na dificuldade escolhida
function gerarImagens() {
  imagens = []; // Limpa o array de imagens
  
  if (facCheck) {
    // Modo Fácil: 3x3 = 9 imagens
    for (let i = 1; i <= 9; i++) {
      const num = i.toString().padStart(3, '0');
      if(num == "001" || num == "002")
        imagens.push({ src: `3x3/${num}.png`, correto: true, clicado: false });
      else
        imagens.push({ src: `3x3/${num}.png`, correto: false, clicado: false });
    }
    puzzleContainer.style.gridTemplateColumns = "repeat(3, 150px)"; // Define grid 3 colunas de 150px
    
  } else if (medCheck) {
    // Modo Médio: 5x5 = 25 imagens
    for (let i = 1; i <= 25; i++) {
      const num = i.toString().padStart(3, '0');
      if(num == "002" || num == "003" || num == "004" || num == "007" || num == "012" || num == "017")
        imagens.push({ src: `5x5/${num}.png`, correto: true });
      else
        imagens.push({ src: `5x5/${num}.png`, correto: false });
    }
    puzzleContainer.style.gridTemplateColumns = "repeat(5, 120px)"; // Define grid 5 colunas de 120px
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
  contCerto = 0;
  if(facCheck)
    quantCerto = 2;
  else if(medCheck)
    quantCerto = 6;
    
  const tamanho = facCheck ? '150px' : '120px';
  
  arr.forEach(obj => {
    obj.clicado = false;
    const img = document.createElement("img");
    img.src = obj.src;
    img.className = "bloco-imagem";
    img.style.width = tamanho;
    img.style.height = tamanho;
    img.addEventListener("click", () => {
      if (obj.correto && obj.clicado == false) {
        contCerto++;
        obj.clicado = true;
        img.style.border = "4px solid green";
        if(contCerto == quantCerto)
        {
          statusText.textContent = `Você clicou na imagens corretas! 🎉`;
          solving = false;
          atualizarRecordes();
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

  //recordMaior.textContent = `Recorde de maior (${tipo}): ${rec.maior}`;
  //recordMenor.textContent = `Recorde de menor (${tipo}): ${rec.menor}`;
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
  renderImagens(imagens);

  const intervalo = facCheck ? 1000 : 3000;
  // iniciar embaralhamento a cada 2 segundos
  if (shuffleInterval) clearInterval(shuffleInterval);
  shuffleInterval = setInterval(() => {
    if (!mouseDentro || !solving) return;

    if (getDificuldade() !== dificuldadeAtual) {
      clearInterval(shuffleInterval);
      shuffleInterval = null;
      solving = false;
      statusText.textContent = "Dificuldade alterada. Algoritmo interrompido.";
      return;
    }

    shuffle(imagens);
    attempts++;
    renderImagens(imagens);
  }, intervalo);
});

puzzleContainer.addEventListener("mouseleave", () => {
  // para o embaralhamento ao sair com o mouse
  mouseDentro = false;
  solving = false;
  if (shuffleInterval) {
    clearInterval(shuffleInterval);
    shuffleInterval = null;
  }
});

function pararSeEstiverRodando() {
  if (solving) {
    solving = false;
    mouseDentro = false;
    if (shuffleInterval) {
      clearInterval(shuffleInterval);
      shuffleInterval = null;
    }
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
  puzzleContainer.classList.add('active');
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
  puzzleContainer.classList.add('active');
  gerarImagens();
  renderImagens(imagens);
});

// Não gerar imagens no início
// gerarImagens();
// renderImagens(imagens);