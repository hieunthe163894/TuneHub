import { NotificationRespository } from "../repository/index.js";
import {io} from "../index.js"
const getNotificationOfUser = async (req, res) => {
  try {
    const userId = req.decodedToken.userId;

    if (userId) {
      const userNotification =
        await NotificationRespository.getUserNotification(userId);
      return res.status(200).json({ data: userNotification });
    } else {
      return res.status(400).json({ error: "Missing userId parameter" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getNotificationOfUser,
};
