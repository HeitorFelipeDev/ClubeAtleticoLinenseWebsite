"use strict"

// VER SENHA
const buttonVerSenha = document.querySelector("#button-ver-senha");
buttonVerSenha.addEventListener("click", () => {
    let inputSenha = document.querySelector(".senha");

    if (inputSenha.type === "password") {
        inputSenha.type = "text";
        buttonVerSenha.classList.replace("fa-eye-slash", "fa-eye");
    } else {
        inputSenha.type = "password";
        buttonVerSenha.classList.replace("fa-eye", "fa-eye-slash");
    }
})