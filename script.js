const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const airplane = new Image();
airplane.src = 'airplane.png';
const cloudImage = new Image();
cloudImage.src = 'cloud.png';
const collisionSound = new Audio('collision.mp3');

let airplaneX = 100;
let airplaneY = 200;
let speed = 2;
let score = 0;
let level = 1;
let clouds = [];
let gameOver = false;

const airplaneWidth = 50;
const airplaneHeight = 50;
const reducedAirplaneWidth = airplaneWidth * 0.9;
const reducedAirplaneHeight = airplaneHeight * 0.9;

// Carregar os seis melhores scores do localStorage
let highScores = JSON.parse(localStorage.getItem('highScores')) || [
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 }
];

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        airplaneY -= 15; // Aumentar a velocidade do movimento para cima
    } else if (event.key === 'ArrowDown') {
        airplaneY += 15; // Aumentar a velocidade do movimento para baixo
    } else if (event.key === 'ArrowLeft') {
        airplaneX -= 15; // Aumentar a velocidade do movimento para trás
    } else if (event.key === 'ArrowRight') {
        airplaneX += 15; // Aumentar a velocidade do movimento para frente
    } else if (event.key === ' ') {
        if (gameOver) {
            resetGame();
        }
    }
});

function addCloud() {
    const cloud = {
        x: canvas.width,
        y: Math.random() * canvas.height,
        width: 50,
        height: 50
    };
    clouds.push(cloud);
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(airplane, airplaneX, airplaneY, reducedAirplaneWidth, reducedAirplaneHeight);

    // Desenhar pontuação
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, canvas.width - 100, 30);

    // Desenhar os seis melhores scores
    ctx.fillText('High Scores:', 10, 30);
    highScores.forEach((record, index) => {
        ctx.fillText(`${index + 1}. ${record.name}: ${record.score}`, 10, 60 + index * 30);
    });

    if (Math.random() < 0.02) {
        addCloud();
    }

    clouds.forEach((cloud, index) => {
        cloud.x -= speed;
        ctx.drawImage(cloudImage, cloud.x, cloud.y, cloud.width, cloud.height);

        if (cloud.x + cloud.width < 0) {
            clouds.splice(index, 1);
            score++;
            if (score % 50 === 0) {
                level++;
                speed += 1;
            }
        }

        if (
            airplaneX < cloud.x + cloud.width &&
            airplaneX + reducedAirplaneWidth > cloud.x &&
            airplaneY < cloud.y + cloud.height &&
            airplaneY + reducedAirplaneHeight > cloud.y
        ) {
            gameOver = true;
            collisionSound.play();
            const playerName = prompt('Game Over! Score: ' + score + '\nDigite seu nome:');
            updateHighScores(playerName, score);
            alert('Pressione a tecla de espaço para reiniciar.');
        }
    });

    requestAnimationFrame(update);
}

function updateHighScores(name, score) {
    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 6);
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function resetGame() {
    airplaneX = 100;
    airplaneY = 200;
    speed = 2;
    score = 0;
    level = 1;
    clouds = [];
    gameOver = false;
    update();
}

airplane.onload = () => {
    console.log('Airplane image loaded');
    update();
};

cloudImage.onload = () => {
    console.log('Cloud image loaded');
};
