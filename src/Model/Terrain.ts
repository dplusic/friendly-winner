import * as R from "ramda";
import { $enum } from "ts-enum-util";
import * as Section from "../Coordinates/Section";

export enum TerrainType {
  Land,
  Water
}
export const wrappedTerrainType = $enum(TerrainType);

export type Terrain = TerrainType[][];

export const generate = (): Terrain =>
  R.range(0, Section.SECTION_HEIGHT).map(() =>
    R.range(0, Section.SECTION_WIDTH).map(
      () =>
        wrappedTerrainType.getValues()[
          Math.floor(Math.random() * wrappedTerrainType.length)
        ]
    )
  );
