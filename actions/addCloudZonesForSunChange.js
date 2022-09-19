import { getNextChange } from "../controllers/SunChangeController";
import {
  homeZoneGeometry,
  windowZoneGeometries,
} from "./helpers/cloudZoneGeometries";
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

  // cloudzone geometries
  const homeZoneGeom = homeZoneGeometry();
  const windowZoneGeoms = windowZoneGeometries(nextChange.angle);

  const dbPayloads = [];
  dbPayloads.push({
    sunChangeId: nextChange.id,
    type: "home zone",
    geometry: homeZoneGeom,
  });
  for (const zone of windowZoneGeoms) {
    dbPayloads.push({
      sunChangeId: nextChange.id,
      type: "window zone",
      geometry: zone,
    });
  }

  await Promise.all(
    dbPayloads.map((payload) => {
      addCloudZone(payload);
    })
  );
};

export { addCloudZonesForSunChange };
