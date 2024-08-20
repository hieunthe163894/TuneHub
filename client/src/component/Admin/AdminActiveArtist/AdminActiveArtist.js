import React, { useEffect, useState, useRef } from 'react';
import PerformRequest from "../../../utilities/PerformRequest";
import { FaSearch } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function AdminActiveArtist() {
    const { OriginalRequest } = PerformRequest();
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectValues, setSelectValues] = useState();
    const hasMounted = useRef(false);

    const handleStatusChange = (event, id) => {
        const newStatus = event.target.value;
        const updatedRows = rows.map(row =>
            row.id === id ? { ...row, status: newStatus } : row
        );
        setRows(updatedRows);
    };

    const handleUpdateStatus = async (id, userId) => {
        const row = rows.find(row => row.id === id);
        if (row) {
            setLoading(true);
            try {
                const response = await OriginalRequest(`artistKitApplication/interactApplication/${id}`, "PUT", { status: row.status, userId: userId });
                const updatedAccount = response.data;
                if (updatedAccount) {
                    const updatedRows = rows.map(row =>
                        row.id === id ? { ...row, status: updatedAccount.status } : row
                    );
                    setRows(updatedRows);
                }
                const data = await OriginalRequest("artistKitApplication/getAllApplication", "GET");
                setSelectValues(data.data);
            } catch (error) {
                console.error('Error updating status:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await OriginalRequest("artistKitApplication/getAllApplication", "GET");
                if (data) {
                    const users = data.data.map((application, index) => ({
                        index: index + 1,
                        id: application._id,
                        artistName: application.artistName,
                        status: application.status,
                        userId: application.userId
                    }));
                    setRows(users);
                    setSelectValues(users);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        if (hasMounted.current) {
            fetchData();
        } else {
            hasMounted.current = true;
        }
    }, [hasMounted]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const filteredRows = rows
        .filter(row => row.artistName.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(row => statusFilter === 'all' || row.status === statusFilter);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRows = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="w-full px-5">
            <h3 className="text-lightText dark:text-darkText text-2xl font-semibold">
                Application List
            </h3>
            {rows.length === 0 ? (
                <div className="max-w-full mx-auto mt-10 p-5 shadow-sm shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm rounded-lg text-lightText dark:text-darkText">
                    <div>No Application</div>
                </div>
            ) : (
                <>
                    <div className="flex flex-row items-center mb-2 mt-2 w-full">
                        <h2 className="text-lightText dark:text-darkText text-lg mr-7 mb-5 mt-5 font-semibold">
                            Search ({filteredRows.length})
                        </h2>
                        <div className="w-3/4 flex items-center bg-opacity-80 border border-gray-500 rounded-full px-4 py-1">
                            <input
                                label="Search by name"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full outline-none bg-transparent dark:text-white"
                            />
                            <button className="ml-2 text-dark10 rounded-full p-2">
                                <FaSearch />
                            </button>
                        </div>
                        <select value={statusFilter} onChange={handleStatusFilterChange} className="ml-8 px-7 py-2 font-semibold shadow-md shadow-neutral-400 dark:shadow-blue-800 dark:shadow-md rounded-lg bg-light5 dark:bg-dark30 text-lightText dark:text-darkText">
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="max-w-full min-h-96">
                        <div className="max-w-full mx-auto p-5 shadow-md shadow-neutral-400 dark:shadow-blue-800 dark:shadow-md rounded-lg bg-light5 dark:bg-dark30 text-lightText dark:text-darkText">
                            <table className="min-w-full">
                                <thead className=" bg-light5 dark:bg-dark30 text-lightText dark:text-darkText">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer">Artist Name</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer">Update</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-light5 dark:bg-dark30 text-lightText dark:text-darkText">
                                    {loading ? (
                                        <tr className="w-full">
                                            <td colSpan="5" className="w-full">
                                                <AiOutlineLoading3Quarters
                                                    className={`mx-auto mt-10 text-light10 animate-spin duration-${10000}`}
                                                    size={35}
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        currentRows.map((row, index) => (
                                            <tr key={row.id} className="border-b border-b-gray-300">
                                                <td className="px-6 py-4">{row.index}</td>
                                                <td className="px-6 py-4">{row.artistName}</td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        disabled={selectValues[index].status === "approved" || selectValues[index].status === "rejected"}
                                                        value={row.status} onChange={(event) => handleStatusChange(event, row.id)}
                                                        className="px-4 py-2 shadow-md shadow-neutral-400 dark:shadow-blue-800 dark:shadow-md rounded-lg bg-light5 dark:bg-dark30 text-lightText dark:text-darkText">
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleUpdateStatus(row.id, row.userId)}
                                                        className={`px-4 py-2 shadow-md shadow-neutral-400 dark:shadow-blue-800 dark:shadow-md rounded-lg text-lightText dark:text-darkText ${selectValues[index].status === 'approved' ? 'bg-green-500' : selectValues[index].status === 'rejected' ? 'bg-red-500' : 'bg-light5 dark:bg-dark30'}`}
                                                        disabled={selectValues[index].status == "approved" || selectValues[index].status === "rejected"}
                                                    >
                                                        {selectValues[index].status === 'approved' ? 'Approved' : selectValues[index].status === 'rejected' ? 'Rejected' : 'Update'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4 ">
                            <nav className="block">
                                <ul className="flex pl-0 rounded list-none flex-wrap">
                                    {[...Array(totalPages).keys()].map((pageNumber) => (
                                        <li key={pageNumber + 1} className="first:ml-0 text-xs font-semibold flex justify-center items-center p-2">
                                            <button
                                                onClick={() => paginate(pageNumber + 1)}
                                                className={`w-full px-4 py-2 border rounded-md ${currentPage === pageNumber + 1 ? 'bg-light30 text-dark60 dark:bg-dark30 dark:text-white' : 'bg-light5 text-lightText dark:bg-white dark:text-blue-500'}`}
                                            >
                                                {pageNumber + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
