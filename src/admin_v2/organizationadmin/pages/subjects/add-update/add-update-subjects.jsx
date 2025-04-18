import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { Modal, Button } from "react-bootstrap";
import * as Yup from "yup";
import Select from "react-select";
import Loading from "react-fullscreen-loading";
import axiosInstance from "../../../components/services/axiosInstance";
import "./add-update-subjects.scss";

const AddUpdateSubjects = ({ show, handleClose, updateSubjectForm, selectedSubject, submitSubjectForm, program_id, programSemesters }) => {

    useEffect(() => {
        console.log(selectedSubject);
    }, []);


    const initialValues = {
        subject_name: selectedSubject?.course_name || "",
        description: selectedSubject?.course_description || "",
        semester: selectedSubject?.semester || []  // Ensure it is an array

    };

    const validationSchemas = Yup.object({
        subject_name: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        semester: Yup.array().min(1, "Select at least one semester").required("Required"),

    });

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body className="bg-light">
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                        <div className="d-flex gap-2 align-items-center w-100">
                            {/* <img src={add_organization} width={35} /> */}
                            <p className="mb-0 fw-bold">{selectedSubject ? 'Update' : 'Add'} Subject</p>
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
                            selectedSubject ? updateSubjectForm(values) : submitSubjectForm(values)
                        }}
                    >
                        {({ errors, touched, isValid }) => (
                            <FormikForm className="border rounded p-3 form-wizard">
                                <>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="form-label">
                                            Subject Name <span className="required">*</span>
                                        </Form.Label>
                                        <Field
                                            name="subject_name"
                                            className={`form-control ${errors.subject_name && touched.subject_name ? "is-invalid" : ""
                                                }`}
                                        />
                                        <ErrorMessage
                                            name="subject_name"
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
                                    {programSemesters && <Form.Group className="mb-2">
                                        <Form.Label className="form-label">
                                            Select Semester <span className="required">*</span>
                                        </Form.Label>
                                        <Field name="semester">
                                            {({ field, form }) => (
                                                <Select
                                                    options={programSemesters.map(option => ({
                                                        label: option.sem_name,
                                                        value: option.semester_id
                                                    }))}
                                                    isMulti
                                                    classNamePrefix="react-select"
                                                    value={programSemesters
                                                        .filter(option => field.value.includes(option.semester_id))
                                                        .map(option => ({ label: option.sem_name, value: option.semester_id }))
                                                    }
                                                    onChange={(selectedOptions) =>
                                                        form.setFieldValue("semester", selectedOptions.map(option => option.value))
                                                    }
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="semester" component="div" className="invalid-feedback" />
                                    </Form.Group>}
                                </>
                                <div>
                                    <Button type="submit" style={{ backgroundColor: "#5d5fe3", color: "#fff" }} >
                                        {selectedSubject ? 'Update' : 'Submit'}
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

export default AddUpdateSubjects;
