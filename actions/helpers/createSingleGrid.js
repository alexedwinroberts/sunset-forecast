import { coordinateCalculator } from "./coordinateCalculator";

const createSingleGrid = ({ startPos, bearing, gridType, length, buffer }) => {
  const grid = [];
  // use grid type and buffer / orthogonal to get first point
  let point1 = coordinateCalculator({ startPos, distance: buffer, bearing });
  if (gridType === "inner") {
    point1 = coordinateCalculator({
      startPos: point1,
      distance: buffer + length,
      bearing: getOrthogonal(bearing),
    });
  }
  if (gridType === "outer") {
    point1 = coordinateCalculator({
      startPos: point1,
      distance: buffer,
      bearing: getNegative(getOrthogonal(bearing)),
    });
  }
  if (gridType === "home") {
    point1 = coordinateCalculator({
      startPos,
      distance: length / 2,
      bearing: getNegative(bearing),
    });
    point1 = coordinateCalculator({
      startPos: point1,
      distance: length / 2,
      bearing: getOrthogonal(bearing),
    });
  }
  grid.push(point1);

  // use bearing to get 2nd point
  const point2 = coordinateCalculator({
    startPos: point1,
    distance: length,
    bearing,
  });
  grid.push(point2);

  // use ortho to get 3rd point
  const point3 = coordinateCalculator({
    startPos: point2,
    distance: length,
    bearing: getNegative(getOrthogonal(bearing)),
  });
  grid.push(point3);

  // use negative bearing to get 4th point
  const point4 = coordinateCalculator({
    startPos: point3,
    distance: length,
    bearing: getNegative(bearing),
  });
  grid.push(point4);

  return grid;
};

const getOrthogonal = (angle) => {
  return angle - 90 >= 0 ? angle - 90 : 360 + (angle - 90);
};

const getNegative = (angle) => {
  return angle - 180 >= 0 ? angle - 180 : angle + 180;
};

export { createSingleGrid };
