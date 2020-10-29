import {CellType, useGame} from './GameState';
import {useCanvas} from './Canvas';
import {checkPointIntersectsRect, Geom} from "./Geom";

const [canvas, graphics] = useCanvas('game-canvas', 1280, 720);
const {gameState, onClickLeft, onClickRight} = useGame(30, 15);


function calculateCellRect(i: any, j: any): Geom {
    const cellWidth = 30;
    const cellHeight = 30;
    const yOffset = canvas.height / 4;

    return {
        x: parseInt(i, 10) * cellWidth,
        y: yOffset + parseInt(j, 10) * cellHeight,
        width: cellWidth,
        height: cellHeight
    };
}

function onKeyUp(event: KeyboardEvent) {
    function startAlgorithm() {
        console.log('start algorithm!');
    }

    if (event.code === 'Enter') {
        startAlgorithm();
    }
}

let leftMouseDown = false;

function onMouseDown(event: MouseEvent) {
    leftMouseDown = event.button === 0;
}

function onMouseMove(event: MouseEvent) {
    if (leftMouseDown) {
        onClickLeft(true);
    }

    for (const i in gameState.cells) {
        for (const j in gameState.cells[i]) {
            const cellRect = calculateCellRect(i, j);

            if (checkPointIntersectsRect({x: event.clientX, y: event.clientY}, cellRect)) {
                gameState.activeCell = {x: i, y: j};
                return;
            }
        }
    }
}

function onMouseRelease(event: MouseEvent) {
    if (!gameState.activeCell)
        return;

    const {x: activeX, y: activeY} = gameState.activeCell;
    const cell = gameState.cells[activeX][activeY];

    if (event.button === 0) {
        leftMouseDown = false;
        onClickLeft(false);
    } else if (event.button === 2) {
        onClickRight();
    }
}

function onGameRender() {
    graphics.clearRect(0, 0, canvas.width, canvas.height);

    graphics.fillStyle = '#FFFFFF';
    graphics.font = "30px Arial";
    graphics.fillText("Breadth First Search Visualizer", 0, 50, 400);

    graphics.font = "15px Arial";
    graphics.fillText("Left Click: Draw WALL", 0, 70, 400);
    graphics.fillText("Right Click: Draw Start / End", 0, 90, 400);
    graphics.fillText("Press Enter: Start Algorithim", 0, 110, 400);

    for (const i in gameState.cells) {
        for (const j in gameState.cells[i]) {
            const cell = gameState.cells[i][j];
            const cellRect = calculateCellRect(i, j);

            graphics.lineWidth = 1;
            graphics.strokeStyle = '#bbbbc4';
            graphics.strokeRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);

            switch (cell) {
                case CellType.EMPTY:
                    graphics.fillStyle = '#ffffff';
                    break;
                case CellType.BLOCKED:
                    graphics.fillStyle = '#4747ab';
                    break;
            }

            graphics.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);
        }
    }

    if (gameState.start) {
        const cellRect = calculateCellRect(gameState.start.x, gameState.start.y);

        graphics.fillStyle = '#55a555';
        graphics.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);
    }

    if (gameState.end) {
        const cellRect = calculateCellRect(gameState.end.x, gameState.end.y);

        graphics.fillStyle = '#8c2e2e';
        graphics.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);
    }

    if (gameState.activeCell) {
        const cellRect = calculateCellRect(gameState.activeCell.x, gameState.activeCell.y);

        graphics.strokeStyle = '#fdbd14';
        graphics.lineWidth = 3;
        graphics.strokeRect(cellRect.x + 1, cellRect.y + 1, cellRect.width, cellRect.height);
    }

    requestAnimationFrame(onGameRender);
}


requestAnimationFrame(onGameRender);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseRelease);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('keyup', onKeyUp);
