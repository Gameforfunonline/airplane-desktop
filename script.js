// Configurações do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "https://airplane-31582-default-rtdb.firebaseio.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_BUCKET.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const plane = new Image();
plane.src = 'airplane.png'; // Substitua pelo caminho da imagem do avião
const cloud = new Image();
cloud.src = 'cloud.png'; // Substitua pelo caminho da imagem da nuvem

let planeX = canvas.width / 2;
let planeY = canvas.height - 100;
let score = 0;
let clouds = [];
let gameOver = false;
let cloudSpeed = 2;
let moveSpeed = 5;
let keys = {};

async function fetchScores() {
    const snapshot = await db.collection('scores').orderBy('score', 'desc').limit(6).get();
    return snapshot.docs.map(doc => doc.data());
}

async function saveScore(name, score) {
    await db.collection('scores').add({ name, score });
    displayHighscores();
}

function drawPlane() {
    ctx.drawImage(plane, planeX, planeY, 50, 50);
}

function drawClouds() {
    clouds.forEach(cloud => {
        ctx.drawImage(cloud.img, cloud.x, cloud.y, 50, 50);
        cloud.y += cloudSpeed;
        if (cloud.y > canvas.height) {
            cloud.y = -50;
            cloud.x = Math.random() * canvas.width;
            score++;
            document.getElementById('score').innerText = score;
            if (score % 40 === 0) { // Aumenta a velocidade a cada 40 pontos
                cloudSpeed++;
                createClouds(2); // Adiciona mais nuvens
            }
        }
        if (planeX < cloud.x + 50 && planeX + 50 > cloud.x && planeY < cloud.y + 50 && planeY + 50 > cloud.y) {
            gameOver = true;
            let playerName = prompt('Game Over! Insira seu nome:');
            saveScore(playerName, score);
        }
    });
}

function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlane();
    drawClouds();
    updatePlanePosition();
    requestAnimationFrame(gameLoop);
}

function createClouds(amount = 5) {
    for (let i = 0; i < amount; i++) {
        clouds.push({
            img: cloud,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height
        });
    }
}

async function displayHighscores() {
    const highscores = await fetchScores();
    const highscoresList = document.getElementById('highscores');
    highscoresList.innerHTML = '';
    highscores.forEach(score => {
        const li = document.createElement('li');
        li.textContent = `${score.name}: ${score.score}`;
        highscoresList.appendChild(li);
    });
}

function updatePlanePosition() {
    if (keys['ArrowUp']) planeY = Math.max(0, planeY - moveSpeed);
    if (keys['ArrowDown']) planeY = Math.min(canvas.height - 50, planeY + moveSpeed);
    if (keys['ArrowLeft']) planeX = Math.max(0, planeX - moveSpeed);
    if (keys['ArrowRight']) planeX = Math.min(canvas.width - 50, planeX + moveSpeed);
}

document.getElementById('up').addEventListener('mousedown', () => keys['ArrowUp'] = true);
document.getElementById('up').addEventListener('mouseup', () => keys['ArrowUp'] = false);
document.getElementById('up').addEventListener('touchstart', () => keys['ArrowUp'] = true);
document.getElementById('up').addEventListener('touchend', () => keys['ArrowUp'] = false);

document.getElementById('down').addEventListener('mousedown', () => keys['ArrowDown'] = true);
document.getElementById('down').addEventListener('mouseup', () => keys['ArrowDown'] = false);
document.getElementById('down').addEventListener('touchstart', () => keys['ArrowDown'] = true);
document.getElementById('down').addEventListener('touchend', () => keys['ArrowDown'] = false);

document.getElementById('left').addEventListener('mousedown', () => keys['ArrowLeft'] = true);
document.getElementById('left').addEventListener('mouseup', () => keys['ArrowLeft'] = false);
document.getElementById('left').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('left').addEventListener('touchend', () => keys['ArrowLeft'] = false);

document.getElementById('right').addEventListener('mousedown', () => keys['ArrowRight'] = true);
document.getElementById('right').addEventListener('mouseup', () => keys['ArrowRight'] = false);
document.getElementById('right').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('right').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.getElementById('restart').addEventListener('click', () => location.reload());
document.getElementById('close').addEventListener('click', () => window.close());

window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

createClouds();
displayHighscores();
gameLoop();
