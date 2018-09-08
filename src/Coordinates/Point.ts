type PointElement = number; // later, use BigInt

export type Point = { x: PointElement; y: PointElement };

export const origin: Point = { x: 0, y: 0 };

export const fromNumber = (x: number, y: number): Point => ({ x, y });

export const add = (a: Point, b: Point): Point => ({
  x: a.x + b.x,
  y: a.y + b.y
});

export const div = (a: Point, b: Point): Point => ({
  x: Math.floor(a.x / b.x),
  y: Math.floor(a.y / b.y)
});

export const toString = (p: Point): string => `${p.x}_${p.y}`;
