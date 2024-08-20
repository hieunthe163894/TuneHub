import { GenreRepository } from "../repository/index.js";
const getAllGenres = async (req, res) => {
  try {
    const result = await GenreRepository.getAllGenres();
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
};

export default {
    getAllGenres
}
