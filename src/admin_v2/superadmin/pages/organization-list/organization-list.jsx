import React, { useState, useMemo, useEffect } from "react";
import { Form, Pagination } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";
import ReactPaginate from 'react-paginate';

import StatusConfirmationDialog from "./status-confirmation-dialog/status-confirmation-dialog";
import AddOrganizationForm from "./add-organization-form/add-organization-form";
import UpdateOrganizationForm from "./update-organization-form/update-organization-form";
import SortableHeader from "../../components/SortableHeader";
import axiosInstance from "../../components/services/axiosInstance";
//Style
import './organization-list.scss';

const OrganizationList = () => {
  const [loading, setLoading] = useState(false)

  //Organization list
  const [organiztionList, setOrganiztionList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ column: "", direction: "" });
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const getOrganizationList = async (payload) => {
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
    setLoading(true)
    const response = await axiosInstance.get(`/superadmin/organization/?${queryString}`);
    if (response && response.data) {
      setTotalRecords(response?.data?.pagination?.total);
      setTotalPages(response?.data?.pagination?.totalPages)
      setOrganiztionList(response?.data?.data)
      setLoading(false)
    }
  }


  const handlePageClick = (event) => {
    let page = (event.selected + 1)
    setCurrentPage(page)
    getOrganizationList({ page });
  };

  //Organization type list
  const [organiztionTypeList, setOrganiztionTypeList] = useState([]);
  const getOrganizationTypeList = async () => {
    const response = await axiosInstance.get(`/superadmin/organizationType/`);
    if (response && response.data) {
      setOrganiztionTypeList(response.data.data)
      console.log(response.data);
    }
  }

  useEffect(() => {
    getOrganizationTypeList();
    getOrganizationList({ page: currentPage });
  }, [])

  const handleSort = ({ column, direction }) => {
    console.log({ column, direction });
    setSortConfig({ column, direction })
    getOrganizationList({ page: currentPage, sortConfig: { column, direction } });
  };

  //Organization form
  const [isOpenOrganizationForm, setIsOpenOrganizationForm] = useState(false);
  const [isOpenOrganizationUpdateForm, setIsOpenOrganizationUpdateForm] = useState(false);

  const submitOrganizationForm = async (value) => {
    try {
    
      setLoading(true);
      const payload = {
        "organization_name": value.organization_name,
        "address": value.address,
        "city": value.city,
        "country": value.country,
        "state": value.state,
        "domain": value.domain,
        "organization_email": value.organization_email,
        "organization_type_id": Number(value.organization_type_id),
        "organization_subtype_id": Number(value.organization_subtype_id),
        "organization_phone_number": value.org_phone,
        "admin": {
          "firstName": value.first_name,
          "lastName": value.last_name,
          "email": value.admin_email,
          "password": value.password,
          "phoneNumber": value.admin_phone,
          "countryCode":value.country_code
        }
      }
      console.log(payload);
      
      const response = await axiosInstance.post(`/superadmin/organization/`, payload);

      if (response) {
        setLoading(false);
        toast.success("Organization inserted successfully");
        getOrganizationList({ page: currentPage });
        //setStep(0);
        setIsOpenOrganizationForm(false)
      }
    } catch (err) {
      setLoading(false);
      console.log("Error in submitOrganizationForm", err);
      //setStep(0);
      toast.error("Error!!! Please try again")
    }
  }

  const updateOrganization = async (value) => {
    try {
      setLoading(true);
      const payload = {
        "organization_type_id": value?.organization_type_id,
        "organization_subtype_id": Number(value.organization_subtype_id),
        "university_name": value.organization_name,
        "address": value.address,
        "country": value.country,
        "city": value.city,
        "state": value.state,
        "domain": value.domain,
        "user": value.organization_email,
        "is_verifed": selectedOrganizationData?.is_verifed,
        "primary_user_id": selectedOrganizationData?.primary_user_id?.id
      }

      const response = await axiosInstance.put(`/superadmin/organization/${selectedOrganizationData?.university_id}/`, payload);

      if (response) {
        setLoading(false);
        toast.success("Organization updated successfully");
        getOrganizationList({ page: currentPage });
        //setStep(0);
        setIsOpenOrganizationUpdateForm(false)
      }
    } catch (err) {
      setLoading(false);
      console.log("Error in updateOrganization", err);
      //setStep(0);
      toast.error("Error!!! Please try again")
    }
  }

  const [selectedOrganizationData, setSelectedOrganizationData] = useState(null)
  const editOrganizationDetails = (organization) => {
    setIsOpenOrganizationUpdateForm(true);
    setSelectedOrganizationData(organization);

  }

  //Change status
  const [isShowStatusConfirmatonModal, setIsShowStatusConfirmatonModal] = useState(false);
  const handleConfirmStatusChange = async () => {
    try {
      setLoading(true);

      const updatedStatus = selectedOrganizationData?.is_active ? 2 : 1;
      const response = await axiosInstance.put(`/organizationChangeStatus/${selectedOrganizationData?.university_id}/${updatedStatus}`, {});

      if (response) {
        getOrganizationList({ page: currentPage });
        setIsShowStatusConfirmatonModal(false);
        toast.success("Status updated successfully");
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setIsShowStatusConfirmatonModal(false);
      console.log("Error in handleConfirmStatusChange", err);
      //setStep(0);
      toast.error("Error!!! Please try again")
    }
  };

  return (
    <>
      <div className="">
        <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-white mb-3">
          <h5 className="m-0 main-title">Organizations</h5>
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
                onClick={() => { setSearch(''); getOrganizationList({ page: currentPage, clear: 'clear' }) }}
              >
                Clear
              </Button>
            </div>
            <Button
              variant="outline-primary add-organization"
              onClick={() => setIsOpenOrganizationForm(true)}
            >
              {" "}
              New Organization +{" "}
            </Button>
          </div>
        </div>

        <div className="my-3 w-100 org-table-div overflow-x-auto px-0 hide-scrollbar">
          <table className="table fs-9 mb-0">
            <thead>
              <tr>
                <th width="5%">
                  <h5 className="sort mb-0 text-center">#</h5>
                </th>
                <th width="20%">
                  <SortableHeader
                    name="Organization Name"
                    id="organization_name"
                    column="organization_name"
                    onSort={handleSort}
                  />
                </th>
                <th width="15%">
                  <h5 className="sort mb-0 d-flex">Organization Email</h5>
                </th>
                <th width="10%">
                  <h5 className="sort mb-0 d-flex">Organization Domain</h5>
                </th>
                <th width="10%">
                  <h5 className="sort mb-0 d-flex">Admin Name</h5>
                </th>
                <th width="20%">
                  <h5 className="sort mb-0 d-flex">Full Address</h5>
                </th>
                <th width="20%">
                  <h5 className="sort mb-0 d-flex">Phone Number</h5>
                </th>
                <th width="7%">
                  <h5 className="sort mb-0 text-center">Status</h5>
                </th>
                <th width="7%">
                  <h5 className="sort mb-0 text-center">Action</h5>
                </th>
              </tr>
            </thead>
            <tbody>
              {organiztionList.length > 0 ? (
                organiztionList.map((item, index) => (
                  <tr
                    key={index}
                    className="hover-actions-trigger btn-reveal-trigger position-static active-row"
                  >
                    <td className="total-orders align-middle white-space-nowrap">
                      <p className="mb-0 text-center">{(currentPage - 1) * pageSize + index + 1}</p>
                    </td>
                    <td className="total-orders align-middle white-space-nowrap">
                      {/* <p className="mb-0">{item.organization_name || "N/A"}</p> */}
                      <p className="mb-0">{item.university_name || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      {/* <p className="mb-0">{item.organization_email || "N/A"}</p> */}
                      <p className="mb-0">{item.user || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">{item.domain || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">{item?.primary_user_id ? (item?.primary_user_id?.first_name + " " + item?.primary_user_id?.last_name) : "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">{item?.address + ', ' + item?.city + ', ' + item?.state + ', ' + item?.country || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">+91 1234567890</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap">
                      <p className="mb-0 text-center">
                        <Form.Check
                          type="switch"
                          id={`switch-${item.university_id}`}
                          checked={item.is_active}
                          onChange={() => { setIsShowStatusConfirmatonModal(true); setSelectedOrganizationData(item) }}
                          className={`me-2 fw-bold d-flex justify-content-center gap-2 ${item.is_active ? "text-success" : "text-danger"}`}
                          label={item.is_active ? "Active" : "Inactive"}
                        />
                      </p>
                    </td>
                    <td className="total-orders align-middle white-space-nowrap">
                      <div className="d-flex justify-content-center">
                        <button
                          className="shadow-none mx-0 border-0"
                          onClick={() => editOrganizationDetails(item)}
                          style={{ background: "none" }}
                        >
                          <img
                            src="https://starlight-admin-v2.web.app/assets/images/pen.svg"
                            alt="Edit"
                          />
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
          {totalRecords > 0 && (
            <div className="d-flex justify-content-between w-100 py-4 px-4 align-items-center">
              <div className="table-footer">
                {(() => {
                  const start = (currentPage - 1) * pageSize + 1;
                  const end = Math.min(currentPage * pageSize, totalRecords);
                  return `Showing ${start} - ${end} of ${totalRecords}`;
                })()}
              </div>
              <div>
                <ReactPaginate
                  className='pagination'
                  breakLabel="..."
                  nextLabel=""
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={totalPages}
                  forcePage={(currentPage - 1)}
                  previousLabel=""
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
          )}
        </div>

        {/* Add new organization form */}
        <AddOrganizationForm
          show={isOpenOrganizationForm}
          handleClose={() => setIsOpenOrganizationForm(false)}
          submitOrganizationForm={submitOrganizationForm}
          organiztionTypeList={organiztionTypeList}
        />

        <UpdateOrganizationForm
          show={isOpenOrganizationUpdateForm}
          handleClose={() => setIsOpenOrganizationUpdateForm(!isOpenOrganizationUpdateForm)}
          updateOrganization={updateOrganization}
          organiztionTypeList={organiztionTypeList}
          selectedOrganizationData={selectedOrganizationData}
        />

        <StatusConfirmationDialog
          show={isShowStatusConfirmatonModal}
          handleClose={() => setIsShowStatusConfirmatonModal(false)}
          handleConfirm={handleConfirmStatusChange}
          status={selectedOrganizationData?.is_active}
        />

        {loading && <Loading loading={true} loaderColor="#000" />}
      </div>
    </>
  );
};

export default OrganizationList;
