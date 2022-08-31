import {
  addSunChange,
  getLastChange,
} from "../controllers/SunChangeController";
import CONSTANTS from "../constants";
import SunCalc from "suncalc";

const addNextDaySunChanges = async () => {
  // logic to add more sun changes
  const timeNow = new Date();
  const lastSunchange = await getLastChange();

  if (timeNow < lastSunchange?.changeTime) {
    return;
  }

  // get times and angles
  const times = SunCalc.getTimes(
    timeNow,
    CONSTANTS.VANCOUVER_POSITION.lat,
    CONSTANTS.VANCOUVER_POSITION.lon
  );
  const sunrise = {
    changeType: "sunrise",
    changeTime: times.sunrise,
  };

  const sunset = {
    changeType: "sunset",
    changeTime: times.sunset,
  };

  const getAzimuthInDegrees = (rad) => {
    const deg = rad * (180 / Math.PI);
    return Math.round(180 + deg);
  };

  sunrise["angle"] = getAzimuthInDegrees(
    SunCalc.getPosition(
      times.sunrise,
      CONSTANTS.VANCOUVER_POSITION.lat,
      CONSTANTS.VANCOUVER_POSITION.lon
    ).azimuth
  );

  sunset["angle"] = getAzimuthInDegrees(
    SunCalc.getPosition(
      times.sunset,
      CONSTANTS.VANCOUVER_POSITION.lat,
      CONSTANTS.VANCOUVER_POSITION.lon
    ).azimuth
  );

  // save to DB
  await addSunChange(sunrise);
  await addSunChange(sunset);
};

export { addNextDaySunChanges };
