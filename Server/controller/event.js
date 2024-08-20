import { ArtistRepository, EventRepository } from "../repository/index.js";
const addEvent = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const userId = decodedToken.userId;
    const {
      eventName,
      eventBanner,
      discount,
      eventContent,
      eventDeadline,
      eventStart,
    } = req.body;
    const artist = await ArtistRepository.findArtistByUserId(userId);
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const result = await EventRepository.addEvent({
      artist: artist._id,
      eventName,
      eventBanner,
      discount,
      eventContent,
      eventDeadline,
      eventStart,
    });
    return res.status(201).json({
      message:
        "Event was created successfully, apply the event to songs at management/single",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getArtistActiveEvent = async (req, res) =>{
  try {
    const decodedToken = req.decodedToken;
    const userId = decodedToken.userId;
    const artist = await ArtistRepository.findArtistByUserId(userId);
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const result = await EventRepository.getArtistEvent(artist._id);
    return res.status(200).json({data: result});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default {
  addEvent,
  getArtistActiveEvent
};
