import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { Modal, Button } from "react-bootstrap";
import * as Yup from "yup";
import add_organization from "../../../../../img/add-organization.svg";
import close_icon from '../../../../../img/close-icon.svg';
import "./add-update-staff.scss";
import axiosInstance from "../../../components/services/axiosInstance";

const ManageStaffAddUpdate = ({ show, handleClose, submitStaffForm, staffDetails, updateStaffForm }) => {
  const orgData = useSelector((state) => state.auth);
  const [roleList, setRoleList] = useState([])
  const getAllRoles = async (payload) => {
    const response = await axiosInstance.get(`/organization/${orgData?.role?.organization_id}/roles/?pageSize=1000&page=1`);
    setRoleList(response.data.data);
  };

  useEffect(() => {
    getAllRoles();
  }, [])

  const initialValues = {
    role_id: staffDetails?.role_id || "",
    firstName: staffDetails?.first_name || "",
    lastName: staffDetails?.last_name || "",
    email: staffDetails?.email || "",
    phoneNumber: staffDetails?.phoneNumber || "",
    password: "",
    confirm_password: "",
  };

  const validationSchemas = Yup.object({
    role_id: Yup.string().required("Required"),
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
    phoneNumber: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Password not match').required("Required"),
  });

  const editValidationSchemas = Yup.object({
    role_id: Yup.string().required("Required"),
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
  });
  return (
    <>
      <Modal show={show} onHide={handleClose} className="slide-in-right right-side-modal">
        <Modal.Body className="bg-light">
          <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
            <div className="d-flex gap-2 align-items-center">
              <img src={add_organization} width={35} />
              <p className="mb-0 fw-bold">{staffDetails ? 'Update' : 'Add'} Staff</p>
            </div>
            <img src={close_icon} width={20} style={{ cursor: 'pointer' }} onClick={handleClose} />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={staffDetails ? editValidationSchemas : validationSchemas}
            onSubmit={(values) => {
              staffDetails ? updateStaffForm(values) : submitStaffForm(values)
            }}
          >
            {({ errors, touched, isValid }) => (
              <FormikForm className="border rounded p-3 form-wizard">
                <>
                  {!staffDetails &&
                    <Form.Group className="mb-2 w-50">
                      <Form.Label className="form-label">
                        Role Type <span className="required">*</span>
                      </Form.Label>
                      <Field as="select" name="role_id" className={`form-control ${errors.role_id && touched.role_id ? "is-invalid" : ""}`}>
                        <option value="">Select Type</option>
                        {roleList.map((item) => (
                          <option value={item.role_id}>{item.role_name}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="role_id" component="div" className="invalid-feedback" />
                    </Form.Group>
                  }
                  <div className="d-flex gap-2">
                    <Form.Group className="mb-2 w-50">
                      <Form.Label className="form-label">
                        First Name <span className="required">*</span>
                      </Form.Label>
                      <Field name="firstName" placeholder="Enter first name" className={`form-control ${errors.firstName && touched.firstName ? "is-invalid" : ""}`} />
                      <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                    </Form.Group>
                    <Form.Group className="mb-2 w-50">
                      <Form.Label className="form-label">
                        Last Name <span className="required">*</span>
                      </Form.Label>
                      <Field name="lastName" placeholder="Enter last name" className={`form-control ${errors.lastName && touched.lastName ? "is-invalid" : ""}`} />
                      <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                    </Form.Group>
                  </div>

                  <div className="d-flex gap-2">
                    <Form.Group className="mb-2 w-50">
                      <Form.Label className="form-label">
                        Email <span className="required">*</span>
                      </Form.Label>
                      <Field name="email" placeholder="Enter email" className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`} />
                      <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </Form.Group>

                    {!staffDetails &&
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Phone <span className="required">*</span>
                        </Form.Label>
                        <Field name="phoneNumber" placeholder="Enter phone number" className={`form-control ${errors.phoneNumber && touched.phoneNumber ? "is-invalid" : ""}`} />
                        <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                      </Form.Group>
                    }
                  </div>
                  {!staffDetails &&
                    <div className="d-flex gap-2">
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">Passwords <span className="required">*</span></Form.Label>
                        <Field name="password" placeholder="Enter password" className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`} />
                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                      </Form.Group>
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">Confirm Passwords <span className="required">*</span></Form.Label>
                        <Field placeholder="Enter confirm password" name="confirm_password" className={`form-control ${errors.confirm_password && touched.confirm_password ? "is-invalid" : ""}`} />
                        <ErrorMessage name="confirm_password" component="div" className="invalid-feedback" />
                      </Form.Group>
                    </div>
                  }
                </>
                <div className="d-flex justify-content-end">
                  <Button type="submit" style={{ backgroundColor: "#5d5fe3", color: "#fff" }} >{staffDetails ? 'Update' : 'Submit'}</Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ManageStaffAddUpdate;
