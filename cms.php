<?php

session_start();

if (isset($_REQUEST['logout'])) {
    session_start();
    session_destroy();
    header('Location: assets/login/controller/logoutAdm.php');
    exit();
}

if (!isset($_SESSION['id_adm'])) {
    header('Location: assets/login/view/loginAdm.html');
    exit();
}

?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clube Atlético Linense | Adminstrador</title>

    <!-- link-css -->
    <link rel="stylesheet" href="./assets/css/cms.css">
    <link rel="stylesheet" href="./assets/css/gallery.css">
    <link rel="stylesheet" href="./assets/css/elenco.css">
    <link rel="stylesheet" href="./assets/css/noticias.css">
    <link rel="stylesheet" href="./assets/css/patrocinadores.css">
    <link rel="stylesheet" href="./assets/css/parceiros.css">
    <link rel="stylesheet" href="./assets/css/staff.css">
    <link rel="stylesheet" href="./assets/css/adm.css">
   
    <!-- script-js -->
    <script src="./assets/js/cms.js" defer></script>
    <script src="./assets/js/darkModeSettings.js" defer></script>

     <!-- SweetAlert -->
     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.0.19/dist/sweetalert2.min.css">

    <!-- font-awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- favicon -->
    <link rel="shortcut icon" href="assets/images/CAL_logo_p.png" type="image/x-icon">
</head>

<body>
    <div class="loader-container">
      <div class="loader"></div>
    </div>
    
    <navbar class="navbar-side">
        <div class="container">
            <a href="assets/cms/view/home.php" class="nav-item nav-item-active">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                    </svg>
                </div>
                <span>Home</span>
            </a>

            <a href="assets/cms/view/galeria.html" class="nav-item">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-images" viewBox="0 0 16 16">
                        <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                        <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
                    </svg>
                </div>
                <span>Galeria</span>
            </a>

            

            <a href="assets/cms/view/noticias.html" class="nav-item">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-newspaper" viewBox="0 0 16 16">
                        <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5v-11zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5H12z" />
                        <path d="M2 3h10v2H2V3zm0 3h4v3H2V6zm0 4h4v1H2v-1zm0 2h4v1H2v-1zm5-6h2v1H7V6zm3 0h2v1h-2V6zM7 8h2v1H7V8zm3 0h2v1h-2V8zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1z" />
                    </svg>
                </div>
                <span>Notícias</span>
            </a>



            <a href="assets/cms/view/staff.html" class="nav-item">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-workspace" viewBox="0 0 16 16">
                        <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z" />
                    </svg>
                </div>
                <span>Staff</span>
            </a>

            <a href="assets/cms/view/elenco.html" class="nav-item">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                    </svg>
                </div>
                <span>Elenco</span>
            </a>

            <a href="assets/cms/view/patrocinadores.html" class="nav-item">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-handshake">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z">
                        </path>
                        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66">
                        </path>
                        <path d="m18 15-2-2"></path>
                        <path d="m15 18-2-2"></path>
                    </svg>
                </div>
                <span>Patrocinador</span>
            </a>

            <a href="assets/cms/view/parceiros.html" class="nav-item">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-handshake">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z">
                        </path>
                        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66">
                        </path>
                        <path d="m18 15-2-2"></path>
                        <path d="m15 18-2-2"></path>
                    </svg>
                </div>
                <span>Parceiro</span>
            </a>
        </div>
    </navbar>

    <header class="header">
        <div class="container">
            <div class="content">
                <img src="./assets/images/CAL_logo_p.png" alt="Clube Atlético Linense" class="logo">
                <div>
                    <h2>Clube Atlético Linense</h2>
                    <span id="sessao">Área do Administrador</span>
                </div>
            </div>
            <div class="assets">
                <button class="button-dark-mode">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-moon" viewBox="0 0 16 16" id="icon-dark-mode">
                        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                    </svg>
                </button>
                <div class="user">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                    </svg>

                    <!-- dropdown-user -->
                    <div class="dropdown-user">
                        <ul class="list">
                            <li class="list-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-gear" viewBox="0 0 16 16">
                                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                                </svg>
                                <a class="button-minha-conta" onclick="openModal()">Minha conta</a>
                            </li>
                            <hr>
                            <li class="list-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                </svg>
                                <a href="">
                                    <form method="post">
                                        <button type="submit" class="button-exit-cms" name="logout">Sair</button>
                                    </form>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <a href="#" class="navbar_button">
                    <span class="bar" id="top"></span>
                    <span class="bar" id="center"></span>
                    <span class="bar" id="bottom"></span>
                </a>
            </div>

        </div>
    </header>

    <main class="main">
        <div class="container" id="main-content">

        </div>
    </main>

    
    <section id="minha-conta-container">
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2>Minha Conta</h2>
                <div class="input-group">
                <div class="input-block">
                    <label for="user_adm">Usuário</label>
                    <input type="text" autocomplete="off" id="input-user-adm" readonly />
                </div>
                <div class="input-block">
                    <label for="email_adm">E-mail</label>
                    <input type="email" autocomplete="off" id="input-email-adm" readonly />
                </div>
                <div class="input-block">
                    <label for="senha_adm">Senha</label>
                    <input type="password" autocomplete="off" id="input-senha-adm" readonly />
                </div>
                </div>
                <div class="input_group i-2">
                <div class="buttons">
                    <button type="submit" class="button-editar" onclick="openEditModal()">Editar</button>
                </div>
                </div>
            </div>
        </div>
    </section>

    <section id="edit-minha-conta-container">
        <div id="editMyModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('edit-minha-conta-container')">&times;</span>
            <h2>Editar Conta</h2>
            <div class="input-group">
                <div class="input-block">
                    <label for="user_adm">Usuário</label>
                    <input type="text" autocomplete="off" id="edit-input-user-adm" />
                </div>
                <div class="input-block">
                    <label for="email_adm">E-mail</label>
                    <input type="email" autocomplete="off" id="edit-input-email-adm" />
                </div>
                <div class="input-block">
                    <label for="senha_adm">Senha</label>
                    <input type="password" placeholder="Nova senha ou sua senha atual" autocomplete="off" id="edit-input-senha-adm" />
                </div>
            </div>
            <div class="input_group i-2">
                <div class="buttons" id="edit-buttons-container">
                    <button type="button" class="button-cancelar" onclick="closeEditModal()">Cancelar</button>
                    <button type="button" class="button-salvar" onclick="saveAdminChanges()">Salvar</button>
                </div>
            </div>
        </div> 
        </div>
    </section>

    
    <script src="./assets/cms/controller/adm.js"></script>
    <script src="assets/js/jquery-3.6.4.js"></script>
</body>

</html>