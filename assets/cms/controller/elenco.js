// CREATE ELENCO

var buttonSubmitFormDados = document
  .querySelector(".button-salvar")
  .addEventListener("click", getFormDados);

var idImagem = null;

function getFormDados() {
  let dados = {
    nome: document.querySelector("#input-nome-jogador").value,
    numero: document.querySelector("#input-numero-jogador").value,
    posicao: document.querySelector("#posicao-jogador").value,
    dataNascimento: document.querySelector("#input-data-jogador").value,
    idade: document.querySelector("#input-idade-jogador").value,
    altura: document.querySelector("#input-altura-jogador").value,
    nacionalidade: document.querySelector("#input-nacionalidade-jogador").value,
    descricao: document.querySelector("#descricao-jogador").value,
    idImagemSelecionada: idImagem,
  };

  if (dados.dataNascimento.length > 10) {
    messageError("Data de nascimento inválida!");
    return;
  }

  if (dados.nome.length < 3) {
    messageError("Nome deve conter ao menos 3 caracteres!");
    return;
  }

  if (!/^[1-9][0-9]?$|^100$/.test(dados.numero)) {
    messageError("O campo número deve conter apenas números entre 1 e 100.");
    return;
  }

  if(dados.altura.length == 3) dados.altura = dados.altura + "0";

  if (dados.altura.indexOf(",") !== -1) {
    dados.altura = dados.altura.replace(",", ".");
  }

  if (!/^\d\.\d\d$/.test(dados.altura)) {
    messageError("Altura inválida!");
    return;
  }

  var idadeNumerica = parseInt(dados.idade, 10); 
    if (isNaN(idadeNumerica) || idadeNumerica < 14 || idadeNumerica > 50) {
      messageError("A idade deve estar entre 14 e 50 anos.");
      return;
  }


  // ------------------------------------------

  // Verifique se idImagem é nulo (null) e, se for o caso, defina-o como '000'
  if (dados.idImagemSelecionada === null) {
    dados.idImagemSelecionada = "000";
  }

  console.log(dados);

  let dataForm = new FormData();
  dataForm.append("nome_jogador", dados.nome);
  dataForm.append("numero_camisa", dados.numero);
  dataForm.append("posicao", dados.posicao);
  dataForm.append("data_nasc", dados.dataNascimento);
  dataForm.append("idade", dados.idade);
  dataForm.append("altura", dados.altura);
  dataForm.append("nacionalidade", dados.nacionalidade);
  dataForm.append("descricao", dados.descricao);
  dataForm.append("id_imagem", dados.idImagemSelecionada);

  let url = `http://localhost/WEBSITELINENSE/api/model/elencoController.php?operation=create`;

  requestCreateImage(url, dataForm);

  console.log(dados);
}

function messageError(_message) {
  Swal.fire({
    icon: "error",
    title: "Ops!",
    customClass: {
      container: "meu-sweet-alert",
      title: "meu-sweet-alert-title",
      content: "meu-sweet-alert-content",
      confirmButton: "meu-sweet-alert-confirm-button",
    },
    text: _message,
  });
}

async function requestCreateImage(url, formData) {
  let req = await fetch(url, {
    method: "POST",
    body: formData,
  });

  let data = await req.json();

  if (data.type == "success") {
    Swal.fire({
      icon: "success",
      title: "Jogador adicionado!",
      customClass: {
        container: "meu-sweet-alert",
        title: "meu-sweet-alert-title",
        content: "meu-sweet-alert-content",
        confirmButton: "meu-sweet-alert-confirm-button",
      },
      text: data.message,
    }).then((result) => {
      result.isConfirmed ? location.reload() : console.log("ERRO");
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Ops!",
      customClass: {
        container: "meu-sweet-alert",
        title: "meu-sweet-alert-title",
        content: "meu-sweet-alert-content",
        confirmButton: "meu-sweet-alert-confirm-button",
      },
      text: data.message,
    });
  }
}

// IMPORT IMAGES GALERIA

var containerGaleria = document.querySelectorAll(".galeria-content");
var url =
  "http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=read";

async function requestImages() {
  let req = await fetch(url);
  let data = await req.json();

  console.log(data);

  if (data.type == "null") {
    containerGaleria.forEach((c) => {
      c.parentElement.innerHTML += `
        <div class="message-not-exists-images">
        <img src="https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-1/254000/37-512.png" />
        Não há imagens cadastradas para essa categoria
        </div>
      `;
    });
  } else {
    let images = data.filter((item) => item.categoria === "elenco");
    showImages(images);
  }
}

function showImages(main) {
  if (main.length == 0) {
    containerGaleria.forEach((c) => {
      c.parentElement.innerHTML += `
        <div class="message-not-exists-images">
        <img src="https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-1/254000/37-512.png" />
        Não há imagens cadastradas para essa categoria
        </div>
      `;
    });
  } else {
    main.forEach((imagem) => {
      containerGaleria.forEach((c) => {
        c.innerHTML += `
        <div class="img">
          <img src="${imagem.path.replace("../../", "")}" data-id="${
          imagem.id_imagem
        }" alt="${imagem.titulo_imagem}" />
  
          <div class="info-img-create">
            <p>Clique para <span>selecionar</span> <br> a imagem</p>
          </div>
        </div>
      `;
      });
    });

    // SELECTED IMAGE GALERIA

    let imagesSelected = document.querySelectorAll(".info-img-create");

    imagesSelected.forEach((imagem) => {
      imagem.addEventListener("click", () => {
        const isSelected = imagem.parentElement.classList.contains("selected");
        console.log(idImagem);

        imagesSelected.forEach((img) => {
          img.parentElement.classList.remove("selected");
          img.innerHTML = `<p>Clique para <span>selecionar</span> <br> a imagem</p>`;
        });

        if (!isSelected) {
          imagem.parentElement.classList.add("selected");
          imagem.innerHTML = `
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Eo_circle_red_white_checkmark.svg/2048px-Eo_circle_red_white_checkmark.svg.png" />
          `;
          idImagem = imagem.parentElement
            .querySelector("img")
            .getAttribute("data-id");
        } else {
          idImagem = "";
        }

        console.log(idImagem);

        var buttonCancelCreateElenco =
          document.querySelector(".button-cancelar");
        buttonCancelCreateElenco.addEventListener("click", () => {
          imagem.parentElement.classList.remove("selected");
        });

        var buttonVoltarCreateElenco = document.querySelector(
          ".button-voltar-icon"
        );
        buttonVoltarCreateElenco.addEventListener("click", () => {
          imagem.parentElement.classList.remove("selected");
        });
      });
    });
  }
}

requestImages();

// SHOW ELENCO
requestReadData();

function requestReadData() {
  fetch(
    "http://localhost/WEBSITELINENSE/api/model/elencoController.php?operation=read"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      jsonData = data;
      if (data.type == "null") {
        var tabelaBody = document.getElementById("table-body");
        tabelaBody.innerHTML = `<tr class="visible">
              <td colspan="7">
                ${data.message}
              </td>
            </tr>`;
      } else {
        preencherTabelaComJSON();
      }
    })
    .catch(function (error) {
      console.error("Erro ao carregar os dados:", error);
    });
}

var jsonData;
var pageSize = 6;
var currentPage = 0;
var sortOrderByCreationDate = 1;
var currentCategory = "";

function preencherTabelaComJSON() {
  var tabelaBody = document.getElementById("table-body");
  tabelaBody.innerHTML = "";

  var start = currentPage * pageSize;
  var end = start + pageSize;

  var sortedData = [...jsonData];

  if (sortedData.length > 0) {
    document
      .getElementById("sortByCreationDate")
      .addEventListener("click", toggleSortByCreationDate);
  }

  if (currentCategory !== "") {
    sortedData = sortedData.filter(function (item) {
      return item.posicao === currentCategory;
    });

    if (sortedData.length === 0) {
      var tabelaBody = document.getElementById("table-body");
      tabelaBody.innerHTML = `<tr class="visible visible-null">
        <td colspan="7">
            Não foi encontrado nenhum registro
        </td>
    </tr>`;
      return;
    } else {
      if (document.querySelector(".visible-null"))
        document.querySelector(".visible-null").style.display = "none";
    }
  }
  var tituloFiltrado = document
    .getElementById("input-search-elenco")
    .value.trim()
    .toLowerCase();
  if (tituloFiltrado !== "") {
    sortedData = sortedData.filter(function (item) {
      return item.nome_jogador.toLowerCase().includes(tituloFiltrado);
    });

    if (sortedData.length === 0) {
      var tabelaBody = document.getElementById("table-body");
      tabelaBody.innerHTML = `<tr class="visible visible-null">
        <td colspan="7">
            Não foi encontrado nenhum registro
        </td>
    </tr>`;
      return;
    } else {
      if (document.querySelector(".visible-null"))
        document.querySelector(".visible-null").style.display = "none";
    }
  }

  sortedData.sort(
    (a, b) =>
      sortOrderByCreationDate * (new Date(a.id_elenco) - new Date(b.id_elenco))
  );

  var visibleRows = [];

  for (var i = start; i < end && i < sortedData.length; i++) {
    var linha = document.createElement("tr");

    linha.setAttribute("data-id", sortedData[i].id_elenco);

    var editarIcon = document.createElement("i");
    editarIcon.className = "fas fa-edit edit-icon";
    editarIcon.setAttribute("title", "Editar Jogador");

    editarIcon.addEventListener("click", function (event) {
      // EDIT-IMAGE
      let formEditContainer = document.querySelector(
        ".form-edit-elenco-container"
      );
      document.querySelector(".list-elenco-container").style.display = "none";
      formEditContainer.style.display = "block";

      formEditContainer
        .querySelector(".button-voltar-icon")
        .addEventListener("click", () => {
          document.querySelector(".list-elenco-container").style.display =
            "block";
          formEditContainer.style.display = "none";
        });

      var rowIndex = Array.from(tabelaBody.children).indexOf(
        event.target.parentNode.parentNode
      );

      var linhaSelecionada = sortedData[rowIndex + currentPage * pageSize];

      formEditContainer
        .querySelector(".button-cancelar")
        .addEventListener("click", () => {
          document.querySelector(".list-elenco-container").style.display =
            "block";
          formEditContainer.style.display = "none"; // Adicione ".style" aqui para corrigir o erro
        });

      // set values
      formEditContainer.querySelector("#input-nome-jogador").value =
        linhaSelecionada.nome_jogador;
      formEditContainer.querySelector("#input-numero-jogador").value =
        linhaSelecionada.numero_camisa;
      formEditContainer.querySelector("#input-data-jogador").value =
        linhaSelecionada.data_nasc;
      formEditContainer.querySelector("#input-idade-jogador").value =
        linhaSelecionada.idade;
      formEditContainer.querySelector("#posicao-jogador").value =
        linhaSelecionada.posicao;
      formEditContainer.querySelector("#input-altura-jogador").value =
        linhaSelecionada.altura;
      formEditContainer.querySelector("#input-nacionalidade-jogador").value =
        linhaSelecionada.nacionalidade;
      formEditContainer.querySelector("#descricao-jogador").value =
        linhaSelecionada.descricao;

      // SHOW GALERRY EDIT SELECTED

      var containerGaleriaEdit = document.querySelectorAll(
        ".galeria-content-edit"
      );
      var url =
        "http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=read";

      async function requestImagesEdit() {
        let req = await fetch(url);
        let data = await req.json();

        if (data.type == "null") {
          containerGaleriaEdit.forEach((c) => {
            c.parentElement.innerHTML += `
        <div class="message-not-exists-images">
        <img src="https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-1/254000/37-512.png" />
        Não há imagens cadastradas para essa categoria
        </div>
      `;
          });
        } else {
          let images = data.filter((item) => item.categoria === "elenco");

          clearImagesEditContainers(); // Limpa as galerias de imagens antes de adicionar novas
          showImagesEdit(images);
        }
      }

      function clearImagesEditContainers() {
        var containers = document.querySelectorAll(".galeria-content-edit");
        containers.forEach((container) => {
          container.innerHTML = ""; // Limpa o conteúdo da galeria de imagens
        });
      }

      function showImagesEdit(main) {
        if (main.length == 0) {
          containerGaleriaEdit.forEach((c) => {
            c.parentElement.innerHTML += `
        <div class="message-not-exists-images">
        <img src="https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-1/254000/37-512.png" />
        Não há imagens cadastradas para essa categoria
        </div>
      `;
          });
        } else {
          main.forEach((imagem) => {
            containerGaleriaEdit.forEach((c) => {
              c.innerHTML += `
              <div class="img">
                <img src="${imagem.path.replace("../../", "")}" data-id="${
                imagem.id_imagem
              }" alt="${imagem.titulo_imagem}" />
                <div class="info-img-edit">
                  <p>Clique para <span>selecionar</span> <br> a imagem</p>
                </div>
              </div>
          `;
            });
          });

          // SELECTED IMAGE GALERIA
          let imagesWrapper = document.querySelectorAll(
            ".galeria-content-edit .img img"
          );

          imagesWrapper.forEach((i) => {
            if (i.getAttribute("data-id") == linhaSelecionada.id_imagem) {
              i.parentElement.classList.add("selected");
              i.parentElement.querySelector(".info-img-edit").innerHTML = `
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Eo_circle_red_white_checkmark.svg/2048px-Eo_circle_red_white_checkmark.svg.png" />
          `;
            }
          });

          let imagesSelected = document.querySelectorAll(".info-img-edit");

          imagesSelected.forEach((imagem) => {
            imagem.addEventListener("click", () => {
              const isSelected =
                imagem.parentElement.classList.contains("selected");
              console.log(idImagem);

              imagesSelected.forEach((img) => {
                img.parentElement.classList.remove("selected");
                img.innerHTML = `<p>Clique para <span>selecionar</span> <br> a imagem</p>`;
              });

              if (!isSelected) {
                imagem.parentElement.classList.add("selected");
                imagem.innerHTML = `
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Eo_circle_red_white_checkmark.svg/2048px-Eo_circle_red_white_checkmark.svg.png" />
            `;
                idImagem = imagem.parentElement
                  .querySelector("img")
                  .getAttribute("data-id");
              } else {
                idImagem = "";
              }
            });
          });
        }
      }

      requestImagesEdit();

      let buttonUploadElenco = document.querySelector("#button-upload-elenco");
      buttonUploadElenco.addEventListener("click", uploadElenco);

      function uploadElenco() {
        let dados = {
          idJogador: linhaSelecionada.id_elenco,
          nomeJogador: formEditContainer.querySelector("#input-nome-jogador")
            .value,
          numero: formEditContainer.querySelector("#input-numero-jogador")
            .value,
          dataNasc: formEditContainer.querySelector("#input-data-jogador")
            .value,
          idade: formEditContainer.querySelector("#input-idade-jogador").value,
          posicao: formEditContainer.querySelector("#posicao-jogador").value,
          altura: formEditContainer.querySelector("#input-altura-jogador")
            .value,
          nacionalidade: formEditContainer.querySelector(
            "#input-nacionalidade-jogador"
          ).value,
          descricao:
            formEditContainer.querySelector("#descricao-jogador").value,
          idImagem: idImagem,
        };

        if (dados.dataNasc.length > 10) {
          messageError("Data de nascimento inválida!");
          return;
        }
      
        if (dados.nomeJogador.length < 3) {
          messageError("Nome deve conter ao menos 3 caracteres!");
          return;
        }
      
        if (!/^[1-9][0-9]?$|^100$/.test(dados.numero)) {
          messageError("O campo número deve conter apenas números entre 1 e 100.");
          return;
        }
      
        if(dados.altura.length == 3) dados.altura = dados.altura + "0";
      
        if (dados.altura.indexOf(",") !== -1) {
          dados.altura = dados.altura.replace(",", ".");
        }
      
        if (!/^\d\.\d\d$/.test(dados.altura)) {
          messageError("Altura inválida!");
          return;
        }
      
        var idadeNumerica = parseInt(dados.idade, 10); 
          if (isNaN(idadeNumerica) || idadeNumerica < 14 || idadeNumerica > 50) {
            messageError("A idade deve estar entre 14 e 50 anos.");
            return;
        }

        let dataForm = new FormData();
        dataForm.append("id_elenco", dados.idJogador);
        dataForm.append("nome_jogador", dados.nomeJogador);
        dataForm.append("numero_camisa", dados.numero);
        dataForm.append("posicao", dados.posicao);
        dataForm.append("data_nasc", dados.dataNasc);
        dataForm.append("idade", dados.idade);
        dataForm.append("altura", dados.altura);
        dataForm.append("nacionalidade", dados.nacionalidade);
        dataForm.append("descricao", dados.descricao);
        dataForm.append("id_imagem", dados.idImagem);

        console.log(dados.idImagem);

        let url = `http://localhost/WEBSITELINENSE/api/model/elencoController.php?operation=update`;

        requestUpdateElenco(url, dataForm);
      }
    });

    var apagarIcon = document.createElement("i");
    apagarIcon.className = "fas fa-trash-alt delete-icon";
    apagarIcon.setAttribute("title", "Deletar Jogador");
    apagarIcon.addEventListener("click", function (event) {
      //  DELETE ELENCO
      Swal.fire({
        title: "Deletar Jogador",
        text: "Tem certeza de que deseja deletar esse jogador? Uma vez que o mesmo for deletado não poderá ser recuperado!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#a8a8a8",
        confirmButtonColor: "#EC1B23",
        confirmButtonText: "Deletar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          let id = event.target.parentNode.parentNode.getAttribute("data-id");
          requestDeteleJogador(id);
        }
      });
      document.body.classList.contains("swal2-height-auto")
        ? document.body.classList.remove("swal2-height-auto")
        : false;
    });

    var viewIcon = document.createElement("i");
    viewIcon.className = "fa fa-eye view-icon";
    viewIcon.setAttribute("title", "Ver detalhes");
    viewIcon.addEventListener("click", function (event) {
      // VIEW DETAILS OF THE ELENCO
      let containerViewImageModal = document.querySelector(
        ".container-view-elenco"
      );
      containerViewImageModal.showModal();

      var rowIndex = Array.from(tabelaBody.children).indexOf(
        event.target.parentNode.parentNode
      );

      var linhaSelecionada = sortedData[rowIndex + currentPage * pageSize];

      setDataModal();

      let buttonBack = containerViewImageModal
        .querySelector("#button-back")
        .addEventListener("click", closeModal);

      function closeModal() {
        containerViewImageModal.close();
      }

      function setDataModal() {
        containerViewImageModal.querySelector("#id-jogador").innerText =
          "000" + linhaSelecionada.id_elenco;
        containerViewImageModal.querySelector("#nome-jogador").innerText =
          linhaSelecionada.nome_jogador;
        containerViewImageModal.querySelector("#numero-camisa").innerText =
          "#" + linhaSelecionada.numero_camisa;
        containerViewImageModal.querySelector("#position-jogador").innerText =
          linhaSelecionada.posicao;

        function formatShowData(data) {
          let arr = data.split("-");
          return `${arr[2]}/${arr[1]}/${arr[0]}`;
        }

        containerViewImageModal.querySelector("#date-jogador").innerText =
          formatShowData(linhaSelecionada.data_nasc);
        containerViewImageModal.querySelector("#idade-jogador").innerText =
          linhaSelecionada.idade;
        containerViewImageModal.querySelector("#altura-jogador").innerText =
          linhaSelecionada.altura;
        containerViewImageModal.querySelector("#nacionalidade").innerText =
          linhaSelecionada.nacionalidade;
        containerViewImageModal.querySelector("#desc-jogador").innerText =
          linhaSelecionada.descricao;

        console.log(linhaSelecionada.id_imagem);

        containerViewImageModal.querySelector("#id-imagem-jogador").innerText =
          linhaSelecionada.id_imagem
            ? "000" + linhaSelecionada.id_imagem
            : "0000";

        requestImageById();

        async function requestImageById() {
          let req = await fetch(
            "http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=read"
          );
          let data = await req.json();

          let image = data.filter(
            (item) => item.id_imagem === linhaSelecionada.id_imagem
          );

          showImage(image);
        }

        function showImage(_src) {
          const elencoImage =
            containerViewImageModal.querySelector("#elenco-view-img");

          if (_src && Array.isArray(_src) && _src.length > 0 && _src[0].path) {
            elencoImage.src = _src[0].path.replace("../../", "");
          } else {
            // Caso o jogador não tenha uma imagem associada, defina a imagem padrão.
            elencoImage.src =
              "http://localhost/WEBSITELINENSE/assets/images/default-avatar.png";
          }
        }
      }
    });

    var acoesCell = document.createElement("td");
    acoesCell.classList.add("td-acoes");
    acoesCell.appendChild(editarIcon);
    acoesCell.appendChild(apagarIcon);
    acoesCell.appendChild(viewIcon);

    var idCell = document.createElement("td");
    idCell.classList.add("td-min");
    var nomeCell = document.createElement("td");
    var numeroCell = document.createElement("td");
    numeroCell.classList.add("td-min");
    var posicaoCell = document.createElement("td");
    posicaoCell.classList.add("td-min");
    var idadeCell = document.createElement("td");
    idadeCell.classList.add("td-min");
    var alturaCell = document.createElement("td");
    alturaCell.classList.add("td-min");
    var descricaoCell = document.createElement("td");
    descricaoCell.classList.add("td-descricao");

    idCell.textContent = sortedData[i].id_elenco;
    nomeCell.textContent = sortedData[i].nome_jogador;
    numeroCell.textContent = "#" + sortedData[i].numero_camisa;
    posicaoCell.textContent = sortedData[i].posicao;
    idadeCell.textContent = sortedData[i].idade;
    alturaCell.textContent =
      sortedData[i].altura.toString().replace(".", ",") + "m";
    descricaoCell.textContent = sortedData[i].descricao;

    if (descricaoCell.innerText.length > 20) {
      descricaoCell.textContent = descricaoCell.innerText.slice(0, 12) + "...";
    }

    linha.appendChild(idCell);
    linha.appendChild(nomeCell);
    linha.appendChild(numeroCell);
    linha.appendChild(posicaoCell);
    linha.appendChild(idadeCell);
    linha.appendChild(alturaCell);
    linha.appendChild(descricaoCell);
    linha.appendChild(acoesCell);

    tabelaBody.appendChild(linha);

    visibleRows.push(linha);
  }

  setTimeout(function () {
    for (var i = 0; i < visibleRows.length; i++) {
      visibleRows[i].classList.add("visible");
    }
  }, 100);
}

function updatePage() {
  preencherTabelaComJSON();
}

function nextPage() {
  if (currentPage < Math.ceil(jsonData.length / pageSize) - 1) {
    currentPage++;
    updatePage();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    updatePage();
  }
}

function toggleSortByCreationDate() {
  sortOrderByCreationDate = -sortOrderByCreationDate;
  updatePage();
}

function applyCategoryFilter() {
  currentCategory = document.getElementById("posicao").value;
  currentPage = 0;
  updatePage();
}

function applyTitleFilter() {
  currentPage = 0;
  updatePage();
}

document.getElementById("nextPage").addEventListener("click", nextPage);
document.getElementById("prevPage").addEventListener("click", prevPage);

document
  .getElementById("filtrar")
  .addEventListener("click", applyCategoryFilter);

document
  .getElementById("button-submit-search-elenco")
  .addEventListener("click", applyTitleFilter);

var buttonAddNewElenco = document.querySelector("#button-create-new-elenco");
buttonAddNewElenco.addEventListener("click", showCreateNewElencoContainer);

function showCreateNewElencoContainer() {
  let list = document.querySelector(".list-elenco-container");
  list.style.display = "none";
  let container = document.querySelector(".form-create-elenco-container");
  container.style.display = "block";
}

var buttonShowList = document.querySelector(".button-voltar-icon");
buttonShowList.addEventListener("click", showList);

function showList() {
  let list = document.querySelector(".list-elenco-container");
  list.style.display = "block";
  let container = document.querySelector(".form-create-elenco-container");
  container.style.display = "none";
}

var buttonCancelCreateElenco = document.querySelector(".button-cancelar");
buttonCancelCreateElenco.addEventListener("click", () => {
  var selectedImage = document.querySelector(".galeria-content .selected");
  if (selectedImage) {
    selectedImage.classList.remove("selected");
    selectedImage.querySelector(".info-img-create").innerHTML = `
      <p>Clique para <span>selecionar</span> <br> a imagem</p>
    `;
    idImagem = "";
  }
  let list = document.querySelector(".list-elenco-container");
  list.style.display = "block";
  let container = document.querySelector(".form-create-elenco-container");
  container.style.display = "none";
});

// REQUESTS
async function requestDeteleJogador(id) {
  let url = `http://localhost/WEBSITELINENSE/api/model/elencoController.php?operation=delete&id_elenco=${id}`;
  let req = await fetch(url);

  let data = await req.json();

  console.log(data);

  if (data.type == "success") {
    Swal.fire({
      icon: "success",
      title: "Jogador deletado!",
      customClass: {
        container: "meu-sweet-alert",
        title: "meu-sweet-alert-title",
        content: "meu-sweet-alert-content",
        confirmButton: "meu-sweet-alert-confirm-button",
      },
      text: data.message,
    }).then((result) => {
      result.isConfirmed ? location.reload() : console.log("ERRO");
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Ops!",
      customClass: {
        container: "meu-sweet-alert",
        title: "meu-sweet-alert-title",
        content: "meu-sweet-alert-content",
        confirmButton: "meu-sweet-alert-confirm-button",
      },
      text: data.message,
    });
  }

  document.body.classList.contains("swal2-height-auto")
    ? document.body.classList.remove("swal2-height-auto")
    : false;
}

async function requestUpdateElenco(_url, _dataForm) {
  let req = await fetch(_url, {
    method: "POST",
    body: _dataForm,
  });

  let data = await req.json();

  if (data.type == "success") {
    Swal.fire({
      icon: "success",
      title: "Jogador alterado!",
      customClass: {
        container: "meu-sweet-alert",
        title: "meu-sweet-alert-title",
        content: "meu-sweet-alert-content",
        confirmButton: "meu-sweet-alert-confirm-button",
      },
      text: data.message,
    }).then((result) => {
      result.isConfirmed ? location.reload() : console.log("ERRO");
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Ops!",
      customClass: {
        container: "meu-sweet-alert",
        title: "meu-sweet-alert-title",
        content: "meu-sweet-alert-content",
        confirmButton: "meu-sweet-alert-confirm-button",
      },
      text: data.message,
    });
  }
}

document
  .querySelector("#input-search-elenco")
  .addEventListener("keypress", () => {
    applyTitleFilter();
  });

document
  .querySelector("#input-search-elenco")
  .addEventListener("keydown", () => {
    applyTitleFilter();
  });

document.querySelector("#input-search-elenco").addEventListener("keyup", () => {
  applyTitleFilter();
});

// SET COUNTRIES

fetch("http://localhost/WEBSITELINENSE/assets/cms/controller/countries.json")
  .then((response) => response.json())
  .then((dados) => {
    dados.forEach((countrie) => {
      for (let n in countrie) {
        document.querySelector("#input-nacionalidade-jogador").innerHTML += `
          <option value="${countrie[n]}">${countrie[n]}</option>
        `;

        document.querySelector(".input-select-edit").innerHTML += `
         <option value="${countrie[n]}">${countrie[n]}</option>
        `;
      }
    });
  })
  .catch((error) => {
    console.error("Ocorreu um erro ao carregar o JSON:", error);
  });

document.querySelector("#input-nacionalidade-jogador").innerHTML += `
  <option disabled selected>Selecione</option>
`;

document.querySelector(".input-select-edit").innerHTML += `
  <option disabled selected>Selecione</option>
`;
