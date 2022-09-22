import { addNextDaySunChanges } from "./addNextDaySunChanges";
import { addCloudZonesForSunChange } from "./addCloudZonesForSunChange";
import { getLatestWeatherForSunChange } from "./getLatestWeatherForSunChange";
import { addPredictionForNextSunChange } from "./addPredictionForNextSunChange";

const initForecast = async () => {
  await addNextDaySunChanges();
  await addCloudZonesForSunChange();
  await getLatestWeatherForSunChange();
  await addPredictionForNextSunChange();
};

export { initForecast };
