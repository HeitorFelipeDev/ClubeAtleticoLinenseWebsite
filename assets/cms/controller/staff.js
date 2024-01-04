// CREATE STAFF

var buttonSubmitFormDados = document
  .querySelector(".button-salvar")
  .addEventListener("click", getFormDados);

var idImagem = null;
var valorSetado = null;

function getFormDados() {
  let dados = {
    nomeStaff: document.querySelector("#input-nome-staff").value,
    setorStaff: document.querySelector("#input-setor-staff").value,
    funcaoStaff: document.querySelector("#input-funcao-staff").value,
    idImagemSelecionada: idImagem,
  };

  if (dados.idImagemSelecionada === null) {
    dados.idImagemSelecionada = "000";
  }

  console.log(dados);

  let dataForm = new FormData();
  dataForm.append("nome_staff", dados.nomeStaff);
  dataForm.append("setor", dados.setorStaff);
  dataForm.append("funcao", dados.funcaoStaff);
  dataForm.append("id_imagem", dados.idImagemSelecionada);

  let url = `http://localhost/WEBSITELINENSE/api/model/staffController.php?operation=create`;

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
      title: "Staff adicionado!",
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
    let images = data.filter((item) => item.categoria === "staff");
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

        var buttonCancelCreateStaff =
          document.querySelector(".button-cancelar");
        buttonCancelCreateStaff.addEventListener("click", () => {
          imagem.parentElement.classList.remove("selected");
        });

        var buttonVoltarCreateStaff = document.querySelector(
          ".button-voltar-icon"
        );
        buttonVoltarCreateStaff.addEventListener("click", () => {
          imagem.parentElement.classList.remove("selected");
        });
      });
    });
  }
}

requestImages();

// SHOW STAFF
requestReadData();

function requestReadData() {
  fetch(
    "http://localhost/WEBSITELINENSE/api/model/staffController.php?operation=read"
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
      return item.setor === currentCategory;
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
    .getElementById("input-search-staff")
    .value.trim()
    .toLowerCase();
  if (tituloFiltrado !== "") {
    sortedData = sortedData.filter(function (item) {
      return item.nome_staff.toLowerCase().includes(tituloFiltrado);
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
      sortOrderByCreationDate * (new Date(a.id_staff) - new Date(b.id_staff))
  );

  var visibleRows = [];

  for (var i = start; i < end && i < sortedData.length; i++) {
    var linha = document.createElement("tr");

    linha.setAttribute("data-id", sortedData[i].id_staff);

    var editarIcon = document.createElement("i");
    editarIcon.className = "fas fa-edit edit-icon";
    editarIcon.setAttribute("title", "Editar staff");

    editarIcon.addEventListener("click", function (event) {
      // EDIT-IMAGE
      let formEditContainer = document.querySelector(
        ".form-edit-staff-container"
      );
      document.querySelector(".list-staff-container").style.display = "none";
      formEditContainer.style.display = "block";

      formEditContainer
        .querySelector(".button-voltar-icon")
        .addEventListener("click", () => {
          document.querySelector(".list-staff-container").style.display =
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
          document.querySelector(".list-staff-container").style.display =
            "block";
          formEditContainer.style.display = "none";
        });

      // set values
      formEditContainer.querySelector("#input-nome-staff").value =
        linhaSelecionada.nome_staff;

      let optionsSetor = formEditContainer.querySelectorAll(
        ".input-setor-staff-edit option"
      );

      optionsSetor.forEach((op) => {
        if (op.value === linhaSelecionada.setor) {
          valorSetado = op.value;
          formEditContainer.querySelector(".input-setor-staff-edit").value =
            valorSetado;
        }
      });

      for (var cargo in dadosStaff[valorSetado].Cargos) {
    
        let optionCargo = document.createElement("option");
        optionCargo.value = dadosStaff[valorSetado].Cargos[cargo];
        optionCargo.text = dadosStaff[valorSetado].Cargos[cargo];
        document.querySelector(".input-funcao-staff-edit").appendChild(optionCargo);
      }

        let ops = document.querySelectorAll(".input-funcao-staff-edit option");

        ops.forEach((op) => {
            if(op.value == linhaSelecionada.funcao) {
                document.querySelector(".input-funcao-staff-edit").value = op.value;
            }
        });
    

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
          let images = data.filter((item) => item.categoria === "staff");

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
      let buttonUploadstaff = document.querySelector("#button-upload-staff");
      buttonUploadstaff.addEventListener("click", uploadstaff);

      function uploadstaff() {
        let dados = {
          idStaff: linhaSelecionada.id_staff,
          nomeStaff: formEditContainer.querySelector("#input-nome-staff").value,
          setorStaff:
            formEditContainer.querySelector("#input-setor-staff").value,
          funcaoStaff: formEditContainer.querySelector("#input-funcao-staff")
            .value,
          idImagem: idImagem,
        };

        let dataForm = new FormData();
        dataForm.append("id_staff", dados.idStaff);
        dataForm.append("nome_staff", dados.nomeStaff);
        dataForm.append("setor", dados.setorStaff);
        dataForm.append("funcao", dados.funcaoStaff);
        dataForm.append("id_imagem", dados.idImagem);

        console.log(dados.idImagem);
        let url = `http://localhost/WEBSITELINENSE/api/model/staffController.php?operation=update`;

        requestUpdatestaff(url, dataForm);
      }
    });

    var apagarIcon = document.createElement("i");
    apagarIcon.className = "fas fa-trash-alt delete-icon";
    apagarIcon.setAttribute("title", "Deletar staff");
    apagarIcon.addEventListener("click", function (event) {
      //  DELETE staff
      Swal.fire({
        title: "Deletar staff",
        text: "Tem certeza de que deseja deletar esse staff? Uma vez que o mesmo for deletado não poderá ser recuperado!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#a8a8a8",
        confirmButtonColor: "#EC1B23",
        confirmButtonText: "Deletar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          let id = event.target.parentNode.parentNode.getAttribute("data-id");
          requestDetelestaff(id);
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
      // VIEW DETAILS OF THE staff
      let containerViewImageModal = document.querySelector(
        ".container-view-staff"
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
        containerViewImageModal.querySelector("#id-staff").innerText =
          "000" + linhaSelecionada.id_staff;
        containerViewImageModal.querySelector("#nome-staff").innerText =
          linhaSelecionada.nome_staff;
        containerViewImageModal.querySelector("#setor-staff").innerText =
          linhaSelecionada.setor;
        containerViewImageModal.querySelector("#funcao-staff").innerText =
          linhaSelecionada.funcao;

        containerViewImageModal.querySelector("#id-imagem-staff").innerText =
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
          const staffImage =
            containerViewImageModal.querySelector("#staff-view-img");

          if (_src && Array.isArray(_src) && _src.length > 0 && _src[0].path) {
            staffImage.src = _src[0].path.replace("../../", "");
          } else {
            // Caso o staff não tenha uma imagem associada, defina a imagem padrão.
            staffImage.src =
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
    var setorCell = document.createElement("td");
    var funcaoCell = document.createElement("td");

    idCell.textContent = sortedData[i].id_staff;
    nomeCell.textContent = sortedData[i].nome_staff;
    setorCell.textContent = sortedData[i].setor;
    funcaoCell.textContent = sortedData[i].funcao;

    linha.appendChild(idCell);
    linha.appendChild(nomeCell);
    linha.appendChild(setorCell);
    linha.appendChild(funcaoCell);
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
  currentCategory = document.getElementById("setor").value;
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
  .getElementById("button-submit-search-staff")
  .addEventListener("click", applyTitleFilter);

var buttonAddNewstaff = document.querySelector("#button-create-new-staff");
buttonAddNewstaff.addEventListener("click", showCreateNewstaffContainer);

function showCreateNewstaffContainer() {
  let list = document.querySelector(".list-staff-container");
  list.style.display = "none";
  let container = document.querySelector(".form-create-staff-container");
  container.style.display = "block";
}

var buttonShowList = document.querySelector(".button-voltar-icon");
buttonShowList.addEventListener("click", showList);

function showList() {
  let list = document.querySelector(".list-staff-container");
  list.style.display = "block";
  let container = document.querySelector(".form-create-staff-container");
  container.style.display = "none";
}

var buttonCancelCreatestaff = document.querySelector(".button-cancelar");
buttonCancelCreatestaff.addEventListener("click", () => {
  var selectedImage = document.querySelector(".galeria-content .selected");
  if (selectedImage) {
    selectedImage.classList.remove("selected");
    selectedImage.querySelector(".info-img-create").innerHTML = `
      <p>Clique para <span>selecionar</span> <br> a imagem</p>
    `;
    idImagem = "";
  }
  let list = document.querySelector(".list-staff-container");
  list.style.display = "block";
  let container = document.querySelector(".form-create-staff-container");
  container.style.display = "none";
});

// REQUESTS
async function requestDetelestaff(id) {
  let url = `http://localhost/WEBSITELINENSE/api/model/staffController.php?operation=delete&id_staff=${id}`;
  let req = await fetch(url);

  let data = await req.json();

  console.log(data);

  if (data.type == "success") {
    Swal.fire({
      icon: "success",
      title: "staff deletado!",
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

async function requestUpdatestaff(_url, _dataForm) {
  let req = await fetch(_url, {
    method: "POST",
    body: _dataForm,
  });

  let data = await req.json();

  if (data.type == "success") {
    Swal.fire({
      icon: "success",
      title: "staff alterado!",
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
  .querySelector("#input-search-staff")
  .addEventListener("keypress", () => {
    applyTitleFilter();
  });

document
  .querySelector("#input-search-staff")
  .addEventListener("keydown", () => {
    applyTitleFilter();
  });

document.querySelector("#input-search-staff").addEventListener("keyup", () => {
  applyTitleFilter();
});

// SET DATA SETORES E FUNÇÕES

var dadosStaff = {
  Administrativo: {
    Cargos: ["Presidente", "Diretor"],
  },
  "Recursos Humanos": {
    Cargos: [
      "Diretor de Recursos Humanos",
      "Gerente de Recursos Humanos",
      "Especialista em Recrutamento",
      "Analista de Remuneração e Benefícios",
      "Coordenador de Treinamento e Desenvolvimento",
      "Assistente de RH",
      "Analista de Relações Trabalhistas",
      "Especialista em Cultura Organizacional",
    ],
  },
  "Gestao Financeira": {
    Cargos: [
      "Diretor Financeiro (CFO)",
      "Controlador Financeiro",
      "Gerente de Contabilidade",
      "Analista Financeiro",
      "Controller de Custos",
      "Especialista em Planejamento Financeiro",
      "Gerente de Tesouraria",
      "Analista de Crédito e Cobrança",
    ],
  },
  Compras: {
    Cargos: [
      "Diretor de Compras",
      "Gerente de Suprimentos",
      "Analista de Compras",
      "Coordenador de Logística",
      "Especialista em Negociação",
      "Analista de Estoques",
      "Comprador Sênior",
      "Assistente de Compras",
    ],
  },
  "Tecnologia da Informação": {
    Cargos: [
      "Diretor de TI",
      "Gerente de Infraestrutura de TI",
      "Administrador de Banco de Dados",
      "Especialista em Segurança Cibernética",
      "Analista de Suporte Técnico",
      "Desenvolvedor de Software",
      "Administrador de Redes",
      "Especialista em Gerenciamento de Projetos de TI",
    ],
  },
  Marketing: {
    Cargos: [
      "Diretor de Marketing",
      "Gerente de Marketing",
      "Especialista em Mídias Sociais",
      "Analista de Pesquisa de Mercado",
      "Gestor de Publicidade",
      "Coordenador de Eventos",
      "Designer Gráfico",
      "Especialista em Marketing Digital",
    ],
  },
  "Executivo de Futebol": {
    Cargos: [
      "Diretor de Futebol",
      "Gerente de Futebol",
      "Técnico de Futebol",
      "Treinador de Futebol",
      "Analista de Desempenho",
      "Preparador Físico",
      "Assistente Técnico",
      "Coordenador de Categorias de Base",
    ],
  },
};

var setorSelect = document.querySelector(".input-setor-staff");
var cargoSelect = document.querySelector(".input-funcao-staff");
var setorFilter = document.getElementById("setor");
var setorSelectEdit = document.querySelector(".input-setor-staff-edit");
var cargoSelectEdit = document.querySelector(".input-funcao-staff-edit");

for (var setor in dadosStaff) {
  var option = document.createElement("option");
  option.value = setor;
  option.text = setor;
  setorSelect.appendChild(option);
}

for (var setor in dadosStaff) {
  var option = document.createElement("option");
  option.value = setor;
  option.text = setor;
  setorSelectEdit.appendChild(option);
}

var optionSelected = document.createElement("option");
optionSelected.selected = true;
optionSelected.value = "";
optionSelected.text = "Todos";
setorFilter.appendChild(optionSelected);

for (var setor in dadosStaff) {
  var option = document.createElement("option");
  option.value = setor;
  option.text = setor;
  setorFilter.appendChild(option);
}

setorSelect.addEventListener("change", function () {
  var setorSelecionado = setorSelect.value;
  var cargos = dadosStaff[setorSelecionado].Cargos;

  cargoSelect.innerHTML = "";

  cargoSelect.disabled = false;

  for (var i = 0; i < cargos.length; i++) {
    var option = document.createElement("option");
    option.value = cargos[i];
    option.text = cargos[i];
    cargoSelect.appendChild(option);
  }
});

setorSelectEdit.addEventListener("change", function () {
  var setorSelecionado = setorSelectEdit.value;
  var cargos = dadosStaff[setorSelecionado].Cargos;

  cargoSelectEdit.innerHTML = "";

  cargoSelectEdit.disabled = false;

  for (var i = 0; i < cargos.length; i++) {
    var option = document.createElement("option");
    option.value = cargos[i];
    option.text = cargos[i];
    cargoSelectEdit.appendChild(option);
  }
});
