import prisma from "../lib/prisma";
import { getNextChange } from "../controllers/SunChangeController";

export default function Home({ sunchange }) {
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
  const sunchange = await getNextChange();
  return {
    props: {
      sunchange: JSON.parse(JSON.stringify(sunchange)),
    },
  };
};
