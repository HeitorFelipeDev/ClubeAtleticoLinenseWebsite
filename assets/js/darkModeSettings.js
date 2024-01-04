"use strict"

const buttonDarkMode = document.querySelector(".button-dark-mode");
buttonDarkMode.addEventListener("click", changeStatus);

if (localStorage.getItem("darkMode") === null){
    localStorage.setItem("darkMode", "false");
}

checkStatus()

function checkStatus(){
    if (localStorage.getItem("darkMode") === "true"){
        document.body.classList = "dark-mode";
    } else {
        document.body.classList = "";
    }
}

function changeStatus(){                                          
    if (localStorage.getItem("darkMode") === "true"){                 
        localStorage.setItem("darkMode", "false");                  
        document.body.classList = "";
    } else{
        localStorage.setItem("darkMode", "true");                  
        document.body.classList = "dark-mode";
    }
}