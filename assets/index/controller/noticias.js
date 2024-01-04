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

  showFooterListElenco(data);
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

requestElenco();

// SET NOTICIAS -------------------------------------------------------------------------------
async function requestNoticias() {
  let req = await fetch(
    "http://localhost/WEBSITELINENSE/api/model/noticiasController.php?operation=read"
  );
  let data = await req.json();

  showNoticias(data, true);
}

requestNoticias();

async function showNoticias(main, _viewAll) {
  let noticias;
  main.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));

  if (_viewAll === false) {
    noticias = main.slice(0, 3);
  } else {
    noticias = main;
  }

  let container = document.querySelector(".noticias-container");
  container.innerHTML = "";

  for (const noticia of noticias) {
    let req = await fetch(
      "http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=getImageNoticia&id_imagem=" +
        noticia.id_imagem
    );

    let dataImage = await req.json();
    let pathImage = dataImage[0].path.replace("../../", "../../../");

    let arrData = noticia.data_criacao.split(" ");
    let data = arrData[0];

    function formatShowData(_data) {
      let arr = _data.split("-");
      return `${arr[2]}/${arr[1]}/${arr[0]}`;
    }

    let descricao = noticia.descricao_materia;
    if (descricao.length > 300) {
      descricao = descricao.slice(0, 300) + "...";
    }

    container.innerHTML += `
        <div class="noticia">
          <img src="${pathImage}" alt="${
      noticia.nome_materia
    }" class="imagem-noticia">
          <span>Clube Atlético Linense</span>
          <small class="data-noticia">${formatShowData(data)}</small>
          <h3 class="titulo-noticia">${noticia.nome_materia}</h3>
          <p class="descricao-noticia">${descricao}</p>
          <a href="#" class="ver-mais-noticia">Ler mais <i class="fa fa-angle-right"></i></a>
        </div>
      `;
  }
}
