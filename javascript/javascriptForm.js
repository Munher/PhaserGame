
var arrayUsuarios = [];

/**
 * Crea el objeto con sus parámetros en el localstorage en forma de json
 */
function datosJugador() {

    var Jugador = function(nombre, apellidos, edad, numeroMedallas, avatar, ciudad, puntuacion) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
        this.numeroMedallas = numeroMedallas;
        this.avatar = avatar;
        this.ciudad = ciudad;
        this.puntuacion = puntuacion;
    }
    
    localStorage.setItem("nombre", $("#nombre").val());
    localStorage.setItem("apellidos", $("#apellidos").val());
    localStorage.setItem("ciudad", $("#ciudades").val());

    var usuario = new Jugador($("#nombre").val(), $("#apellidos").val(), $("#edad").val(), $("#medallas").val(), $(".selected").attr("value"), $("#ciudades").val(), 0);
    arrayUsuarios.push(usuario);
    localStorage.setItem('jsonUsuario', JSON.stringify(arrayUsuarios));
}

/**
 * Cambia la clase al avatar elegido y lo elige
 */
function classChange() {
    $(document).ready(function() {
        $("img").on("click", function() {
            if ($(this).hasClass("noSelected")) {
                $(this).removeClass("noSelected");
                $(this).addClass("selected");
            } 
            else if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
                $(this).addClass("noSelected");
            }
        })
    });
}