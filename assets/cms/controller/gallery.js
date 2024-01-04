// CREATE IMAGES

var buttonSubmitFormDados = document
  .querySelector(".button-salvar")
  .addEventListener("click", getFormDados);

function getFormDados() {
  let dados = {
    tituloImagem: document.getElementById("input-titulo-imagem").value,
    categoriaImagem: document
      .getElementById("categoria-imagem")
      .value.toLowerCase(),
    descricaoImagem: document.getElementById("descricao_imagem").value,
    pathImagem: () => {
      return document.getElementById("file-input").files[0];
    },
  };

  let now = new Date();

  let year = now.getFullYear();
  let month = (now.getMonth() + 1).toString().padStart(2, "0");
  let day = now.getDate().toString().padStart(2, "0");
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let seconds = now.getSeconds().toString().padStart(2, "0");

  let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  let dataForm = new FormData();
  dataForm.append("titulo_imagem", dados.tituloImagem);
  dataForm.append("categoria", dados.categoriaImagem);
  dataForm.append("descricao_imagem", dados.descricaoImagem);
  dataForm.append("path", dados.pathImagem());
  dataForm.append("data_criacao", formattedDate);

  let url = `http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=create`;

  requestCreateImage(url, dataForm);

  console.log(dados);
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
      title: "Imagem criada com sucesso!",
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

document.querySelector("#file-input").addEventListener("change", getFile);

function getFile() {
  document.querySelector("#arquiveNome").textContent =
    document.getElementById("file-input").files[0].name;
}

// LIST IMAGES

requestReadData();

function requestReadData() {
  fetch(
    "http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=read"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) { 
      jsonData = data;
      console.log(data)
      if (data.type == "null") {
        var tabelaBody = document.getElementById("table-body");
        tabelaBody.innerHTML = `<tr class="visible">
              <td colspan="6">
                ${data.message}
              </td>
            </tr>`;
      } else {
        preencherTabelaComJSON();
       
        document.getElementById("sortByCreationDate").addEventListener("click", toggleSortByCreationDate);
        
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

  if (currentCategory !== "") {
    sortedData = sortedData.filter(function (item) {
      return item.categoria === currentCategory;
    });

    if (sortedData.length == 0) {
      var tabelaBody = document.getElementById("table-body");
      tabelaBody.innerHTML = `<tr class="visible visible-null">
        <td colspan="6">
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
    .getElementById("input-search-images")
    .value.trim()
    .toLowerCase();
  if (tituloFiltrado !== "") {
    sortedData = sortedData.filter(function (item) {
      return item.titulo_imagem.toLowerCase().includes(tituloFiltrado);
    });

  }

  sortedData.sort(
    (a, b) =>
      sortOrderByCreationDate *
      (new Date(a.data_criacao) - new Date(b.data_criacao))
  );

  var visibleRows = [];

  for (var i = start; i < end && i < sortedData.length; i++) {
    var linha = document.createElement("tr");

    linha.setAttribute("data-id", sortedData[i].id_imagem);

    var editarIcon = document.createElement("i");
    editarIcon.className = "fas fa-edit edit-icon";
    editarIcon.setAttribute("title", "Editar imagem");
    editarIcon.addEventListener("click", function (event) {
        // EDIT-IMAGE
    
        let formEditContainer = document.querySelector(".form-edit-image-container");
        document.querySelector(".list-images-container").style.display = "none";
        formEditContainer.style.display = "block";
    
        formEditContainer
            .querySelector(".button-voltar-icon")
            .addEventListener("click", () => {
                document.querySelector(".list-images-container").style.display = "block";
                formEditContainer.style.display = "none";
            });
    
        var rowIndex = Array.from(tabelaBody.children).indexOf(
            event.target.parentNode.parentNode
        );
    
        var linhaSelecionada = sortedData[rowIndex + currentPage * pageSize];
    
        const inputImage = formEditContainer.querySelector('.input-file-image');
        const previewImage = formEditContainer.querySelector('.img-upload');
    
        inputImage.addEventListener('change', function () {
            const file = inputImage.files[0];
            if (file) {
                // Ler o arquivo e atualizar a imagem de visualização
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    
        formEditContainer.querySelector(".button-cancelar").addEventListener("click", () => {
            document.querySelector(".list-images-container").style.display = "block";
            formEditContainer.style.display = "none";
        });
    
        formEditContainer.querySelector("#input-titulo-imagem").value = linhaSelecionada.titulo_imagem;
        formEditContainer.querySelector("#categoria-imagem").value = linhaSelecionada.categoria;
        formEditContainer.querySelector("#descricao_imagem").value = linhaSelecionada.descricao_imagem;
        formEditContainer.querySelector(".img-upload").src = linhaSelecionada.path.replace("../../", "../../../../WEBSITELINENSE/");
    
        formEditContainer.querySelector(".button-salvar").addEventListener("click", uploadImages);
    
        function uploadImages() {
            let tituloImg = formEditContainer.querySelector("#input-titulo-imagem").value;
            let categoriaImg = formEditContainer.querySelector("#categoria-imagem").value;
            let descricaoImg = formEditContainer.querySelector("#descricao_imagem").value;
            let fileImg = document.querySelector(".input-file-image").files[0];
    
            let dataForm = new FormData();
            dataForm.append("titulo_imagem", tituloImg);
            dataForm.append("categoria", categoriaImg);
            dataForm.append("descricao_imagem", descricaoImg);
            dataForm.append("id_imagem", linhaSelecionada.id_imagem);
            dataForm.append("path", document.querySelector(".input-file-image").files[0]);
    
            let url = `http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=update`;
    
            requestUpdateImage(url, dataForm);
        }
    
        async function requestUpdateImage(_url, _dataForm) {
    
            let req = await fetch(_url, {
                method: "POST",
                body: _dataForm,
            });
    
            let data = await req.json();
    
            if (data.type == "success") {
                Swal.fire({
                    icon: "success",
                    title: "Imagem alterada com sucesso!",
                    customClass: {
                        container: "meu-sweet-alert",
                        title: "meu-sweet-alert-title",
                        content: "meu-sweet-alert-content",
                        confirmButton: "meu-sweet-alert-confirm-button",
                    },
                    text: data.message,
                }).then((result) => {
                    previewImage.src = data.novoCaminhoDaImagem;
    
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
    });
    

    var apagarIcon = document.createElement("i");
    apagarIcon.className = "fas fa-trash-alt delete-icon";
    apagarIcon.setAttribute("title", "Deletar imagem");
    apagarIcon.addEventListener("click", function (event) {
      //   DELETE IMAGE
      Swal.fire({
        title: "Deletar Imagem",
        text: "Tem certeza de que deseja deletar essa imagem? Uma vez que a mesma for apagada não poderá ser recuperada!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#a8a8a8",
        confirmButtonColor: "#EC1B23",
        confirmButtonText: "Deletar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          let id = event.target.parentNode.parentNode.getAttribute("data-id");
          requestDeteleImage(id);
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
      // VIEW DETAILS OF THE IMAGE
      let containerViewImageModal = document.querySelector(".container-view-image");
      containerViewImageModal.showModal();
    
      var rowIndex = Array.from(tabelaBody.children).indexOf(
        event.target.parentNode.parentNode
      );
    
      // Obtenha a linha selecionada com base na página atual
      var linhaSelecionada = sortedData[rowIndex + currentPage * pageSize];
    
      setDataModal();
    
      let buttonBack = containerViewImageModal
        .querySelector("#button-back")
        .addEventListener("click", closeModal);
    
      function closeModal() {
        containerViewImageModal.close();
      }
    
      function setDataModal() {
        document.getElementById("image-title").innerText =
          linhaSelecionada.titulo_imagem;
        document.getElementById("image-id").innerText =
          "000" + linhaSelecionada.id_imagem;
        document.getElementById("image-description").innerText =
          linhaSelecionada.descricao_imagem;
    
        document.getElementById("image-view").src = "";
    
        let arrDataCriacao = linhaSelecionada.data_criacao.split(" ");
    
        function formatShowData(data) {
          let arr = data.split("-");
          return `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
    
        document.getElementById("image-path").innerText =
          linhaSelecionada.path.replace("../../assets/", "");
        document.getElementById("image-data").innerText =
          formatShowData(arrDataCriacao[0]) + " às " + arrDataCriacao[1];
        document.getElementById("image-view").src =
          linhaSelecionada.path.replace(
            "../../",
            "../../../../WEBSITELINENSE/"
          );
    
        let categoriasSelecionadas = document.querySelectorAll(".categoria");
        categoriasSelecionadas.forEach((categoria) => {
          if (
            categoria.classList.contains(
              `${linhaSelecionada.categoria}-categoria`
            )
          ) {
            categoria.classList.add("selected");
          } else {
            categoria.classList.remove("selected");
          }
        });
      }
    });

    var acoesCell = document.createElement("td");
    acoesCell.classList.add("td-acoes");
    acoesCell.appendChild(editarIcon);
    acoesCell.appendChild(apagarIcon);
    acoesCell.appendChild(viewIcon);

    var idCell = document.createElement("td");
    idCell.classList.add("id");
    var tituloCell = document.createElement("td");
    var descricaoCell = document.createElement("td");
    var categoriaCell = document.createElement("td");
    var caminhoCell = document.createElement("td");
    var dataCell = document.createElement("td");

    idCell.textContent = sortedData[i].id_imagem;
    tituloCell.textContent = sortedData[i].titulo_imagem;
    descricaoCell.textContent = sortedData[i].descricao_imagem;
    categoriaCell.textContent = sortedData[i].categoria;
    caminhoCell.textContent = sortedData[i].path;
    dataCell.textContent = sortedData[i].data_criacao;

    if (descricaoCell.innerText.length > 12) {
      descricaoCell.textContent = descricaoCell.innerText.slice(0, 12) + "...";
    }


    

    if (tituloCell.innerText.length > 15)
      tituloCell.textContent = tituloCell.innerText.slice(0, 15) + "...";

    caminhoCell.textContent = caminhoCell.innerText.replace(
      "../../assets/images/",
      ""
    );

    if (caminhoCell.innerText.length > 18) {
      caminhoCell.textContent = caminhoCell.innerText.slice(0, 12) + "...";
    }

    let arrDataCriacao = dataCell.innerText.split(" ");

    dataCell.textContent =
      formatShowData(arrDataCriacao[0]);

    function formatShowData(data) {
      let arr = data.split("-");
      return `${arr[2]}/${arr[1]}/${arr[0]}`;
    }

    linha.appendChild(idCell);
    linha.appendChild(tituloCell);
    linha.appendChild(descricaoCell);
    linha.appendChild(categoriaCell);
    linha.appendChild(caminhoCell);
    linha.appendChild(dataCell);
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
  currentCategory = document.getElementById("categoria").value;
  currentPage = 0;
  updatePage();
}

// Função para aplicar o filtro com base no título inserido
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
    .getElementById("button-submit-search-images")
    .addEventListener("click", applyTitleFilter);


var buttonAddNewImage = document.querySelector("#button-create-new-image");
buttonAddNewImage.addEventListener("click", showCreateNewImageContainer);

function showCreateNewImageContainer() {
  let list = document.querySelector(".list-images-container");
  list.style.display = "none";
  let container = document.querySelector(".form-create-image-container");
  container.style.display = "block";
}

var buttonShowList = document.querySelector(".button-voltar-icon");
buttonShowList.addEventListener("click", showList);

function showList() {
  let list = document.querySelector(".list-images-container");
  list.style.display = "block";
  let container = document.querySelector(".form-create-image-container");
  container.style.display = "none";
}

var buttonCancelCreateImage = document.querySelector(".button-cancelar");
buttonCancelCreateImage.addEventListener("click", showList);

// REQUESTS

async function requestDeteleImage(id) {
  let url = `http://localhost/WEBSITELINENSE/api/model/imagensController.php?operation=delete&id_imagem=${id}`;
  let req = await fetch(url);

  let data = await req.json();

  console.log(data);

  if (data.type == "success") {
    Swal.fire({
      icon: "success",
      title: "Imagem deletada!",
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



  document.querySelector("#input-search-images").addEventListener("keypress", () => {
      applyTitleFilter();
  });
  
  document.querySelector("#input-search-images").addEventListener("keydown", () => {
    applyTitleFilter();
  });
  
  document.querySelector("#input-search-images").addEventListener("keyup", () => {
    applyTitleFilter();
  });
