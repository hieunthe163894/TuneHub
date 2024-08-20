import mongoose from "mongoose";
import Comment from "../model/Comment.js";
const getAllComents = async (songId) => {
    try {
        const result = await Comment.aggregate(
            [
                {
                    $lookup: {
                        from: "Users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: {
                        path: "$user",
                    },
                },
                {
                    $lookup: {
                        from: "Artist",
                        localField: "songId",
                        foreignField: "song_uploads.songId",
                        as: "artist",
                    },
                },
                {
                    $unwind: {
                        path: "$artist",
                    },
                },
                {
                    $addFields: {
                        "user.full_name": {
                            $cond: {
                                if: {
                                    $eq: ["$user._id", "$artist.userId"],
                                },
                                then: "$artist.artist_name",
                                else: {
                                    $concat: [
                                        "$user.first_name",
                                        " ",
                                        "$user.last_name",
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        user: {
                            _id: "$user._id",
                            full_name: "$user.full_name",
                            profile_picture: "$user.profile_picture",
                        },
                        songId: 1,
                        parent_comment: 1,
                        content: 1,
                        is_root: 1,
                        artist: {
                            userId: "$artist.userId",
                        },
                    },
                },
                {
                    $match: {
                        songId: new mongoose.Types.ObjectId(songId)
                    },
                },
            ]
        );
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

const createComment = async ({
    user,
    songId,
    parent_comment,
    content,
    is_root
}) => {
    try {
        const result = await Comment.create({
            user,
            songId,
            parent_comment,
            content,
            is_root
        });
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getAllComents,
    createComment
}