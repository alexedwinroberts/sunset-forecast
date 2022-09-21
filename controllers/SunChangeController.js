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
    orderBy: {
      changeTime: "asc",
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

const getChangesInTimeWindow = async (timeStart, timeEnd) => {
  const sunChanges = await prisma.sunChange.findMany({
    where: {
      changeTime: {
        lt: timeEnd,
        gt: timeStart,
      },
    },
  });

  return sunChanges;
};

export { addSunChange, getNextChange, getLastChange, getChangesInTimeWindow };
