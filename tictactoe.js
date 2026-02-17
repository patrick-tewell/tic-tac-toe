// ...existing code...
let animationFrameId = null;

function animateBackground() {
    // Remove any existing animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    let canvas = document.getElementById('bg-x-canvas');
    if (!canvas) {
        drawXBackground();
        canvas = document.getElementById('bg-x-canvas');
    }
    let showingX = true;
    let fade = 1;
    let fadingOut = true;
    const fadeStep = 0.01;
    let offsetX = 0;
    let offsetY = 0;
    const moveSpeed = 0.7; // px per frame
    function step() {
        // Move offset down and left
        offsetX -= moveSpeed;
        offsetY += moveSpeed;
        // Wrap offset to keep it in [0, tile*4)
        const dpr = window.devicePixelRatio || 1;
        const tile = 80 * dpr;
        offsetX = ((offsetX % (tile * 4)) + (tile * 4)) % (tile * 4);
        offsetY = ((offsetY % (tile * 4)) + (tile * 4)) % (tile * 4);
        if (showingX) {
            drawXBackground.offset = {x: offsetX, y: offsetY};
            drawXBackground();
        } else {
            drawOBackground.offset = {x: offsetX, y: offsetY};
            drawOBackground();
        }
        if (fadingOut) {
            fade -= fadeStep;
            if (fade <= 0) {
                fade = 0;
                fadingOut = false;
                showingX = !showingX;
            }
        } else {
            fade += fadeStep;
            if (fade >= 1) {
                fade = 1;
                fadingOut = true;
            }
        }
        canvas.style.opacity = fade;
        animationFrameId = requestAnimationFrame(step);
    }
    step();
}

function drawXBackground() {
    let canvas = document.getElementById('bg-x-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bg-x-canvas';
        document.body.prepend(canvas);
    }
    const ctx = canvas.getContext('2d');
    // Set canvas size to viewport
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // X pattern settings
    const tile = 80 * dpr;
    const xColor = '#4682B4';
    const bgColor = '#001524';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let row = 0;
    const offset = drawXBackground.offset || {x: 0, y: 0};
    for (let y = -tile * 4 + offset.y; y < canvas.height + tile * 4; y += tile * 2, row++) {
        for (let x = -tile * 4 + offset.x; x < canvas.width + tile * 4; x += tile * 4) {
            if (row % 2 === 0) {
                drawX(ctx, x + tile, y + tile / 2, tile * 0.7, xColor, dpr);
            } else {    
                drawX(ctx, x + tile + (tile * 2), y + tile / 2, tile * 0.7, xColor, dpr);
            }
        }
    }
}

function drawOBackground() {
    let canvas = document.getElementById('bg-x-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bg-x-canvas';
        document.body.prepend(canvas);
    }
    const ctx = canvas.getContext('2d');
    // Set canvas size to viewport
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // O pattern settings
    const tile = 80 * dpr;
    const xColor = '#4682B4';
    const bgColor = '#001524';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let row = 0;
    const offset = drawOBackground.offset || {x: 0, y: 0};
    for (let y = -tile * 4 + offset.y; y < canvas.height + tile * 4; y += tile * 2, row++) {
        for (let x = -tile * 4 + offset.x; x < canvas.width + tile * 4; x += tile * 4) {
            if (row % 2 === 0) {
                drawO(ctx, x + tile, y + tile / 2, tile * 0.7, xColor, dpr);
            } else {    
                drawO(ctx, x + tile + (tile * 2), y + tile / 2, tile * 0.7, xColor, dpr);
            }
        }
    }
}

function drawX(ctx, cx, cy, size, color, dpr) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4 * dpr;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - size / 2, cy - size / 2);
    ctx.lineTo(cx + size / 2, cy + size / 2);
    ctx.moveTo(cx + size / 2, cy - size / 2);
    ctx.lineTo(cx - size / 2, cy + size / 2);
    ctx.stroke();
    ctx.restore();
}

function drawO(ctx, cx, cy, size, color, dpr) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4 * dpr;
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
}

window.addEventListener('resize', () => {
    const canvas = document.getElementById('bg-x-canvas');
    if (canvas) canvas.remove();
    animateBackground();
});
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-x-canvas');
    if (canvas) canvas.remove();
    animateBackground();
});

// Set up variables

let inputButton = document.getElementsByClassName("buttonSquare");
let winnerDisplay = document.getElementById("winner");
let gridDisplay = document.getElementById("grid");
let scoreXDisplay = document.getElementById("scoreX");
let scoreODisplay = document.getElementById("scoreO");
let inputSquare;
let count = 0;
let winningX = [];
let winningO = [];
let gameOver = false;
let readyToReset = false;
let scoreX = 0;
let scoreO = 0;

// Winning sets:

const leftVerticalWinner = ["TL", "ML", "BL"];
const midVerticalWinner = ["TM", "MM", "BM"];
const rightVerticalWinner = ["TR", "MR", "BR"];

const topHorizontalWinner = ["TL", "TM", "TR"];
const midHorizontalWinner = ["ML", "MM", "MR"];
const botHorizontalWinner = ["BL", "BM", "BR"];

const leftDiagonalWinner = ["TL", "MM", "BR"];
const rightDiagonalWinner = ["TR", "MM", "BL"];

// Add click events to each playable button

for (let i = 0; i < inputButton.length; i++) {
    inputButton[i].addEventListener("click", () => {
        if (gameOver) {
            return;
        }
        inputSquare = inputButton[i].value;
        markSquare(inputSquare);
        checkWinner();
    });
}

document.addEventListener("click", () => {
    if (gameOver && readyToReset) {
        resetGame();
    }
});

// Mark square with either X or O and update variables for next turn

function markSquare(inputSquare) {
    let input = inputSquare.slice(2);

    if (document.getElementById(inputSquare).innerHTML === "") {
        if (count % 2 === 0) {
            document.getElementById(inputSquare).innerHTML = `<div class="X X-${input}"><div class="X-left"><div class="X-right"></div></div></div>`;
            gridDisplay.style.setProperty('--grid-frame-color', '#CFFFB3');
            winningX.push(input);
        } else {
            document.getElementById(inputSquare).innerHTML = `<div class="O O-${input}"><div class="O-outer"><div class="O-inner"></div></div></div>`;
            gridDisplay.style.setProperty('--grid-frame-color', '#A63D40');
            winningO.push(input); 
        };
        count++;
    };  
};

function checkWinner() {
    if (
        leftVerticalWinner.every(element => winningX.includes(element)) ||
        midVerticalWinner.every(element => winningX.includes(element)) ||
        rightVerticalWinner.every(element => winningX.includes(element)) ||
        topHorizontalWinner.every(element => winningX.includes(element)) ||
        midHorizontalWinner.every(element => winningX.includes(element)) ||
        botHorizontalWinner.every(element => winningX.includes(element)) ||
        leftDiagonalWinner.every(element => winningX.includes(element)) ||
        rightDiagonalWinner.every(element => winningX.includes(element))
    ) {
        winnerDisplay.innerHTML = "X WINS!";
        winnerDisplay.style.color = '#A63D40';
        gridDisplay.style.setProperty('--grid-frame-color', '#A63D40');
        gridDisplay.classList.add('is-finished');
        scoreX += 1;
        scoreXDisplay.textContent = scoreX;
        gameOver = true;
        readyToReset = false;
        // Find which set won
        let winSet = null;
        if (leftVerticalWinner.every(element => winningX.includes(element))) winSet = leftVerticalWinner;
        else if (midVerticalWinner.every(element => winningX.includes(element))) winSet = midVerticalWinner;
        else if (rightVerticalWinner.every(element => winningX.includes(element))) winSet = rightVerticalWinner;
        else if (topHorizontalWinner.every(element => winningX.includes(element))) winSet = topHorizontalWinner;
        else if (midHorizontalWinner.every(element => winningX.includes(element))) winSet = midHorizontalWinner;
        else if (botHorizontalWinner.every(element => winningX.includes(element))) winSet = botHorizontalWinner;
        else if (leftDiagonalWinner.every(element => winningX.includes(element))) winSet = leftDiagonalWinner;
        else if (rightDiagonalWinner.every(element => winningX.includes(element))) winSet = rightDiagonalWinner;
        if (winSet) drawWinningLine('X', winSet);
        setTimeout(() => {
            readyToReset = true;
        }, 0);
    } else if (
        leftVerticalWinner.every(element => winningO.includes(element)) ||
        midVerticalWinner.every(element => winningO.includes(element)) ||
        rightVerticalWinner.every(element => winningO.includes(element)) ||
        topHorizontalWinner.every(element => winningO.includes(element)) ||
        midHorizontalWinner.every(element => winningO.includes(element)) ||
        botHorizontalWinner.every(element => winningO.includes(element)) ||
        leftDiagonalWinner.every(element => winningO.includes(element)) ||
        rightDiagonalWinner.every(element => winningO.includes(element))
    ) {
        winnerDisplay.innerHTML = "O WINS!";
        winnerDisplay.style.color = '#CFFFB3';
        gridDisplay.style.setProperty('--grid-frame-color', '#CFFFB3');
        gridDisplay.classList.add('is-finished');
        scoreO += 1;
        scoreODisplay.textContent = scoreO;
        gameOver = true;
        readyToReset = false;
        // Find which set won
        let winSet = null;
        if (leftVerticalWinner.every(element => winningO.includes(element))) winSet = leftVerticalWinner;
        else if (midVerticalWinner.every(element => winningO.includes(element))) winSet = midVerticalWinner;
        else if (rightVerticalWinner.every(element => winningO.includes(element))) winSet = rightVerticalWinner;
        else if (topHorizontalWinner.every(element => winningO.includes(element))) winSet = topHorizontalWinner;
        else if (midHorizontalWinner.every(element => winningO.includes(element))) winSet = midHorizontalWinner;
        else if (botHorizontalWinner.every(element => winningO.includes(element))) winSet = botHorizontalWinner;
        else if (leftDiagonalWinner.every(element => winningO.includes(element))) winSet = leftDiagonalWinner;
        else if (rightDiagonalWinner.every(element => winningO.includes(element))) winSet = rightDiagonalWinner;
        if (winSet) drawWinningLine('O', winSet);
        setTimeout(() => {
            readyToReset = true;
        }, 0);
    } else if (count === 9) {
        winnerDisplay.innerHTML = 'Draw!';
        winnerDisplay.style.color = '#C8963E';
        gridDisplay.style.setProperty('--grid-frame-color', '#C8963E');
        gridDisplay.classList.add('is-finished');
        gameOver = true;
        readyToReset = false;
        removeWinningLine();
        setTimeout(() => {
            readyToReset = true;
        }, 0);
    };
}

function resetGame() {
    removeWinningLine(); // Remove winning line immediately
    count = 0;
    winningX = [];
    winningO = [];
    gameOver = false;
    readyToReset = false;

    gridDisplay.style.setProperty('--grid-frame-color', '#15616D');
    gridDisplay.classList.remove('is-finished');
    winnerDisplay.innerHTML = '';

    for (const square of inputButton) {
        square.innerHTML = '';
    }
}

function drawWinningLine(winner, squares) {
    let canvas = document.getElementById('winning-line-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'winning-line-canvas';
        canvas.style.position = 'absolute';
        canvas.style.left = '-10px';
        canvas.style.top = '-10px';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '10';
        document.body.appendChild(canvas);
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Get DOM positions of first and last winning square
    const first = document.getElementById('B-' + squares[0]);
    const last = document.getElementById('B-' + squares[2]);
    if (!first || !last) return;
    const rect1 = first.getBoundingClientRect();
    const rect2 = last.getBoundingClientRect();
    // Center points
    const x1 = (rect1.left + rect1.width / 2) * dpr;
    const y1 = (rect1.top + rect1.height / 2) * dpr;
    const x2 = (rect2.left + rect2.width / 2) * dpr;
    const y2 = (rect2.top + rect2.height / 2) * dpr;
    ctx.save();
    ctx.strokeStyle = winner === 'X' ? '#A63D40' : '#CFFFB3';
    ctx.lineWidth = 10 * dpr;
    ctx.lineCap = 'round';
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 16 * dpr;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

function removeWinningLine() {
    const canvas = document.getElementById('winning-line-canvas');
    if (canvas) canvas.remove();
}