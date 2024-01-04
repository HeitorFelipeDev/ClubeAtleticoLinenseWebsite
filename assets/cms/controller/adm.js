var idAdm;

function openModal() {
  let containerViewModal = document.getElementById("minha-conta-container");
  containerViewModal.classList.add("show");

  fetch(
    "http://localhost/WEBSITELINENSE/api/model/admController.php?operation=read"
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        let primeiroRegistro = data[0];
        idAdm = primeiroRegistro.id_adm;
        setDataModal(
          primeiroRegistro.user_adm,
          primeiroRegistro.email_adm,
          primeiroRegistro.senha_adm
        );
      }
    })
    .catch((error) => console.error("Erro ao obter dados do servidor:", error));
}

function closeModal(modalId) {
  let containerViewModal;
  if (modalId) {
    containerViewModal = document.getElementById(modalId);
  } else {
    containerViewModal = document.getElementById("minha-conta-container");
  }
  containerViewModal.classList.remove("show");
}

function setDataModal(user_adm, email_adm, senha_adm) {
  var senhaOculta = senha_adm.replace(/./g, "*");

  let containerViewModal = document.getElementById("minha-conta-container");
  containerViewModal.querySelector("#input-user-adm").value = user_adm;
  containerViewModal.querySelector("#input-email-adm").value = email_adm;
  containerViewModal.querySelector("#input-senha-adm").value = senhaOculta;
  containerViewModal.querySelector("#input-senha-adm").type = "text";
}

function openEditModal() {
  let containerViewModal = document.getElementById(
    "edit-minha-conta-container"
  );
  containerViewModal.classList.add("show");

  fetch(
    "http://localhost/WEBSITELINENSE/api/model/admController.php?operation=read"
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        let primeiroRegistro = data[0];
        setEditDataModal(
          primeiroRegistro.user_adm,
          primeiroRegistro.email_adm,
          primeiroRegistro.senha_adm
        );
      }
    })
    .catch((error) => console.error("Erro ao obter dados do servidor:", error));
}

function setEditDataModal(user_adm, email_adm, senha_adm) {
  let containerViewModal = document.getElementById(
    "edit-minha-conta-container"
  );
  containerViewModal.querySelector("#edit-input-user-adm").value = user_adm;
  containerViewModal.querySelector("#edit-input-email-adm").value = email_adm;
}

function saveAdminChanges() {
  let userAdm = document.getElementById("edit-input-user-adm").value;
  let emailAdm = document.getElementById("edit-input-email-adm").value;
  let senhaAdm = document.getElementById("edit-input-senha-adm").value;

  console.log(senhaAdm)
  console.log(idAdm)

  let formData = new FormData();
  formData.append("user_adm", userAdm);
  formData.append("email_adm", emailAdm);
  formData.append("senha_adm", senhaAdm);
  formData.append("id_adm", idAdm);

  // Verificar se a senha foi alterada
  fetch(
    "http://localhost/WEBSITELINENSE/api/model/admController.php?operation=read"
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        let primeiroRegistro = data[0];
        let senhaAtual = primeiroRegistro.senha_adm;

        if (senhaAdm === senhaAtual) {
          // Se a senha for a mesma, remover o campo senha_adm dos dados a serem enviados
          formData.delete("senha_adm");
        }

        let url =
          "http://localhost/WEBSITELINENSE/api/model/admController.php?operation=update";
        requestUpdateAdmin(url, formData);
      }
    })
    .catch((error) => console.error("Erro ao obter dados do servidor:", error));
}

async function requestUpdateAdmin(url, formData) {
  let req = await fetch(url, {
    method: "POST",
    body: formData,
  });

  let data = await req.json();

  if (data.type == "success") {
    Swal.fire({
      icon: "success",
      title: "Alteração realizada com sucesso!",
      customClass: {
        container: "meu-sweet-alert",
        title: "meu-sweet-alert-title",
        content: "meu-sweet-alert-content",
        confirmButton: "meu-sweet-alert-confirm-button",
      },
      text: data.message,
    }).then((result) => {
      if (result.isConfirmed) {
        closeModal("edit-minha-conta-container");
        closeModal("minha-conta-container");
        location.reload();
      }
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

function closeEditModal() {
  let containerViewModal = document.getElementById(
    "edit-minha-conta-container"
  );
  if (containerViewModal.classList.contains("show")) {
    containerViewModal.classList.remove("show");
  } else {
    containerViewModal = document.getElementById("minha-conta-container");
    containerViewModal.classList.remove("show");
  }
}

