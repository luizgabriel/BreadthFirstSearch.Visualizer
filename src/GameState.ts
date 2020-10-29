import {Point} from './Geom';

export enum CellType {
    EMPTY,
    BLOCKED,
}

export interface GameState {
    cells: CellType[][],
    start?: Point,
    end?: Point,
    activeCell?: Point,
    started: boolean
}

function createDefaultGameState(widthUnits: number, heightUnits: number): GameState {
    return {
        started: false,
        cells: Array.from(Array(widthUnits), (): CellType[] => {
            return Array.from(Array(heightUnits), (): CellType => {
                return CellType.EMPTY;
            });
        }),
    }
}

function setCellType(gameState: GameState, point: Point, type: CellType) {
    gameState.cells[point.x][point.y] = type;
}

function setActiveCellType(gameState: GameState, type: CellType) {
    if (gameState.activeCell)
        setCellType(gameState, gameState.activeCell, type);
}

function onClickLeft(gameState: GameState, hold: boolean) {
    if (!gameState.activeCell)
        return;

    const point = gameState.activeCell;
    const type = gameState.cells[point.x][point.y];

    if (hold)
        setActiveCellType(gameState, CellType.BLOCKED);
    else
        setActiveCellType(gameState, type === CellType.BLOCKED ? CellType.EMPTY : CellType.BLOCKED);
}

function onClickRight(gameState: GameState) {
    if (!gameState.activeCell)
        return;

    const point = gameState.activeCell;

    if (!gameState.start)
        gameState.start = point;
    else if (!gameState.end)
        gameState.end = point;
    else if (gameState.start && gameState.end) {
        gameState.start = point;
        gameState.end = undefined;
    }
}

export function useGame(widthUnits: number, heightUnits: number) {
    const gameState = createDefaultGameState(widthUnits, heightUnits);

    return {
        gameState,
        onClickLeft: (hold: boolean) => onClickLeft(gameState, hold),
        onClickRight: () => onClickRight(gameState),
    };
}