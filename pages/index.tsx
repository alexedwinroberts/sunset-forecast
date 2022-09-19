import { getForecastForNextSunChange } from "../actions/getForecastForNextSunChange";

export default function Home({ forecast }) {
  if (forecast.sunChange === null || forecast.prediction === null) {
    return (
      <>
        <p>no more sunsets sorry</p>
      </>
    );
  }

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
