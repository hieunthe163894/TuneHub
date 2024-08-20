import Event from "../model/Event.js";
import moment from "moment";
const addEvent = async ({
  artist,
  eventName,
  eventBanner,
  discount,
  eventContent,
  eventDeadline,
  eventStart,
}) => {
  try {
    const result = await Event.create({
      artist,
      eventName,
      eventBanner,
      discount,
      eventContent,
      eventDeadline,
      eventStart,
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getArtistEvent = async (artistId) => {
  try {
    const result = await Event.find({ artist: artistId, active: true });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateEventStatus = async () => {
  try {
    const startOfDay = moment().utc().startOf("day").toISOString();
    const endOfDay = moment().utc().endOf("day").toISOString();
    const [activateResult, deactivateResult] = await Promise.all([
      Event.updateMany(
        { eventStart: { $gte: startOfDay, $lte: endOfDay }, active: false },
        { $set: { active: true } }
      ),
      Event.updateMany(
        { eventDeadline: { $gte: startOfDay, $lte: endOfDay }, active: true },
        { $set: { active: false } },
      ),
    ]);
    console.log(deactivateResult);
    return { activateResult, deactivateResult };
  } catch (error) {
    throw new Error(error);
  }
};
export default {
  addEvent,
  getArtistEvent,
  updateEventStatus,
};
