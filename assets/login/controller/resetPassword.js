"use strict";

var token = document.getElementById("div-token").getAttribute("token");

const buttonResetPassword = document.getElementById(
  "button-submit-reset-password"
);
buttonResetPassword.addEventListener("click", changePassword);

function showErrorAlertInput(errorMessage) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    customClass: {
      container: "meu-sweet-alert",
      title: "meu-sweet-alert-title",
      content: "meu-sweet-alert-content",
      confirmButton: "meu-sweet-alert-confirm-button",
    },
    text: errorMessage,
  });
  document.body.classList.contains("swal2-height-auto")
    ? document.body.classList.remove("swal2-height-auto")
    : false;
}

function changePassword() {
  const newPassword = document.getElementById("senha").value;
  const confirmNewPassword = document.getElementById("confirm-senha").value;


  if (!newPassword || !confirmNewPassword) {
    showErrorAlertInput("Há campos não preenchidos!");
  } else if (newPassword != confirmNewPassword) {
    showErrorAlertInput("As senhas são diferentes!");
  } else if (newPassword === confirmNewPassword) {
    requestResetPassword(newPassword);
  }

}

async function requestResetPassword(senha) {
  const url = `http://localhost/websitelinense/api/model/passwordReset/settings/resetPasswordController.php?operation=updatePassword&token=${token}&newPassword=${senha}`;

    const response = await fetch(url);

    const responseData = await response.json();

    if (responseData.type == 1) showSuccessPassword();
    if (responseData.type == 2) showErrorPasswordUpdate();

    console.log(responseData.mensagem)
    return;
}

function showErrorAlert(errorMessage) {
    Swal.fire({
        title: "Erro",
        text: errorMessage,
        icon: "error",
        customClass: {
            container: "meu-sweet-alert",
            title: "meu-sweet-alert-title",
            content: "meu-sweet-alert-content",
            confirmButton: "meu-sweet-alert-confirm-button"
        },
        timer: 4000, 
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
        willClose: () => {
          window.location.href = "../../../../assets/login/view/loginAdm.html";
        }
    });
}

function showSuccessPassword() {
    let timerInterval
    Swal.fire({
      icon: 'success',
      title: 'Senha atualizada com sucesso!',
      customClass: {
        container: 'meu-sweet-alert',
        title: 'meu-sweet-alert-title',
        content: 'meu-sweet-alert-content',
        confirmButton: 'meu-sweet-alert-confirm-button',
      },
      html: 'Você será redirecionado para tela de login',
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
        window.location.href = "../view/loginAdm.html";
      }
    })

    document.body.classList.contains("swal2-height-auto") ? document.body.classList.remove("swal2-height-auto") : false;
}

function showErrorPasswordUpdate() {
    Swal.fire({
        title: "Erro",
        text: "Falha ao atualizar a senha. Tente novamente.",
        icon: "error",
        customClass: {
            container: "meu-sweet-alert",
            title: "meu-sweet-alert-title",
            content: "meu-sweet-alert-content",
            confirmButton: "meu-sweet-alert-confirm-button"
        }
    });
}


