import { getNextChange } from "../controllers/SunChangeController";

import {
  addCloudZone,
  getCloudZonesBySunChange,
} from "../controllers/CloudZoneController";

const addCloudZonesForSunChange = async () => {
  // get sunchange id
  const nextChange = await getNextChange();
  if (!nextChange?.id) {
    return;
  }

  // check zones don't already exist
  const cloudZones = await getCloudZonesBySunChange(nextChange.id);
  if (Array.isArray(cloudZones) && cloudZones.length !== 0) {
    return;
  }

  // calculate geometries
  // home
  const homeZoneGeom = [
    { lat: 49.34864531245275, lon: -123.26147959298012 },
    { lat: 49.34864531245275, lon: -123.03428086475515 },
    { lat: 49.23903770171018, lon: -123.03428086475515 },
    { lat: 49.23903770171018, lon: -123.26147959298012 },
  ];

  // sunsetWindowGeom
  const sunsetWindow = [
    { lat: 49.34864531245275, lon: -123.47541036268585 },
    { lat: 49.34864531245275, lon: -123.26147959298012 },
    { lat: 49.23903770171018, lon: -123.26147959298012 },
    { lat: 49.23903770171018, lon: -123.47541036268585 },
  ];

  // sunriseWindow

  const sunriseWindow = [
    { lat: 49.34864531245275, lon: -123.03428086475515 },
    { lat: 49.34864531245275, lon: -122.87737901231046 },
    { lat: 49.23903770171018, lon: -122.87737901231046 },
    { lat: 49.23903770171018, lon: -123.03428086475515 },
  ];

  const homeZone = {
    sunChangeId: nextChange.id,
    type: "home zone",
    geometry: JSON.stringify(homeZoneGeom),
  };

  const windowZone = {
    sunChangeId: nextChange.id,
    type: "window zone",
    geometry:
      nextChange.changeType === "sunset"
        ? JSON.stringify(sunsetWindow)
        : JSON.stringify(sunriseWindow),
  };

  // save to DB
  await addCloudZone(homeZone);
  await addCloudZone(windowZone);
};

export { addCloudZonesForSunChange };
