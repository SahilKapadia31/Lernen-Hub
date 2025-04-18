import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Form, Pagination } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import SortableHeader from "../../components/SortableHeader";
import AddUpdateSubjects from "./add-update/add-update-subjects";
import ConfirmationDialog from "./confirmation-dialog/confirmation-dialog";
import { useSelector } from "react-redux";
import "./subjects.scss";
import axiosInstance from "../../components/services/axiosInstance";

const ManageSubjects = () => {
    const orgData = useSelector((state) => state.auth);

    const { program_id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const program = searchParams.get("program");

    const [isOpenAddForm, setIsOpenAddForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("");
    const [subjectsList, setSubjectsList] = useState([]);
    const [programSemesters, setProgramSemesters] = useState([])

    useEffect(() => {
        getAllSubjects();
        getProgramsById();
    }, []);

    const getAllSubjects = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get(`/courses/${program_id}/${orgData?.role?.organization_id}/`);
            if (response.data.status) {
                setSubjectsList(response.data.data)
                setIsLoading(false)
            }
        } catch (err) {
            setIsLoading(false)
            console.log("Error in getAllSubjects", err);
        }
    };

    const getProgramsById = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get(`/program/${program_id}/`);
            if (response.data.status) {
                console.log("------>>>>program>>>--", response.data.data.semester)
                setProgramSemesters(response.data.data.semester)
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
    const currentItems = subjectsList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(subjectsList.length / itemsPerPage);

    const handleSort = ({ column, direction }) => {
        console.log({ column, direction });
        // setSortConfig({ column, direction })
        // getAllRoles({ page: currentPage, sortConfig: { column, direction } });
    };
    const getAllRoles = () => {
        console.log('');
        // setSortConfig({ column, direction })
        // getAllRoles({ page: currentPage, sortConfig: { column, direction } });
    };

    const submitSubjectsForm = async (value) => {
        try {
            setIsOpenAddForm(false)
            setIsLoading(true)
            const payload = {
                "course_name": value.subject_name,
                "university_name": orgData?.role?.organization_id,
                "program_id": Number(program_id),
                "course_description": value.description,
                "semester": value.semester.join(","),
                "is_verified": false
            }
            const response = await axiosInstance.post(`/courses/`, payload);

            if (response) {
                setIsLoading(false);
                toast.success("Subject inserted successfully");
                getAllSubjects();
            }
        } catch (err) {
            setIsLoading(false);
            console.log("Error in submitSubjectsForm", err);
            toast.error("Error!!! Please try again")
        }
    }


    const [selectedSubject, setSelectedSubject] = useState(null)
    const editSubject = (subject) => {
        setIsOpenAddForm(true);
        setSelectedSubject(subject);
    }

    const updateSubjectsForm = async (value) => {
        try {
            console.log("sddsd");
            
            setIsOpenAddForm(false)
            setIsLoading(true)
            const payload = {
                "course_name": value.subject_name,
                "organization_id": orgData?.role?.organization_id,
                "program_id": selectedSubject?.program_id,
                "course_description": value.description,
                "semester": value.semester.join(","),
                "is_verified": true
            }
            const response = await axiosInstance.put(`/courses/${selectedSubject.course_id}/`, payload);

            if (response) {
                setIsLoading(false);
                toast.success("Subject updated successfully");
                getAllSubjects();
                setSelectedSubject(null)
            }
        } catch (err) {
            setIsLoading(false);
            setSelectedSubject(null)
            console.log("Error in updateSubjectsForm", err);
            toast.error("Error!!! Please try again")
        }
    }

    const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false)
    const deleteSubject = async () => {
        try {
            setIsOpenConfirmationModal(false)
            setIsLoading(true)
            const response = await axiosInstance.delete(`/courses/${selectedSubject.course_id}/`);

            if (response) {
                setIsLoading(false);
                toast.success("Subject deleted successfully");
                getAllSubjects();
                setSelectedSubject(null)
            }
        } catch (err) {
            setIsLoading(false);
            setSelectedSubject(null);
            console.log("Error in deleteSubject", err);
            toast.error("Error!!! Please try again")
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-white mb-3">
                <h5 className="m-0 main-title"> Subjects <span className="program-name text-uppercase">{program}</span></h5>
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
                        onClick={() => { setIsOpenAddForm(true); setSelectedSubject(null) }}
                    >
                        {" "}
                        Add Subjects +{" "}
                    </Button>
                </div>
            </div>

            <div className="my-3 w-100 table-div overflow-x-auto px-0 hide-scrollbar">
                <table className="table fs-9 mb-0">
                    <thead>
                        <tr>
                            <th width="5%">
                                <h5 className="sort mb-0 d-flex">#</h5>
                            </th>
                            <th width="25%">
                                <SortableHeader
                                    name="SUBJECT"
                                    id="name"
                                    column="name"
                                    onSort={handleSort}
                                />
                            </th>
                            <th width="35%">
                                <h5 className="sort mb-0 d-flex text-uppercase">Description</h5>
                            </th>
                            <th width="35%">
                                <h5 className="sort mb-0 d-flex text-uppercase">Semester</h5>
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
                                        <p className="mb-0">{index + 1}</p>
                                    </td>
                                    <td className="customer align-middle white-space-nowrap pe-5">
                                        <p className="mb-0 text-uppercase">{item.course_name || "N/A"}</p>
                                    </td>
                                    <td className="customer align-middle white-space-nowrap pe-5">
                                        <p className="mb-0">{item.course_description || "N/A"}</p>
                                    </td>
                                    {/* <td className="customer align-middle white-space-nowrap pe-5">
                                        <p className="mb-0">{item?.semester || "N/A"}</p>
                                    </td> */}
                                    <td className="customer align-middle white-space-nowrap pe-5">
                                        <p className="mb-0">
                                            {item?.semester ? (
                                                item.semester
                                                    .split(",") // Convert "25,27" into ["25", "27"]
                                                    .map((semId) => {
                                                        const sem = programSemesters.find(s => s.semester_id == semId);
                                                        return sem ? (
                                                            <span key={sem.semester_id} className="semesters me-1 text-uppercase">{sem.sem_name}</span>
                                                        ) : null;
                                                    })
                                            ) : "N/A"}
                                        </p>
                                    </td>

                                    <td className="total-orders align-middle white-space-nowrap">
                                        <div className="d-flex gap-2">
                                            <button
                                                className="shadow-none mx-0 border-0"
                                                onClick={() => editSubject(item)}
                                                style={{ background: "none" }}
                                            >
                                                <img
                                                    src="https://starlight-admin-v2.web.app/assets/images/pen.svg"
                                                    alt="Edit"
                                                />
                                            </button>
                                            <button
                                                className="shadow-none mx-0 border-0"
                                                onClick={() => { setIsOpenConfirmationModal(true); setSelectedSubject(item) }}
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
                        <p className="px-2 py-2 mb-0 bg-white border rounded">Total Records : <span className="fw-bold">{subjectsList.length}</span></p>
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
            <AddUpdateSubjects
                program_id={program_id}
                show={isOpenAddForm}
                handleClose={() => setIsOpenAddForm(false)}
                submitSubjectForm={submitSubjectsForm}
                selectedSubject={selectedSubject}
                updateSubjectForm={updateSubjectsForm}
                programSemesters={programSemesters}
            />
            <ConfirmationDialog
                show={isOpenConfirmationModal}
                handleClose={() => setIsOpenConfirmationModal(false)}
                handleConfirm={deleteSubject}
            />
            {isLoading && <Loading loading={true} loaderColor="#000" />}
        </>
    );
};

export default ManageSubjects;