import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Table, Form, Pagination, ProgressBar } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage, } from "formik";
import * as Yup from "yup";
import "./add-organization-form.scss";
import add_organization from "../../../../../img/add-organization.svg";
import close_icon from "../../../../../img/close-icon.svg";
import axiosInstance from "../../../components/services/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const AddOrganizationForm = ({
  show,
  handleClose,
  submitOrganizationForm,
  organiztionTypeList,
  organization_id,
}) => {
  const steps = ["Organization Info", "Contact Details"];
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [organiztionSubTypeList, setOrganiztionSubTypeList] = useState([]);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validationSchemas = [
    Yup.object({
      organization_type_id: Yup.string().required("Required"),
      organization_name: Yup.string().required("Required"),
      organization_email: Yup.string()
        .email("Enter valid email")
        .required("Email required"),
      org_phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
      country_code:Yup.string().required("Required"),
      domain: Yup.string().required("Domain required").url("Invalid Domain"),
      address: Yup.string().required("Address required"),
      city: Yup.string().required("City required"),
      state: Yup.string().required("State required"),
      country: Yup.string().required("Country required"),
      zipcode: Yup.string()
        .required("Zipcode is required")
        .matches(/^[0-9]{6}$/, "Zipcode must be 6 digits"),
    }),
    Yup.object({
      first_name: Yup.string().required("First name required"),
      last_name: Yup.string().required("Last name required"),
      admin_email: Yup.string().required("Email required").email("Invalid email"),
      admin_phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
      password: Yup.string().required("Required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password not match")
        .required("Confirm password required"),
    }),
  ];

  const initialValues = {
    organization_type_id: "",
    organization_subtype_id: "",
    organization_name: "",
    organization_email: "",
    org_phone: "",
    country_code: "",
    domain: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    first_name: "",
    last_name: "",
    admin_email: "",
    admin_phone: "",
    password: "",
    confirm_password: "",
  };

  const getSubType = async (e) => {
    const selectedValue = e.target.value;
    if (selectedValue != '') {
      try {
        setOrganiztionSubTypeList([]);
        const response = await axiosInstance.get(`/public/organizationSubType/${selectedValue}/`);
        if (response && response.data) {
          setOrganiztionSubTypeList(response.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

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
              <p className="mb-0 fw-bold">Add Organization</p>
            </div>
            <img
              src={close_icon}
              width={20}
              style={{ cursor: "pointer" }}
              onClick={handleClose}
            />
          </div>
          {/* Step Indicator */}
          <div className="d-flex align-items-center justify-content-center mb-3 position-relative px-4">
            <div
              className={`step-circle ${step === 0 ? "active-tab" : "completed"
                }`}
            >
              1
            </div>
            <div
              className="step-line w-50"
              style={{ background: "#ccc" }}
            ></div>
            <div
              className={`step-circle ${step === 1 ? "active-tab" : "text-muted"
                }`}
            >
              2
            </div>
          </div>
          <div className="d-flex justify-content-between text-center mb-3">
            <span className={step === 0 ? "fw-bold" : "text-muted"}>
              Orgnization Details
            </span>
            <span className={step === 1 ? "fw-bold" : "text-muted"}>
              Admin Details
            </span>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[step]}
            onSubmit={(values, { setSubmitting }) => {
              if (step === steps.length - 1) {
                submitOrganizationForm(values);
              } else {
                setStep((prev) => prev + 1);
              }
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isValid, handleChange }) => (
              <FormikForm className="border rounded p-3 form-wizard">
                {step === 0 && (
                  <>
                    <Form.Group className="mb-2 w-50">
                      <Form.Label className="form-label">
                        Organization Type <span className="required">*</span>
                      </Form.Label>
                      <Field
                        as="select"
                        name="organization_type_id"
                        className={`form-control ${errors.organization_type_id &&
                          touched.organization_type_id
                          ? "is-invalid"
                          : ""
                          }`}
                        onChange={(e) => {
                          getSubType(e);
                          handleChange(e);
                        }}
                      >
                        <option value="">Select Type</option>
                        {organiztionTypeList.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                    <Form.Group className="mb-2 w-50">
                      <Form.Label className="form-label">
                        Organization Sub-Type <span className="required">*</span>
                      </Form.Label>
                      <Field
                        as="select"
                        name="organization_subtype_id"
                        className={`form-control ${errors.organization_subtype_id && touched.organization_subtype_id
                          ? "is-invalid"
                          : ""
                          }`}
                      >
                        <>
                          <option value="">Select Sub-Type</option>
                          {organiztionSubTypeList.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </>
                      </Field>

                      <ErrorMessage
                        name="organization_type_id"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="form-label">
                        Organization Name <span className="required">*</span>
                      </Form.Label>
                      <Field
                        name="organization_name"
                        placeholder="Enter organization name"
                        className={`form-control ${errors.organization_name && touched.organization_name
                          ? "is-invalid"
                          : ""
                          }`}
                      />
                      <ErrorMessage
                        name="organization_name"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Organization Email <span className="required">*</span>
                        </Form.Label>
                        <Field
                          name="organization_email"
                          placeholder="Ex: abc@gmail.com"
                          className={`form-control ${errors.organization_email &&
                            touched.organization_email
                            ? "is-invalid"
                            : ""
                            }`}
                        />
                        <ErrorMessage
                          name="organization_email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Organization Domain <span className="required">*</span>
                        </Form.Label>
                        <Field
                          name="domain"
                          placeholder="Ex: https://example.com"
                          className={`form-control ${errors.domain && touched.domain ? "is-invalid" : ""
                            }`}
                        />
                        <ErrorMessage
                          name="domain"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                    </div>
                    <div className="d-flex gap-2">
                      <Form.Group className="mb-2 w-25">
                        <Form.Label className="form-label">
                          Country Code{" "}
                          <span className="required">*</span>
                        </Form.Label>
                        <Field
                          as="select"
                          name="country_code"
                          className={`form-control ${errors.country_code &&
                            touched.country_code
                            ? "is-invalid"
                            : ""
                            }`}
                          onChange={(e) => {
                            getSubType(e);
                            handleChange(e);
                          }}
                        >
                          <option value="">Select</option>
                          <option value={"+91"}>{"+91"}</option>
                        </Field>
                        <ErrorMessage
                          name="country_code"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Organization Phone Number{" "}
                          <span className="required">*</span>
                        </Form.Label>
                        <Field
                          type='number'
                          name="org_phone"
                          placeholder="Organization Phone Number"
                          className={`form-control ${errors.org_phone && touched.org_phone ? "is-invalid" : ""
                            }`}
                        />
                        <ErrorMessage
                          name="org_phone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                    </div>

                    <Form.Group className="mb-2">
                      <Form.Label className="form-label">
                        Address <span className="required">*</span>
                      </Form.Label>
                      <Field
                        name="address"
                        placeholder="Organization address"
                        as="textarea"
                        rows={2}
                        className={`form-control ${errors.address && touched.address ? "is-invalid" : ""
                          }`}
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          City <span className="required">*</span>
                        </Form.Label>
                        <Field
                          name="city"
                          placeholder="Enter city"
                          className={`form-control ${errors.city && touched.city ? "is-invalid" : ""
                            }`}
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          State <span className="required">*</span>
                        </Form.Label>
                        <Field
                          name="state"
                          placeholder="Enter state"
                          className={`form-control ${errors.state && touched.state ? "is-invalid" : ""
                            }`}
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                    </div>
                    <div className="d-flex gap-2">
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Country <span className="required">*</span>
                        </Form.Label>
                        <Field
                          as="select"
                          name="country"
                          className={`form-control ${errors.country && touched.country
                            ? "is-invalid"
                            : ""
                            }`}
                        >
                          <option value="">Select Country</option>
                          <option value="USA">USA</option>
                          <option value="India">India</option>
                        </Field>
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Zip Code <span className="required">*</span>
                        </Form.Label>
                        <Field
                          type='number'
                          name="zipcode"
                          placeholder="Enter zip code"
                          className={`form-control ${errors.zipcode && touched.zipcode ? "is-invalid" : ""
                            }`}
                        />
                        <ErrorMessage
                          name="zipcode"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <div className="d-flex gap-2">
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          First Name <span className="required">*</span>
                        </Form.Label>
                        <Field
                          name="first_name"
                          placeholder="Enter first name"
                          className={`form-control ${errors.first_name && touched.first_name
                            ? "is-invalid"
                            : ""
                            }`}
                        />
                        <ErrorMessage
                          name="first_name"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Last Name <span className="required">*</span>
                        </Form.Label>
                        <Field
                          name="last_name"
                          placeholder="Enter last name"
                          className={`form-control ${errors.last_name && touched.last_name
                            ? "is-invalid"
                            : ""
                            }`}
                        />
                        <ErrorMessage
                          name="last_name"
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
                          name="admin_email"
                          placeholder="Enter email"
                          className={`form-control ${errors.admin_email && touched.admin_email
                            ? "is-invalid"
                            : ""
                            }`}
                        />
                        <ErrorMessage
                          name="admin_email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                      <Form.Group className="mb-2 w-50">
                        <Form.Label className="form-label">
                          Phone <span className="required">*</span>
                        </Form.Label>
                        <Field
                          name="admin_phone"
                          placeholder="Enter phone number"
                          className={`form-control ${errors.admin_phone && touched.admin_phone ? "is-invalid" : ""
                            }`}
                        />
                        <ErrorMessage
                          name="admin_phone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                    </div>

                    <div className="d-flex gap-2">
                      <Form.Group className="mb-2 w-50 position-relative">
                        <Form.Label className="form-label">
                          Passwords <span className="required">*</span>
                        </Form.Label>
                        <div className="position-relative">
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`}
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: "absolute",
                              top: "50%",
                              right: "10px",
                              transform: "translateY(-50%)",
                              cursor: "pointer"
                            }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                      </Form.Group>

                      <Form.Group className="mb-2 w-50 position-relative">
                        <Form.Label className="form-label">
                          Confirm Passwords <span className="required">*</span>
                        </Form.Label>
                        <div className="position-relative">
                          <Field
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirm_password"
                            placeholder="Enter confirm password"
                            className={`form-control ${errors.confirm_password && touched.confirm_password ? "is-invalid" : ""}`}
                          />
                          <span
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                              position: "absolute",
                              top: "50%",
                              right: "10px",
                              transform: "translateY(-50%)",
                              cursor: "pointer"
                            }}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        <ErrorMessage name="confirm_password" component="div" className="invalid-feedback" />
                      </Form.Group>
                    </div>
                  </>
                )}
                <div
                  className={`d-flex ${step === steps.length - 1
                    ? "justify-content-between"
                    : "justify-content-end"
                    }`}
                >
                  {step > 0 && (
                    <Button
                      onClick={() => setStep((prev) => prev - 1)}
                      variant="secondary"
                    >
                      ← Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#5d5fe3", color: "#fff" }}
                  >
                    {step === steps.length - 1 ? "Submit" : "Next →"}
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

export default AddOrganizationForm;
