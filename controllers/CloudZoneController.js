import prisma from "../lib/prisma";

const addCloudZone = async ({ sunChangeId, type, geometry }) => {
  const entry = await prisma.cloudZone.create({
    data: { sunChangeId, type, geometry },
  });

  return entry;
};

const getCloudZonesBySunChange = async (sunChangeId) => {
  const cloudZones = await prisma.cloudZone.findMany({
    where: { sunChangeId: sunChangeId },
  });

  return cloudZones;
};

export { addCloudZone, getCloudZonesBySunChange };
