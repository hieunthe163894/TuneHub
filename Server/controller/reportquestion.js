import { ReportQuestionRepository } from "../repository/index.js";
const getQuestionReport = async (req, res) => {
    try {
        const result = await ReportQuestionRepository.getAllQuestion()
        res.status(200).json({ data: result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const addReport = async (req, res) => {
    try {
        const userId = req.decodedToken.userId;
        const commentReportedId = req.params.commentReportedId;
        const { content_reported, typeReported } = req.body;

        const result = await ReportQuestionRepository.addReport(userId, commentReportedId, typeReported, content_reported);

        res.status(200).json({ data: result, message: "Your report has been recorded !" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getReportByIdUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await ReportQuestionRepository.getReportByIdUser(userId);

        res.status(200).json({ data: result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteReport = async (req, res) => {
    try {
        const id_reported = req.params.id_reported;
        const result = await ReportQuestionRepository.deleteReport(id_reported);

        res.status(200).json({ data: result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getReportByIdSong = async (req, res) => {
    try {
        const songId = req.params.songId;
        const result = await ReportQuestionRepository.getReportByIdSong(songId);

        res.status(200).json({ data: result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default {
    getQuestionReport,
    addReport,
    getReportByIdUser,
    deleteReport,
    getReportByIdSong,
}