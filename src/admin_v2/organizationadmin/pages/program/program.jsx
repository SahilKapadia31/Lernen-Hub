import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Form, Pagination } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import Loading from "react-fullscreen-loading";
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";
import SortableHeader from "../../components/SortableHeader";
import AddUpdateProgram from "./add-update/add-update-program";
import ConfirmationDialog from "./confirmation-dialog/confirmation-dialog";
import { useSelector } from "react-redux";
import "./program.scss";
import axiosInstance from "../../components/services/axiosInstance";

const ManageProgram = () => {
    const orgData = useSelector((state) => state.auth);

    const { program_type_id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const programType = searchParams.get("program_type");

    const [isOpenAddForm, setIsOpenAddForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("");
    const [programList, setProgramList] = useState([]);

    useEffect(() => {
        getAllPrograms();
    }, []);

    const getAllPrograms = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get(`/program/organization/${orgData?.role?.organization_id}/${program_type_id}/`);
            if (response.data.status) {
                console.log("------>>>>program>>>--", response.data)
                setProgramList(response.data.data)
                setIsLoading(false)
            }
        } catch (err) {
            setIsLoading(false)
            console.log("Error in getAllPrograms", err);
        }
    };

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = programList.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentItems);

    const totalPages = Math.ceil(programList.length / itemsPerPage);

    const handleSort = ({ column, direction }) => {
        console.log({ column, direction });
        // setSortConfig({ column, direction })
        // getAllRoles({ page: currentPage, sortConfig: { column, direction } });
    };

    const getAllRoles = () => {
        console.log('getAllRoles');
        // setSortConfig({ column, direction })
        // getAllRoles({ page: currentPage, sortConfig: { column, direction } });
    };

    const submitProgramForm = async (value) => {
        try {
            setIsOpenAddForm(false)
            setIsLoading(true)
            let formattedSemesters = []
            if (value.semesters) {
                formattedSemesters = value.semesters.map(item => item.sem_name)
            }
            const payload = {
                "program_name": value.program_name,
                "uni_name": orgData?.role?.organization_id,
                "program_type_id": Number(program_type_id),
                "program_description": value.description,
                "semester": formattedSemesters,
                "is_verified": false
            }
            const response = await axiosInstance.post(`/program/`, payload);

            if (response) {
                setIsLoading(false);
                toast.success("Program inserted successfully");
                getAllPrograms();
            }
        } catch (err) {
            setIsLoading(false);
            console.log("Error in submitProgramForm", err);
            toast.error("Error!!! Please try again")
        }
    }


    const [selectedProgram, setSelectedProgram] = useState(null)
    const editProgramType = (programType) => {
        setIsOpenAddForm(true);
        setSelectedProgram(programType);
    }

    const updateProgramForm = async (value) => {
        try {
            setIsOpenAddForm(false);
            setIsLoading(true);
            // Format semesters properly
            const formattedSemesters = value.semesters.map(sem => ({
                ...(sem.semester_id ? { semester_id: sem.semester_id } : {}), // Only include semester_id if it exists
                sem_name: sem.sem_name,  // Always include sem_name
                is_deleted: sem.is_deleted  // Ensure is_deleted is present
            }));

            // Construct payload
            const payload = {
                "program_name": value.program_name,
                "organization_id": orgData?.role?.organization_id,
                "program_type_id": selectedProgram?.program_type_id,
                "program_description": value.description,
                "is_verified": selectedProgram?.is_verified,
                "semester": formattedSemesters  // Include formatted semesters
            };


            // API Call
            const response = await axiosInstance.put(`/program/${selectedProgram.pid}/`, payload);

            if (response) {
                setIsLoading(false);
                toast.success("Program updated successfully");
                getAllPrograms();
                setSelectedProgram(null);
            }
        } catch (err) {
            setIsLoading(false);
            setSelectedProgram(null);
            console.log("Error in updateProgramForm", err);
            toast.error("Error!!! Please try again");
        }
    };



    const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false)
    const deleteProgram = async () => {
        try {
            setIsOpenConfirmationModal(false)
            setIsLoading(true)
            const response = await axiosInstance.delete(`/program/${selectedProgram.pid}/`);

            if (response) {
                setIsLoading(false);
                toast.success("Program deleted successfully");
                getAllPrograms();
                setSelectedProgram(null)
            }
        } catch (err) {
            setIsLoading(false);
            setSelectedProgram(null);
            console.log("Error in deleteProgram", err);
            toast.error("Error!!! Please try again")
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-white mb-3 programs-list">
                <h5 className="m-0 main-title">Programs <span className="program-type text-uppercase">{programType}</span></h5>
                <div className="d-flex justify-content-end gap-2">
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value) }}
                        />
                        <Button
                            variant="outline-primary add-organization"
                            // onClick={(e) => getAllRoles()}
                        >
                            Filter{" "}
                        </Button>
                        <Button
                            variant="outline-danger add-organization"
                            // onClick={() => { getAllRoles({ search: "" }); setSearch("") }}
                        >
                            Clear
                        </Button>
                    </div>
                    <Button
                        variant="outline-primary add-organization"
                        onClick={() => { setIsOpenAddForm(true); setSelectedProgram(null) }}
                    >
                        {" "}
                        Add Program +{" "}
                    </Button>
                </div>
            </div>

            <div className="my-3 w-100 table-div overflow-x-auto px-0 hide-scrollbar">
                <table className="table fs-9 mb-0">
                    <thead>
                        <tr>
                            <th width="5%">
                                <h5 className="sort mb-0 text-center">#</h5>
                            </th>
                            <th width="25%">
                                <SortableHeader
                                    name="PROGRAM"
                                    id="name"
                                    column="name"
                                    onSort={handleSort}
                                />
                            </th>
                            <th width="35%">
                                <h5 className="sort mb-0 d-flex text-uppercase">Description</h5>
                            </th>
                            <th width="30%">
                                <h5 className="sort mb-0 d-flex text-uppercase">Semesters</h5>
                            </th>
                            <th width="30%">
                                <h5 className="sort mb-0 d-flex text-uppercase">Total Students</h5>
                            </th>
                            <th width="30%">
                                <h5 className="sort mb-0 d-flex text-uppercase">Total Staff</h5>
                            </th>
                            <th width="5%">
                                <h5 className="sort mb-0 d-flex text-uppercase">Action</h5>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover-actions-trigger btn-reveal-trigger position-static active-row"
                                >
                                    <td className="total-orders align-middle white-space-nowrap">
                                        <p className="mb-0 text-center">{index + 1}</p>
                                    </td>
                                    <td className="customer align-middle white-space-nowrap pe-5">
                                        <Link to={`/organization/subjects/${item?.pid}?program=${item.program_name}`}><p className="mb-0 text-uppercase">{item.program_name || "N/A"}</p></Link>
                                    </td>
                                    <td className="customer align-middle white-space-nowrap pe-5">
                                        <p className="mb-0">{item.program_description || "N/A"}</p>
                                    </td>
                                    <td className="customer align-middle white-space-nowrap pe-5" style={{ whiteSpace: 'nowrap', maxWidth: '100px', overflowX: 'auto' }}>
                                        <p className="mb-0">
                                            {(item?.semester && item?.semester.length > 0) ? (
                                                item.semester
                                                    .filter((sem) => !sem.is_deleted) // Filter out deleted semesters
                                                    .map((sem) => (
                                                        <span key={sem.sem_name} className="semesters me-1 text-uppercase">{sem.sem_name}</span>
                                                    ))
                                            ) : "N/A"}
                                        </p>
                                    </td>
                                    <td className="customer align-middle white-space-nowrap pe-5">
                                        <p className="mb-0">20</p>
                                    </td>
                                    <td className="customer align-middle white-space-nowrap pe-5">
                                        <p className="mb-0">25</p>
                                    </td>
                                    <td className="total-orders align-middle white-space-nowrap">
                                        <div className="d-flex gap-2">
                                            <button
                                                className="shadow-none mx-0 border-0"
                                                // onClick={() => editProgramType(item)}
                                                style={{ background: "none" }}
                                            >
                                                <Link to={`/organization/subjects/${item?.pid}?program=${item.program_name}`}>
                                                    <img
                                                        src="https://starlight-admin-v2.web.app/assets/images/eye.svg"
                                                        alt="Show"
                                                    />
                                                </Link>
                                            </button>
                                            <button
                                                className="shadow-none mx-0 border-0"
                                                onClick={() => editProgramType(item)}
                                                style={{ background: "none" }}
                                            >
                                                <img
                                                    src="https://starlight-admin-v2.web.app/assets/images/pen.svg"
                                                    alt="Edit"
                                                />
                                            </button>
                                            <button
                                                className="shadow-none mx-0 border-0"
                                                onClick={() => { setIsOpenConfirmationModal(true); setSelectedProgram(item) }}
                                                style={{ background: "none" }}
                                            >
                                                <img
                                                    src="https://starlight-admin-v2.web.app/assets/images/trash-xmark.svg"
                                                    alt="Delete"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No Records Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {currentItems.length ?
                    <div className="d-flex align-items-center justify-content-between mt-3 px-2">
                        <p className="px-2 py-2 mb-0 bg-white border rounded">Total Records : <span className="fw-bold">{programList.length}</span></p>
                        <Pagination className="mb-2">
                            <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>
                    :
                    ''
                }
            </div>
            <AddUpdateProgram
                show={isOpenAddForm}
                handleClose={() => setIsOpenAddForm(false)}
                submitProgramForm={submitProgramForm}
                selectedProgram={selectedProgram}
                updateProgramForm={updateProgramForm}
            />
            <ConfirmationDialog
                show={isOpenConfirmationModal}
                handleClose={() => setIsOpenConfirmationModal(false)}
                handleConfirm={deleteProgram}
            />
            {isLoading && <Loading loading={true} loaderColor="#000" />}
        </>
    );
};

export default ManageProgram;