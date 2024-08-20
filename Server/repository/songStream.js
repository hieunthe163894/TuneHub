import SongStream from "../model/SongStream.js";
import mongoose, { Schema } from "mongoose";
import Song from "../model/Song.js";
import moment from "moment";
// import Song from "./Song.js";
const addSongStreamm = async ({ userId, songId }) => {
  try {
    const songStream = await SongStream.create({
      song: songId,
      user: userId,
    });
    return songStream;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRecentlyPlayedSongStreams = async (currentUserId) => {
  try {
    const userId = new mongoose.Types.ObjectId(currentUserId);
    return await SongStream.aggregate([
      { $match: { user: userId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { user: "$user", song: "$song" },
          document: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$document" } },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
    ]);
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    throw error; // Rethrow lỗi để bên ngoài có thể xử lý
  }
};
const getArtistSongStream = async (artistId, span) => {
  try {
    let spanFilter = {};
    if (span === "weekly") {
      spanFilter.createdAt = { $gte: moment().startOf("isoWeek").toDate() };
    } else if (span === "monthly") {
      spanFilter.createdAt = { $gte: moment().startOf("month").toDate() };
    }
    const result = await SongStream.aggregate([
      {
        $lookup: {
          from: "Song",
          localField: "song",
          foreignField: "_id",
          as: "songDetail",
        },
      },
      {
        $unwind: "$songDetail",
      },
      {
        $match: {
          $and: [
            { "songDetail.artist": new mongoose.Types.ObjectId(artistId) },
            spanFilter,
          ],
        },
      },
      {
        $count: "total",
      },
    ]);
    return result;
  } catch (error) {
    console.error("Error in getArtistSongStream:", error);
    throw new Error(error.message);
  }
};
const getArtistSongStreamTrend = async (artist, span) => {
  try {
    let filter = {};
    let daysArray = [];
    let format = "%Y-%m-%d";
    if (span === "weekly") {
      const startOfWeek = moment().startOf("isoWeek").toDate();
      const currentDate = moment().endOf("day").toDate();
      filter.createdAt = {
        $gte: startOfWeek,
        $lt: currentDate,
      };
      const dayDiff = moment(currentDate).diff(startOfWeek, "days");
      daysArray = Array.from({ length: dayDiff + 1 }, (_, i) => {
        const date = moment(startOfWeek).add(i, "days").format("YYYY-MM-DD");
        return date;
      });
    } else if (span === "monthly") {
      const startOfMonth = moment().startOf("month").toDate();
      const currentDate = moment().endOf("day").toDate();
      filter.createdAt = {
        $gte: startOfMonth,
        $lt: currentDate,
      };
      const dayDiff = moment(currentDate).diff(startOfMonth, "days");
      daysArray = Array.from({ length: dayDiff + 1 }, (_, i) => {
        const date = moment(startOfMonth).add(i, "days").format("YYYY-MM-DD");
        return date;
      });
    } else if (span === "allTime") {
      const startOfCareer = moment(artist.createdAt).toDate();
      const currentDate = moment().endOf("day").toDate();
      const monthDiff = moment(currentDate).diff(startOfCareer, "months") + 1;
      console.log(monthDiff);
      daysArray = Array.from({ length: monthDiff + 1 }, (_, i) => {
        const month = moment(startOfCareer).add(i, "months").format("YYYY-MM");
        return month;
      });
      format = "%Y-%m";
    }
    const result = await SongStream.aggregate([
      {
        $lookup: {
          from: "Song",
          localField: "song",
          foreignField: "_id",
          as: "songDetail",
        },
      },
      {
        $unwind: "$songDetail",
      },
      {
        $match: {
          $and: [
            {
              "songDetail.artist": new mongoose.Types.ObjectId(artist._id),
            },
            filter,
          ],
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: format,
              date: "$createdAt",
            },
          },
          streamCount: {
            $sum: 1,
          },
          songDetail: {
            $first: "$songDetail",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          streamCount: 1,
        },
      },
    ]);
    const revenueMap = result.reduce((acc, { date, streamCount }) => {
      acc[date] = streamCount;
      return acc;
    }, {});
    const finalResult = daysArray.map((day) => ({
      date: day,
      totalAmount: revenueMap[day] || 0,
    }));
    // console.log(finalResult);
    return finalResult;
  } catch (error) {
    throw new Error(error.message);
  }
};
const get5MostStreamedSongsOfArtist = async (artistId, span) => {
  try {
    let filter = {};
    if (span === "weekly") {
      const startOfWeek = moment().startOf("isoWeek").toDate();
      const currentDate = moment().endOf("day").toDate();
      filter.createdAt = {
        $gte: startOfWeek,
        $lt: currentDate,
      };
    } else if (span === "monthly") {
      const startOfMonth = moment().startOf("month").toDate();
      const currentDate = moment().endOf("day").toDate();
      filter.createdAt = {
        $gte: startOfMonth,
        $lt: currentDate,
      };
    }
    const result = SongStream.aggregate([
      {
        $lookup: {
          from: "Song",
          localField: "song",
          foreignField: "_id",
          as: "songDetail",
        },
      },
      {
        $unwind: "$songDetail",
      },
      {
        $match: {
          $and: [
            {
              "songDetail.artist": new mongoose.Types.ObjectId(artistId),
            },
            filter,
          ],
        },
      },
      {
        $group: {
          _id: "$songDetail._id",
          streamCount: {
            $sum: 1,
          },
          songDetail: {
            $first: "$songDetail",
          },
        },
      },
      {
        $sort: {
          streamCount: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          streamCount: 1,
          _id: 0,
          "songDetail._id": 1,
          "songDetail.song_name": 1,
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getArtistSongStreamByAdmin = async ({ artistId, date }) => {
  try {
    const now = new Date();
    let dateFilter = {};
    switch (date) {
      case "weekly":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 6);
        dateFilter = {
          $gte: startOfWeek,
          $lte: now,
        };
        break;
      case "monthly":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
          $lte: now,
        };
        break;
      case "allTime": {
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 12, now.getDate()),
          $lte: now,
        };
        break;
      }
    }

    const result = await Song.aggregate([
      { $match: { artist: artistId } }, 
      {
        $lookup: {
          from: "SongStream",
          localField: "_id",
          foreignField: "song",
          as: "streams",
        },
      },
      { $unwind: "$streams" }, 
      { $match: { "streams.createdAt": dateFilter } }, 
      {
        $group: {
          _id: null,
          totalListens: { $sum: 1 }, 
        },
      },
    ]);

    return result[0] ? result[0].totalListens : 0;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  addSongStreamm,
  getRecentlyPlayedSongStreams,
  getArtistSongStream,
  getArtistSongStreamTrend,
  get5MostStreamedSongsOfArtist,
  getArtistSongStreamByAdmin,
};
