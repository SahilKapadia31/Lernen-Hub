import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import Loading from "react-fullscreen-loading";
import ReactPaginate from 'react-paginate';
import { useSelector } from "react-redux";
import ManageRoleAddUpdate from "../add-update/add-update-role";
import DeleteConfirmationDialog from "../../../components/delete-confirmation-dialog/delete-confirmation-dialog";
import SortableHeader from "../../../components/SortableHeader";
import "./role-lists.scss";
import axiosInstance from "../../../components/services/axiosInstance";
import { toast } from "react-toastify";

const ManageStaff = () => {
  const orgData = useSelector((state) => state.auth);
  const [permissions, setPermissions] = useState([]);
  const [isOpenAddForm, setIsOpenAddForm] = useState(false);
  const handleClose = () => setIsOpenAddForm(false);
  const handleShow = () => setIsOpenAddForm(true);

  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ column: "", direction: "" });
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [sortedData, setSortedData] = useState()
  const [lists, setLists] = useState([]);

  useEffect(() => {
    getAllPermission();
    getAllRoles();
  }, []);

  const getAllPermission = async () => {
    setIsLoading(true)
    const response = await axiosInstance.get(`/organization/permissions/`);
    console.log(response?.data?.data);
    setPermissions(response?.data?.data);
    setIsLoading(false)
  };

  const getAllRoles = async (payload) => {
    const sortConfigData = payload?.sortConfig || sortConfig
    const searchData = payload?.clear ? '' : search
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
    const response = await axiosInstance.get(`/organization/${orgData?.role?.organization_id}/roles/?${queryString}`);
    setTotalRecords(response.data.pagination.total);
    setTotalPages(response.data.pagination.totalPages)
    setLists(response.data.data);
    setIsLoading(false)
  };

  const handleSort = ({ column, direction }) => {
    console.log({ column, direction });
    setSortConfig({ column, direction })
    getAllRoles({ page: currentPage, sortConfig: { column, direction } });
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const payload = {
        role_name: data.role_name,
        organization_id: orgData?.role?.organization_id,
        option_id: "4",
        permissions: data.permissions.map((item) => ({
          "permission_id": item.permission_id,
          permission_name: item.permission_name,
          is_active: item.is_active,
        })),
      };

      const res = await axiosInstance.post(`/organization/add-roles/`, payload);

      if (res && res.status) {
        toast.success("Role added successfully");
        getAllRoles({ page: currentPage });
        handleClose();
      } else {
        toast.error("Error!!! Please try again");
      }
      setIsLoading(false)
    } catch (err) {
      console.log("Error in onSubmitRole", err);
      setIsLoading(false)
    }
  };

  const handleUpdateRole = async (data) => {
    try {
      setIsLoading(true)
      const payload = {
        "role_id": selectedRole?.role_id,
        role_name: data.role_name,
        organization_id: orgData?.role?.organization_id,
        option_id: "4",
        permissions: data.permissions.map((item) => ({
          "permission_id": item.permission_id,
          permission_name: item.permission_name,
          is_active: item.is_active,
        })),
      };

      const res = await axiosInstance.put(`/organization/update-roles/`, payload);

      if (res && res.status) {
        toast.success("Role updated successfully")
        getAllRoles({ page: currentPage });
        handleClose();
      } else {
        toast.success("Error!!! Please try again")
      }
      setIsLoading(true)
    } catch (err) {
      console.log("Error in handleUpdateRole", err);
    }
  };

  const [openConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const deleteRole = async (data) => {
    try {
      setIsLoading(true)
      const res = await axiosInstance.delete(`/organization/delete-roles/${selectedRole?.role_id}/`);
      if (res && res.status) {
        toast.success("Role deleted successfully")
        getAllRoles({ page: currentPage });
        setIsOpenConfirmationModal(false);
      } else {
        toast.success("Error!!! Please try again")
      }
      setIsLoading(true)
    } catch (err) {
      console.log("Error in deleteRole", err);
    }
  };


  const [selectedRole, setSelectedRole] = useState(null);
  const edidDetails = (role) => {
    setSelectedRole(role);
    handleShow(true);
  };

  // Pagination
  const handlePageClick = (event) => {
    let page = (event.selected + 1)
    setCurrentPage(page)
    getAllRoles({ page });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-white mb-3 manage-role">
        <h5 className="m-0 main-title">Roles</h5>
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
              onClick={handleSort}
            >
              Filter{" "}
            </Button>
            <Button
              variant="outline-danger add-organization"
              onClick={() => { setSearch(''); getAllRoles({ page: currentPage, clear: 'clear' }) }}
            >
              Clear
            </Button>
          </div>
          <Button
            variant="outline-primary add-organization"
            onClick={() => { handleShow(); setSelectedRole(null) }}
          >
            {" "}
            New Role +{" "}
          </Button>
        </div>
      </div>

      <div className="my-3 w-100 role-table-div overflow-x-auto px-0 hide-scrollbar">
        <table className="table fs-9 mb-0">
          <thead>
            <tr>
              <th width="5%">
                <h5 className="sort mb-0 text-center">#</h5>
              </th>
              <th width="80%">
                <SortableHeader
                  name="Role Name"
                  id="role_name"
                  column="role_name"
                  onSort={handleSort}
                />
              </th>
              <th width="10%">
                <h5 className="sort mb-0 d-flex">Action</h5>
              </th>
            </tr>
          </thead>
          <tbody>
            {lists.length > 0 ? (
              lists.map((item, index) => (
                <tr
                  key={index}
                  className="hover-actions-trigger btn-reveal-trigger position-static active-row"
                >
                  <td className="total-orders align-middle white-space-nowrap">
                    <p className="mb-0 text-center">{index + 1}</p>
                  </td>
                  <td className="customer align-middle white-space-nowrap pe-5">
                    <p className="mb-0">{item.role_name || "N/A"}</p>
                  </td>
                  <td className="total-orders align-middle white-space-nowrap">
                    <div className="d-flex gap-2">
                      <button className="shadow-none mx-0 border-0" onClick={() => { setSelectedRole(null); edidDetails(item) }} style={{ background: "none" }}>
                        <img src="https://starlight-admin-v2.web.app/assets/images/pen.svg" alt="Edit" />
                      </button>
                      <button className="shadow-none mx-0 border-0" onClick={() => { setSelectedRole(item); setIsOpenConfirmationModal(true) }} style={{ background: "none" }}>
                        <img src="https://starlight-admin-v2.web.app/assets/images/trash-xmark.svg" alt="Delete" />
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
        <div className="d-flex justify-content-between py-3 px-4">
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

      <ManageRoleAddUpdate
        show={isOpenAddForm}
        onSubmit={onSubmit}
        permissionsData={permissions}
        handleClose={() => setIsOpenAddForm(false)}
        selectedRole={selectedRole}
        onUpdate={handleUpdateRole}
      />

      <DeleteConfirmationDialog
        show={openConfirmationModal}
        handleClose={() => setIsOpenConfirmationModal(false)}
        handleConfirm={deleteRole}
      />
      {isLoading && <Loading loading={true} loaderColor="#000" />}
    </>
  );
};

export default ManageStaff;
