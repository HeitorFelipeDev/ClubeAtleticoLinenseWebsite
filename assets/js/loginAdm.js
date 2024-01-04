"use strict";

document.querySelector("#senha").addEventListener("keypress", (e) => {
    if (e.key === "Enter") submitLogin();
});

const buttonSubmitLogin = document.querySelector("#button-submit-login");
buttonSubmitLogin.addEventListener("click", submitLogin);

async function submitLogin() {
    var user = document.querySelector("#usuario").value;
    let senha = document.querySelector("#senha").value;

    let url = `http://localhost/websitelinense/assets/login/controller/checkLoginAdm.php?operation=login&user_adm=${user}&senha_adm=${senha}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    console.log(data);

    showAlert(data, user);
}

function showAlert(data, user) {
    if (data.type == "error") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            customClass: {
                container: "meu-sweet-alert",
                title: "meu-sweet-alert-title",
                content: "meu-sweet-alert-content",
                confirmButton: "meu-sweet-alert-confirm-button",
            },
            text: data.mensagem,
        });
        document.body.classList.contains("swal2-height-auto")
            ? document.body.classList.remove("swal2-height-auto")
            : false;
    } else {
        let timerInterval;
        Swal.fire({
            icon: "success",
            title: data.mensagem,
            customClass: {
                container: "meu-sweet-alert",
                title: "meu-sweet-alert-title",
                content: "meu-sweet-alert-content",
                confirmButton: "meu-sweet-alert-confirm-button",
            },
            html: "Você será redirecionado para tela principal",
            timer: 4000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                window.location.href = `http://localhost/WEBSITELINENSE/assets/login/controller/checkLoginAdm.php?operation=sendToCms&user_adm=${user}`;
            }
        });

        document.body.classList.contains("swal2-height-auto")
            ? document.body.classList.remove("swal2-height-auto")
            : false;



    }
}

const buttonEsqueceuSenha = document.querySelector("#button-esqueceu-senha");

buttonEsqueceuSenha.addEventListener("click", showMessageSendEmail);

async function showMessageSendEmail() {
    var user = document.querySelector("#usuario").value;

    let url = `http://localhost/WEBSITELINENSE/assets/login/controller/checkLoginAdm.php?operation=userExists&user_adm=${user}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    let data = await response.json();

    if (data.type == "error") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            customClass: {
                container: "meu-sweet-alert",
                title: "meu-sweet-alert-title",
                content: "meu-sweet-alert-content",
                confirmButton: "meu-sweet-alert-confirm-button",
            },
            text: data.mensagem,
        });
        document.body.classList.contains("swal2-height-auto")
            ? document.body.classList.remove("swal2-height-auto")
            : false;
    } else {
        Swal.fire({
            title: "Esqueceu sua senha?",
            text: "Caso você tenha esquecido sua senha, mandaremos um e-mail a você para que possa redefiní-la. Confirma o envio do e-mail?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#91DE91",
            cancelButtonColor: "#EC1B23",
            confirmButtonText: "Enviar no meu e-mail",
        }).then((result) => {
            if (result.isConfirmed) {
                requestSendEmail(user);

                Swal.fire({
                    title: "Solicitação enviada",
                    html: "Mandamos uma mensagem para o e-mail: " + data.email,
                    icon: "success",
                    customClass: {
                        container: "meu-sweet-alert",
                        title: "meu-sweet-alert-title",
                        content: "meu-sweet-alert-content",
                        confirmButton: "meu-sweet-alert-confirm-button-green",
                    },
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Enviar novamente",
                    denyButtonText: `Não tem acesso ao e-mail?`,
                    cancelButtonText: "Fechar",
                }).then((result) => {
                    if (result.isConfirmed) {

                        requestSendEmail(user);

                        Swal.fire({
                            title: "Solicitação reenviada",
                            html: "Reenviamos a mensagem para o e-mail: " + data.email,
                            icon: "success",
                            customClass: {
                                container: "meu-sweet-alert",
                                title: "meu-sweet-alert-title",
                                content: "meu-sweet-alert-content",
                                confirmButton: "meu-sweet-alert-confirm-button-green",
                            },
                        });

                        document.body.classList.contains("swal2-height-auto")
                            ? document.body.classList.remove("swal2-height-auto")
                            : false;



                    } else if (result.isDenied) {
                        Swal.fire({
                            icon: "warning",
                            html: "Caso você não tenha acesso ao seu e-mail, é necessário falar com os administradores do sistema",
                            customClass: {
                                container: "meu-sweet-alert",
                                title: "meu-sweet-alert-title",
                                content: "meu-sweet-alert-content",
                                confirmButton: "meu-sweet-alert-confirm-button",
                            },
                        });
                    }
                });


                document.body.classList.contains("swal2-height-auto")
                    ? document.body.classList.remove("swal2-height-auto")
                    : false;
            }
        });
        document.body.classList.contains("swal2-height-auto")
            ? document.body.classList.remove("swal2-height-auto")
            : false;
    }
}

async function requestSendEmail(_user) {
    let url = `http://localhost/WEBSITELINENSE/api/model/passwordReset/settings/sendEmail.php?username=${_user}&operation=sendEmail`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    let data = await response.json();
    console.log(data.type);
}


