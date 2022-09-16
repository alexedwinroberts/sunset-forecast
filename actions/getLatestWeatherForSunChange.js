import { getNextChange } from "../controllers/SunChangeController";
import { addCloudData } from "../controllers/CloudDataController";
import { getCloudZonesBySunChange } from "../controllers/CloudZoneController";
import axios from "axios";

const getLatestWeatherForSunChange = async () => {
  // get sunchange id
  const nextChange = await getNextChange();
  if (!nextChange?.id) {
    console.log("no sunchange");
    return;
  }

  // get cloud zones
  const cloudZones = await getCloudZonesBySunChange(nextChange.id);
  if (Array.isArray(cloudZones) && cloudZones.length === 0) {
    return;
  }

  // interval times for API request
  const startTime = new Date(nextChange.changeTime);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  // prepare bodies for API request
  for (const cloudZone of cloudZones) {
    // add polygon for each cloudzone
    const geom = JSON.parse(cloudZone.geometry);
    const poly = [];
    for (const obj of geom) {
      poly.push([obj["lon"], obj["lat"]]);
    }
    poly.push(poly[0]);
    cloudZone.poly = poly;

    cloudZone.requestBody = {
      location: {
        type: "Polygon",
        coordinates: [poly],
      },
      fields: [
        "cloudBaseAvg",
        "cloudCeilingAvg",
        "cloudCoverAvg",
        "visibilityAvg",
      ],
      units: "metric",
      timesteps: ["1h"],
      startTime: startTime,
      endTime: endTime,
    };
  }

  // get weather data
  try {
    const response = await axios.all(
      cloudZones.map((cloudZone) =>
        axios.post(
          `https://api.tomorrow.io/v4/timelines?apikey=${process.env.WEATHER_API_KEY}`,
          cloudZone.requestBody
        )
      )
    );

    for (let i = 0; i < response.length; i++) {
      cloudZones[i].cloudDataIntervals = [
        ...response[i].data.data.timelines[0].intervals,
      ];
    }

    for (const cloudZone of cloudZones) {
      cloudZone.cloudData = cloudZone.cloudDataIntervals.filter(
        (interval) =>
          Math.abs(nextChange.changeTime - new Date(interval.startTime)) <=
          1800000
      )[0];

      cloudZone.dbPayload = {
        cloudZoneId: cloudZone.id,
        visibility: cloudZone.cloudData.values.visibilityAvg,
        cloudBase: cloudZone.cloudData.values.cloudBaseAvg,
        cloudCeiling: cloudZone.cloudData.values.cloudCeilingAvg,
        cloudCover: cloudZone.cloudData.values.cloudCoverAvg,
      };
    }

    await Promise.all(
      cloudZones.map((cloudZone) => {
        addCloudData(cloudZone.dbPayload);
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export { getLatestWeatherForSunChange };
