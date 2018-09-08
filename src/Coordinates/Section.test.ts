import * as Section from "./Section";
import * as Rectangle from "./Rectangle";
import * as Point from "./Point";

describe("intersectedSectionsWithSectionSize(20, 20)", () => {
  const intersectedSections = Section.intersectedSectionsWithSectionSize(
    20,
    20
  );

  test("for rect ((-9, -9), (9, 9))", () => {
    expect(
      intersectedSections(
        Rectangle.create({
          bottomLeft: Point.fromNumber(-9, -9),
          topRight: Point.fromNumber(9, 9)
        })
      )
    ).toEqual([
      Section.create({ position: Point.fromNumber(-20, -20) }),
      Section.create({ position: Point.fromNumber(-20, 0) }),
      Section.create({ position: Point.fromNumber(0, -20) }),
      Section.create({ position: Point.fromNumber(0, 0) })
    ]);
  });

  test("for rect ((1, 1), (19, 19))", () => {
    expect(
      intersectedSections(
        Rectangle.create({
          bottomLeft: Point.fromNumber(1, 1),
          topRight: Point.fromNumber(19, 19)
        })
      )
    ).toEqual([Section.create({ position: Point.fromNumber(0, 0) })]);
  });
});
