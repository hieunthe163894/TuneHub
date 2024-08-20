import ArtistKitApplication from "../model/ArtistKitApplication.js";

const createApplication = async ({ artistName, userId }) => {
  try {
    const result = await ArtistKitApplication.create({
      artistName,
      userId,
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getActiveApplicationOfUser = async ({ userId }) => {
  try {
    const result = await ArtistKitApplication.findOne({
      userId: userId,
      status: { $in: ["pending", "approved"] },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllApplication = async () => {
  try {
    const result = await ArtistKitApplication.find();
    return result;
  } catch (error) {
    throw new Error(error.message);

  }
}

const interactApplication = async (id, status) => {
  try {
    const result = await ArtistKitApplication.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getActiveApplicationByUser = async ({ userId }) => {
  try {
    const result = await ArtistKitApplication.findOne({
      userId: userId,
      status: { $in: ["pending", "approved", "rejected"] },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createApplication,
  getActiveApplicationOfUser,
  getAllApplication,
  interactApplication,
  getActiveApplicationByUser,
};
