import { getNextChange } from "../controllers/SunChangeController";
import { getLatestPredictionBySunChange } from "../controllers/PredictionController";
import { getCloudZonesBySunChange } from "../controllers/CloudZoneController";
import { getLatestCloudDataByCloudZone } from "../controllers/CloudDataController";
import { VANCOUVER_POSITION } from "../constants";
import { coordinateCalculator } from "../actions/helpers/coordinateCalculator";

const getForecastForNextSunChange = async () => {
  const nextChange = await getNextChange();
  if (!nextChange) {
    console.log("no sunchange");
    return;
  }
  const prediction = await getLatestPredictionBySunChange(nextChange?.id);
  if (!prediction) {
    console.log("no no prediction data");
    return;
  }

  const cloudZones = await getCloudZonesBySunChange(nextChange.id);
  const homeZone = cloudZones.filter((zone) => zone.type === "home zone")[0];
  const homeZoneData = await getLatestCloudDataByCloudZone(homeZone.id);
  const windowZones = cloudZones.filter((zone) => zone.type !== "home zone");
  for (const zone of windowZones) {
    zone.data = await getLatestCloudDataByCloudZone(zone.id);
  }
  const windowZonesRes = [];
  for (const zone of windowZones) {
    windowZonesRes.push({
      geometry: zone.geometry,
      data: {
        visibility: zone.data.visibility,
        cloudBase: zone.data.cloudBase,
        cloudCeiling: zone.data.cloudCeiling,
        cloudCover: zone.data.cloudCover,
      },
    });
  }

  const sunLinePoints = [VANCOUVER_POSITION];
  sunLinePoints.push(
    coordinateCalculator({
      startPos: VANCOUVER_POSITION,
      distance: 200,
      bearing: nextChange.angle,
    })
  );

  return {
    sunChange: {
      changeType: nextChange.changeType,
      changeTime: nextChange.changeTime,
    },
    prediction: {
      value: prediction.value,
      reason: prediction.reason,
    },
    homeZone: {
      geometry: homeZone?.geometry,
      data: {
        visibility: homeZoneData?.visibility,
        cloudBase: homeZoneData?.cloudBase,
        cloudCeiling: homeZoneData?.cloudCeiling,
        cloudCover: homeZoneData?.cloudCover,
      },
    },
    windowZones: windowZonesRes,
    sunLine: sunLinePoints,
  };
};

export { getForecastForNextSunChange };
