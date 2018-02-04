/**
 * Crea el menú en la pantalla de juego con datos del jugador y un botón de reiniciar.
 */
function menu() {
    var menu = document.createElement("div");
    menu.id = "menu";
    menu.style.border="1px solid grey";
    menu.style.borderTop="10px solid grey";
    menu.style.padding = "0.5em";

    var espacio = document.createElement("br");
    var name = document.createElement("label");
    name.textContent = "General " + localStorage.getItem("nombre") + " " + localStorage.getItem("apellidos"); 

    var city = document.createElement("label");
    city.textContent = "Ciudad de " + localStorage.getItem("ciudad");
    menu.appendChild(name);
    menu.appendChild(espacio);
    menu.appendChild(city);
    menu.appendChild(document.createElement("br"));

    var boton = document.createElement("input");
    boton.type = "button";
    boton.value="REINICIAR PARTIDA";
    boton.addEventListener("click", reinicia);
    menu.appendChild(boton);

    document.getElementById("body").appendChild(menu);
}

/**
 * Reinicia la partida
 */
function reinicia() {
    location.reload(true);
}
