import dynamic from "next/dynamic";
import { getForecastForNextSunChange } from "../actions/getForecastForNextSunChange";
import { Layout } from "../components/Layout";
import styles from "../styles/Forecast.module.scss";

export default function Home({ forecast }) {
  if (forecast.sunChange === null || forecast.prediction === null) {
    return (
      <>
        <p>no more sunsets sorry</p>
      </>
    );
  }

  const MapWithNoSSR = dynamic(() => import("../components/map"), {
    ssr: false,
  });

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZone: "America/Vancouver",
    timeZoneName: "short",
  };
  const utcDate = new Date(forecast.sunChange.changeTime);
  const displayDate = new Intl.DateTimeFormat("en-CA", timeOptions).format(
    utcDate
  );

  return (
    <Layout title="YVR sunset forecasts">
      <div className={styles.forecast__container}>
        <h1>
          The next {forecast.sunChange.changeType} will be at {displayDate}
        </h1>
        <p>
          This {forecast.sunChange.changeType} will be{" "}
          {forecast.prediction.value} because {forecast.prediction.reason}.
        </p>
        <div id="map" className={styles.forecast__map}>
          <MapWithNoSSR
            homeZone={forecast.homeZone}
            windowZones={forecast.windowZones}
            sunLine={forecast.sunLine}
          />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const forecast = await getForecastForNextSunChange();
  return {
    props: {
      forecast: JSON.parse(JSON.stringify(forecast)),
    },
  };
};
