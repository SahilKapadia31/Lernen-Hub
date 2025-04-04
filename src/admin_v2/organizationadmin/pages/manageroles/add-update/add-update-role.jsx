import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { Modal, Button } from "react-bootstrap";
import * as Yup from "yup";
import close_icon from '../../../../../img/close-icon.svg';
import "./add-update-role.scss";

const ManageRoleAddUpdate = ({ show, permissionsData, onSubmit,handleClose,selectedRole }) => {
  const [permissions, setPermissions] = useState(permissionsData);

  const initialValues = {
    role_name: selectedRole?.role_name || "",
  };
  
  const validationSchemas = Yup.object({
    role_name: Yup.string().required("Required"),
  });

  
  const togglePermission = (id) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((perm) =>
        perm.permission_id === id
          ? { ...perm, is_active: !perm.is_active }
          : perm
      )
    );

    console.log(permissions);
    
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="slide-in-right right-side-modal">
        <Modal.Body className="bg-light">
          <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
            <div className="d-flex gap-2 align-items-center">
              <p className="mb-0 fw-bold">{selectedRole ? 'Update' : 'Add'} Role</p>
            </div>
            <img src={close_icon} width={15} style={{ cursor: "pointer" }} onClick={() => handleClose()}/>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas}
            onSubmit={(values) => {
              console.log(values);
              onSubmit({ ...values, permissions })
            }}
          >
            {({ errors, touched, isValid }) => (
              <FormikForm className="border rounded p-3 form-wizard">
                <>
                  <Form.Group className="mb-2">
                    <Form.Label className="form-label">
                      Role Name <span className="required">*</span>
                    </Form.Label>
                    <Field
                      name="role_name"
                      className={`form-control ${errors.role_name && touched.role_name ? "is-invalid" : ""
                        }`}
                    />
                    <ErrorMessage
                      name="role_name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="form-label">
                      Permission <span className="required">*</span>
                    </Form.Label>
                    <div className="card p-4 border rounded shadow">

                      {permissionsData.map((perm) => (
                        <div key={perm.permission_id} className="form-check form-switch mb-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`switch${perm.permission_id}`}
                            checked={perm.is_active}
                            onChange={() => togglePermission(perm.permission_id)}
                          />
                          <label className="form-check-label" htmlFor={`switch${perm.permission_id}`}>
                            {perm.permission_name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </>
                <div className="d-flex justify-content-end">
                  <Button type="submit" style={{ backgroundColor: "#5d5fe3", color: "#fff" }}>{selectedRole ? 'Update' : 'Submit'}</Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default ManageRoleAddUpdate;
