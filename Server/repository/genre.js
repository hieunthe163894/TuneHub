import Genre from "../model/Genre.js";
const getAllGenres = async () => {
  try {
    const genresList = await Genre.find().exec();
    return genresList;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
    getAllGenres
}