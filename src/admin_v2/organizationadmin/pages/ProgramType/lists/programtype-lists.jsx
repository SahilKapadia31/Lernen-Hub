import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Pagination } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import Loading from "react-fullscreen-loading";
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";
import SortableHeader from "../../../components/SortableHeader";
import AddUpdateProgramType from "./add-update/add-update-programtype";
import ConfirmationDialog from "./confirmation-dialog/confirmation-dialog";
import { useSelector } from "react-redux";
import "./ProgramType-lists.scss";
import axiosInstance from "../../../components/services/axiosInstance";

const ManagestaffProgramTypes = () => {
    const orgData = useSelector((state) => state.auth);

    const [isOpenAddForm, setIsOpenAddForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("");
    const [programTypeList, setProgramTypeList] = useState([]);

    useEffect(() => {
        getAllProgramType();
    }, []);

    const getAllProgramType = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get(`/typeProgram/organization/${orgData?.role?.organization_id}/`);
            if (response.data.status) {
                setProgramTypeList(response.data.data)
                setIsLoading(false)
            }
        } catch (err) {
            setIsLoading(false)
            console.log("Error in getAllProgramType", err);
        }
    };

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = programTypeList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(programTypeList.length / itemsPerPage);

    const handleSort = ({ column, direction }) => {
        console.log({ column, direction });
        // setSortConfig({ column, direction })
        // getAllRoles({ page: currentPage, sortConfig: { column, direction } });
    };

    const submitProgramTypeForm = async (value) => {
        try {
            setIsOpenAddForm(false)
            setIsLoading(true)
            const payload = {
                "name": value.program_type,
                "organization_id": orgData?.role?.organization_id,
                "description": value.description
            }
            const response = await axiosInstance.post(`/typeProgram/`, payload);

            if (response) {
                setIsLoading(false);
                toast.success("Program type inserted successfully");
                getAllProgramType();
            }
        } catch (err) {
            setIsLoading(false);
            console.log("Error in submitProgramTypeForm", err);
            toast.error("Error!!! Please try again")
        }
    }

    const updateProgramTypeForm = async (value) => {
        try {
            setIsOpenAddForm(false)
            setIsLoading(true)
            const payload = {
                "name": value.program_type,
                "description": value.description,
                "organization_id": orgData?.role?.organization_id,
            }
            const response = await axiosInstance.put(`/typeProgram/${selectedProgramType.id}/`, payload);

            if (response) {
                setIsLoading(false);
                toast.success("Program type updated successfully");
                getAllProgramType();
                setSelectedProgramType(null)
            }
        } catch (err) {
            setIsLoading(false);
            setSelectedProgramType(null)
            console.log("Error in updateProgramTypeForm", err);
            toast.error("Error!!! Please try again")
        }
    }

    const [selectedProgramType, setSelectedProgramType] = useState(null)
    const editProgramType = (programType) => {
        setIsOpenAddForm(true);
        setSelectedProgramType(programType);
    }

    const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false)
    const deleteProgramType = async () => {
        try {
            setIsOpenConfirmationModal(false)
            setIsLoading(true)
            const response = await axiosInstance.delete(`/typeProgram/${selectedProgramType.id}/`);

            if (response) {
                setIsLoading(false);
                toast.success("Program type deleted successfully");
                getAllProgramType();
                setSelectedProgramType(null)
            }
        } catch (err) {
            setIsLoading(false);
            setSelectedProgramType(null);
            console.log("Error in deleteProgramType", err);
            toast.error("Error!!! Please try again")
        }
    }
    return (
        <>
            <div className="p-3 mb-3 bg-white border rounded d-flex justify-content-between align-items-center">
                <h5 className="m-0 main-title">Program Type</h5>
                <div className="gap-2 d-flex justify-content-end">
                    <div className="gap-2 d-flex">
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
                        onClick={() => { setIsOpenAddForm(true); setSelectedProgramType(null) }}
                    >
                        {" "}
                        Program Type +{" "}
                    </Button>
                </div>
            </div>

            <div className="px-0 my-3 overflow-x-auto w-100 table-div hide-scrollbar">
                <table className="table mb-0 fs-9">
                    <thead>
                        <tr>
                            <th width="5%">
                                <h5 className="mb-0 sort d-flex">#</h5>
                            </th>
                            <th width="25%">
                                <SortableHeader
                                    name="PROGRAM TYPE"
                                    id="name"
                                    column="name"
                                    onSort={handleSort}
                                />
                            </th>
                            <th width="25%">
                                <h5 className="mb-0 sort d-flex text-uppercase">Description</h5>
                            </th>
                            <th width="25%">
                                <h5 className="mb-0 sort d-flex text-uppercase">Total Programs</h5>
                            </th>
                            <th width="5%">
                                <h5 className="mb-0 sort d-flex text-uppercase">Action</h5>
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
                                    <td className="align-middle total-orders white-space-nowrap">
                                        <p className="mb-0">{index + 1}</p>
                                    </td>
                                    <td className="align-middle customer white-space-nowrap pe-5">
                                        <Link to={`/organization/programs/${item.id}?program_type=${item.name}`}><p className="mb-0 text-uppercase">{item.name || "N/A"}</p></Link>
                                    </td>
                                    <td className="align-middle customer white-space-nowrap pe-5">
                                        <p className="mb-0">{item.description || "N/A"}</p>
                                    </td>
                                    <td className="align-middle customer white-space-nowrap pe-5">
                                        <p className="mb-0">20</p>
                                    </td>
                                    <td className="align-middle total-orders white-space-nowrap">
                                        <div className="gap-2 d-flex">
                                            <button
                                                className="mx-0 border-0 shadow-none"
                                                // onClick={() => editProgramType(item)}
                                                style={{ background: "none" }}
                                            >
                                                <Link to={`/organization/programs/${item.id}?program_type=${item.name}`}>
                                                    <img
                                                        src="https://starlight-admin-v2.web.app/assets/images/eye.svg"
                                                        alt="show"
                                                    />
                                                </Link>

                                            </button>
                                            <button
                                                className="mx-0 border-0 shadow-none"
                                                onClick={() => editProgramType(item)}
                                                style={{ background: "none" }}
                                            >
                                                <img
                                                    src="https://starlight-admin-v2.web.app/assets/images/pen.svg"
                                                    alt="Edit"
                                                />
                                            </button>
                                            <button
                                                className="mx-0 border-0 shadow-none"
                                                onClick={() => { setIsOpenConfirmationModal(true); setSelectedProgramType(item) }}
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
                    <div className="px-2 mt-3 d-flex align-items-center justify-content-between">
                        <p className="px-2 py-2 mb-0 bg-white border rounded">Total Records : <span className="fw-bold">{programTypeList.length}</span></p>
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
            <AddUpdateProgramType
                show={isOpenAddForm}
                handleClose={() => setIsOpenAddForm(false)}
                submitProgramTypeForm={submitProgramTypeForm}
                selectedProgramType={selectedProgramType}
                updateProgramTypeForm={updateProgramTypeForm}
            />
            <ConfirmationDialog
                show={isOpenConfirmationModal}
                handleClose={() => setIsOpenConfirmationModal(false)}
                handleConfirm={deleteProgramType}
            />
            {isLoading && <Loading loading={true} loaderColor="#000" />}
        </>
    );
};

export default ManagestaffProgramTypes;