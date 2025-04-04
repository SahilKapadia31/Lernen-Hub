import React, { useState, useMemo, useEffect } from "react";
import { Form, Pagination } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";

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
  const getOrganizationList = async () => {
    setLoading(true)
    const response = await axiosInstance.get(`/superadmin/organization/`);
    if (response && response.data) {
      var filteredData = response.data.filter(item => item.organization_type);
      filteredData = filteredData.map((item, index) => {
        return { ...item, id: index + 1 };
      });
      setOrganiztionList(filteredData)
      setLoading(false)
    }
  }

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
    getOrganizationList();
  }, [])

  //Table
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = ({ column, direction }) => {
    const sortedData = [...organiztionList].sort((a, b) => {
      if (!direction) return 0;
      return direction === "asc"
        ? a[column] > b[column]
          ? 1
          : -1
        : a[column] < b[column]
          ? 1
          : -1;
    });

    setOrganiztionList(sortedData);
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = organiztionList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(organiztionList.length / itemsPerPage);

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
        "admin": {
          "firstName": value.first_name,
          "lastName": value.last_name,
          "email": value.admin_email,
          "password": value.password,
          "phoneNumber": value.phone
        }
      }
      const response = await axiosInstance.post(`/superadmin/organization/`, payload);

      if (response) {
        setLoading(false);
        toast.success("Organization inserted successfully");
        getOrganizationList();
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
        "organization_name": value.organization_name,
        "address": value.address,
        "country": value.country,
        "city": value.city,
        "state": value.state,
        "domain": value.domain,
        "organization_email": value.organization_email,
        "is_verifed": selectedOrganizationData?.is_verifed,
        "primary_user_id": selectedOrganizationData?.primary_user_id
      }

      const response = await axiosInstance.put(`/superadmin/organization/${selectedOrganizationData?.organization_id}/`, payload);

      if (response) {
        setLoading(false);
        toast.success("Organization updated successfully");
        getOrganizationList();
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
  const handleConfirmStatusChange = () => {
    console.log(`Status changed`);
    setIsShowStatusConfirmatonModal(false);
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
              // onChange={(e) => setSearch(e.target.value)}
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
                <th width="3%">
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
                <th width="12%">
                  <h5 className="sort mb-0 d-flex">Organization Domain</h5>
                </th>
                <th width="20%">
                  <h5 className="sort mb-0 d-flex">Address</h5>
                </th>
                <th width="7%">
                  <SortableHeader
                    name="City"
                    id="city"
                    column="city"
                    onSort={handleSort}
                  />
                </th>
                <th width="7%">
                  <SortableHeader
                    name="State"
                    id="state"
                    column="state"
                    onSort={handleSort}
                  />
                </th>
                <th width="7%">
                  <SortableHeader
                    name="Country"
                    id="country"
                    column="country"
                    onSort={handleSort}
                  />
                </th>
                <th width="7%">
                  <h5 className="sort mb-0 d-flex">Status</h5>
                </th>
                <th width="7%">
                  <h5 className="sort mb-0 d-flex">Action</h5>
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
                      <p className="mb-0 text-center">{index+1}</p>
                    </td>
                    <td className="total-orders align-middle white-space-nowrap">
                      <p className="mb-0">{item.organization_name || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">{item.organization_email || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">{item.domain || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">{item.address || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">{item.city || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">{item.state || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">{item.country || "N/A"}</p>
                    </td>
                    <td className="customer align-middle white-space-nowrap pe-5">
                      <p className="mb-0">
                        <Form.Check
                          type="switch"
                          id={`switch-${item.id}`}
                          checked={item.status}
                          onChange={() => setIsShowStatusConfirmatonModal(true)}
                          className={`me-2 fw-bold d-flex justify-content-center gap-2 ${item.status ? "text-success" : "text-danger"}`}
                          label={item.status ? "Active" : "Inactive"}
                        />
                      </p>
                    </td>
                    <td className="total-orders align-middle white-space-nowrap">
                      <div>
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
                  <td colSpan="9" className="text-center">
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {currentItems.length ?
            <div className="d-flex align-items-center justify-content-between mt-3 px-2">
              <p className="px-2 py-2 mb-0 bg-white border rounded">Total Records : <span className="fw-bold">{organiztionList.length}</span></p>
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
          status={""}
          organization_id={""}
        />

        {loading && <Loading loading={true} loaderColor="#000" />}
      </div>
    </>
  );
};

export default OrganizationList;
