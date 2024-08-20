import { TransactionRepository } from "../repository/index.js";
const getTransactionHistory = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const result = await TransactionRepository.getTransactionHistory(
      decodedToken.userId
    );
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  getTransactionHistory,
};
