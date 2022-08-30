import { getNextChange } from "../controllers/SunChangeController";
import { addNextDaySunChanges } from "../actions/addNextDaySunChanges";

export default function Home({ sunchange }) {
  if (sunchange === null) {
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
    </>
  );
}

export const getServerSideProps = async () => {
  console.log("SSR called");
  await addNextDaySunChanges();
  const sunchange = await getNextChange();
  return {
    props: {
      sunchange: JSON.parse(JSON.stringify(sunchange)),
    },
  };
};
