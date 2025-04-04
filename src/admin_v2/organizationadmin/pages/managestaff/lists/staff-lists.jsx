import React, { useState, useEffect } from "react";
import { Form, Pagination } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loading from "react-fullscreen-loading";
import ManageStaffAddUpdate from "../add-update/add-update-staff";
import ManageStaffAssignPrograms from "../assign-programs/assign-programs";
import ReactPaginate from 'react-paginate';

import SortableHeader from "../../../components/SortableHeader";
import "./staff-lists.scss";
import axiosInstance from "../../../components/services/axiosInstance";
import { toast } from "react-toastify";
import StatusConfirmationDialog from "../status-confirmation-dialog/status-confirmation-dialog";

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return "N/A";
  }

  let phone = phoneNumber.toString().replace(/\D/g, ""); // Remove non-numeric characters

  if (phone.length === 10) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  }

  return phoneNumber.toString(); // Return original if not 10 digits
};

const ManageStaff = () => {
  const orgData = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false)
  const [isOpenAddForm, setIsOpenAddForm] = useState(false);
  const [isOpenAssignPrograms, setIsOpenAssignProgramsForm] = useState(false);

  //Staff list
  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ column: "", direction: "" });
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const getStaffList = async (payload) => {
    const sortConfigData = payload?.sortConfig || sortConfig
    const searchData = payload?.search || search
    const pageData = payload?.page || currentPage

    setIsLoading(true)
    var queryParams = {
      pageSize: pageSize,
      page: pageData
    };

    if (searchData != "") {
      queryParams["filter"] = searchData;
    }

    if (sortConfigData?.column && sortConfigData?.direction) {
      queryParams["sortOrder"] = sortConfigData.direction;
      queryParams["sortKey"] = sortConfigData.column;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    setIsLoading(true);
    const response = await axiosInstance.get(`/getStaff/${orgData?.role?.organization_id}/?${queryString}`);
    if (response && response.data) {
      setTotalRecords(response.data.pagination.total);
      setTotalPages(response.data.pagination.totalPages)

      let staffList = response.data.data.sort((a, b) => {
        if (a.role_name === "Organization Admin" && b.role_name !== "Organization Admin") {
            return -1;
        }
        if (a.role_name !== "Organization Admin" && b.role_name === "Organization Admin") {
            return 1;
        }
        return 0;
    });
      setStaffList(staffList)
      getAllPrograms();
    }
    else {
      setIsLoading(false)
    }
  }

  const [programList, setProgramList] = useState([]);
  const getAllPrograms = async () => {
    try {
      const response = await axiosInstance.get(`/program/organization/${orgData?.role?.organization_id}/`);
      if (response.data.status) {
        let programList = response.data.data || [];
        programList = programList.filter(item => item.semester.length);
        setProgramList(programList);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Error in getAllPrograms", err);
    }
  };

  useEffect(() => {
    getStaffList(currentPage);
  }, [])

  const handleSort = ({ column, direction }) => {
    console.log({ column, direction });
    setSortConfig({ column, direction })
    getStaffList({ page: currentPage, sortConfig: { column, direction } });
  };

  const submitStaffForm = async (value) => {
    try {
      setIsLoading(true);
      const payload = {
        "organization_id": orgData?.role?.organization_id,
        "role_id": value.role_id,
        "admin": {
          "firstName": value.firstName,
          "lastName": value.lastName,
          "email": value.email,
          "password": value.password,
          "phoneNumber": value.phoneNumber
        }
      }

      const response = await axiosInstance.post(`/organization/createStaffUser/`, payload);

      if (response) {
        setIsLoading(false);
        toast.success("Staff inserted successfully");
        getStaffList(currentPage);
        setIsOpenAddForm(false)
      }
    } catch (err) {
      setIsLoading(false);
      console.log("Error in submitStaffForm", err);
      toast.error("Error!!! Please try again")
    }
  }

  const [staffDetails, setStaffDetails] = useState(null);
  const handleEditStaff = (staffDetails) => {
    setIsOpenAddForm(true)
    setStaffDetails(staffDetails)
  }

  const updateStaffForm = async (value) => {
    try {
      setIsLoading(true);
      const payload = {
        "firstName": value.firstName,
        "lastName": value.lastName,
        "email": value.email,
      }

      const response = await axiosInstance.put(`/organization/UpdateStaffUser/${staffDetails?.user_id}/`, payload);

      if (response) {
        setIsLoading(false);
        toast.success("Staff updated successfully");
        getStaffList(currentPage);
        setIsOpenAddForm(false)
      }
    } catch (err) {
      setIsLoading(false);
      console.log("Error in updateStaffForm", err);
      toast.error("Error!!! Please try again")
    }
  }

  const submitStaffAssignProgramsForm = (value) => {

  }

  const handlePageClick = (event) => {
    let page = (event.selected + 1)
    setCurrentPage(page)
    getStaffList({ page });
  };


  const [isShowStatusConfirmatonModal, setIsShowStatusConfirmatonModal] = useState(false);
  const handleConfirmStatusChange = () => {
    console.log(`Status changed`);
    setIsShowStatusConfirmatonModal(false);
  };
  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-white mb-3">
        <h5 className="m-0 main-title">Staff</h5>
        <div className="d-flex justify-content-end gap-2">
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="outline-primary add-organization"
            // onClick={handleShow}
            >
              Filter{" "}
            </Button>
            <Button
              variant="outline-danger add-organization"
            // onClick={handleShow}
            >
              Clear
            </Button>
          </div>
          <Button
            variant="outline-primary add-organization"
            onClick={() => { setIsOpenAddForm(true); setStaffDetails(null) }}
          >
            {" "}
            New Staff +{" "}
          </Button>
        </div>
      </div>

      <div className="my-3 w-100 staff-table-div overflow-x-auto px-0 hide-scrollbar">
        <table className="table fs-9 mb-0">
          <thead>
            <tr style={{textTransform:'uppercase'}}>
              <th width="5%">
                <h5 className="sort mb-0 text-center">#</h5>
              </th>
              <th>
                <SortableHeader
                  name="First Name"
                  id="first_name"
                  column="first_name"
                  onSort={handleSort}
                  center={false}
                />
              </th>
              <th>
                <SortableHeader
                  name="Last Name"
                  id="last_name"
                  column="last_name"
                  onSort={handleSort}
                  center={false}
                />
              </th>
              <th>
                <SortableHeader
                  name="Email"
                  id="email"
                  column="email"
                  onSort={handleSort}
                  center={false}
                />
              </th>
              <th className="text-center">
                <SortableHeader
                  name="Role"
                  id="role_name"
                  column="role_name"
                  onSort={handleSort}
                  center={true}
                />
              </th>
              <th>
                <h5 className="sort mb-0 text-center">Phone Number</h5>
              </th>
              <th>
                <h5 className="sort mb-0 text-center  ">Status</h5>
              </th>
              <th>
                <h5 className="sort mb-0 text-center">Assign Programs</h5>
              </th>
              <th>
                <h5 className="sort mb-0 text-center">Action</h5>
              </th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((item, index) => (
                <tr
                  key={index}
                  className="hover-actions-trigger btn-reveal-trigger position-static active-row"
                >
                  <td className="total-orders align-middle white-space-nowrap">
                    <p className="mb-0 text-center">{index+1}</p>
                  </td>
                  <td className="total-orders align-middle white-space-nowrap">
                    <p className="mb-0">{item.first_name || "N/A"}</p>
                  </td>
                  <td className="customer align-middle white-space-nowrap">
                    <p className="mb-0">{item.last_name || "N/A"}</p>
                  </td>
                  <td className="customer align-middle white-space-nowrap">
                    <p className="mb-0">{item.email || "N/A"}</p>
                  </td>
                  <td className="customer align-middle white-space-nowrap">
                    <p className="mb-0 text-center"><span className={`${item.role_name ? 'staff_role' : ''}`}>{item.role_name || "N/A"}</span></p>
                  </td>
                  <td className="customer align-middle white-space-nowrap">
                    <p className="mb-0 text-center">
                      {formatPhoneNumber(item.phoneNumber)}
                    </p>
                  </td>
                  <td className="customer white-space-nowrap">
                    <p className="mb-0 text-center">
                      <Form.Check
                        type="switch"
                        id={`switch-${item.user_id}`}
                        checked={item.is_active}
                        onChange={() => { setIsShowStatusConfirmatonModal(true); setStaffDetails(item) }}
                        className={`fw-bold d-flex justify-content-center  gap-2 ${item.is_active ? "text-success" : "text-danger"}`}
                        label={item.is_active ? "Active" : "Inactive"}
                      />
                    </p>
                  </td>
                  <td className="customer white-space-nowrap text-center">
                    <button className="btn btn-sm btn-primary" onClick={() => { setIsOpenAssignProgramsForm(true); setStaffDetails(item) }}>View</button>
                  </td>
                  <td className="total-orders align-middle white-space-nowrap">
                    <div className="text-center">
                      <button title="Edit Staff" className="shadow-none mx-0 border-0" onClick={() => handleEditStaff(item)} style={{ background: "none" }}>
                        <img src="https://starlight-admin-v2.web.app/assets/images/pen.svg" alt="Edit" />
                      </button>
                      {/* <button className="shadow-none mx-0 border-0" onClick={() => deleteUser(item, index)} style={{ background: "none" }}>
                        <img src="https://starlight-admin-v2.web.app/assets/images/trash-xmark.svg" alt="Delete"/>
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="d-flex justify-content-between w-100 py-4 px-4 align-items-center">
          <div className="table-footer">
            Total Records : {totalRecords > 0 ? currentPage !== pageSize ? (((currentPage) * (pageSize) - pageSize) + 1) : totalRecords : 0} of {totalRecords}
          </div>
          <div>
            <ReactPaginate
              className='pagination'
              breakLabel="..."
              nextLabel=""
              onPageChange={handlePageClick}
              pageRangeDisplayed={pageSize}
              pageCount={totalPages}
              forcePage={(currentPage - 1)}
              previousLabel=""
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>
      <ManageStaffAssignPrograms
        show={isOpenAssignPrograms}
        handleClose={() => setIsOpenAssignProgramsForm(false)}
        submitForm={submitStaffAssignProgramsForm}
        staffDetails={staffDetails}
        programList={programList}
      />

      <ManageStaffAddUpdate
        show={isOpenAddForm}
        handleClose={() => setIsOpenAddForm(false)}
        submitStaffForm={submitStaffForm}
        staffDetails={staffDetails}
        updateStaffForm={updateStaffForm}
      />

      <StatusConfirmationDialog
        show={isShowStatusConfirmatonModal}
        handleClose={() => setIsShowStatusConfirmatonModal(false)}
        handleConfirm={handleConfirmStatusChange}
        status={staffDetails?.is_active}
      />
      {isLoading && <Loading loading={true} loaderColor="#000" />}
    </>
  );
};

export default ManageStaff;
