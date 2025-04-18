import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import Loading from "react-fullscreen-loading";
import ReactPaginate from 'react-paginate';
import { useSelector } from "react-redux";
import ManagePromoCodeAddUpdate from "../add-update/add-update-promoCode";
import SortableHeader from "../../../components/SortableHeader";
import { toast } from "react-toastify";
import "./promoCode-lists.scss";
import axiosInstance from "../../../components/services/axiosInstance";

const ManagePromoCode = () => {
  // test
  const orgData = useSelector((state) => state.auth);
  const [programTypeList, setProgramType] = useState([]);
  const [programList, setProgramList] = useState([]);
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
    getAllProgramType();
    fetchPrograms();
    getAllRoles();
  }, []);

  const getAllProgramType = async () => {
    setIsLoading(true)
    const response = await axiosInstance.get(`/typeProgram/organization/${orgData?.role?.organization_id}/`);
    setProgramType(response?.data.data);
    setIsLoading(false)
  };
  const fetchPrograms = async () => {
    const response = await axiosInstance.get(`/program/organization/${orgData?.role?.organization_id}/`);
    setProgramList(response?.data.data);
  }

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
    const response = await axiosInstance.get(`/organization/${orgData?.role?.organization_id}/promoCode/?${queryString}`);
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
    const payload = {
      promo_code: data.promo_code,
      program_type_id: Number(data.program_type_id),
      organization_id: orgData?.role?.organization_id,
      program_id: Number(data.program_id),
      semester_id: Number(data.semester_id),
      allow_permission: data.allow_permission,
      created_by: orgData?.user?.id,
    };
    await axiosInstance.post(`organization/promoCode/`, payload);
    getAllRoles({ page: currentPage });
    handleClose();
  };

  const onUpdate = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        promo_code: data.promo_code,
        program_type_id: Number(data.program_type_id),
        organization_id: orgData?.role?.organization_id,
        program_id: Number(data.program_id),
        semester_id: Number(data.semester_id),
        allow_permission: data.allow_permission,
        created_by: orgData?.user?.id,
      };

      const response = await axiosInstance.put(
        `organization/promoCode/${selectedRole?.id}/`,
        payload
      );

      if (response) {
        setIsLoading(false);
        toast.success("PromoCode updated successfully");
        getAllRoles({ page: currentPage });
        setIsOpenAddForm(false);
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("Error!!! Please try again");
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

  const deleteRole = (id) => {
    if (window.confirm("Are you sure you want to delete this promo code?")) {
      setIsLoading(true)
      axiosInstance.delete(`organization/promoCodeDelete/${id}/`).then((res) => {
        setIsLoading(false)
        getAllRoles({ page: currentPage });
      }).catch((error) => {
        console.error("There was an error deleting the promo code!", error);
        setIsLoading(false)
      });
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-white mb-3 manage-promo-code">
        <h5 className="m-0 main-title">PromoCodes</h5>
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
            New PromoCode +{" "}
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
              <th width="20%">
                <SortableHeader
                  name="Promo Code"
                  id="promo_code"
                  column="promo_code"
                  onSort={handleSort}
                />
              </th>
              <th width="15%">
                <SortableHeader
                  name="Permission"
                  id="allow_permission"
                  column="allow_permission"
                  onSort={handleSort}
                />
              </th>
              <th width="20%">
                <SortableHeader
                  name="Program Type"
                  id="program_type_name"
                  column="program_type_name"
                  onSort={handleSort}
                />
              </th>

              <th width="20%">
                <SortableHeader
                  name="Program"
                  id="program_name"
                  column="program_name"
                  onSort={handleSort}
                />
              </th>
              <th width="10%">
                <SortableHeader
                  name="Semester"
                  id="semester_name"
                  column="semester_name"
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
                    <p className="mb-0">{item.promo_code || "N/A"}</p>
                  </td>
                  <td className="customer align-middle white-space-nowrap pe-5">
                    <p className="mb-0">{item.allow_permission || "N/A"}</p>
                  </td>
                  <td className="customer align-middle white-space-nowrap pe-5">
                    <p className="mb-0">{item.program_type_name || "N/A"}</p>
                  </td>
                  <td className="customer align-middle white-space-nowrap pe-5">
                    <p className="mb-0">{item.program_name || "N/A"}</p>
                  </td>
                  <td className="customer align-middle white-space-nowrap pe-5">
                    <p className="mb-0">{item.semester_name || "N/A"}</p>
                  </td>
                  <td className="total-orders align-middle white-space-nowrap">
                    <div className="d-flex gap-2">
                      <button className="shadow-none mx-0 border-0" onClick={() => edidDetails(item)} style={{ background: "none" }}>
                        <img src="https://starlight-admin-v2.web.app/assets/images/pen.svg" alt="Edit" />
                      </button>
                      <button className="shadow-none mx-0 border-0" onClick={() => deleteRole(item, index)} style={{ background: "none" }}>
                        <img src="https://starlight-admin-v2.web.app/assets/images/trash-xmark.svg" alt="Delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
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

      <ManagePromoCodeAddUpdate
        show={isOpenAddForm}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        programTypeListData={programTypeList}
        programListData={programList}
        handleClose={() => setIsOpenAddForm(false)}
        selectedRole={selectedRole}
      />
      {isLoading && <Loading loading={true} loaderColor="#000" />}
    </>
  );
};

export default ManagePromoCode;
