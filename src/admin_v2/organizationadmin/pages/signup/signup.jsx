import React, { useState, useContext } from 'react';
import { Form } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Loading from "react-fullscreen-loading";
import { Button } from 'reactstrap';

import FirstNavbar from '../../../../components/First_navabr';
import axiosInstance from '../../components/services/axiosInstance';

//Style
import "./signup.scss";

const StaffSignup = () => {

    const [isLoading, setIsLoading] = useState(false);

    // Formik Initializations
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm_password: "",
        signup_code: ""
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("Firstname required"),
        lastName: Yup.string().required("Lastname required"),
        email: Yup.string().email("Enter a valid email address").required("Email is a required."),
        password: Yup.string().required("Password is a required."),
        confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Password not match').required("Confirm password is a required."),
        signup_code: Yup.string().required("Signup Code is a required."),
    });

    const submitStaffForm = async (values,resetForm ) => {
        try {
            const payload = {
                "firstName": values.firstName,
                "lastName": values.lastName,
                "email": values.email,
                "password": values.password,
                "signup_code": values.signup_code
            }

            const response = await axiosInstance.post(`/organization/registration-staff/`, payload);

            if (response && response.status) {
                setIsLoading(false);
                resetForm();
                toast.success("Registration completed successfully");
            } else {
                setIsLoading(false);
                toast.error("Error!!! Please try again");
            }
        } catch (err) {
            setIsLoading(false);
            console.log("Error in submitStaffForm", err);
            toast.error("Error!!! Please try again");
        }
    };

    return (
        <div className='bg-light pb-4 organization-login' style={{ minHeight: '100vh' }}>
            <div className="container">
                <FirstNavbar />
                <div className="row mt-lg-2 loginform-div">
                    <div className="col-lg-12">
                        <div className='row'>
                            <h3 className='page6-month mb-0 text-center mb-3' style={{ fontSize: '24px', color: '#5D5FE3' }}>{'Staff'}</h3>
                            <div className='col-lg-5 p-0 forms-div m-auto'>
                                <div className='bg-white loginpageform1 shadow rounded h-100 px-3 d-flex flex-column align-items-center position-relative'>
                                    <h3 className='page6-month mb-0' style={{ fontSize: '24px', color: '#5D5FE3' }}>{'Registration'}</h3>
                                    <div className="w-100">
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={validationSchema}
                                            onSubmit={(values,{ resetForm }) => {
                                                submitStaffForm(values,resetForm )
                                
                                            }}
                                        >
                                            {({ errors, touched, isValid }) => (
                                                <FormikForm className=" rounded p-3 form-wizard">
                                                    <>
                                                        <Form.Group className="mb-2 w-100">
                                                            <Form.Label className="form-label">
                                                                Signup Code <span className="required">*</span>
                                                            </Form.Label>
                                                            <Field name="signup_code" placeholder="Enter signup code" className={`form-control ${errors.signup_code && touched.signup_code ? "is-invalid" : ""}`} />
                                                            <ErrorMessage name="signup_code" component="div" className="invalid-feedback" />
                                                        </Form.Group>
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
                                                            <Form.Group className="mb-2 w-100">
                                                                <Form.Label className="form-label">
                                                                    Email <span className="required">*</span>
                                                                </Form.Label>
                                                                <Field name="email" placeholder="Enter email" className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`} />
                                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                                            </Form.Group>

                                                            {/* {!staffDetails &&
                                                                <Form.Group className="mb-2 w-50">
                                                                    <Form.Label className="form-label">
                                                                        Phone <span className="required">*</span>
                                                                    </Form.Label>
                                                                    <Field name="phoneNumber" placeholder="Enter phone number" className={`form-control ${errors.phoneNumber && touched.phoneNumber ? "is-invalid" : ""}`} />
                                                                    <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                                                                </Form.Group>
                                                            } */}
                                                        </div>

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

                                                    </>
                                                    <div className="d-flex mt-2">
                                                        <Button type="submit" className='w-100' style={{ backgroundColor: "#5d5fe3", color: "#fff" }} >{'Submit'}</Button>
                                                    </div>
                                                </FormikForm>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Loading loading={true} loaderColor="#000" />}
        </div>
    );
};
export default StaffSignup;