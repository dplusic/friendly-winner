import * as R from "ramda";
import * as Rectangle from "./Rectangle";
import * as Point from "./Point";

export const SECTION_WIDTH = 20;
export const SECTION_HEIGHT = 20;

export type Section = {
  position: Point.Point;
};

export const create = ({ position }: { position: Point.Point }) => ({
  position
});

export const intersectedSectionsWithSectionSize = (
  sectionWidth: number,
  sectionHeight: number
) => (rectangle: Rectangle.Rectangle): Section[] => {
  const a = Rectangle.create({
    bottomLeft: Point.div(
      rectangle.bottomLeft,
      Point.fromNumber(sectionWidth, sectionHeight)
    ),
    topRight: Point.div(
      rectangle.topRight,
      Point.fromNumber(sectionWidth, sectionHeight)
    )
  });

  const rangeX = R.range(a.bottomLeft.x, a.topRight.x + 1).map(
    x => x * sectionWidth
  );
  const rangeY = R.range(a.bottomLeft.y, a.topRight.y + 1).map(
    y => y * sectionHeight
  );
  return R.xprod(rangeX, rangeY).map(([x, y]) =>
    create({ position: Point.fromNumber(x, y) })
  );
};

export const intersectedSections = intersectedSectionsWithSectionSize(
  SECTION_WIDTH,
  SECTION_HEIGHT
);
