import { getNextChange } from "../controllers/SunChangeController";
import { addCloudData } from "../controllers/CloudDataController";
import { getCloudZonesBySunChange } from "../controllers/CloudZoneController";
import axios from "axios";
import Bottleneck from "bottleneck";

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
    // Tomorrow.io needs lat lon to be flipped
    const geom = cloudZone.geometry;
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
    const limiter = new Bottleneck({
      minTime: 340, //minimum time between requests
      maxConcurrent: 1, //maximum concurrent requests
    });

    function scheduleRequest(endpoint, payload, zoneId) {
      return limiter.schedule(() => {
        return axios.post(endpoint, payload).then((resp) => {
          return {
            zoneId,
            response: resp.data,
          };
        });
      });
    }

    const cloudPromises = cloudZones.map((cloudZone) => {
      let endpoint = `https://api.tomorrow.io/v4/timelines?apikey=${process.env.WEATHER_API_KEY}`;
      return scheduleRequest(endpoint, cloudZone.requestBody, cloudZone.id);
    });

    const errors = [];
    const cloudResp = await promiseAll(cloudPromises, errors);

    for (const resp of cloudResp) {
      const index = cloudZones.findIndex((zone) => zone.id === resp.zoneId);
      const intervals = resp?.response?.data?.timelines[0].intervals;
      const cloudData = intervals.filter(
        (interval) =>
          Math.abs(nextChange.changeTime - new Date(interval.startTime)) <=
          1800000
      )[0];
      cloudZones[index].dbPayload = {
        cloudZoneId: cloudZones[index]?.id,
        visibility: cloudData?.values?.visibilityAvg,
        cloudBase: cloudData?.values?.cloudBaseAvg,
        cloudCeiling: cloudData?.values?.cloudCeilingAvg,
        cloudCover: cloudData?.values?.cloudCoverAvg,
      };
    }

    console.log(errors);

    await Promise.all(
      cloudZones.map((cloudZone) => {
        addCloudData(cloudZone.dbPayload);
      })
    );
  } catch (error) {
    console.log(error);
  }
};

function promiseAll(promises, errors) {
  return Promise.all(
    promises.map((p) => {
      return p.catch((e) => {
        errors.push(e.response);

        return null;
      });
    })
  );
}

export { getLatestWeatherForSunChange };
