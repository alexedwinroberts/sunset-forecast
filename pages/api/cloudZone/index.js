import { addCloudZonesForSunChange } from "../../../actions/addCloudZonesForSunChange";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const result = await addCloudZonesForSunChange();
      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ error: "failed to load data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
