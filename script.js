const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Adjust canvas size based on window size for mobile responsiveness
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables
const GRAVITY = 0.6;
const FLAP = -12;
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlap = false;
let isGameRunning = false;
let isPaused = false;
let score = 0;
let highestScore = localStorage.getItem('highestScore') || 0;

// Images
const bird = new Image();
bird.src = "https://raw.githubusercontent.com/Auntor-00/FlappyHasina/main/hasina-mgi-png.png"; // Bird image

const background = new Image();
background.src = "https://raw.githubusercontent.com/Auntor-00/FlappyHasina/main/indian-slum-png.png"; // Background image

const poop = new Image();
poop.src = "https://raw.githubusercontent.com/Auntor-00/FlappyHasina/main/shit-png.png"; // Transparent poop emoji

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
let pipeX = canvas.width;
let poopTimer = 0;
let poopVisible = false;
let speedModifier = 1;

// Functions
function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Make the background cover the full canvas
}

function drawBird() {
    ctx.drawImage(bird, 50, birdY, 40, 40); // Bird image positioning
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomHeight, pipeWidth, canvas.height - pipe.bottomHeight);
    });
}

function updatePipes() {
    if (pipeX <= -pipeWidth) {
        pipes.shift();
        pipeX = canvas.width;
    }

    if (pipeX <= canvas.width / 2) {
        pipes.push({
            x: pipeX,
            topHeight: Math.random() * (canvas.height / 2),
            bottomHeight: Math.random() * (canvas.height / 2) + pipeGap
        });
    }

    pipeX -= 2;
}

function showPoop() {
    if (poopVisible) {
        ctx.drawImage(poop, canvas.width / 2, birdY + 10, 30, 30); // Show the poop emoji when visible
    }
}

function updatePoop() {
    poopTimer++;

    if (poopTimer % 60 === 0 && poopTimer / 60 <= 4) {
        poopVisible = true;
    } else if (poopTimer % 60 === 0) {
        poopVisible = false;
    }
}

function slowDown() {
    if (poopVisible) {
        speedModifier = 0.5;
    } else {
        speedModifier = 1;
    }
}

function drawGame() {
    if (isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (birdFlap) {
        birdVelocity = FLAP;
        birdFlap = false;
    }

    birdVelocity += GRAVITY;
    birdY += birdVelocity * speedModifier;

    if (birdY <= 0) birdY = 0;
    if (birdY >= canvas.height - 40) birdY = canvas.height - 40;

    drawBackground();
    drawBird();
    drawPipes();
    updatePipes();
    showPoop();
    updatePoop();
    slowDown();

    requestAnimationFrame(drawGame);
}

// Button Event Listeners
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("pauseButton").addEventListener("click", pauseGame);
document.getElementById("resumeButton").addEventListener("click", resumeGame);
document.getElementById("exitButton").addEventListener("click", exitGame);
document.getElementById("highestScoreButton").addEventListener("click", showHighestScore);

// Start the game
function startGame() {
    isGameRunning = true;
    isPaused = false;
    score = 0;
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes.length = 0;
    poopTimer = 0;
    poopVisible = false;
    speedModifier = 1;

    document.getElementById("startButton").style.display = "none";
    document.getElementById("pauseButton").style.display = "inline-block";
    document.getElementById("exitButton").style.display = "inline-block";
    document.getElementById("highestScoreButton").style.display = "inline-block";
    drawGame();
}

// Pause and Resume Functions
function pauseGame() {
    isPaused = true;
    document.getElementById("resumeButton").style.display = "inline-block";
}

function resumeGame() {
    isPaused = false;
    document.getElementById("resumeButton").style.display = "none";
    drawGame();
}

function exitGame() {
    isGameRunning = false;
    document.getElementById("startButton").style.display = "inline-block";
    document.getElementById("pauseButton").style.display = "none";
    document.getElementById("resumeButton").style.display = "none";
    document.getElementById("exitButton").style.display = "none";
    document.getElementById("highestScoreButton").style.display = "none";
}

function showHighestScore() {
    alert("সর্বোচ্চ স্কোর: " + highestScore);
}

// Keydown Event
document.addEventListener("keydown", () => {
    if (!isGameRunning || isPaused) return;
    birdFlap = true;
});
