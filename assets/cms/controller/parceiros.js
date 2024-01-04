// CREATE PARCEIRO

var buttonSubmitFormDados = document
  .querySelector(".button-salvar")
  .addEventListener("click", getFormDados);

var idImagem = null;

function getFormDados() {
  let dados = {
    nomeParceiro: document.querySelector("#input-nome-parceiro").value,
    linkParceiro: document.querySelector("#input-link-parceiro").value,
    idImagemSelecionada: idImagem,
  };

  if (dados.idImagemSelecionada === null) {
    dados.idImagemSelecionada = "000";
  }

  console.log(dados);

  let dataForm = new FormData();
  dataForm.append("nome_parceiro", dados.nomeParceiro);
  dataForm.append("link", dados.linkParceiro);
  dataForm.append("id_imagem", dados.idImagemSelecionada);

  let url = `http://localhost/WEBSITELINENSE/api/model/parceiroController.php?operation=create`;

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
      title: "Parceiro adicionado!",
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

  if(data.length > 0) {
    let images = data.filter((item) => item.categoria === "parceiro");
    showImages(images);
  } else {
    showImages([]);
  }

}

function showImages(main) {

  if(main.length == 0) {
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
  
        var buttonCancelCreateParceiro = document.querySelector(".button-cancelar");
        buttonCancelCreateParceiro.addEventListener("click", () => {
          imagem.parentElement.classList.remove("selected");
        });
  
        var buttonVoltarCreateParceiro = document.querySelector(
          ".button-voltar-icon"
        );
        buttonVoltarCreateParceiro.addEventListener("click", () => {
          imagem.parentElement.classList.remove("selected");
        });
        
      });
    });
  }
}

requestImages();

// SHOW PARCEIROS   
requestReadData();

function requestReadData() {
    fetch(
      "http://localhost/WEBSITELINENSE/api/model/parceiroController.php?operation=read"
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
          document.getElementById("sortByCreationDate").addEventListener("click", toggleSortByCreationDate);
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
  
  var tituloFiltrado = document
    .getElementById("input-search-parceiros")
    .value.trim()
    .toLowerCase();
  if (tituloFiltrado !== "") {
    sortedData = sortedData.filter(function (item) {
      return item.nome_parceiro.toLowerCase().includes(tituloFiltrado);
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
      sortOrderByCreationDate *
      (new Date(a.id_parceiro) - new Date(b.id_parceiro))
  );

  var visibleRows = [];

  for (var i = start; i < end && i < sortedData.length; i++) {
    var linha = document.createElement("tr");

    linha.setAttribute("data-id", sortedData[i].id_parceiro);

    var editarIcon = document.createElement("i");
    editarIcon.className = "fas fa-edit edit-icon";
    editarIcon.setAttribute("title", "Editar Parceiro");

    editarIcon.addEventListener("click", function (event) {
      // EDIT-PARCEIRO
      let formEditContainer = document.querySelector(
        ".form-edit-parceiro-container"
      );
      document.querySelector(".list-parceiros-container").style.display = "none";
      formEditContainer.style.display = "block";

      formEditContainer
        .querySelector(".button-voltar-icon")
        .addEventListener("click", () => {
          document.querySelector(".list-parceiros-container").style.display =
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
          document.querySelector(".list-parceiros-container").style.display =
            "block";
          formEditContainer.style.display = "none";
        });

      // set values
      formEditContainer.querySelector("#input-nome-parceiro").value =
        linhaSelecionada.nome_parceiro;
      formEditContainer.querySelector("#input-link-parceiro").value =
        linhaSelecionada.link;

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
            let images = data.filter((item) => item.categoria === "parceiro");
        
            clearImagesEditContainers(); 
            showImagesEdit(images);
          }
        }

      function clearImagesEditContainers() {
        var containers = document.querySelectorAll(".galeria-content-edit");
        containers.forEach((container) => {
          container.innerHTML = ""; 
        });
      }

      function showImagesEdit(main) {
        if(main.length == 0) {
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

      let buttonUploadParceiro = document.querySelector("#button-upload-parceiro");
      buttonUploadParceiro.addEventListener("click", uploadParceiro);

      function uploadParceiro() {
        let dados = {
          idParceiro: linhaSelecionada.id_parceiro,
          nomeParceiro: formEditContainer.querySelector("#input-nome-parceiro").value,
          linkParceiro: formEditContainer.querySelector("#input-link-parceiro").value,
          idImagem: idImagem,
        };
      
        console.log(dados);

        let dataForm = new FormData();
        dataForm.append("id_parceiro", dados.idParceiro);
        dataForm.append("nome_parceiro", dados.nomeParceiro);
        dataForm.append("link", dados.linkParceiro);
        dataForm.append("id_imagem", dados.idImagem);

        let url = `http://localhost/WEBSITELINENSE/api/model/parceiroController.php?operation=update`;
      
        requestUpdateParceiro(url, dataForm);
        console.log(dados);
      }

    });

    var apagarIcon = document.createElement("i");
    apagarIcon.className = "fas fa-trash-alt delete-icon";
    apagarIcon.setAttribute("title", "Deletar Parceiro");
    apagarIcon.addEventListener("click", function (event) {
      //  DELETE PARCEIRO
      Swal.fire({
        title: "Deletar Parceiro",
        text: "Tem certeza de que deseja deletar esse parceiro? Uma vez que o mesmo for deletado não poderá ser recuperado!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#a8a8a8",
        confirmButtonColor: "#EC1B23",
        confirmButtonText: "Deletar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          let id = event.target.parentNode.parentNode.getAttribute("data-id");
          requestDeleteParceiro(id);
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
      // VIEW DETAILS OF THE PARCEIRO
      let containerViewImageModal = document.querySelector(
        ".container-view-parceiro"
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
        containerViewImageModal.querySelector("#id-parceiro").innerText =
          "000" + linhaSelecionada.id_parceiro;
        containerViewImageModal.querySelector("#nome-parceiro").innerText =
          linhaSelecionada.nome_parceiro;
        containerViewImageModal.querySelector("#link-parceiro").innerHTML = linhaSelecionada.link;
 
        containerViewImageModal.querySelector("#id-imagem-parceiro").innerText =
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
    const parceiroImage = 
    containerViewImageModal.querySelector("#parceiro-view-img");

    if (_src && Array.isArray(_src) && _src.length > 0 && _src[0].path) {
      parceiroImage.src = _src[0].path.replace("../../", "");
    } else {
      // Caso o parceiro não tenha uma imagem associada, defina a imagem padrão.
      parceiroImage.src = "http://localhost/WEBSITELINENSE/assets/images/image-default.jpg";
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
    var linkCell = document.createElement("td");

    var anchorLinkCell = document.createElement("a");
    anchorLinkCell.href = sortedData[i].link;
    anchorLinkCell.target = "_blank";
    
    
    idCell.textContent = sortedData[i].id_parceiro;
    nomeCell.textContent = sortedData[i].nome_parceiro;
    anchorLinkCell.textContent = sortedData[i].link;
    if(anchorLinkCell.innerText.length > 30) {
      anchorLinkCell.innerText = anchorLinkCell.innerText.slice(0, 30) + "...";
    }
    linkCell.appendChild(anchorLinkCell); 

   
    

    linha.appendChild(idCell);
    linha.appendChild(nomeCell);
    linha.appendChild(linkCell);
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
  .getElementById("button-submit-search-parceiros")
  .addEventListener("click", applyTitleFilter);

var buttonAddNewParceiro = document.querySelector("#button-create-new-parceiro");
buttonAddNewParceiro.addEventListener("click", showCreateNewParceiroContainer);

function showCreateNewParceiroContainer() {
  let list = document.querySelector(".list-parceiros-container");
  list.style.display = "none";
  let container = document.querySelector(".form-create-parceiro-container");
  container.style.display = "block";
}

var buttonShowList = document.querySelector(".button-voltar-icon");
buttonShowList.addEventListener("click", showList);


function showList() {
  let list = document.querySelector(".list-parceiros-container");
  list.style.display = "block";
  let container = document.querySelector(".form-create-parceiro-container");
  container.style.display = "none";
}

var buttonCancelCreateParceiro = document.querySelector(".button-cancelar");
buttonCancelCreateParceiro.addEventListener("click", () => {
  var selectedImage = document.querySelector(".galeria-content .selected");
  if (selectedImage) {
    selectedImage.classList.remove("selected");
    selectedImage.querySelector(".info-img-create").innerHTML = `
      <p>Clique para <span>selecionar</span> <br> a imagem</p>
    `;
    idImagem = "";
  }
  let list = document.querySelector(".list-parceiros-container");
  list.style.display = "block";
  let container = document.querySelector(".form-create-parceiro-container");
  container.style.display = "none";
});

// ORDER BY ID

var buttonSortByID = document.getElementById("sortByCreationDate");

buttonSortByID.addEventListener("click", function () {
  var rows = document.querySelectorAll("#table-body tr");
  var rowsArray = Array.from(rows);
  var isAscending = buttonSortByID.classList.contains("asc");

  rowsArray.forEach(function (row) {
    row.classList.remove("asc", "desc");
  });

  rowsArray.sort(function (a, b) {
    var idA = parseInt(a.querySelector(".td-min").textContent, 10);
    var idB = parseInt(b.querySelector(".td-min").textContent, 10);

    if (isAscending) {
      return idA - idB;
    } else {
      return idB - idA;
    }
  });

  rowsArray.forEach(function (row) {
    row.classList.add("sorting-animation");
  });

  setTimeout(function () {
    var tableBody = document.getElementById("table-body");

    tableBody.innerHTML = "";

    rowsArray.forEach(function (row) {
      tableBody.appendChild(row);
    });

    rowsArray.forEach(function (row) {
      row.classList.remove("sorting-animation");
    });

    buttonSortByID.classList.toggle("asc");
    buttonSortByID.classList.toggle("desc");
  }, 100);
});

// REQUESTS
async function requestDeleteParceiro(id) {
  let url = `http://localhost/WEBSITELINENSE/api/model/parceiroController.php?operation=delete&id_parceiro=${id}`;
  let req = await fetch(url);

  let data = await req.json();

  console.log(data);

  if (data.type == "success") {
    Swal.fire({
      icon: "success",
      title: "parceiro deletado!",
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

async function requestUpdateParceiro(_url, _dataForm) {
  let req = await fetch(_url, {
    method: "POST",
    body: _dataForm,
  });

  let data = await req.json();

  if (data.type == "success") {
    Swal.fire({
      icon: "success",
      title: "parceiro alterado!",
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
  .querySelector("#input-search-parceiros")
  .addEventListener("keypress", () => {
    applyTitleFilter();
  });

document
  .querySelector("#input-search-parceiros")
  .addEventListener("keydown", () => {
    applyTitleFilter();
  });

document.querySelector("#input-search-parceiros").addEventListener("keyup", () => {
  applyTitleFilter();
});
