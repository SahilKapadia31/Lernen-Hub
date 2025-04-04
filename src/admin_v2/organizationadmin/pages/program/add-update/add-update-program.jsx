import React from "react";
import { Form } from "react-bootstrap";
import { Formik, FieldArray, ErrorMessage } from "formik";
import { Modal, Button } from "react-bootstrap";
import * as Yup from "yup";
import close_icon from '../../../../../img/close-icon.svg'
import "./add-update-program.scss";

const AddUpdateProgram = ({ show, handleClose, submitProgramForm, selectedProgram, updateProgramForm }) => {
    const initialValues = {
        program_name: selectedProgram?.program_name || "",
        description: selectedProgram?.program_description || "",
        semesters: selectedProgram?.semester?.map(sem => ({
            semester_id: sem.semester_id || "",
            sem_name: sem.sem_name || "",
            is_deleted: false // Default to false
        })) || [{ semester_id: "", sem_name: "", is_deleted: false }],
    };

    const validationSchema = Yup.object({
        program_name: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        semesters: Yup.array().of(
            Yup.object({
                semester_id: Yup.string(),
                sem_name: Yup.string().required("Required"),
                is_deleted: Yup.boolean()
            })
        )
    });

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="bg-light">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                    <p className="mb-0 fw-bold">{selectedProgram ? 'Update' : 'Add'} Program</p>
                    <img src={close_icon} width={15} onClick={handleClose} style={{ cursor: 'pointer' }} />
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log("Form submitted with values:", values);
                        selectedProgram ? updateProgramForm(values) : submitProgramForm(values);
                    }}
                >
                    {(formik) => (
                        <Form className="border rounded p-3 form-wizard">
                            {/* Program Name */}
                            <Form.Group className="mb-2">
                                <Form.Label className="form-label">
                                    Program Name <span className="required">*</span>
                                </Form.Label>
                                <input
                                    name="program_name"
                                    className={`form-control ${formik.touched.program_name && formik.errors.program_name ? "is-invalid" : ""}`}
                                    value={formik.values.program_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <ErrorMessage name="program_name" component="div" className="invalid-feedback" />
                            </Form.Group>

                            {/* Description */}
                            <Form.Group className="mb-2">
                                <Form.Label className="form-label">
                                    Description <span className="required">*</span>
                                </Form.Label>
                                <textarea
                                    rows={4}
                                    name="description"
                                    className={`form-control ${formik.touched.description && formik.errors.description ? "is-invalid" : ""}`}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <ErrorMessage name="description" component="div" className="invalid-feedback" />
                            </Form.Group>

                            {/* Semesters */}
                            <Form.Group className="mb-2">
                                <Form.Label className="form-label">
                                    Semesters <span className="required">*</span>
                                </Form.Label>
                                <FieldArray name="semesters">
                                    {({ push, remove }) => (
                                        <div>
                                            {formik.values.semesters.map((sem, index) => (
                                                !sem.is_deleted && ( // Hide deleted items from UI
                                                    <div key={index} className="d-flex align-items-center mb-2">
                                                        {/* Hidden Field for Semester ID */}
                                                        <input
                                                            type="hidden"
                                                            name={`semesters[${index}].semester_id`}
                                                            value={formik.values.semesters[index].semester_id}
                                                        />

                                                        {/* Semester Name Input */}
                                                        <input
                                                            name={`semesters[${index}].sem_name`}
                                                            className={`form-control ${formik.touched.semesters?.[index]?.sem_name && formik.errors.semesters?.[index]?.sem_name ? "is-invalid" : ""}`}
                                                            value={formik.values.semesters[index].sem_name}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                        <ErrorMessage name={`semesters[${index}].sem_name`} component="div" className="invalid-feedback" />

                                                        {/* Remove Button */}
                                                        {formik.values.semesters.length > 1 && (
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                className="ms-2"
                                                                onClick={() => {
                                                                    if (formik.values.semesters[index].semester_id) {
                                                                        formik.setFieldValue(`semesters[${index}].is_deleted`, true);
                                                                    } else {
                                                                        remove(index);
                                                                    }
                                                                }}
                                                            >
                                                                X
                                                            </Button>
                                                        )}
                                                    </div>
                                                )
                                            ))}

                                            {/* Add Semester Button */}
                                            <Button variant="success" size="sm" className="w-100" onClick={() => push({ semester_id: "", sem_name: "", is_deleted: false })}>
                                                Add Semester
                                            </Button>
                                        </div>
                                    )}
                                </FieldArray>
                            </Form.Group>

                            {/* Submit Button */}
                            <div>
                                <Button
                                    type="button"
                                    style={{ backgroundColor: "#5d5fe3", color: "#fff" }}
                                    onClick={formik.handleSubmit}
                                >
                                    {selectedProgram ? 'Update' : 'Submit'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default AddUpdateProgram;
