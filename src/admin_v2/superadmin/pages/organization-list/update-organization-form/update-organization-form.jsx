import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Table, Form, Pagination, ProgressBar } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import './update-organization-form.scss'
import add_organization from "../../../../../img/add-organization.svg";
import close_icon from "../../../../../img/close-icon.svg"

const UpdateOrganizationForm = ({ show, handleClose, updateOrganization, organiztionTypeList, selectedOrganizationData }) => {
    const validationSchemas = Yup.object({
        organization_type_id: Yup.string().required("Required"),
        organization_name: Yup.string().required("Required"),
        organization_email: Yup.string().email("Enter valid email").required("Required"),
        domain: Yup.string().required("Required").url("Invalid Domain"),
        address: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        state: Yup.string().required("Required"),
        country: Yup.string().required("Required"),
    });

    const initialValues = {
        organization_type_id: selectedOrganizationData?.organization_type?.id || '',
        organization_name: selectedOrganizationData?.organization_name || '',
        organization_email: selectedOrganizationData?.organization_email || '',
        domain: selectedOrganizationData?.domain || '',
        address: selectedOrganizationData?.address || '',
        city: selectedOrganizationData?.city || '',
        state: selectedOrganizationData?.state || '',
        country: selectedOrganizationData?.country || '',
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} className="slide-in-right right-side-modal">
                <Modal.Body className="bg-light">
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                        <div className="d-flex gap-2 align-items-center">
                            <img src={add_organization} width={35} />
                            <p className="mb-0 fw-bold">Update Organization</p>
                        </div>
                        <img src={close_icon} width={20} style={{ cursor: 'pointer' }} onClick={handleClose} />
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchemas}
                        onSubmit={(values, { setSubmitting }) => {
                            updateOrganization(values)
                            setSubmitting(false);
                        }}
                    >
                        {({ errors, touched, isValid }) => (
                            <FormikForm className="border rounded p-3 form-wizard">
                                <>
                                    <Form.Group className="mb-2 w-50">
                                        <Form.Label className="form-label">Organization Type <span className="required">*</span></Form.Label>
                                        <Field as="select" name="organization_type_id"  className={`form-control ${errors.organization_type_id && touched.organization_type_id ? "is-invalid" : ""}`}>
                                            <option value="">Select Type</option>
                                            {organiztionTypeList.map((item) =>
                                                <option value={item.id}>{item.name}</option>
                                            )}
                                        </Field>
                                        <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="form-label">Organization Name <span className="required">*</span></Form.Label>
                                        <Field name="organization_name" className={`form-control ${errors.organization_name && touched.organization_name ? "is-invalid" : ""}`} />
                                        <ErrorMessage name="organization_name" component="div" className="invalid-feedback" />
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Form.Group className="mb-2 w-50">
                                            <Form.Label className="form-label">Organization Email <span className="required">*</span></Form.Label>
                                            <Field name="organization_email" className={`form-control ${errors.organization_email && touched.organization_email ? "is-invalid" : ""}`} />
                                            <ErrorMessage name="organization_email" component="div" className="invalid-feedback" />
                                        </Form.Group>
                                        <Form.Group className="mb-2 w-50">
                                            <Form.Label className="form-label">Organization Domain <span className="required">*</span></Form.Label>
                                            <Field name="domain" className={`form-control ${errors.domain && touched.domain ? "is-invalid" : ""}`} />
                                            <ErrorMessage name="domain" component="div" className="invalid-feedback" />
                                        </Form.Group>
                                    </div>

                                    <Form.Group className="mb-2">
                                        <Form.Label className="form-label">Address <span className="required">*</span></Form.Label>
                                        <Field name="address" as="textarea" rows={2} className={`form-control ${errors.address && touched.address ? "is-invalid" : ""}`} />
                                        <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Form.Group className="mb-2 w-50">
                                            <Form.Label className="form-label">City <span className="required">*</span></Form.Label>
                                            <Field name="city" className={`form-control ${errors.city && touched.city ? "is-invalid" : ""}`} />
                                            <ErrorMessage name="city" component="div" className="invalid-feedback" />
                                        </Form.Group>
                                        <Form.Group className="mb-2 w-50">
                                            <Form.Label className="form-label">State <span className="required">*</span></Form.Label>
                                            <Field name="state" className={`form-control ${errors.state && touched.state ? "is-invalid" : ""}`} />
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
                                <div className={`d-flex justify-content-end`}>
                                    <Button type="submit" style={{ backgroundColor: '#5d5fe3', color: '#fff' }}>Update</Button>
                                </div>
                            </FormikForm>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UpdateOrganizationForm