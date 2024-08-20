import { CommentRepository } from "../repository/index.js";

const getAllComents = async (req, res) => {
    try {
        const songId = req.params.songId;
        console.log(songId);
        const comment = await CommentRepository.getAllComents(songId);
        console.log(songId);
        return res.status(200).json({ data: comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addComments = async (req, res) => {
    try {
        const { user, songId, parent_comment, content, is_root } = req.body;
        const newComment = await CommentRepository.createComment({
            user,
            songId,
            parent_comment,
            content,
            is_root
        })
        return res.status(200).json({ data: newComment });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default {
    getAllComents,
    addComments
}