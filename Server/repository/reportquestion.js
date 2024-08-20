import ReportQuestion from "../model/ReportQuestion.js"
import Report from "../model/Report.js"
import mongoose from "mongoose";

const getAllQuestion = async () => {
    try {
        return await ReportQuestion.find();
    } catch (error) {
        throw new Error(error.message);
    }
}
const addReport = async (userId, idReported, typeReported, contentReported) => {
    try {
        const report = new Report({
            reporter: userId,
            id_reported: idReported,
            type_reported: typeReported,
            content_reported: contentReported
        });

        await report.save();
        return report;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getReportByIdUser = async (userId) => {
    try {
        return await Report.aggregate(
            [
                {
                    $lookup: {
                        from: "Users",
                        localField: "reporter",
                        foreignField: "_id",
                        as: "reportBy",
                    },
                },
                {
                    $unwind: {
                        path: "$reportBy",
                    },
                },
                {
                    $lookup: {
                        from: "Comment",
                        localField: "id_reported",
                        foreignField: "_id",
                        as: "comment",
                    },
                },
                {
                    $unwind: {
                        path: "$comment",
                    },
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "comment.user",
                        foreignField: "_id",
                        as: "userReport",
                    },
                },
                {
                    $unwind: {
                        path: "$userReport",
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        userReport: {
                            $first: {
                                _id: "$userReport._id",
                                first_name: "$userReport.first_name",
                                last_name: "$userReport.last_name",
                                profile_picture:
                                    "$userReport.profile_picture",
                            },
                        },
                        reportBy: {
                            $first: {
                                _id: "$reportBy._id",
                                first_name: "$reportBy.first_name",
                                last_name: "$reportBy.last_name",
                                profile_picture:
                                    "$reportBy.profile_picture",
                            },
                        },
                        content_reported: {
                            $first: "$content_reported",
                        },
                        id_reported: {
                            $first: "$id_reported",
                        },
                        comment: {
                            $first: "$comment.content",
                        },
                        createdAt: { $first: "$createdAt" },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        reportBy: 1,
                        userReport: 1,
                        content_reported: 1,
                        comment: 1,
                        createdAt: 1,
                        id_reported: 1,
                    },
                },
                {
                    $match: {
                        "userReport._id": new mongoose.Types.ObjectId(userId)
                    },
                },
            ]
        )
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteReport = async (id_reported) => {
    try {
        const result = await Report.deleteMany({ id_reported: id_reported });
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getReportByIdSong = async (songId) => {
    try {
        return await Report.aggregate(
            [
                {
                    $lookup: {
                        from: "Users",
                        localField: "reporter",
                        foreignField: "_id",
                        as: "reportBy",
                    },
                },
                {
                    $unwind: {
                        path: "$reportBy",
                    },
                },
                {
                    $lookup: {
                        from: "Song",
                        localField: "id_reported",
                        foreignField: "_id",
                        as: "songReport",
                    },
                },
                {
                    $unwind: {
                        path: "$songReport",
                    },
                },
                {
                    $lookup: {
                        from: "Artist",
                        localField: "songReport.artist",
                        foreignField: "_id",
                        as: "artist",
                    },
                },
                {
                    $unwind: {
                        path: "$artist",
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        songReport: {
                            $first: {
                                _id: "$songReport._id",
                                song_name: "$songReport.song_name",
                                cover_image: "$songReport.cover_image",
                            },
                        },
                        reportBy: {
                            $first: {
                                _id: "$reportBy._id",
                                first_name: "$reportBy.first_name",
                                last_name: "$reportBy.last_name",
                                profile_picture:
                                    "$reportBy.profile_picture",
                            },
                        },
                        artist: {
                            $first: "$artist.artist_name",
                        },
                        content_reported: {
                            $first: "$content_reported",
                        },
                        id_reported: {
                            $first: "$id_reported",
                        },
                        createdAt: { $first: "$createdAt" },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        reportBy: 1,
                        songReport: 1,
                        artist: 1,
                        content_reported: 1,
                        createdAt: 1,
                        id_reported: 1,
                    },
                },
                {
                    $match: {
                        "songReport._id": new mongoose.Types.ObjectId(songId),
                    },
                },
            ]
        )
    } catch (error) {
        throw new Error(error.message);
    }
}

export default {
    getAllQuestion,
    addReport,
    getReportByIdUser,
    deleteReport,
    getReportByIdSong
} 