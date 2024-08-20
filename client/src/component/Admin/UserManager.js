import AdminTemplate from "../../template/AdminTemplate";
import React, { useEffect, useState, useRef } from 'react';
import PerformRequest from "../../utilities/PerformRequest";
import { Button, Switch, TextField } from "@mui/material";
import { CiFaceFrown, CiFaceSmile, CiFaceMeh } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function UserManager() {
    const { OriginalRequest } = PerformRequest();
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState({ field: '', order: 'asc' });
    const hasMounted = useRef(false);
    const [valid, setValid] = useState(false);

    const handleActiveChange = async (event, id) => {
        const active = event.target.checked;
        console.log(active);
        try {
            const response = await OriginalRequest(`user/banAccount/${id}`, "PUT", { active });
            const updatedAccount = response.data;
            if (updatedAccount) {
                const updatedRows = rows.map(row =>
                    row.id === id ? { ...row, active: active } : row
                );
                setRows(updatedRows);
            }
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    useEffect(() => {
        try {
            const checkAdmin = async () => {
                const response = await OriginalRequest(`auth/checkAdmin`, "GET");
                if (response) {
                    setValid(true);
                }
            };

            const fetchData = async () => {
                const data = await OriginalRequest("user/getAllUser", "GET");
                if (data) {
                    const users = data.data.map((user, index) => ({
                        index: index + 1,
                        id: user._id,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        date: new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }),
                        email: user.email,
                        role: user.role,
                        active: user.active,
                        status: user.total_reports
                    }));
                    setRows(users);
                }
            };

            if (hasMounted.current) {
                checkAdmin();
                if (valid) {
                    fetchData();
                }
            } else {
                hasMounted.current = true;
            }
        } catch (error) {
            console.error(error.message);
        }
    }, [hasMounted, valid]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        const newOrder = sortBy.field === field && sortBy.order === 'asc' ? 'desc' : 'asc';
        setSortBy({ field, order: newOrder });
        setCurrentPage(1);
    };

    const sortFunction = (a, b) => {
        const { field, order } = sortBy;
        const aValue = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
        const bValue = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];

        if (order === 'asc') {
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        } else {
            if (aValue > bValue) return -1;
            if (aValue < bValue) return 1;
            return 0;
        }
    };

    const filteredRows = rows.filter(row =>
        row.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort(sortFunction);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRows = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    if (valid) {
        console.log(valid);
        return (
            <AdminTemplate>
                <div className="w-full min-h-screen px-5">

                    <h3 className="text-lightText dark:text-darkText text-2xl font-semibold pl-3">
                        User List
                    </h3>
                    <div className="w-full h-[1px] bg-black/60 dark:bg-darkText/60 shadow-md mt-2"></div>
                    <div className="flex flex-row items-center m-2">
                        <h2 className="text-lightText dark:text-darkText text-lg pl-3 m-5">
                            All user ({filteredRows.length})
                        </h2>
                        <Link
                            variant="contained"
                            className="flex items-center justify-center bg-light10 dark:bg-light10 text-white rounded-full w-32 h-10"
                            to={"/admin/artist/createArtist"}
                        > ADD NEW
                        </Link>
                        <div className="ml-7 flex items-center bg-opacity-80 border border-gray-500 rounded-full px-4 py-1 w-3/4">
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
                    </div>
                    <div className="h-fit max-w-full">
                        <div className="max-w-full mx-auto p-5 shadow-md shadow-neutral-400 dark:shadow-blue-800 dark:shadow-md rounded-lg bg-light5 dark:bg-dark30 text-lightText dark:text-darkText">
                            <table className="min-w-full">
                                <thead className=" bg-light5 dark:bg-dark30 text-lightText dark:text-darkText">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort('index')}>ID</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort('firstName')}>First Name</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort('lastName')}>Last Name</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort('date')}>Create Date</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort('role')}>Role</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort('active')}>Active</th>
                                        <th scope="col" className="px-6 py-3 text-left font-medium cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-light5 dark:bg-dark30 text-lightText dark:text-darkText">
                                    {currentRows.map((row) => (
                                        <tr key={row.id}>
                                            <td className="px-6 py-4">{row.index}</td>
                                            <td className="px-6 py-4">{row.firstName}</td>
                                            <td className="px-6 py-4">{row.lastName}</td>
                                            <td className="px-6 py-4">{row.email}</td>
                                            <td className="px-6 py-4">{row.date}</td>
                                            <td className="px-6 py-4">{row.role}</td>
                                            <td className="px-6 py-4">
                                                <Switch
                                                    checked={row.active}
                                                    onChange={(event) => handleActiveChange(event, row.id)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    className={`bg-${row.status && row.status > 0 ? (row.status <= 5 ? 'yellow' : 'red') : 'green'}-500`}
                                                    variant="contained"
                                                    to={`/admin/user/report/${row.id}`}
                                                >
                                                    {
                                                        row.status !== undefined && row.status !== null ? (
                                                            row.status > 5 ? (
                                                                <CiFaceFrown className="bg-red-700 text-white text-3xl rounded-full items-center m-2" />
                                                            ) : row.status > 0 && row.status <= 5 ? (
                                                                <CiFaceMeh className="bg-yellow-700 text-white text-3xl rounded-full items-center m-2" />
                                                            ) : (
                                                                <CiFaceSmile className="bg-green-700 text-white text-3xl rounded-full items-center m-2" />
                                                            )
                                                        ) : (
                                                            <CiFaceSmile className="bg-green-700 text-white text-3xl rounded-full items-center m-2" />
                                                        )
                                                    }
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
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
                </div>
            </AdminTemplate>
        );
    }
}
