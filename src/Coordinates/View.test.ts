import * as View from "./View";
import * as Rectangle from "./Rectangle";
import * as Point from "./Point";

describe("getViewWithViewSize(19, 19)", () => {
  const fromPoint = View.fromPointWithViewSize(19, 19);

  test("at (0, 0)", () => {
    expect(fromPoint(Point.origin)).toEqual(
      Rectangle.create({
        bottomLeft: Point.fromNumber(-9, -9),
        topRight: Point.fromNumber(9, 9)
      })
    );
  });
});
