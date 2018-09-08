import { DB } from "../db";
import * as MapModel from "../Model/Map";
import * as TerrainModel from "../Model/Terrain";
import * as Section from "../Coordinates/Section";

export const getMap = (db: DB) => (sections: Section.Section[]) => {
  const ids = sections.map(MapModel.sectionToId);
  return db
    .batchGet<MapModel.Map>({
      table: "map",
      queries: ids.map(id => ({ id }))
    })
    .then(existMaps => {
      const notExistIds = ids.filter(id => existMaps.every(x => x.id !== id));
      const newMaps = notExistIds.map(id =>
        MapModel.create({ id, terrain: TerrainModel.generate() })
      );
      return Promise.all(
        newMaps.map(data =>
          db.put({
            table: "map",
            data,
            ifValueNotExists: "id"
          })
        )
      )
        .then(() =>
          db.batchGet<MapModel.Map>({
            table: "map",
            queries: notExistIds.map(id => ({ id }))
          })
        )
        .then(newMaps => [...existMaps, ...newMaps]);
    });
};
