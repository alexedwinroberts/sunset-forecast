const coordinateCalculator = ({ startPos, distance, bearing }) => {
  const latStart = (startPos.lat * Math.PI) / 180;
  const lonStart = (startPos.lon * Math.PI) / 180;
  const brng = (bearing * Math.PI) / 180;
  const R = 6371;

  const latNew = Math.asin(
    Math.sin(latStart) * Math.cos(distance / R) +
      Math.cos(latStart) * Math.sin(distance / R) * Math.cos(brng)
  );
  const lonNew =
    lonStart +
    Math.atan2(
      Math.sin(brng) * Math.sin(distance / R) * Math.cos(latStart),
      Math.cos(distance / R) - Math.sin(latStart) * Math.sin(latNew)
    );

  return {
    lat: (latNew * 180) / Math.PI,
    lon: (lonNew * 180) / Math.PI,
  };
};

export { coordinateCalculator };
