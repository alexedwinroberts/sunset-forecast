import prisma from "../lib/prisma";

const addSunChange = async ({ changeType, changeTime, angle }) => {
  const entry = await prisma.sunChange.create({
    data: { changeType, changeTime, angle },
  });

  return entry;
};

const getNextChange = async () => {
  const timeNow = new Date().toISOString();
  const sunChange = await prisma.sunChange.findFirst({
    where: {
      changeTime: {
        gt: timeNow,
      },
    },
  });

  return sunChange;
};

const getLastChange = async () => {
  const sunChange = await prisma.sunChange.findFirst({
    take: -1,
  });

  return sunChange;
};

export { addSunChange, getNextChange, getLastChange };
