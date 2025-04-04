import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Table, Form, Pagination, ProgressBar } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import './add-organization-form.scss'
import add_organization from "../../../../../img/add-organization.svg";
import close_icon from "../../../../../img/close-icon.svg"

const AddOrganizationForm = ({ show, handleClose, submitOrganizationForm, organiztionTypeList, organization_id }) => {
    const steps = ["Organization Info", "Contact Details"];
    const [step, setStep] = useState(0);
    const validationSchemas = [
        Yup.object({
            organization_type_id: Yup.string().required("Required"),
            organization_name: Yup.string().required("Required"),
            organization_email: Yup.string().email("Enter valid email").required("Required"),
            domain: Yup.string().required("Required").url("Invalid Domain"),
            address: Yup.string().required("Required"),
            city: Yup.string().required("Required"),
            state: Yup.string().required("Required"),
            country: Yup.string().required("Required"),
        }),
        Yup.object({
            first_name: Yup.string().required("Required"),
            last_name: Yup.string().required("Required"),
            admin_email: Yup.string().required("Required").email("Invalid email"),
            phone: Yup.number().required("Required"),
            password: Yup.string().required("Required"),
            confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Password not match').required("Required"),
        }),
    ];

    const initialValues = {
        organization_type_id: "",
        organization_name: "",
        organization_email: "",
        domain: "",
        address: "",
        city: "",
        state: "",
        country: "",
        first_name: "",
        last_name: "",
        admin_email: "",
        phone: "",
        password: "",
        confirm_password: ""
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} className="slide-in-right right-side-modal">
                    <Modal.Body className="bg-light">
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                            <div className="d-flex gap-2 align-items-center">
                                <img src={add_organization} width={35} />
                                <p className="mb-0 fw-bold">Add Organization</p>
                            </div>
                            <img src={close_icon} width={20} style={{ cursor: 'pointer' }} onClick={handleClose} />
                        </div>
                        {/* Step Indicator */}
                        <div className="d-flex align-items-center justify-content-center mb-3 position-relative px-4">
                            <div className={`step-circle ${step === 0 ? "active-tab" : "completed"}`}>1</div>
                            <div className="step-line w-50" style={{ background: "#ccc" }}></div>
                            <div className={`step-circle ${step === 1 ? "active-tab" : "text-muted"}`}>2</div>
                        </div>
                        <div className="d-flex justify-content-between text-center mb-3">
                            <span className={step === 0 ? "fw-bold" : "text-muted"}>Orgnization Details</span>
                            <span className={step === 1 ? "fw-bold" : "text-muted"}>Admin Details</span>
                        </div>


                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchemas[step]}
                            onSubmit={(values, { setSubmitting }) => {
                                if (step === steps.length - 1) {
                                    submitOrganizationForm(values)
                                } else {
                                    setStep((prev) => prev + 1);
                                }
                                setSubmitting(false);
                            }}
                        >
                            {({ errors, touched, isValid }) => (
                                <FormikForm className="border rounded p-3 form-wizard">
                                    {step === 0 && (
                                        <>
                                            <Form.Group className="mb-2 w-50">
                                                <Form.Label className="form-label">Organization Type <span className="required">*</span></Form.Label>
                                                <Field as="select" name="organization_type_id" className={`form-control ${errors.organization_type_id && touched.organization_type_id ? "is-invalid" : ""}`}>
                                                    <option value="">Select Type</option>
                                                    {organiztionTypeList.map((item) =>
                                                        <option value={item.id}>{item.name}</option>
                                                    )}
                                                </Field>
                                                <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="form-label">Organization Name <span className="required">*</span></Form.Label>
                                                <Field name="organization_name" placeholder="Enter organization name" className={`form-control ${errors.organization_name && touched.organization_name ? "is-invalid" : ""}`} />
                                                <ErrorMessage name="organization_name" component="div" className="invalid-feedback" />
                                            </Form.Group>
                                            <div className="d-flex gap-2">
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">Organization Email <span className="required">*</span></Form.Label>
                                                    <Field name="organization_email" placeholder="Ex: abc@gmail.com" className={`form-control ${errors.organization_email && touched.organization_email ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="organization_email" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">Organization Domain <span className="required">*</span></Form.Label>
                                                    <Field name="domain" placeholder="Ex: https://example.com" className={`form-control ${errors.domain && touched.domain ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="domain" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                            </div>

                                            <Form.Group className="mb-2">
                                                <Form.Label className="form-label">Address <span className="required">*</span></Form.Label>
                                                <Field name="address" placeholder="Organization address" as="textarea" rows={2} className={`form-control ${errors.address && touched.address ? "is-invalid" : ""}`} />
                                                <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                            </Form.Group>
                                            <div className="d-flex gap-2">
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">City <span className="required">*</span></Form.Label>
                                                    <Field name="city" placeholder="Enter city" className={`form-control ${errors.city && touched.city ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="city" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">State <span className="required">*</span></Form.Label>
                                                    <Field name="state" placeholder="Enter state" className={`form-control ${errors.state && touched.state ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="state" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                            </div>
                                            <Form.Group className="mb-2 w-50">
                                                <Form.Label className="form-label">Country <span className="required">*</span></Form.Label>
                                                <Field as="select" name="country" className={`form-control ${errors.country && touched.country ? "is-invalid" : ""}`}>
                                                    <option value="">Select Country</option>
                                                    <option value="USA">USA</option>
                                                    <option value="India">India</option>
                                                </Field>
                                                <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                            </Form.Group>
                                        </>
                                    )}
                                    {step === 1 && (
                                        <>
                                            <div className="d-flex gap-2">
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">First Name <span className="required">*</span></Form.Label>
                                                    <Field name="first_name" placeholder="Enter first name" className={`form-control ${errors.first_name && touched.first_name ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="first_name" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">Last Name <span className="required">*</span></Form.Label>
                                                    <Field name="last_name" placeholder="Enter last name" className={`form-control ${errors.last_name && touched.last_name ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="last_name" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">Email <span className="required">*</span></Form.Label>
                                                    <Field name="admin_email" placeholder="Enter email" className={`form-control ${errors.admin_email && touched.admin_email ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="admin_email" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">Phone <span className="required">*</span></Form.Label>
                                                    <Field name="phone" placeholder="Enter phone number" className={`form-control ${errors.phone && touched.phone ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">Passwords <span className="required">*</span></Form.Label>
                                                    <Field name="password" placeholder="Enter password" className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                                <Form.Group className="mb-2 w-50">
                                                    <Form.Label className="form-label">Confirm Passwords <span className="required">*</span></Form.Label>
                                                    <Field name="confirm_password" placeholder="Enter confirm password" className={`form-control ${errors.confirm_password && touched.confirm_password ? "is-invalid" : ""}`} />
                                                    <ErrorMessage name="confirm_password" component="div" className="invalid-feedback" />
                                                </Form.Group>
                                            </div>
                                        </>
                                    )}
                                    <div className={`d-flex ${step === steps.length - 1 ? 'justify-content-between' : 'justify-content-end'}`}>
                                        {step > 0 && <Button onClick={() => setStep((prev) => prev - 1)} variant="secondary">← Back</Button>}
                                        <Button type="submit" style={{ backgroundColor: '#5d5fe3', color: '#fff' }}>{step === steps.length - 1 ? "Submit" : "Next →"}</Button>
                                    </div>
                                </FormikForm>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
        </>
    )
}

export default AddOrganizationForm