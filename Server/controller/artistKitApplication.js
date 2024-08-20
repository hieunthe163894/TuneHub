import {
  ArtistKitApplicationRepository,
  ArtistRepository,
  UserRepository,
} from "../repository/index.js";
import { sendArtistKitPayment, sendArtistKitReject } from "../utils/mailTransport.js";

const createArtistKitApplication = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const { artistName } = req.body;

    if (!artistName || artistName.length === 0) {
      return res.status(400).json({ error: "Invalid artist name" });
    }
    const existingApplication =
      await ArtistKitApplicationRepository.getActiveApplicationOfUser({
        userId: decodedToken.userId,
      });
    if (existingApplication) {
      return res.status(400).json({ error: "User has been applied" });
    }

    const existingArtist = await ArtistRepository.findArtistByNameExact(
      artistName
    );
    if (existingArtist) {
      return res.status(400).json({ error: "Artist name is taken" });
    }
    const result = await ArtistKitApplicationRepository.createApplication({
      artistName,
      userId: decodedToken.userId,
    });
    return res.status(201).json({
      message:
        "Applied successfully, we will send a url for payment to your registered email when your application has been approved. After payment",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllApplication = async (req, res) => {
  try {
    const result = await ArtistKitApplicationRepository.getAllApplication();
    res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const interactApplication = async (req, res) => {
  const id = req.params.id;
  const { status, userId } = req.body;
  try {
    const result = await ArtistKitApplicationRepository.interactApplication(id, status);
    const application = await ArtistKitApplicationRepository.getActiveApplicationByUser({ userId });
    const existingUser = await UserRepository.findById(userId);
    if (application.status === 'rejected') {
      await sendArtistKitReject(existingUser.email);
    }
    if (application.status === 'approved') {
      await sendArtistKitPayment(existingUser.email, application.artistName);
    }
    res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default {
  createArtistKitApplication,
  getAllApplication,
  interactApplication,
};
