import { getNextChange } from "../controllers/SunChangeController";
import { getCloudZonesBySunChange } from "../controllers/CloudZoneController";
import { getLatestCloudDataByCloudZone } from "../controllers/CloudDataController";
import { addPrediction } from "../controllers/PredictionController";

const addPredictionForNextSunChange = async () => {
  // get sunchange id
  const nextChange = await getNextChange();
  if (!nextChange?.id) {
    console.log("no sunchange");
    return;
  }

  // get cloud zones
  const cloudZones = await getCloudZonesBySunChange(nextChange.id);
  if (Array.isArray(cloudZones) && cloudZones.length === 0) {
    console.log("no cloudZones");
    return;
  }

  // get latest cloud data
  for (const cloudZone of cloudZones) {
    cloudZone.cloudData = await getLatestCloudDataByCloudZone(cloudZone.id);
  }
  for (const cloudZone of cloudZones) {
    if (!cloudZone.cloudData) {
      console.log("missing cloud data");
      return;
    }
  }

  // make prediction
  const predictionPayload = {
    sunChangeId: nextChange.id,
    value: "poor",
    reason: "there will be mixed cloud conditions",
    predictionMethod: "v0",
  };

  const homeZone = cloudZones.filter((zone) => zone.type === "home zone")[0];
  const windowZones = cloudZones.filter((zone) => zone.type !== "home zone");
  const direction = nextChange.changeType === "sunset" ? "west" : "east";

  // low visibility in home zone - bad
  if (homeZone.cloudData.visibility < 5 || !homeZone.cloudData.visibility) {
    predictionPayload.value = "poor";
    predictionPayload.reason = "there will be low visibility in Vancouver";
  } // high cloud coverage in window - bad
  else if (windowZones[0].cloudData.cloudCover > 50) {
    predictionPayload.value = "poor";
    predictionPayload.reason = `there will be a lot of cloud coverage in the ${direction} blocking sunlight`;
  } // high altitude above homezone and low coverage in window - great
  else if (
    windowZones[0].cloudData.cloudCover < 30 &&
    homeZone.cloudData.cloudBase > 4
  ) {
    predictionPayload.value = "great";
    predictionPayload.reason = `there will be high altitude clouds above Vancouver and few clouds in the ${direction} that could block sunlight`;
  } // low coverage in window and home - nice
  else if (
    homeZone.cloudData.cloudCover < 30 &&
    windowZones[0].cloudData.cloudCover < 30
  ) {
    predictionPayload.value = "nice";
    predictionPayload.reason = "there will be low cloud coverage";
  }

  // save prediction to DB
  await addPrediction(predictionPayload);
};

export { addPredictionForNextSunChange };
