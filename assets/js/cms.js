document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
      document.querySelector(".loader-container").classList.add("hidden")
    }, 2000);
});

const buttonMenu = document.querySelector(".navbar_button");

buttonMenu.addEventListener("click", showNavbarSide);
buttonMenu.addEventListener("touchstart", showNavbarSide);

function showNavbarSide(e) {
    if(e.type === "touchstart") e.preventDefault();

    buttonMenu.classList.toggle("active");

    let navbarSide = document.querySelector(".navbar-side");
    navbarSide.classList.toggle("active");
}

$(document).ready(function() {
    function loadMainContent(url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'html',
            success: function(data) {
                $('#main-content').html(data);
            },
            error: function() {
                $('#main-content').html('Erro ao carregar o conteúdo principal.');
            }
        });
    }
    
    // Verifique se há um registro da última página visitada no armazenamento local
    var lastVisitedPage = localStorage.getItem('lastVisitedPage');
    if (lastVisitedPage) {
        loadMainContent(lastVisitedPage);
        // Atualize a classe ativa no menu de navegação
        $('.nav-item').removeClass('nav-item-active');
        $('a[href="' + lastVisitedPage + '"]').closest('.nav-item').addClass('nav-item-active');
    } else {
        // Se não houver registro da última página, carregue a página inicial
        loadMainContent('assets/cms/view/home.php');
    }
    
    $('.nav-item').click(function(e) {
        e.preventDefault();
        $('.nav-item').removeClass('nav-item-active');
        $(this).addClass('nav-item-active');
        var url = $(this).attr('href');
        loadMainContent(url);
        
        // Armazene a página atual como a última página visitada no armazenamento local
        localStorage.setItem('lastVisitedPage', url);
        
        document.querySelector(".loader-container").classList.remove("hidden")
        setTimeout(function() {
            document.querySelector(".loader-container").classList.add("hidden")
          }, 500);
    });
});


