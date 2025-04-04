import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { Modal, Button } from "react-bootstrap";
import * as Yup from "yup";
import "./add-update-programtype.scss";

const AddUpdateProgramType = ({ show, handleClose, submitProgramTypeForm, selectedProgramType, updateProgramTypeForm }) => {

    const initialValues = {
        program_type: selectedProgramType?.name || "",
        description: selectedProgramType?.description || ""
    };

    const validationSchemas = Yup.object({
        program_type: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
    });

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body className="bg-light">
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                        <div className="d-flex gap-2 align-items-center w-100">
                            <p className="mb-0 fw-bold">{selectedProgramType ? 'Update' : 'Add'} Program Type</p>
                            <button
                                className="border-0 bg-transparent p-0 ms-auto"
                                style={{ cursor: "pointer" }}
                                onClick={handleClose}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#5d5fe3" stroke="#5d5fe3" stroke-width="2" class="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                </svg>
                            </button>
                        </div>
                        {/* <img
                            src={close_icon}
                            width={20}
                            style={{ cursor: "pointer" }}
                        onClick={() => setIsOpenOrganizationForm(!isOpenOrganizationForm)}
                        /> */}
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchemas}
                        onSubmit={(values) => {
                            selectedProgramType ? updateProgramTypeForm(values) : submitProgramTypeForm(values)
                        }}
                    >
                        {({ errors, touched, isValid }) => (
                            <FormikForm className="border rounded p-3 form-wizard">
                                <>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="form-label">
                                            Program Type <span className="required">*</span>
                                        </Form.Label>
                                        <Field
                                            name="program_type"
                                            className={`form-control ${errors.program_type && touched.program_type ? "is-invalid" : ""
                                                }`}
                                        />
                                        <ErrorMessage
                                            name="program_type"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="form-label">
                                            Description <span className="required">*</span>
                                        </Form.Label>
                                        <Field
                                            as="textarea"
                                            rows={4}
                                            name="description"
                                            className={`form-control ${errors.description && touched.description ? "is-invalid" : ""
                                                }`}
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </Form.Group>
                                </>
                                <div>
                                    <Button type="submit" style={{ backgroundColor: "#5d5fe3", color: "#fff" }} >
                                        {selectedProgramType ? 'Update' : 'Submit'}
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

export default AddUpdateProgramType;
