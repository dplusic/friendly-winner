import * as Point from "./Point";

export type Rectangle = {
  bottomLeft: Point.Point;
  topRight: Point.Point;
};

export const create = ({
  bottomLeft,
  topRight
}: {
  bottomLeft: Point.Point;
  topRight: Point.Point;
}): Rectangle => ({
  bottomLeft,
  topRight
});
