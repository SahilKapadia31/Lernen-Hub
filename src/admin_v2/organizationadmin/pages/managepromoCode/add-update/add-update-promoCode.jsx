import React, { useMemo, useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import close_icon from '../../../../../img/close-icon.svg';

const ManageRoleAddUpdate = ({ show, programTypeListData, programListData, onUpdate, onSubmit, handleClose, selectedRole }) => {
  const [programs, setPrograms] = useState([]);
  //test
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const generatedCode = useMemo(() => {
    if (!selectedRole) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }
    return "";
  }, [selectedRole]);

  const initialValues = {
    promo_code: selectedRole?.promo_code || generatedCode,
    allow_permission: selectedRole?.allow_permission || "",
    program_type_id: selectedRole?.program_type_id || "",
    program_id: selectedRole?.program_id || "",
    semester_id: selectedRole?.semester_id || ""
  };

  const validationSchemas = Yup.object({
    promo_code: Yup.string().required("Required"),
    allow_permission: Yup.string().required("Permission type is required"),
    program_type_id: Yup.string().required("Program type is required"),
    program_id: Yup.string().required("Program is required"),
    semester_id: Yup.string().required("Semester is required"),
  });

  const filterDegreeByProgram = (programTypeId) => {
    const filteredtype = programListData.filter((program) => program.program_type_id === Number(programTypeId));
    setPrograms(filteredtype || []);
  };
  const filterSemestersByProgram = (programId) => {
    const filtered = programListData.filter((sem) => sem.pid === Number(programId));
    setFilteredSemesters(filtered[0]?.semester || []);
  };
  return (
    <Modal show={show} onHide={handleClose} className="slide-in-right right-side-modal">
      <Modal.Body className="bg-light">
        <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
          <div className="d-flex gap-2 align-items-center">
            <p className="mb-0 fw-bold">{selectedRole ? 'Update' : 'Add'} promo-code</p>
          </div>
          <img src={close_icon} width={15} style={{ cursor: "pointer" }} onClick={handleClose} />
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchemas}
          onSubmit={(values) => {
            selectedRole
              ? onUpdate(values)
              : onSubmit(values);
          }}
        >
          {({ errors, touched, values, setFieldValue }) => {
            useEffect(() => {
              if (values.program_type_id) {
                filterDegreeByProgram(values.program_type_id);
              } else {
                setPrograms([]);
              }
              if (values.program_id) {
                filterSemestersByProgram(values.program_id);
              } else {
                setFilteredSemesters([]);
              }
              if (values.program_id && !filteredSemesters.find((sem) => sem.semester_id.toString() === values.semester_id)) {
                setFieldValue("semester", "");
              }
            }, [values.program_type_id, values.program_id, values.semester_id]);

            return (
              <FormikForm className="border rounded p-3 form-wizard">
                <Form.Group className="mb-2">
                  <Form.Label>Promo Code <span className="required">*</span></Form.Label>
                  <Field
                    name="promo_code"
                    className={`form-control ${errors.promo_code && touched.promo_code ? "is-invalid" : ""}`}
                  />
                  <ErrorMessage name="promo_code" component="div" className="invalid-feedback" />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Permission Type <span className="required">*</span></Form.Label>
                  <Field
                    as="select"
                    name="allow_permission"
                    className={`form-control ${errors.allow_permission && touched.allow_permission ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Permission</option>
                    <option value="Public">Public</option>
                    <option value="Internal">Internal</option>
                  </Field>
                  <ErrorMessage name="allow_permission" component="div" className="invalid-feedback" />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Program Type<span className="required">*</span></Form.Label>
                  <Field
                    as="select"
                    name="program_type_id"
                    className={`form-control ${errors.program_type_id && touched.program_type_id ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Program Type</option>
                    {programTypeListData.map((program_type) => (
                      <option key={program_type.id} value={program_type.id}>
                        {program_type.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="program_type_id" component="div" className="invalid-feedback" />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Program <span className="required">*</span></Form.Label>
                  <Field
                    as="select"
                    name="program_id"
                    className={`form-control ${errors.program_id && touched.program_id ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                      <option key={program.pid} value={program.pid}>
                        {program.program_name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="program_id" component="div" className="invalid-feedback" />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Semester <span className="required">*</span></Form.Label>
                  <Field
                    as="select"
                    name="semester_id"
                    className={`form-control ${errors.semester_id && touched.semester_id ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Semester</option>
                    {filteredSemesters.map((sem) => (
                      <option key={sem.semester_id} value={sem.semester_id}>
                        {sem.sem_name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="semester_id" component="div" className="invalid-feedback" />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button type="submit" style={{ backgroundColor: "#5d5fe3", color: "#fff" }}>
                    {selectedRole ? 'Update' : 'Submit'}
                  </Button>
                </div>
              </FormikForm>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ManageRoleAddUpdate;
