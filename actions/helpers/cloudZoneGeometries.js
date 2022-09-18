import { coordinateCalculator } from "./coordinateCalculator";
import { createSingleGrid } from "./createSingleGrid";
import { VANCOUVER_POSITION } from "../../constants";

const homeZoneGeometry = () => {
  const origin = VANCOUVER_POSITION;
  const gridLength = 19;

  const homeZone = createSingleGrid({
    startPos: origin,
    bearing: 0,
    gridType: "home",
    length: gridLength,
    buffer: 0,
  });

  return homeZone;
};

const windowZoneGeometries = (sunAngle) => {
  const origin = VANCOUVER_POSITION;
  const gridRows = 12;
  const gridLength = 19;
  const windowOffset = 20;
  const windowBuffer = (windowOffset - gridLength) / 2;
  const geometries = [];

  let windowStart = coordinateCalculator({
    startPos: origin,
    distance: windowOffset,
    bearing: sunAngle,
  });

  for (let i = 0; i < gridRows; i++) {
    geometries.push(
      createSingleGrid({
        startPos: windowStart,
        bearing: sunAngle,
        gridType: "inner",
        length: gridLength,
        buffer: windowBuffer,
      })
    );
    geometries.push(
      createSingleGrid({
        startPos: windowStart,
        bearing: sunAngle,
        gridType: "outer",
        length: gridLength,
        buffer: windowBuffer,
      })
    );
    windowStart = coordinateCalculator({
      startPos: windowStart,
      distance: windowOffset,
      bearing: sunAngle,
    });
  }

  return geometries;
};

export { homeZoneGeometry, windowZoneGeometries };
