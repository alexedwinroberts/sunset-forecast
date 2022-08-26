import prisma from "../lib/prisma";

const addPrediction = async ({
  sunChangeId,
  value,
  reason,
  predictionMethod,
}) => {
  const entry = await prisma.prediction.create({
    data: { sunChangeId, value, reason, predictionMethod },
  });

  return entry;
};

const getLatestPrediction = async () => {
  const prediction = await prisma.prediction.findFirst({
    take: -1,
  });

  return prediction;
};

const getLatestPredictionBySunChange = async (sunChangeId) => {
  const prediction = await prisma.prediction.findFirst({
    where: { sunChangeId: sunChangeId },
    take: -1,
  });

  return prediction;
};

export { addPrediction, getLatestPrediction, getLatestPredictionBySunChange };
