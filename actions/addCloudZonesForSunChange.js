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
    [49.4072334489827, -123.42884056629285],
    [49.4072334489827, -122.8980586699725],
    [49.136423375185025, -122.8980586699725],
    [49.136423375185025, -123.42884056629285],
  ];

  // sunsetWindowGeom
  const sunsetWindow = [
    [49.40118201813296, -126.96690649642822],
    [49.41438324143594, -123.71932028448745],
    [49.079099490898, -123.4697213464307],
    [48.25930435754537, -126.66611826951721],
  ];

  // sunriseWindow

  const sunriseWindow = [
    [49.436569778485016, -122.86837962635265],
    [49.65322518347002, -120.79849392585172],
    [48.72770102443615, -120.91424547886557],
    [49.06997914116475, -122.88868502836283],
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
