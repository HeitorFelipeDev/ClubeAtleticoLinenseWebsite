// COOKIES

let buttonAcceptCookies = document.querySelector(".accept-cookies");
buttonAcceptCookies.addEventListener("click", aceitarCookies);


if (!localStorage.getItem('cookiesAceitos')) {
  exibirBannerCookies();
} else {
  ocultarBannerCookies();
}

function ocultarBannerCookies() {
  var banner = document.getElementById('cookieBanner');
  banner.classList.add("hidden");
}

function exibirBannerCookies() {
  var banner = document.getElementById('cookieBanner');
  banner.classList.remove("hidden");
}

function aceitarCookies() {
  var banner = document.getElementById('cookieBanner');
  banner.classList.add("hidden");

  localStorage.setItem('cookiesAceitos', 'true');
}

let buttonCloseAnuncio = document.getElementById("button-close-anuncio");
buttonCloseAnuncio.addEventListener("click", () => {
  let anuncio = document.querySelector(".banner-anuncio");
  anuncio.classList.add("hidden");
})


// NAVBAR
var navbar = document.querySelector(".navbar");
var buttonTop = document.querySelector("#button-top");
var buttonDark = document.querySelector(".button-dark-mode");
var messageBottom = document.querySelector(".message-bottom");
var buttonCloseCookies = document.querySelector(".button-cookies");

buttonCloseCookies.addEventListener("click", () => {
  document.querySelector(".cookies").classList.add("hidden");
});



var lastScrollTop = 0;
var isScrollingUp = false;

window.onscroll = function () {
  var st = window.scrollY;

  isScrollingUp = st < lastScrollTop;

  if (isScrollingUp || st <= 60) {
    messageBottom.classList.add("show");
  } else {
    messageBottom.classList.remove("show");
  }

  lastScrollTop = st;

  // Restante do seu código para lidar com a barra de navegação, botões, etc.
  if (st >= 60) {
    navbar.classList.add("fixed");
    buttonTop.classList.add("show");
    buttonDark.classList.add("show");
  } else {
    navbar.classList.remove("fixed");
    buttonTop.classList.remove("show");
    buttonDark.classList.remove("show");
  }
};


buttonTop.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

// SUBMENU (NAVBAR)

let navItemSubmenu = document.querySelectorAll(".nav-item-submenu");

navItemSubmenu.forEach((item) => {
  let submenu = item.querySelector(".submenu");

  let timeout;

  item.addEventListener("mouseenter", () => {
    clearTimeout(timeout);
    submenu.classList.add("active");
  });

  item.addEventListener("mouseleave", () => {
    timeout = setTimeout(() => {
      submenu.classList.remove("active");
    }, 100);
  });

  submenu.addEventListener("mouseenter", () => {
    clearTimeout(timeout);
  });

  submenu.addEventListener("mouseleave", () => {
    timeout = setTimeout(() => {
      submenu.classList.remove("active");
    }, 100);
  });
});

// SET PATROCINADORES AND PARCEIROS -------------------------------------------------------------
var containerPatrocinadores = document.querySelector(
  ".patrocinadores .content"
);
var containerParceiros = document.querySelector(".parceiros .content");
const url =
  "http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=read";

async function requestData() {
  let req = await fetch(url);
  let data = await req.json();

  let patrocinadores = data.filter((item) => item.categoria === "patrocinador");
  let parceiros = data.filter((item) => item.categoria === "parceiro");

  showPatrocinadores(patrocinadores.slice(0, 5));
  showParceiros(parceiros);
}

function showPatrocinadores(main) {
  let patrocinadores = main.slice(0, 3);
  patrocinadores.forEach((patrocinador) => {
    containerPatrocinadores.innerHTML += `
            <div class='patrocinador'>
                <a href="#">
                   <img src='${patrocinador.path.replace("../../", "")}' alt='${
      patrocinador.titulo_imagem
    }' />
                </a>
            </div>
        `;
  });
}

function showParceiros(main) {
  const randomIndices = [];
  while (randomIndices.length < 6) {
    const randomIndex = Math.floor(Math.random() * main.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  // Crie o HTML para os três elementos aleatórios
  randomIndices.forEach((index) => {
    const parceiro = main[index];
    containerParceiros.innerHTML += `
      <div class='parceiro'>
        <a href="#">
          <img src='${parceiro.path.replace("../../", "")}' alt='${
      parceiro.titulo_imagem
    }' />
        </a>
      </div>
    `;
  });
}

requestData();

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
  main = main
    .filter((jogador) =>
      jogador.numero_camisa == 10 || jogador.numero_camisa == 17 || jogador.numero_camisa == 12
    )
    .sort((a, b) => a.numero_camisa - b.numero_camisa);

  for (const jogador of main) {
    let req = await fetch(
      "http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=getImagePlayer&id_imagem=" +
        jogador.id_imagem
    );
    let data = await req.json();
    let pathImage = data[0].path.replace("../../", "");

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

requestElenco();

// SET NOTICIAS -------------------------------------------------------------------------------
async function requestNoticias() {
  let req = await fetch(
    "http://localhost/WEBSITELINENSE/api/model/noticiasController.php?operation=read"
  );
  let data = await req.json();

  showNoticias(data, false);
}

requestNoticias();


async function showNoticias(main, _viewAll) {
  let noticias;
  main.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));

  if (_viewAll === false) {
    noticias = main.slice(0, 3);
  } else {
    noticias = main.slice(0, 6);
  }

  let container = document.querySelector(".noticias-container");
  container.innerHTML = "";

  for (const noticia of noticias) {
    let req = await fetch(
      "http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=getImageNoticia&id_imagem=" +
        noticia.id_imagem
    );

    let dataImage = await req.json();
    let pathImage = dataImage[0].path.replace("../../", "");

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
        <img src="${pathImage}" alt="${noticia.nome_materia}" class="imagem-noticia">
        <span>Clube Atlético Linense</span>
        <small class="data-noticia">${formatShowData(data)}</small>
        <h3 class="titulo-noticia">${noticia.nome_materia}</h3>
        <p class="descricao-noticia">${descricao}</p>
        <a href="#" class="ver-mais-noticia">Ler mais <i class="fa fa-angle-right"></i></a>
      </div>
    `;
  }

  let buttonVerMaisNoticias = document.querySelector(
    ".button-ver-mais-noticias"
  );

  let buttonVerTodasNoticias = document.querySelector(
    ".button-ver-todas-noticias"
  );

  buttonVerMaisNoticias.addEventListener("click", () => {
    showNoticias(main, true);
    buttonVerTodasNoticias.style.display = "inline-block";
    buttonVerMaisNoticias.style.display = "none";
  });
}


// API API-FUTBOL -------------------------------------------------------------------------------]
let API_KEY = "test_10ac4fa6637a2d7784c94881bdec3c";
let URL_FUTEBOL = "https://api.api-futebol.com.br/v1/campeonatos/40/tabela";

async function fetchData(_url, _api_key) {
  try {
    const response = await fetch(_url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${_api_key}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro na solicitação.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

(async () => {
  try {
    const tabelaData = await fetchData(URL_FUTEBOL, API_KEY);
    setDataTable(tabelaData, false);

    const partidaAnteriorData = await fetchData(
      "https://api.api-futebol.com.br/v1/times/577/partidas/anteriores/",
      API_KEY
    );
    setPartidaAnterior(partidaAnteriorData);

    const proximaPartidaData = await fetchData(
      "https://api.api-futebol.com.br/v1/times/57/partidas/proximas",
      API_KEY
    );
    setProximaPartida(proximaPartidaData);
  } catch (error) {
  } finally {
    document.querySelector(".loader-container").classList.add("hidden");
  }
})();

function setDataTable(_data, viewAll) {
  var tableContainer = document.querySelector(".tabela-classificacao-body");
  tableContainer.innerHTML = "";

  _data = {
    "primeira-fase": {
      "grupo-principal": [
        {
          posicao: 1,
          pontos: 36,
          time: {
            time_id: 61,
            nome_popular: "Ponte Preta",
            sigla: "PON",
            escudo: "https://cdn.api-futebol.com.br/escudos/638d34a46fbd4.svg",
          },
          jogos: 15,
          vitorias: 11,
          empates: 3,
          derrotas: 1,
          gols_pro: 29,
          gols_contra: 14,
          saldo_gols: 15,
          aproveitamento: 80,
          variacao_posicao: 0,
          ultimos_jogos: ["v", "v", "e", "e", "v"],
        },
        {
          posicao: 2,
          pontos: 29,
          time: {
            time_id: 51,
            nome_popular: "Novorizontino",
            sigla: "NOV",
            escudo: "https://cdn.api-futebol.com.br/escudos/638d349f5f733.svg",
          },
          jogos: 15,
          vitorias: 9,
          empates: 2,
          derrotas: 4,
          gols_pro: 26,
          gols_contra: 16,
          saldo_gols: 10,
          aproveitamento: 64,
          variacao_posicao: 0,
          ultimos_jogos: ["d", "e", "d", "v", "v"],
        },
        {
          posicao: 3,
          pontos: 26,
          time: {
            time_id: 576,
            nome_popular: "Noroeste",
            sigla: "NOR",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b877366d1.svg",
          },
          jogos: 15,
          vitorias: 8,
          empates: 2,
          derrotas: 5,
          gols_pro: 24,
          gols_contra: 20,
          saldo_gols: 4,
          aproveitamento: 57,
          variacao_posicao: 0,
          ultimos_jogos: ["d", "e", "v", "v", "d"],
        },
        {
          posicao: 4,
          pontos: 25,
          time: {
            time_id: 70,
            nome_popular: "XV de Piracicaba",
            sigla: "PIR",
            escudo: "https://cdn.api-futebol.com.br/escudos/638d34a99cd3e.png",
          },
          jogos: 15,
          vitorias: 6,
          empates: 7,
          derrotas: 2,
          gols_pro: 18,
          gols_contra: 12,
          saldo_gols: 6,
          aproveitamento: 55,
          variacao_posicao: 1,
          ultimos_jogos: ["v", "v", "v", "v", "v"],
        },
        {
          posicao: 5,
          pontos: 24,
          time: {
            time_id: 574,
            nome_popular: "Portuguesa Santista",
            sigla: "PST",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87504dc1.png",
          },
          jogos: 15,
          vitorias: 7,
          empates: 3,
          derrotas: 5,
          gols_pro: 24,
          gols_contra: 21,
          saldo_gols: 3,
          aproveitamento: 53,
          variacao_posicao: -1,
          ultimos_jogos: ["d", "e", "d", "d", "e"],
        },
        {
          posicao: 6,
          pontos: 21,
          time: {
            time_id: 522,
            nome_popular: "Velo Clube",
            sigla: "VEL",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b83500cb6.png",
          },
          jogos: 15,
          vitorias: 6,
          empates: 3,
          derrotas: 6,
          gols_pro: 20,
          gols_contra: 21,
          saldo_gols: -1,
          aproveitamento: 46,
          variacao_posicao: 0,
          ultimos_jogos: ["v", "d", "v", "e", "d"],
        },
        {
          posicao: 7,
          pontos: 21,
          time: {
            time_id: 52,
            nome_popular: "Oeste",
            sigla: "OES",
            escudo: "https://cdn.api-futebol.com.br/escudos/638d349fed9c0.svg",
          },
          jogos: 15,
          vitorias: 5,
          empates: 6,
          derrotas: 4,
          gols_pro: 23,
          gols_contra: 17,
          saldo_gols: 6,
          aproveitamento: 46,
          variacao_posicao: 0,
          ultimos_jogos: ["v", "e", "v", "v", "e"],
        },
        {
          posicao: 8,
          pontos: 19,
          time: {
            time_id: 527,
            nome_popular: "Comercial-SP",
            sigla: "COM",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b83aa86d0.png",
          },
          jogos: 15,
          vitorias: 5,
          empates: 4,
          derrotas: 6,
          gols_pro: 12,
          gols_contra: 16,
          saldo_gols: -4,
          aproveitamento: 42,
          variacao_posicao: 0,
          ultimos_jogos: ["v", "v", "d", "e", "d"],
        },
        {
          posicao: 9,
          pontos: 19,
          time: {
            time_id: 575,
            nome_popular: "Primavera-SP",
            sigla: "PRI",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b876169dd.png",
          },
          jogos: 15,
          vitorias: 4,
          empates: 7,
          derrotas: 4,
          gols_pro: 20,
          gols_contra: 20,
          saldo_gols: 0,
          aproveitamento: 42,
          variacao_posicao: 1,
          ultimos_jogos: ["e", "e", "e", "e", "e"],
        },
        {
          posicao: 10,
          pontos: 18,
          time: {
            time_id: 543,
            nome_popular: "Rio Claro",
            sigla: "RIC",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b84cba6f0.png",
          },
          jogos: 15,
          vitorias: 5,
          empates: 3,
          derrotas: 7,
          gols_pro: 18,
          gols_contra: 20,
          saldo_gols: -2,
          aproveitamento: 40,
          variacao_posicao: 2,
          ultimos_jogos: ["d", "v", "d", "d", "v"],
        },
        {
          posicao: 11,
          pontos: 18,
          time: {
            time_id: 556,
            nome_popular: "Juventus-SP",
            sigla: "JUV-SP",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b85b6d749.png",
          },
          jogos: 15,
          vitorias: 4,
          empates: 6,
          derrotas: 5,
          gols_pro: 18,
          gols_contra: 14,
          saldo_gols: 4,
          aproveitamento: 40,
          variacao_posicao: -2,
          ultimos_jogos: ["d", "e", "e", "v", "d"],
        },
        {
          posicao: 12,
          pontos: 18,
          time: {
            time_id: 577,
            nome_popular: "Linense",
            sigla: "LIN",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
          },
          jogos: 15,
          vitorias: 4,
          empates: 6,
          derrotas: 5,
          gols_pro: 13,
          gols_contra: 14,
          saldo_gols: -1,
          aproveitamento: 40,
          variacao_posicao: 1,
          ultimos_jogos: ["d", "e", "v", "d", "v"],
        },
        {
          posicao: 13,
          pontos: 16,
          time: {
            time_id: 532,
            nome_popular: "Taubat\u00e9",
            sigla: "TAU",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b84080f4b.png",
          },
          jogos: 15,
          vitorias: 4,
          empates: 4,
          derrotas: 7,
          gols_pro: 14,
          gols_contra: 16,
          saldo_gols: -2,
          aproveitamento: 35,
          variacao_posicao: -2,
          ultimos_jogos: ["v", "e", "d", "d", "e"],
        },
        {
          posicao: 14,
          pontos: 14,
          time: {
            time_id: 578,
            nome_popular: "Monte Azul",
            sigla: "MOA",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b879579ba.png",
          },
          jogos: 15,
          vitorias: 3,
          empates: 5,
          derrotas: 7,
          gols_pro: 18,
          gols_contra: 27,
          saldo_gols: -9,
          aproveitamento: 31,
          variacao_posicao: 2,
          ultimos_jogos: ["v", "d", "e", "v", "v"],
        },
        {
          posicao: 15,
          pontos: 12,
          time: {
            time_id: 215,
            nome_popular: "S\u00e3o Caetano",
            sigla: "SCA",
            escudo: "https://cdn.api-futebol.com.br/escudos/638d34f1b1d3f.svg",
          },
          jogos: 15,
          vitorias: 3,
          empates: 3,
          derrotas: 9,
          gols_pro: 14,
          gols_contra: 24,
          saldo_gols: -10,
          aproveitamento: 26,
          variacao_posicao: -1,
          ultimos_jogos: ["d", "d", "v", "d", "d"],
        },
        {
          posicao: 16,
          pontos: 11,
          time: {
            time_id: 541,
            nome_popular: "Lemense",
            sigla: "LEM",
            escudo: "https://cdn.api-futebol.com.br/escudos/63f2b84a71a72.png",
          },
          jogos: 15,
          vitorias: 3,
          empates: 2,
          derrotas: 10,
          gols_pro: 13,
          gols_contra: 32,
          saldo_gols: -19,
          aproveitamento: 24,
          variacao_posicao: -1,
          ultimos_jogos: ["e", "d", "d", "d", "d"],
        },
      ],
    },
  };

  let idTime = 577;

  _data = _data["primeira-fase"]["grupo-principal"];

  _data.forEach((time) => {
    if (time.time.time_id == idTime) {
      let timesProx;

      if (viewAll == false) {
        if (time.posicao > 3) {
          timesProx = _data.slice(time.posicao - 3, time.posicao + 2);
        } else {
          timesProx = _data.slice(0, time.posicao + 4);
        }
      } else {
        timesProx = _data;
      }

      timesProx.forEach((timeSelecionado) => {
        let tr = document.createElement("tr");

        timeSelecionado.time.time_id == idTime
          ? tr.classList.add("time-selecionado")
          : null;

        let clube = document.createElement("td");
        clube.classList.add("td-full");
        clube.innerHTML = `
          <span class="posicao-time">${timeSelecionado.posicao}</span>
          <img src="${timeSelecionado.time.escudo}" alt="${timeSelecionado.time.nome_popular}" />
          <span class="nome-time">${timeSelecionado.time.nome_popular}</span>
        `;

        let pontos = document.createElement("td");
        pontos.textContent = timeSelecionado.pontos;

        let pj = document.createElement("td");
        pj.textContent = parseInt(
          parseInt(timeSelecionado.vitorias) +
            parseInt(timeSelecionado.empates) +
            parseInt(timeSelecionado.derrotas)
        );

        let v = document.createElement("td");
        v.textContent = timeSelecionado.vitorias;

        let e = document.createElement("td");
        e.textContent = timeSelecionado.empates;

        let d = document.createElement("td");
        d.textContent = timeSelecionado.derrotas;

        let gm = document.createElement("td");
        gm.textContent = timeSelecionado.gols_pro;

        let gs = document.createElement("td");
        gs.textContent = timeSelecionado.gols_contra;

        let sg = document.createElement("td");
        sg.textContent = timeSelecionado.saldo_gols;

        let ultimosJogos = document.createElement("td");
        ultimosJogos.classList.add("td-ultimos-jogos");

        timeSelecionado.ultimos_jogos.forEach((jogo) => {
          if (jogo === "v") {
            ultimosJogos.innerHTML += `<div><i class="fa-solid fa-check ultimo-jogo vitoria"></i><div>`;
          }
          if (jogo === "e") {
            ultimosJogos.innerHTML += `<div><i class="fa-solid fa-minus ultimo-jogo empate"></i><div>`;
          }
          if (jogo === "d") {
            ultimosJogos.innerHTML += `<div><i class="fa-solid fa-xmark ultimo-jogo derrota"></i><div>`;
          }
        });

        // Incluindo colunas na tabela
        tr.appendChild(clube);
        tr.appendChild(pontos);
        tr.appendChild(pj);
        tr.appendChild(v);
        tr.appendChild(e);
        tr.appendChild(d);
        tr.appendChild(gs);
        tr.appendChild(sg);
        tr.appendChild(gm);
        tr.appendChild(ultimosJogos);

        // Incluindo nova linha à tabela
        tableContainer.appendChild(tr);
      });

      let buttonVerMaisTabela = document.querySelector(
        ".button-ver-tabela-completa"
      );

      buttonVerMaisTabela.addEventListener("click", () => {
        setDataTable(_data, true);
        buttonVerMaisTabela.style.display = "none";
        buttonVerMenosTabela.style.display = "inline-block";
      });

      let buttonVerMenosTabela = document.querySelector(
        ".button-ver-tabela-minimizada"
      );
      
      buttonVerMenosTabela.addEventListener("click", () => {
        setDataTable(_data, false);
        buttonVerMaisTabela.style.display = "inline-block";
        buttonVerMenosTabela.style.display = "none";
      });
    }
  });
}

function showMoreInfoElenco(player) {
  let container = player.querySelector(".more-info");
  container.classList.toggle("show");
}

function setPartidaAnterior(_data) {
  _data = {
    "campeonato-paulista-a2": [
      {
        partida_id: 8559,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Comercial-SP 0x0 Linense",
        time_mandante: {
          time_id: 527,
          nome_popular: "Comercial-SP",
          sigla: "COM",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b83aa86d0.png",
        },
        time_visitante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        placar_mandante: 0,
        placar_visitante: 0,
        disputa_penalti: false,
        status: "finalizado",
        slug: "comercial-sp-linense-63dac39833199",
        data_realizacao: "14/01/2023",
        hora_realizacao: "16:00",
        data_realizacao_iso: "2023-01-14T16:00:00-0300",
        estadio: {
          estadio_id: 663,
          nome_popular: "Palma Travassos",
        },
      },
      {
        partida_id: 8569,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Linense 0x0 Juventus-SP",
        time_mandante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        time_visitante: {
          time_id: 556,
          nome_popular: "Juventus-SP",
          sigla: "JUV-SP",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b85b6d749.png",
        },
        placar_mandante: 0,
        placar_visitante: 0,
        disputa_penalti: false,
        status: "finalizado",
        slug: "linense-juventus-sp-63dac39f4c830",
        data_realizacao: "18/01/2023",
        hora_realizacao: "19:30",
        data_realizacao_iso: "2023-01-18T19:30:00-0300",
        estadio: {
          estadio_id: 671,
          nome_popular: "Gilbert\u00e3o (SP)",
        },
      },
      {
        partida_id: 8574,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Linense 3x2 Lemense",
        time_mandante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        time_visitante: {
          time_id: 541,
          nome_popular: "Lemense",
          sigla: "LEM",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b84a71a72.png",
        },
        placar_mandante: 3,
        placar_visitante: 2,
        disputa_penalti: false,
        status: "finalizado",
        slug: "linense-lemense-63dac3a56b1e6",
        data_realizacao: "21/01/2023",
        hora_realizacao: "18:00",
        data_realizacao_iso: "2023-01-21T18:00:00-0300",
        estadio: {
          estadio_id: 671,
          nome_popular: "Gilbert\u00e3o (SP)",
        },
      },
      {
        partida_id: 8584,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Velo Clube 1x0 Linense",
        time_mandante: {
          time_id: 522,
          nome_popular: "Velo Clube",
          sigla: "VEL",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b83500cb6.png",
        },
        time_visitante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        placar_mandante: 1,
        placar_visitante: 0,
        disputa_penalti: false,
        status: "finalizado",
        slug: "velo-clube-linense-63dac3abd5569",
        data_realizacao: "25/01/2023",
        hora_realizacao: "20:00",
        data_realizacao_iso: "2023-01-25T20:00:00-0300",
        estadio: {
          estadio_id: 662,
          nome_popular: "Benit\u00e3o",
        },
      },
      {
        partida_id: 8592,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Linense 0x0 Portuguesa Santista",
        time_mandante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        time_visitante: {
          time_id: 574,
          nome_popular: "Portuguesa Santista",
          sigla: "PST",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87504dc1.png",
        },
        placar_mandante: 0,
        placar_visitante: 0,
        disputa_penalti: false,
        status: "finalizado",
        slug: "linense-portuguesa-santista-63dac3b2516f0",
        data_realizacao: "28/01/2023",
        hora_realizacao: "18:00",
        data_realizacao_iso: "2023-01-28T18:00:00-0300",
        estadio: {
          estadio_id: 671,
          nome_popular: "Gilbert\u00e3o (SP)",
        },
      },
      {
        partida_id: 8600,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Oeste 0x2 Linense",
        time_mandante: {
          time_id: 52,
          nome_popular: "Oeste",
          sigla: "OES",
          escudo: "https://cdn.api-futebol.com.br/escudos/638d349fed9c0.svg",
        },
        time_visitante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        placar_mandante: 0,
        placar_visitante: 2,
        disputa_penalti: false,
        status: "finalizado",
        slug: "oeste-linense-8600",
        data_realizacao: "01/02/2023",
        hora_realizacao: "19:00",
        data_realizacao_iso: "2023-02-01T19:00:00-0300",
        estadio: {
          estadio_id: 69,
          nome_popular: "Arena Barueri",
        },
      },
      {
        partida_id: 8609,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Linense 1x1 Noroeste",
        time_mandante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        time_visitante: {
          time_id: 576,
          nome_popular: "Noroeste",
          sigla: "NOR",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b877366d1.svg",
        },
        placar_mandante: 1,
        placar_visitante: 1,
        disputa_penalti: false,
        status: "finalizado",
        slug: "linense-noroeste-8609",
        data_realizacao: "04/02/2023",
        hora_realizacao: "18:00",
        data_realizacao_iso: "2023-02-04T18:00:00-0300",
        estadio: {
          estadio_id: 671,
          nome_popular: "Gilbert\u00e3o (SP)",
        },
      },
      {
        partida_id: 8618,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Novorizontino 2x1 Linense",
        time_mandante: {
          time_id: 51,
          nome_popular: "Novorizontino",
          sigla: "NOV",
          escudo: "https://cdn.api-futebol.com.br/escudos/638d349f5f733.svg",
        },
        time_visitante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        placar_mandante: 2,
        placar_visitante: 1,
        disputa_penalti: false,
        status: "finalizado",
        slug: "novorizontino-linense-8618",
        data_realizacao: "08/02/2023",
        hora_realizacao: "20:00",
        data_realizacao_iso: "2023-02-08T20:00:00-0300",
        estadio: {
          estadio_id: 60,
          nome_popular: "Jorge Ismael de Biasi",
        },
      },
      {
        partida_id: 8626,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Linense 1x1 XV de Piracicaba",
        time_mandante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        time_visitante: {
          time_id: 70,
          nome_popular: "XV de Piracicaba",
          sigla: "PIR",
          escudo: "https://cdn.api-futebol.com.br/escudos/638d34a99cd3e.png",
        },
        placar_mandante: 1,
        placar_visitante: 1,
        disputa_penalti: false,
        status: "finalizado",
        slug: "linense-xv-de-piracicaba-8626",
        data_realizacao: "11/02/2023",
        hora_realizacao: "18:00",
        data_realizacao_iso: "2023-02-11T18:00:00-0300",
        estadio: {
          estadio_id: 671,
          nome_popular: "Gilbert\u00e3o (SP)",
        },
      },
      {
        partida_id: 8628,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Linense 0x2 Ponte Preta",
        time_mandante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        time_visitante: {
          time_id: 61,
          nome_popular: "Ponte Preta",
          sigla: "PON",
          escudo: "https://cdn.api-futebol.com.br/escudos/638d34a46fbd4.svg",
        },
        placar_mandante: 0,
        placar_visitante: 2,
        disputa_penalti: false,
        status: "finalizado",
        slug: "linense-ponte-preta-8628",
        data_realizacao: "14/02/2023",
        hora_realizacao: "20:30",
        data_realizacao_iso: "2023-02-14T20:30:00-0300",
        estadio: {
          estadio_id: 671,
          nome_popular: "Gilbert\u00e3o (SP)",
        },
      },
      {
        partida_id: 8638,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Taubat\u00e9 2x0 Linense",
        time_mandante: {
          time_id: 532,
          nome_popular: "Taubat\u00e9",
          sigla: "TAU",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b84080f4b.png",
        },
        time_visitante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        placar_mandante: 2,
        placar_visitante: 0,
        disputa_penalti: false,
        status: "finalizado",
        slug: "taubate-linense-8638",
        data_realizacao: "18/02/2023",
        hora_realizacao: "15:00",
        data_realizacao_iso: "2023-02-18T15:00:00-0300",
        estadio: {
          estadio_id: 666,
          nome_popular: "Joaquinz\u00e3o",
        },
      },
      {
        partida_id: 8645,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Primavera-SP 1x1 Linense",
        time_mandante: {
          time_id: 575,
          nome_popular: "Primavera-SP",
          sigla: "PRI",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b876169dd.png",
        },
        time_visitante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        placar_mandante: 1,
        placar_visitante: 1,
        disputa_penalti: false,
        status: "finalizado",
        slug: "primavera-sp-linense-8645",
        data_realizacao: "26/02/2023",
        hora_realizacao: "15:00",
        data_realizacao_iso: "2023-02-26T15:00:00-0300",
        estadio: {
          estadio_id: 668,
          nome_popular: "\u00cdtalo Limongi",
        },
      },
      {
        partida_id: 8654,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Linense 2x1 Rio Claro",
        time_mandante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        time_visitante: {
          time_id: 543,
          nome_popular: "Rio Claro",
          sigla: "RIC",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b84cba6f0.png",
        },
        placar_mandante: 2,
        placar_visitante: 1,
        disputa_penalti: false,
        status: "finalizado",
        slug: "linense-rio-claro-8654",
        data_realizacao: "01/03/2023",
        hora_realizacao: "19:30",
        data_realizacao_iso: "2023-03-01T19:30:00-0300",
        estadio: {
          estadio_id: 671,
          nome_popular: "Gilbert\u00e3o (SP)",
        },
      },
      {
        partida_id: 8667,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Monte Azul 1x0 Linense",
        time_mandante: {
          time_id: 578,
          nome_popular: "Monte Azul",
          sigla: "MOA",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b879579ba.png",
        },
        time_visitante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        placar_mandante: 1,
        placar_visitante: 0,
        disputa_penalti: false,
        status: "finalizado",
        slug: "monte-azul-linense-8667",
        data_realizacao: "05/03/2023",
        hora_realizacao: "10:00",
        data_realizacao_iso: "2023-03-05T10:00:00-0300",
        estadio: {
          estadio_id: 667,
          nome_popular: "Otac\u00edlia Patr\u00edcio Arroyo",
        },
      },
      {
        partida_id: 8671,
        campeonato: {
          campeonato_id: 40,
          nome: "Campeonato Paulista A2",
          slug: "campeonato-paulista-a2",
        },
        placar: "Linense 2x0 S\u00e3o Caetano",
        time_mandante: {
          time_id: 577,
          nome_popular: "Linense",
          sigla: "LIN",
          escudo: "https://cdn.api-futebol.com.br/escudos/63f2b87846c12.png",
        },
        time_visitante: {
          time_id: 215,
          nome_popular: "S\u00e3o Caetano",
          sigla: "SCA",
          escudo: "https://cdn.api-futebol.com.br/escudos/638d34f1b1d3f.svg",
        },
        placar_mandante: 2,
        placar_visitante: 0,
        disputa_penalti: false,
        status: "finalizado",
        slug: "linense-sao-caetano-8671",
        data_realizacao: "11/03/2023",
        hora_realizacao: "15:00",
        data_realizacao_iso: "2023-03-11T15:00:00-0300",
        estadio: {
          estadio_id: 671,
          nome_popular: "Gilbert\u00e3o (SP)",
        },
      },
    ],
  };


  for (key in _data) {
    let data = _data[key];

    data.sort((a, b) => b.partida_id - a.partida_id);

    data = data.slice(0, 3);

    let container = document.querySelector(".partida-anterior-container");

    data.forEach((main) => {
      container.innerHTML += `
      <div class="partida">
        <span class="situacao-partida">${main.status}</span>
        <div class="campeonato">${main.campeonato.nome} | ${main.data_realizacao}</div>
        <div class="partida-anterior">
          <div class="partida-anterior-content">
            <div class="time-casa time">
              <div class="time-content">
                <img src="${main.time_mandante.escudo}" alt="${main.time_mandante.nome_popular}" class="logo-time">
                <span class="nome-time-casa">${main.time_mandante.nome_popular}</span>
              </div>
              <span class="placar-time-casa">${main.placar_mandante}</span>
            </div>
            <div class="time-fora time">
              <div class="time-content">
                <img src="${main.time_visitante.escudo}" alt="${main.time_visitante.nome_popular}" class="logo-time">
                <span class="nome-time-fora">${main.time_visitante.nome_popular}</span>
              </div>
              <span class="placar-time-fora">${main.placar_visitante}</span>
            </div>
          </div>
        </div>
        <a href=#" class="ver-resumo-partida">Resumo da partida <i class="fa fa-angle-right"></i></a>
      </div>
      `;
    });
  }
}

function setProximaPartida(_data) {
  // for (key in _data) {
  //   let main = _data[key][0];
  //   console.log(main)
  // }
}
