var escenario;

//Variables para los zombies
var zombies;
var zombie;
var zombieType;
var numZombies = 0;
var contZombies = 0;
var fallenZombies = 0;
var velocidadZombies = 0;

//Variables del cañón y el disparo
var canion, bala, numBalas, disparo, metralla, explosion
var tiempoBala = 0;
var bulletTime = 0;
var hit;

//Variables varias
var controles;
var limiteDificultad = 3;
var dificultad = 0;
var subnivel = 0;
var cont = 0;

//Variables para sonidos y música.
var musica, boom, zom, victory, defeat;

//Límite invisible al que no pueden llegar los zombies
var raya;

//variables varias
var scoreText;
var segundos = 0;
var textoSegundos;

//Según la ciudad, se determinan varios parámetros de configuración
if (localStorage.getItem("ciudad") == "Montreal") {
    dificultad = 3;
    velocidadZombies = -300;
    zombieType = 'zombien1';
} 
else if (localStorage.getItem("ciudad") == "New York") {
    dificultad = 4;
    velocidadZombies = -350;
    zombieType = 'zombien2';
} 
else if (localStorage.getItem("ciudad") == "Pekín") {
    dificultad = 5;
    velocidadZombies = -418;
    zombieType = 'zombien3';
}
else {
    dificultad = 3;
    velocidadZombies = -300;
    zombieType = 'zombien1';
}

//ancho de pantalla 1265 y alto 599. screen.width-130, 599
var game = new Phaser.Game(window.innerWidth-18, 599, Phaser.CANVAS, 'canionVSzombies', { preload: preload, create: create, update: update });

/**
 * Función del framework que carga los recursos que utilizaremos
 */
function preload() {
    game.load.image('background', 'images/Frontyard.jpg');

    game.load.audio('music', 'audio/musica.ogg');
    game.load.audio('boom', 'audio/Shotgun_Blast-Jim_Rogers.ogg');
    game.load.audio('zombie', 'audio/Zombie_Gets_Attacked.ogg');
    game.load.audio('victory', 'audio/Short_triumphal_fanfare-John_Stracke.ogg');

    game.load.image('canion', 'images/canon.gif');
    game.load.image('bala', 'images/disparo.png');

    game.load.spritesheet('zombien1','images/xy.png', 70, 135);
    game.load.spritesheet('zombien2','images/xx.png', 73, 127);
    game.load.spritesheet('zombien3','images/xyx.png', 65, 135);

    game.load.spritesheet('explosion', 'images/explosion.png', 127, 120);
    game.load.spritesheet('hit', 'images/blood_hit.png', 95, 92);
    game.load.image('raya', 'images/raya.png');
}
 
/**
 * Función del framework que crea los elementos
 */
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Carga de algunos recursos
    raya = game.add.sprite(360,80,'raya');
    escenario = game.add.sprite(0, 0, 'background');
    canion = game.add.sprite(250, 180, 'canion');
    bala = game.add.sprite(0, 0, 'bala');

    //Carga grupopara la munición
    metralla = game.add.group();
    metralla.enableBody = true;
    metralla.physicsBodyType = Phaser.Physics.ARCADE;
    metralla.createMultiple(dificultad, 'bala');

    //Dá la física a los elementos
    controles = game.input.keyboard.createCursorKeys();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(canion, Phaser.Physics.ARCADE);  
    game.physics.arcade.enable(escenario, Phaser.Physics.ARCADE);  
    game.physics.arcade.enable(bala, Phaser.Physics.ARCADE);  
    game.physics.arcade.enable(raya, Phaser.Physics.ARCADE);   
    game.physics.arcade.enable(bala);

    //Carga de música y sonidos
    boom = game.add.audio('boom');
    zom = game.add.audio('zombie');
    victory = game.add.audio('victory');
    musica = game.add.audio('music');
    musica.play();

    //Grupo de zombies dependiendo de la condición
    if (numZombies <= dificultad) {
        zombies = game.add.group();
        zombies.enableBody = true;
        zombies.physicsBodyType = Phaser.Physics.ARCADE;
        zombies.createMultiple(dificultad, zombieType);
    }

    disparo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //Texto de puntuación y segundos transcurridos
    scoreText = game.add.text(1010, 5, "Puntuación: "+ fallenZombies, {font:'25px Arial', fill:'white'});
    textoSegundos = game.add.text(1010, 30, 'Segundos: 0', {font: '25px Arial', fill:'white'});

    //Llama a función que actualiza contador
    game.time.events.loop(Phaser.Timer.SECOND, actualizaContador, this);
}

/**
 * Función del framework que se encarga de actualizar el estado del juego y sus elementos.
 */
function update() {

    if (controles.down.isDown && canion.body.y <= 445) {
        canion.body.velocity.y = +140;
    }
    else if (controles.up.isDown && canion.body.y >= 5) {
        canion.body.velocity.y = -140;
    }
    else {
        canion.body.velocity.y = 0;
    }
     
    if (disparo.isDown) {
        disparar();
        game.sound.play('boom');
    }
    
    game.physics.arcade.overlap(zombies, metralla, matarZombie, null, this);
    game.physics.arcade.overlap(zombies, raya, limite, null, this);

    scoreText.text = "Puntuación: " + fallenZombies;
    //timeText.text = game.time.events.loop(Phaser.Timer.SECOND*1, this.suma, this);

    if (numZombies <= dificultad) {
        setInterval(generaZombies, 1);
        numZombies+=1;
    }
}

/**
 * Recibe los grupos de colosión y si se tocan llaman a la función kill() de phaser y quita los elementod que colisionaron
 * @param {Object} zombie 
 * @param {Object} bala 
 */
function matarZombie(zombie, bala){

    hit = game.add.sprite(zombie.x, zombie.y, 'hit');        
    hit.animations.add('right');
    hit.animations.play('right', 150, false, true);

    zom.volume = 3;
    zom.play(); 
    
    zombie.kill();
    bala.kill();
    
    fallenZombies +=1;
  
    setTimeout(compruebaGana, 10);
}

/**
 * Crea los zombies en una posición y empiezan a correr hacia el cañón
 */
function generaZombies() {

    var randomPosition2 = Math.round((Math.random()*420)+12);
    
    if (game.time.now > bulletTime)
    {
        zombie = zombies.getFirstExists(false);

        if (zombie)
        {
            zombie.reset(1155, randomPosition2);
            zombie.body.velocity.x = velocidadZombies;
            bulletTime = game.time.now + 1500;
            zombie.animations.add('avanza', [ 0, 1, 2, 3 ], 7, true);
            zombie.play('avanza');
        }   
    }
}

/**
 * Dispara el cañón y genera un sprite de explosión
 */
function disparar() {
        
    bala = metralla.getFirstExists(false);

    if (game.time.now >= tiempoBala)
    {
        if (bala) {
            explosion = game.add.sprite(canion.body.x + 110, canion.body.y, 'explosion');        
            explosion.animations.add('right');
            explosion.animations.play('right', 100, false, true); 
            bala.reset(canion.body.x + 139, canion.body.y + 65);
            bala.body.velocity.x = +700;
            tiempoBala = game.time.now+800;  
            boom.volume = 0;
            boom.play();
        }
    }
}

/**
 * Genera la ventana de diálogo en caso de que los zomies alcancen la posición del cañón
 */
function limite() {

    modificaPuntuación(fallenZombies);
    game.paused=true;

    $(function() {
        $("#dialogo").dialog({
            open: function(event, ui) {$(".ui-dialog-titlebar-close", ui.dialog).hide();},
            title:"Los zombies han alcanzado tu posición. Has perdido. ¿Jugar de nuevo?",
            width: "50em",
            resizable: false,
            show: {
                 effect: "explode"
            },
            hide: {
                effect: "explode"
            },
            modal:true,
            buttons: {
                "Sí": function() {
                    location.reload(true);
                },
                "No": function() {
                    window.location.href = "index.html";
                }
            }
        })
    })
}

/**
 * Comprueba si se han derrotado a todos los zombies de ese nivel
 */
function compruebaGana() {
    if (fallenZombies == (dificultad * 3)) {

        musica.stop();
        victory.play();
        zombies.destroy(true);
        modificaPuntuación(fallenZombies);
        setTimeout(pausa, 4000);

        $(function() {
            $("#dialogo").dialog({
                open: function(event, ui) {$(".ui-dialog-titlebar-close", ui.dialog).hide();},
                title:"¡Has derrotado a los zombies! " + "Tu puntuación es: " + fallenZombies + " ¿Quieres jugar otra vez?",
                width: "55em",
                resizable: false,
                show: {
                    effect: "explode"
                },
                hide: {
                    effect: "explode"
                },
                modal:true,
                buttons: {
                    "Sí": function() {
                        location.reload(true);
                    },
                    "No. Menú inicial": function() {
                        window.location.href = "index.html";
                    }
                }
            })
        })
    }
}

/**
 * Pausa el juego y reduce el tiempo a  4 segundos que tardó el juego en ser pausado
 */
function pausa() {
    textoSegundos.setText('Segundos: ' + (segundos -=4));
    game.paused = true;
}

/**
 * Va sumando los segundos que permanecesmos en el juego
 */
function actualizaContador() {
    segundos++;
    textoSegundos.setText('Segundos: ' + segundos);
}

/**
 * Crea registro de la partida del usuario o modifica la puntuación obtenida por los usuarios
 * @param {int} puntuacion 
 */
function modificaPuntuación(puntuacion) {
    var arrayUsuarios = JSON.parse(localStorage.getItem('jsonUsuario'));

    arrayUsuarios.forEach(function(jugador) {
        if (jugador.nombre === localStorage.getItem("nombre") && jugador.ciudad === localStorage.getItem("ciudad")) {
            jugador.puntuacion = puntuacion; 
            arrayUsuarios.push(jugador); 
        }
    });

    localStorage.setItem('jsonUsuario', JSON.stringify(arrayUsuarios));
}

