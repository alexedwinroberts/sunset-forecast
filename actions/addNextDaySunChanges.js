import {
  addSunChange,
  getLastChange,
  getChangesInTimeWindow,
} from "../controllers/SunChangeController";
import { VANCOUVER_POSITION } from "../constants";
import SunCalc from "suncalc";

const addNextDaySunChanges = async () => {
  // logic to add more sun changes
  const timeNow = new Date();
  const windowEnd = new Date(timeNow.getTime() + 24 * 60 * 60 * 1000);

  const nextChanges = await getChangesInTimeWindow(timeNow, windowEnd);

  const findSunrise = nextChanges.filter(
    (change) => change.changeType === "sunrise"
  )[0];
  const findSunset = nextChanges.filter(
    (change) => change.changeType === "sunset"
  )[0];
  if (findSunrise && findSunset) {
    console.log("already have both sun changes");
    return;
  }

  // // get times and angles
  const times = SunCalc.getTimes(
    timeNow,
    VANCOUVER_POSITION.lat,
    VANCOUVER_POSITION.lon
  );
  const timesNextDay = SunCalc.getTimes(
    windowEnd,
    VANCOUVER_POSITION.lat,
    VANCOUVER_POSITION.lon
  );

  const sunrise = {
    changeType: "sunrise",
    changeTime: times.sunrise > timeNow ? times.sunrise : timesNextDay.sunrise,
  };

  const sunset = {
    changeType: "sunset",
    changeTime: times.sunset > timeNow ? times.sunset : timesNextDay.sunset,
  };

  const getAzimuthInDegrees = (rad) => {
    const deg = rad * (180 / Math.PI);
    return Math.round(180 + deg);
  };

  sunrise["angle"] = getAzimuthInDegrees(
    SunCalc.getPosition(
      times.sunrise,
      VANCOUVER_POSITION.lat,
      VANCOUVER_POSITION.lon
    ).azimuth
  );

  sunset["angle"] = getAzimuthInDegrees(
    SunCalc.getPosition(
      times.sunset,
      VANCOUVER_POSITION.lat,
      VANCOUVER_POSITION.lon
    ).azimuth
  );

  // save to DB
  if (!findSunrise) {
    await addSunChange(sunrise);
  }
  if (!findSunset) {
    await addSunChange(sunset);
  }
};

export { addNextDaySunChanges };
