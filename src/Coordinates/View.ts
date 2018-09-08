import * as Point from "./Point";
import * as Rectangle from "./Rectangle";

// Must be odd values
export const VIEW_WIDTH = 19;
export const VIEW_HEIGHT = 19;

export type View = Rectangle.Rectangle;

export const fromPointWithViewSize = (
  viewWidth: number,
  viewHeight: number
) => (point: Point.Point): View =>
  Rectangle.create({
    bottomLeft: Point.add(
      point,
      Point.fromNumber(-Math.floor(viewWidth / 2), -Math.floor(viewWidth / 2))
    ),
    topRight: Point.add(
      point,
      Point.fromNumber(Math.floor(viewHeight / 2), Math.floor(viewHeight / 2))
    )
  });

export const fromPoint = fromPointWithViewSize(VIEW_WIDTH, VIEW_HEIGHT);
