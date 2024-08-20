import AdminTemplate from "../../../template/AdminTemplate";
import PerformRequest from "../../../utilities/PerformRequest";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrashCan } from "react-icons/fa6";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";

export default function AdminSongReport() {
    const { OriginalRequest } = PerformRequest();
    const [reports, setReports] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await OriginalRequest(`reportquestion/getReportSong/${id}`, "GET");
                if (data && data.data) {
                    setReports(data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleDelete = async (id_reported) => {
        try {
            await OriginalRequest(`reportquestion/deleteReport/${id_reported}`, "DELETE");
            const updatedReports = reports.filter(report => report.id_reported !== id_reported);
            setReports(updatedReports);
        } catch (error) {
            console.error('Error deleting report:', error);
        }
    };

    const groupReportsByUniqueComments = () => {
        const grouped = {};
        reports.forEach(report => {
            const comment = report.comment;
            if (!grouped[comment]) {
                grouped[comment] = [];
            }
            grouped[comment].push(report);
        });

        return Object.values(grouped);
    };

    const uniqueComments = groupReportsByUniqueComments();

    return (
        <AdminTemplate>
            <div className="w-full min-h-screen px-5 mb-10">
                <h3 className="text-lightText dark:text-darkText text-2xl font-semibold pl-3">
                    Report Song
                </h3>
                <div className="w-full h-[1px] bg-black/60 dark:bg-darkText/60 shadow-md mt-2"></div>
                {uniqueComments.map((comment, index) => (
                    <CommentCard key={index} comment={comment} handleDelete={handleDelete} />
                ))}
                {reports.length === 0 && (
                    <div className="max-w-full mx-auto mt-10 p-5 shadow-sm shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm rounded-lg text-lightText dark:text-darkText">
                        <div>No reports found</div>
                    </div>
                )}
            </div>
        </AdminTemplate>
    );
}

const CommentCard = ({ comment, handleDelete }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="max-w-full mx-auto mt-10 p-5 shadow-sm shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm rounded-lg bg-light5 dark:bg-dark30 text-lightText dark:text-darkText">
            <div className="border-l-2 border-gray-300 pl-4 mb-2">
                <div className="flex items-center">
                    <div className="flex-1 text-lg font-semibold">
                        Total Report ({comment.length})
                    </div>
                    <div className="text-gray-500 ml-aut cursor-pointer p-1">
                        <FaTrashCan onClick={() => handleDelete(comment[0].id_reported)} />
                    </div>
                </div>
                <div className="flex items-center mt-2">
                    <img
                        src={comment[0].songReport.cover_image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                        alt=""
                        className="w-14 h-14 rounded-lg mr-3 object-cover"
                    />
                    <div className="w-32 ml-4 font-semibold">
                        {`${comment[0].songReport.song_name}`}
                    </div>
                    <div className="flex-1 ml-2">
                        {comment[0].artist}
                    </div>
                </div>
                <button
                    onClick={toggleExpand}
                    className="text-gray-500 dark:text-gray-200 mt-4"
                >
                    {isExpanded ? <FaArrowRight /> : <FaArrowDown />}
                </button>
            </div>
            {isExpanded && (
                <>
                    <h3 className="flex-1 text-lg font-semibold">User Reported</h3>
                    <div className="mt-4 text-lightText dark:text-darkText">
                        {comment.map((report, idx) => (
                            <div key={idx} className="flex items-center ml-10 m-2 border-b-2 border-l-2 border-gray-300 dark:border-gray-600 pl-4 p-5 mb-10">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={report.reportBy.profile_picture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                        alt=""
                                        className="w-12 h-12 rounded-full mr-3 object-cover"
                                    />
                                </div>
                                <div className="font-semibold mr-6">
                                    {`${report.reportBy.first_name} ${report.reportBy.last_name}`}
                                </div>
                                <div className="flex ml-2">
                                    {report.content_reported.map(content => content.question).join(', ')}
                                </div>
                                <div className="flex-1 text-right">
                                    {new Date(comment[0].createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
