import React, { useState, useMemo, useEffect } from "react";
import { Form, Pagination } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";
import { Tab, Row, Col, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import SortableHeader from "../../components/SortableHeader";
import axiosInstance from "../../components/services/axiosInstance";
import './organization-pending-list.scss';

const SuperAdminPendingRequest = () => {
  const [loading, setLoading] = useState(false);
  const currentItems = [];

  return (
    <>
      <div className="">
        <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-white mb-3">
          <h5 className="m-0 main-title">Pending Requests</h5>
          <div className="d-flex justify-content-end gap-2">
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Search..."

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
          </div>
        </div>

        <Tab.Container defaultActiveKey="Organization">
          <div className="d-flex justify-content-center mb-3">
            <Nav className="d-flex flex-wrap gap-5">
              <Nav.Item>
                <Nav.Link eventKey="Organization" className="custom-tab">
                  Organizations
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Tab.Content className="mb-4">
            <Tab.Pane eventKey="Organization">
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
                        />
                      </th>
                      <th width="15%">
                        <h5 className="sort mb-0 d-flex">Organization Email</h5>
                      </th>
                      <th width="12%">
                        <h5 className="sort mb-0 d-flex">Phone Number</h5>
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
                            <p className="mb-0 text-center">{index + 1}</p>
                          </td>
                          <td className="total-orders align-middle white-space-nowrap">
                            <p className="mb-0">
                              {item.organization_name || "N/A"}
                            </p>
                          </td>
                          <td className="customer align-middle white-space-nowrap pe-5">
                            <p className="mb-0">
                              {item.organization_email || "N/A"}
                            </p>
                          </td>
                          <td className="customer align-middle white-space-nowrap pe-5">
                            <p className="mb-0">{item.phoneNumber || "N/A"}</p>
                          </td>
                          <td className="customer align-middle white-space-nowrap pe-5">
                            <p className="mb-0">
                              <Form.Check
                                type="switch"
                                id={`switch-${item.id}`}
                                checked={item.status}
                                onChange={() =>
                                  setIsShowStatusConfirmatonModal(true)
                                }
                                className={`me-2 fw-bold d-flex justify-content-center gap-2 ${item.status ? "text-success" : "text-danger"
                                  }`}
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
                {currentItems.length ? (
                  <div className="d-flex align-items-center justify-content-between mt-3 px-2">
                    <p className="px-2 py-2 mb-0 bg-white border rounded">
                      Total Records :{" "}
                      <span className="fw-bold">{organiztionList.length}</span>
                    </p>
                    <Pagination className="mb-2">
                      <Pagination.Prev
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      />
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={i + 1 === currentPage}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {loading && <Loading loading={true} loaderColor="#000" />}
      </div>
    </>
  );

};

export default SuperAdminPendingRequest;
