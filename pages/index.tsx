import dynamic from "next/dynamic";
import { getForecastForNextSunChange } from "../actions/getForecastForNextSunChange";

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

  const tempStyle = {
    height: "600px",
  };

  return (
    <>
      <h1>this is the home page</h1>
      <p>
        next {forecast.sunChange.changeType} is at{" "}
        {forecast.sunChange.changeTime}
      </p>
      <p>
        This {forecast.sunChange.changeType} will be {forecast.prediction.value}{" "}
        because {forecast.prediction.reason}.
      </p>
      <div id="map" style={tempStyle}>
        <MapWithNoSSR
          homeZone={forecast.homeZone}
          windowZones={forecast.windowZones}
          sunLine={forecast.sunLine}
        />
      </div>
    </>
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
