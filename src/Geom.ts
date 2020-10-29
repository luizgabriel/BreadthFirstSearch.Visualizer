export interface Rect {
    x: number,
    y: number,
    width: number,
    height: number
}

export interface Point {
    x: number,
    y: number
}

export function checkPointIntersectsRect(point: Point, rect: Rect): boolean {
    return point.x >= rect.x
            && point.y >= point.y
            && point.x <= rect.x + rect.width
            && point.y <= rect.y + rect.height;
}