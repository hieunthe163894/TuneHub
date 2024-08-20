import Notification from "../model/Notification.js";
const addNotification = async ({ userId, content, linkTo }) => {
  try {
    const newNotification = await Notification.create({
      user: userId,
      content: content,
      linkTo: linkTo,
    });
    return newNotification;
  } catch (error) {
    throw new Error(error.message)
  }
};
const getUserNotification = async (userId) =>{
  try {
    const notificationList = await Notification.find({user: userId});
    return notificationList;
  } catch (error) {
    throw new Error(error.message)
  }
}
export default {
    addNotification,
    getUserNotification
}
