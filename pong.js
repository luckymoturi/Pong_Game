const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const replayButton = document.getElementById("replayButton");

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;
const initialBallSpeed = 3;

let playerPaddle = {
    x: 0,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let aiPaddle = {
    x: canvas.width - paddleWidth,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 2
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    dx: initialBallSpeed,
    dy: initialBallSpeed
};

let isGameOver = false;
let animationFrameId;
let touchStartY = 0;
let touchPaddleY = playerPaddle.y;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
canvas.addEventListener("touchstart", touchStartHandler);
canvas.addEventListener("touchmove", touchMoveHandler);
canvas.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
        playerPaddle.dy = -4;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        playerPaddle.dy = 4;
    }
}

function keyUpHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp" || e.key === "Down" || e.key === "ArrowDown") {
        playerPaddle.dy = 0;
    }
}

function touchStartHandler(e) {
    e.preventDefault();
    touchStartY = e.touches[0].clientY;
    touchPaddleY = playerPaddle.y;
}

function touchMoveHandler(e) {
    e.preventDefault();
    const touchCurrentY = e.touches[0].clientY;
    const touchDeltaY = touchCurrentY - touchStartY;
    playerPaddle.y = touchPaddleY + touchDeltaY;
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    } else if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
}

function mouseMoveHandler(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerPaddle.y = mouseY - playerPaddle.height / 2; // Adjust paddle position based on mouse cursor
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    } else if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
}

function drawPaddle(paddle) {
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function movePaddle(paddle) {
    paddle.y += paddle.dy;
    if (paddle.y < 0) {
        paddle.y = 0;
    } else if (paddle.y + paddle.height > canvas.height) {
        paddle.y = canvas.height - paddle.height;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (ball.x + ball.radius > canvas.width) {
        isGameOver = true;
    }

    if (ball.x - ball.radius < 0) {
        isGameOver = true;
    }

    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width && ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx *= -1;
    }

    if (ball.x + ball.radius > aiPaddle.x && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
        ball.dx *= -1;
    }
}

function moveAI() {
    if (aiPaddle.y + aiPaddle.height / 2 < ball.y) {
        aiPaddle.dy = 2;
    } else {
        aiPaddle.dy = -2;
    }
    movePaddle(aiPaddle);
}

function drawGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2);
    replayButton.style.display = "block";
    cancelAnimationFrame(animationFrameId);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isGameOver) {
        drawGameOver();
        return;
    }
    drawPaddle(playerPaddle);
    drawPaddle(aiPaddle);
    drawBall();
}

function update() {
    if (isGameOver) {
        return;
    }
    movePaddle(playerPaddle);
    moveBall();
    moveAI();
}

function gameLoop() {
    update();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function replayGame() {
    isGameOver = false;
    playerPaddle.y = (canvas.height - paddleHeight) / 2;
    aiPaddle.y = (canvas.height - paddleHeight) / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = initialBallSpeed;
    ball.dy = initialBallSpeed;
    replayButton.style.display = "none";
    cancelAnimationFrame(animationFrameId); // Ensure no multiple gameLoop calls
    gameLoop();
}

gameLoop();
