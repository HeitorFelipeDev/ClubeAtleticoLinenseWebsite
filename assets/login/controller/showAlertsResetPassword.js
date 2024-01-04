function showErrorTokenInvalid() {
    Swal.fire({
        title: "Erro",
        text: "A credencial está inválida. Você será redirecionado para a tela de login. Faça uma nova requisição.",
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
                toast.addEventListener("mouseenter", Swal.stopTimer)
                toast.addEventListener("mouseleave", Swal.resumeTimer)
            },
            willClose: () => {
                window.location.href = "../view/loginAdm.html";
            }
    });
}

function showErrorTokenExpired() {
    Swal.fire({
        title: "Erro",
        text: "A credencial está expirada. Você será redirecionado para a tela de login. Faça uma nova requisição.",
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
                toast.addEventListener("mouseenter", Swal.stopTimer)
                toast.addEventListener("mouseleave", Swal.resumeTimer)
            },
            willClose: () => {
                window.location.href = "../view/loginAdm.html";
            }
    });
}

function showErrorMethodInvalid(){
    Swal.fire({
        title: "Método de solicitação inválido.",
        icon: "error",
        customClass: {
            container: "meu-sweet-alert",
            title: "meu-sweet-alert-title",
            content: "meu-sweet-alert-content",
            confirmButton: "meu-sweet-alert-confirm-button"
        },
    });
}

