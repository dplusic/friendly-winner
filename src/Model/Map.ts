import * as Terrain from "./Terrain";
import * as Structure from "./Structure";
import * as Section from "../Coordinates/Section";
import * as Point from "../Coordinates/Point";

type Version = number; // later, use BigInt

export type Map = {
  id: string;
  terrain: Terrain.Terrain;
  structures: [Point.Point, Structure.Structure][];
  version: Version;
};

export const sectionToId = (section: Section.Section): string =>
  Point.toString(section.position);

export const create = ({
  id,
  terrain
}: {
  id: string;
  terrain: Terrain.Terrain;
}): Map => ({
  id,
  terrain,
  structures: [],
  version: 0
});
