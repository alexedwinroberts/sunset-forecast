import prisma from "../lib/prisma";

const addSunChange = async ({ changeType, changeTime, angle }) => {
  const entry = await prisma.sunChange.create({
    data: { changeType, changeTime, angle },
  });

  return entry;
};

const getNextChange = async () => {
  const sunChange = await prisma.sunChange.findFirst({
    take: -1,
  });

  return sunChange;
};

export { addSunChange, getNextChange };
