document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    document.querySelector(".loader-container").classList.add("hidden")
  }, 2000);
});

var navbar = document.querySelector(".navbar");
var buttonTop = document.querySelector("#button-top");
var buttonDark = document.querySelector(".button-dark-mode");

window.onscroll = function () {
  if (window.scrollY >= 20) {
    navbar.classList.add("fixed");
    buttonTop.classList.add("show");
    buttonDark.classList.add("show");
  } else {
    navbar.classList.remove("fixed");
    buttonTop.classList.remove("show");
    buttonDark.classList.remove("show");
  }
};

// SET ELENCO --------------------------------------------------------------------------------
var elencoContainer = document.querySelector(".jogadores");

async function requestElenco() {
  let req = await fetch(
    "http://localhost/WEBSITELINENSE/api/model/elencoController.php?operation=read"
  );
  let data = await req.json();

  showElenco(data);
  showFooterListElenco(data);
}

async function showElenco(main) {
  console.log("JOGADORES", main);

  const ordemPosicoes = ["Goleiro", "Zagueiro", "Lateral", "Meia", "Atacante"];

  function compararPorPosicao(a, b) {
    const posicaoA = ordemPosicoes.indexOf(a.posicao);
    const posicaoB = ordemPosicoes.indexOf(b.posicao);

    if (posicaoA < posicaoB) {
      return -1;
    } else if (posicaoA > posicaoB) {
      return 1;
    } else {
      // Se as posições forem iguais, ordene pelo número da camisa
      return a.numero_camisa - b.numero_camisa;
    }
  }

  main = main.sort(compararPorPosicao);

  for (const jogador of main) {
    let req = await fetch(
      "http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=getImagePlayer&id_imagem=" +
        jogador.id_imagem
    );
    let data = await req.json();
    let pathImage = data[0].path.replace("../../", "../../../");

    let arrNome = jogador.nome_jogador.split(" ");
    let nome = arrNome[0];
    let sobrenome = arrNome[1];

    elencoContainer.innerHTML += `
        <div class="jogador" data-anime="left">
          <img src="${pathImage}" alt="${pathImage}" class="imagem-jogador">
          <div class="text-content">
            <div class="sobrenome">${nome}</div>
            <div class="info">
              <span class="numero-camisa"><strong>${jogador.numero_camisa}</strong></span>
              <span class="nome">${nome} <strong>${sobrenome}</strong></span>
              <p class="posicao">${jogador.posicao}</p>
            </div>
            <div class="more-info">
              <div class="info-player">
                <span class="idade">${jogador.idade}</span>
                <small>Idade</small>
              </div>
              <div class="info-player">
                <span class="altura">${jogador.altura}m</span>
                <small>Altura</small>
              </div>
              <div class="info-player">
                <span class="nacionalidade">${jogador.nacionalidade}</span>
                <small>Nacionalidade</small>
              </div>
            </div>
          </div>
        </div>
      `;

    document.querySelectorAll(".jogador").forEach((item) => {
      item.addEventListener("click", () => showMoreInfoElenco(item));
    });
  }
}

function showFooterListElenco(main) {
  let goleiros = main.filter((jogador) => jogador.posicao === "Goleiro");
  let zagueiros = main.filter((jogador) => jogador.posicao === "Zagueiro");
  let laterais = main.filter((jogador) => jogador.posicao === "Lateral");
  let meias = main.filter((jogador) => jogador.posicao === "Meia");
  let atacantes = main.filter((jogador) => jogador.posicao === "Atacante");

  goleiros.forEach((jogador) => {
    document.querySelector(
      ".list-goleiros"
    ).innerHTML += `<li><a href="">${jogador.nome_jogador}</a></li>`;
  });

  zagueiros.forEach((jogador) => {
    document.querySelector(
      ".list-zagueiros"
    ).innerHTML += `<li><a href="">${jogador.nome_jogador}</a></li>`;
  });

  laterais.forEach((jogador) => {
    document.querySelector(
      ".list-laterais"
    ).innerHTML += `<li><a href="">${jogador.nome_jogador}</a></li>`;
  });

  meias.forEach((jogador) => {
    document.querySelector(
      ".list-meias"
    ).innerHTML += `<li><a href="">${jogador.nome_jogador}</a></li>`;
  });

  atacantes.forEach((jogador) => {
    document.querySelector(
      ".list-atacantes"
    ).innerHTML += `<li><a href="">${jogador.nome_jogador}</a></li>`;
  });
}

function showMoreInfoElenco(player) {
  let container = player.querySelector(".more-info");
  container.classList.toggle("show");
}

requestElenco();
