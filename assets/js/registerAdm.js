"use strict";

document.querySelector("#confirmar_senha").addEventListener("keypress", (e) => {
  if (e.key === "Enter") submitRegister();
});

const buttonSubmitRegister = document.querySelector(".button-submit-cadastro");
buttonSubmitRegister.addEventListener("click", submitRegister);

async function submitRegister() {
  let user_adm = document.querySelector("#user_adm").value;
  let email_adm = document.querySelector("#email_adm").value;
  let senha_adm = document.querySelector("#senha_adm").value;
  let confimar_senha_adm = document.querySelector("#confirmar_senha").value;

  const url = `http://localhost/WEBSITELINENSE/api/model/admController.php?operation=create&user_adm=${user_adm}&email_adm=${email_adm}&senha_adm=${senha_adm}&confirmar_senha=${confimar_senha_adm}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  console.log(data);

  showAlert(data);
}

function showAlert(data) {
  if (data.type == 'error') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      customClass: {
        container: 'meu-sweet-alert',
        title: 'meu-sweet-alert-title',
        content: 'meu-sweet-alert-content',
        confirmButton: 'meu-sweet-alert-confirm-button',
      },
      text: data.mensagem
    })
    document.body.classList.contains("swal2-height-auto") ? document.body.classList.remove("swal2-height-auto") : false;
  } else {
    let timerInterval
    Swal.fire({
      icon: 'success',
      title: data.mensagem,
      customClass: {
        container: 'meu-sweet-alert',
        title: 'meu-sweet-alert-title',
        content: 'meu-sweet-alert-content',
        confirmButton: 'meu-sweet-alert-confirm-button',
      },
      html: 'Você será redirecinado para tela de login',
      timer: 4000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
        window.location.href = "http://localhost/WEBSITELINENSE/assets/login/view/loginAdm.html";
      }
    })

    document.body.classList.contains("swal2-height-auto") ? document.body.classList.remove("swal2-height-auto") : false;
  }
}