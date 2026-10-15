
// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Clase Ball (Pelota)
class Ball {
constructor(x, y, radius, speedX, speedY, color) {
this.x = x;
this.y = y;
this.radius = radius;
this.speedX = speedX;
this.speedY = speedY;
this.color= color;
}


draw() {
ctx.beginPath();
ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
ctx.fillStyle = this.color;
ctx.fill();
ctx.closePath();
}


move() {
this.x += this.speedX;
this.y += this.speedY;
// Colisión con la parte superior e inferior
if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
this.speedY = -this.speedY;
}
}


reset() {
this.x = canvas.width / 2;
this.y = canvas.height / 2;
this.speedX = -this.speedX; // Cambia dirección al resetear
}
}

// Clase Paddle (Paleta)
class Paddle{
constructor(x, y, width, height, isPlayerControlled = false,color) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.isPlayerControlled = isPlayerControlled;
this.speed = 5;
this.color = color;
}


draw() {
ctx.fillStyle = this.color;
ctx.fillRect(this.x, this.y, this.width, this.height);
}


move(direction) {
if (direction === 'up' && this.y > 0) {
this.y -= this.speed;
} else if (direction === 'down' && this.y + this.height < canvas.height) {
this.y += this.speed;
}
}



// Movimiento de la paleta automática (IA)
autoMove(ball) {if (ball.y < this.y + this.height / 2) {
this.y -= this.speed;
} else if (ball.y > this.y + this.height / 2) {
this.y += this.speed;
}
}
}

// Clase Game (Controla el juego)
class Game {

    constructor() {

    this.playerScore = 0;
    this.computerScore = 0;

    this.balls=[    ///XDDDD
            new Ball(400, 150, 8, 3, 2, "#FF5252"),
            new Ball(400, 250, 18, 1, 3, "#FFD740"),
            new Ball(400, 350, 36, 1, -4, "#40C4FF"),
            new Ball(400, 450, 10, -3, 4, "#69F0AE"),
            new Ball(400, 300, 15, 4, 4, "#E040FB")
    ];


////
    this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 200, true,"#4bfff0ff"); // jugador

    this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 150,false,"#bf2300ff"); // CPU
    
    this.keys = {}; // Para capturar las teclas
}

draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.balls.forEach(ball => ball.draw());

    this.paddle1.draw();
    this.paddle2.draw();

    // Contador de puntos
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "JUGADOR: " + this.playerScore,
        200,
        40
    );

    ctx.fillText(
        "COMPUTADORA: " + this.computerScore,
        600,
        40
);

}

update() {
// Movimiento de la paleta 1 (Jugador) controlado por teclas
if (this.keys['ArrowUp']) {
this.paddle1.move('up');
}
if (this.keys['ArrowDown']) {
this.paddle1.move('down');
}
if (this.keys['ArrowLeft']) {
this.paddle1.move('up');
}
if (this.keys['ArrowRight']) {
this.paddle1.move('down');
}
//////////
 // Actualizar cada pelota
        this.balls.forEach(ball => {
            ball.move();

           // Colisión con la paleta del jugador
        if (    ball.speedX < 0 &&
                ball.x - ball.radius <=  this.paddle1.x + this.paddle1.width &&
                ball.x + ball.radius >= this.paddle1.x &&
                ball.y + ball.radius >= this.paddle1.y &&
                ball.y - ball.radius <=
                this.paddle1.y + this.paddle1.height    ) 
            {
                ball.speedX = Math.abs(ball.speedX);
            }

            // Colisión con la paleta de la computadora
        if (    ball.speedX > 0 &&
                ball.x + ball.radius >= this.paddle2.x &&
                ball.x - ball.radius <=
                this.paddle2.x + this.paddle2.width &&
                ball.y + ball.radius >= this.paddle2.y &&
                ball.y - ball.radius <=
                    this.paddle2.y + this.paddle2.height) 
            {
                ball.speedX = -Math.abs(ball.speedX);
            }

            // Si sale por un lateral, regresa al centro
            
        if (ball.x + ball.radius < 0) {
            // La computadora gana un punto
            this.computerScore++;
            ball.reset();
        }

        if (ball.x - ball.radius > canvas.width) {
            // El jugador gana un punto
            this.playerScore++;
            ball.reset();
        }

});

// La computadora sigue la pelota más cercana a su paleta
        let nearestBall = this.balls.reduce((nearest, ball) => {
            if (ball.speedX > 0) {
                if (
                    nearest === null ||
                    ball.x > nearest.x
                ) {
                    return ball;
                }
            }
            return nearest;
        }, null);

        if (nearestBall !== null) {
            this.paddle2.autoMove(nearestBall);
        }



}

// Captura de teclas para el control de la paleta
handleInput() {
window.addEventListener('keydown', (event) => {
this.keys[event.key] = true;
});
window.addEventListener('keyup', (event) => {
this.keys[event.key] = false;
});


}


run() {
this.handleInput();
const gameLoop = () => {
this.update();
this.draw();
requestAnimationFrame(gameLoop);
};
gameLoop();
}


}


// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run(); 