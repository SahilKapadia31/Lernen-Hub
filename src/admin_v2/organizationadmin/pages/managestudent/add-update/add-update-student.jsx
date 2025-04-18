import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { Modal, Button } from "react-bootstrap";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import add_organization from "../../../../../img/add-organization.svg";
import close_icon from "../../../../../img/close-icon.svg";
import { IMaskInput } from "react-imask";
import { Eye, EyeOff } from "lucide-react";
import "./add-update-student.scss";
import axiosInstance from "../../../components/services/axiosInstance";

const ManageStudentAddUpdate = ({
  show,
  handleClose,
  submitStudentForm,
  studentDetails,
  updateStudentForm,
}) => {
  const initialValues = {
    firstName: studentDetails?.first_name || "",
    lastName: studentDetails?.last_name || "",
    email: studentDetails?.email || "",
    phoneNumber: studentDetails?.phoneNumber || "",
    password: "",
    confirm_password: "",
  };

  const validationSchemas = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
    phoneNumber: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "Password not match")
      .required("Required"),
  });

  const editValidationSchemas = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        className="slide-in-right right-side-modal"
      >
        <Modal.Body className="bg-light">
          <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
            <div className="d-flex gap-2 align-items-center">
              <img src={add_organization} width={35} />
              <p className="mb-0 fw-bold">
                {studentDetails ? "Update" : "Add"} Student
              </p>
            </div>
            <img
              src={close_icon}
              width={20}
              style={{ cursor: "pointer" }}
              onClick={handleClose}
            />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={
              studentDetails ? editValidationSchemas : validationSchemas
            }
            onSubmit={(values) => {
              studentDetails
                ? updateStudentForm(values)
                : submitStudentForm(values);
            }}
          >
            {({ errors, touched, isValid }) => (
              <FormikForm className="border rounded p-3 form-wizard">
                <>
                  <div className="d-flex gap-2">
                    <Form.Group className="mb-2 w-50">
                      <Form.Label className="form-label">
                        First Name <span className="required">*</span>
                      </Form.Label>
                      <Field
                        name="firstName"
                        placeholder="Enter first name"
                        className={`form-control ${
                          errors.firstName && touched.firstName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                    <Form.Group className="mb-2 w-50">
                      <Form.Label className="form-label">
                        Last Name <span className="required">*</span>
                      </Form.Label>
                      <Field
                        name="lastName"
                        placeholder="Enter last name"
                        className={`form-control ${
                          errors.lastName && touched.lastName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                  </div>

                  <div className="d-flex gap-2">
                    <Form.Group className="mb-2 w-50">
                      <Form.Label className="form-label">
                        Email <span className="required">*</span>
                      </Form.Label>
                      <Field
                        name="email"
                        placeholder="Enter email"
                        className={`form-control ${
                          errors.email && touched.email ? "is-invalid" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                    {!studentDetails && (
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Phone <span className="required">*</span>
                        </Form.Label>

                        {/* Masked Input inside Formik Field */}
                        <Field name="phoneNumber">
                          {({ field, form }) => (
                            <IMaskInput
                              {...field}
                              mask="+91(000)000-00-00"
                              placeholder="Enter phone number"
                              className={`form-control ${
                                errors.phoneNumber && touched.phoneNumber
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onAccept={(value) =>
                                form.setFieldValue(field.name, value)
                              } // Update Formik state
                            />
                          )}
                        </Field>

                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                    )}
                  </div>
                  {!studentDetails && (
                    <div className="d-flex gap-2">
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Password <span className="required">*</span>
                        </Form.Label>

                        <div className="position-relative">
                          <Field
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className={`form-control ${
                              errors.password && touched.password
                                ? "is-invalid"
                                : ""
                            }`}
                          />

                          {/* Eye icon button */}
                          <span
                            className="position-absolute end-0 top-50 translate-middle-y me-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </span>
                        </div>

                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                      <Form.Group className="mb-2 w-50 position-relative">
                        <Form.Label className="form-label">
                          Confirm Password <span className="required">*</span>
                        </Form.Label>

                        <div className="position-relative">
                          <Field
                            name="confirm_password"
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Enter confirm password"
                            className={`form-control ${
                              errors.confirm_password &&
                              touched.confirm_password
                                ? "is-invalid"
                                : ""
                            }`}
                          />

                          {/* Eye Icon for Toggle */}
                          <span
                            className="position-absolute end-0 top-50 translate-middle-y me-2"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </span>
                        </div>

                        <ErrorMessage
                          name="confirm_password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                    </div>
                  )}
                </>
                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#5d5fe3", color: "#fff" }}
                  >
                    {studentDetails ? "Update" : "Submit"}
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ManageStudentAddUpdate;
