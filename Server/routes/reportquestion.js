import { ReportquestionController } from "../controller/index.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";

const reportquestionRouter = express.Router();
reportquestionRouter.get("/getReportQuestion", ReportquestionController.getQuestionReport);
reportquestionRouter.post("/addReport/:commentReportedId", verifyToken, ReportquestionController.addReport);
reportquestionRouter.get("/getReport/:userId", verifyToken, ReportquestionController.getReportByIdUser);
reportquestionRouter.delete("/deleteReport/:id_reported", verifyToken, ReportquestionController.deleteReport);
reportquestionRouter.get("/getReportSong/:songId", verifyToken, ReportquestionController.getReportByIdSong);
export default reportquestionRouter;