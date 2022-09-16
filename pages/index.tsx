import { getNextChange } from "../controllers/SunChangeController";
import { getLatestPredictionBySunChange } from "../controllers/PredictionController";

export default function Home({ sunchange, prediction }) {
  if (sunchange === null || prediction === null) {
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
        next {sunchange.changeType} is at {sunchange.changeTime}
      </p>
      <p>
        This {sunchange.changeType} will be {prediction.value} because{" "}
        {prediction.reason}.
      </p>
    </>
  );
}

export const getServerSideProps = async () => {
  const sunchange = await getNextChange();
  const prediction = await getLatestPredictionBySunChange(sunchange.id);
  return {
    props: {
      sunchange: JSON.parse(JSON.stringify(sunchange)),
      prediction: JSON.parse(JSON.stringify(prediction)),
    },
  };
};
