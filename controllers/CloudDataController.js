import prisma from "../lib/prisma";

const addCloudData = async ({
  cloudZoneId,
  visibility,
  cloudBase,
  cloudCeiling,
  cloudCover,
}) => {
  const entry = await prisma.cloudData.create({
    data: { cloudZoneId, visibility, cloudBase, cloudCeiling, cloudCover },
  });

  return entry;
};

const getLatestCloudDataByCloudZone = async ({ cloudZoneId }) => {
  const cloudData = await prisma.cloudData.findFirst({
    where: { cloudZoneId: cloudZoneId },
    take: -1,
  });

  return cloudData;
};

export { addCloudData, getLatestCloudDataByCloudZone };
