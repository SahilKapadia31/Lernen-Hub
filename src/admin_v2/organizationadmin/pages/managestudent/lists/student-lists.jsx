import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Pagination } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import ManageStudentAddUpdate from "../add-update/add-update-student";
import ManageStudentAssignPrograms from "../assign-programs/assign-programs";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import SortableHeader from "../../../components/SortableHeader";
import "./student-lists.scss";
import { toast } from "react-toastify";
import StatusConfirmationDialog from "../status-confirmation-dialog/status-confirmation-dialog";
import Loading from "react-fullscreen-loading";
import UploadFile from "../../../components/upload-file/upload-file";
import axiosInstance from "../../../components/services/axiosInstance";

import upload_file_icon from "../../../../../assets/svg/upload-file.svg"
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

const ManageStudent = () => {
  const orgData = useSelector((state) => state.auth);
  const [isOpenAddForm, setIsOpenAddForm] = useState(false);
  const [isOpenAssignPrograms, setIsOpenAssignProgramsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentRoleId, setStudentRoleID] = useState(null);
  const [uploadFile, setUploadFile] = useState(false);
  const [studentType, setStudentType] = useState('active');

  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ column: "", direction: "" });
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //Staff list
  const [studentList, setStudentList] = useState([]);
  const getStudentList = async (payload) => {
    const sortConfigData = payload?.sortConfig || sortConfig
    const searchData = payload?.clear ? '' : search
    const pageData = payload?.page || currentPage

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

    let response = null;
    if (studentType == 'active') {
      response = await axiosInstance.get(`/getStudent/${orgData?.role?.organization_id}/?${queryString}`);
    } else {
      response = await axiosInstance.get(`/organization/uploadStudentsData/?organization_id=${orgData?.role?.organization_id}&${queryString}`);
    }

    if (response && response.data) {
      setIsLoading(false);
      setTotalRecords(response.data.pagination.total);
      setTotalPages(response.data.pagination.totalPages);
      setStudentList(response.data.data);
      getAllPrograms();
    } else {
      setIsLoading(false);
    }
  };

  const getAllRoles = async () => {
    setIsLoading(true);
    const response = await axiosInstance.get(
      `/organization/${orgData?.role?.organization_id}/roles/?pageSize=1000&page=1`
    );
    const role_id = response.data.data.find(
      (x) => x.role_name == "Student"
    ).role_id;
    setStudentRoleID(role_id);
    setIsLoading(false);
  };


  const [programList, setProgramList] = useState([]);
  const getAllPrograms = async () => {
    try {
      const response = await axiosInstance.get(
        `/program/organization/${orgData?.role?.organization_id}/`
      );
      if (response.data.status) {
        let programList = response.data.data || [];
        programList = programList.filter((item) => item.semester.length);
        setProgramList(programList);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Error in getAllPrograms", err);
    }
  };

  useEffect(() => {
    getStudentList(currentPage);
  }, [studentType]);

  useEffect(() => {
    getAllRoles()
  }, []);

  const handleSort = ({ column, direction }) => {
    console.log({ column, direction });
    setSortConfig({ column, direction })
    getStudentList({ page: currentPage, sortConfig: { column, direction } });
  };

  const submitStudentForm = async (value) => {
    setIsLoading(true);
    try {
      const payload = {
        organization_id: orgData?.role?.organization_id,
        role_id: studentRoleId,
        admin: {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          password: value.password,
          phoneNumber: value.phoneNumber,
        },
      };

      const response = await axiosInstance.post(
        `/organization/createStaffUser/`,
        payload
      );

      if (response) {
        setIsLoading(false);
        toast.success("Student inserted successfully");
        getStudentList({ page: currentPage });
        setIsOpenAddForm(false);
        //setIsOpenAssignProgramsForm(true)
      } else {
        setIsLoading(false);
        toast.error("Error!!! Please try again");
      }
    } catch (err) {
      setIsLoading(false);
      console.log("Error in submitStudentForm", err);
      toast.error("Error!!! Please try again");
    }
  };

  const [studentDetails, setStudentDetails] = useState(null);
  const handleEditStaff = (studentDetails) => {
    setIsOpenAddForm(true);
    setStudentDetails(studentDetails);
  };

  const updateStudentForm = async (value) => {
    try {
      setIsLoading(true);
      const payload = {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
      };

      const response = await axiosInstance.put(
        `/organization/UpdateStaffUser/${studentDetails?.user_id}/`,
        payload
      );

      if (response) {
        setIsLoading(false);
        toast.success("Student updated successfully");
        getStudentList({ page: currentPage });
        setIsOpenAddForm(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log("Error in updateStudentForm", err);
      toast.error("Error!!! Please try again");
    }
  };

  const onOpenAssignPrograms = () => {
    setIsOpenAssignProgramsForm(true);
    setStudentDetails(studentDetails);
  };

  const submitStaffAssignProgramsForm = (value) => { };

  const handlePageClick = (event) => {
    let page = event.selected + 1;
    setCurrentPage(page);
    getStudentList({ page });
  };

  const [isShowStatusConfirmatonModal, setIsShowStatusConfirmatonModal] = useState(false);
  const handleConfirmStatusChange = async () => {
    try {
      setIsLoading(true);

      const updatedStatus = studentDetails?.is_active ? 2 : 1;

      const response = await axiosInstance.put(`/userChangeStatus/${studentDetails?.user_id}/${updatedStatus}`, {});

      if (response) {
        getStudentList({ page: currentPage });
        setIsShowStatusConfirmatonModal(false);
        toast.success("Status updated successfully");
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setIsShowStatusConfirmatonModal(false);
      console.log("Error in handleConfirmStatusChange", err);
      //setStep(0);
      toast.error("Error!!! Please try again")
    }
  };
  return (
    <>
      <div className="student-lists">
        <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-white mb-3">
          <h5 className="m-0 main-title">Students</h5>
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
                onClick={handleSort}
              >
                Filter{" "}
              </Button>
              <Button
                variant="outline-danger add-organization"
                onClick={() => { setSearch(''); getStudentList({ page: currentPage, clear: 'clear' }) }}
              >
                Clear
              </Button>
            </div>
            <Button
              variant="outline-primary add-organization"
              onClick={() => {
                setIsOpenAddForm(true);
                setStudentDetails(null);
              }}
            >
              {" "}
              New Student +{" "}
            </Button>
            <Button
              variant="outline-primary add-organization"
              title="Upload Student File"
              onClick={() => {
                setUploadFile(true);
              }}
            >
              <img src={upload_file_icon} width={15} />
            </Button>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-end">
          <div className="bg-white bg-white px-2 py-2 border rounded d-flex align-items-center gap-2">
            <p onClick={() => setStudentType('active')} className={`mb-0 student-type ${studentType == 'active' ? 'active-student-type' : ''}`}>Active Student</p>
            <p onClick={() => setStudentType('inactive')} className={`mb-0 student-type ${studentType == 'inactive' ? 'active-student-type' : ''}`}>Inactive Student</p>
          </div>
        </div>
        <div className="my-3 w-100 table-div overflow-x-auto px-0 hide-scrollbar">
          <table className="table fs-9 mb-0">
            <thead>
              <tr style={{ textTransform: "uppercase" }}>
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
                {studentType == 'active' &&(<>
                <th>
                  <h5 className="sort mb-0 text-center ">Status</h5>
                </th>
                <th>
                  <h5 className="sort mb-0 text-center">Assign Programs</h5>
                </th>
                </>)}
                <th>
                  <h5 className="sort mb-0 text-center">Action</h5>
                </th>
              </tr>
            </thead>
            <tbody>
              {studentList.length > 0 ? (
                studentList.map((item, index) => (
                  <tr
                    key={index}
                    className="hover-actions-trigger btn-reveal-trigger position-static active-row"
                  >
                    <td className="total-orders align-middle white-space-nowrap">
                      <p className="mb-0 text-center">{index + 1}</p>
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
                      <p className="mb-0 text-center">
                        <span className={`${item.role_name ? "staff_role" : ""}`}>
                          {item.role_name || "N/A"}
                        </span>
                      </p>
                    </td>
                    <td className="customer align-middle white-space-nowrap">
                      <p className="mb-0 text-center">
                        {formatPhoneNumber(item.phoneNumber)}
                      </p>
                    </td>
                    {studentType == 'active' &&(<>
                    <td className="customer white-space-nowrap">
                      <p className="mb-0 text-center">
                        <Form.Check
                          type="switch"
                          id={`switch-${item.user_id}`}
                          checked={item.is_active}
                          onChange={() => {
                            setIsShowStatusConfirmatonModal(true);
                            setStudentDetails(item);
                          }}
                          className={`fw-bold d-flex justify-content-center  gap-2 ${item.is_active ? "text-success" : "text-danger"
                            }`}
                          label={item.is_active ? "Active" : "Inactive"}
                        />
                      </p>
                    </td>
                    <td className="customer white-space-nowrap text-center">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          onOpenAssignPrograms();
                          setStudentDetails(item);
                        }}
                      >
                        View
                      </button>
                    </td>
                    </>)}
                    <td className="total-orders align-middle white-space-nowrap">
                      <div className="text-center">
                        <button
                          title="Edit Staff"
                          className="shadow-none mx-0 border-0"
                          onClick={() => handleEditStaff(item)}
                          style={{ background: "none" }}
                        >
                          <img
                            src="https://starlight-admin-v2.web.app/assets/images/pen.svg"
                            alt="Edit"
                          />
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
                    No Records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className=" d-flex justify-content-between w-100 px-4 py-3 align-items-center">
            <div className="table-footer">
              Total Records :{" "}
              {totalRecords > 0
                ? currentPage !== pageSize
                  ? currentPage * pageSize - pageSize + 1
                  : totalRecords
                : 0}{" "}
              of {totalRecords}
            </div>
            <div className="">
              <ReactPaginate
                className="pagination"
                breakLabel="..."
                nextLabel=""
                onPageChange={handlePageClick}
                pageRangeDisplayed={pageSize}
                pageCount={totalPages}
                forcePage={currentPage - 1}
                previousLabel=""
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        </div>

        <ManageStudentAssignPrograms
          show={isOpenAssignPrograms}
          handleClose={() => setIsOpenAssignProgramsForm(false)}
          submitStudentForm={submitStaffAssignProgramsForm}
          studentDetails={studentDetails}
          programList={programList}
        />

        <ManageStudentAddUpdate
          show={isOpenAddForm}
          handleClose={() => setIsOpenAddForm(false)}
          submitStudentForm={submitStudentForm}
          studentDetails={studentDetails}
          updateStudentForm={updateStudentForm}
        />

        <StatusConfirmationDialog
          show={isShowStatusConfirmatonModal}
          handleClose={() => setIsShowStatusConfirmatonModal(false)}
          handleConfirm={handleConfirmStatusChange}
          status={studentDetails?.is_active}
        />

        <UploadFile
          show={uploadFile}
          handleClose={() => setUploadFile(false)}
          organization_id={orgData?.role?.organization_id}
        />
        {isLoading && <Loading loading={true} loaderColor="#000" />}
      </div>
    </>
  );
};

export default ManageStudent;
