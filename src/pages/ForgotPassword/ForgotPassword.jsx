import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Preloader from '../Preloader';
import { domain, ipaddress } from '../../App';
import apiClient from '../../pages/Middlewares/axiosConfig';
import axiosInstance from '../axiosInstance';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import { Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import "./ForgotPassword.css";
const toastConfigRight = { autoClose: 3000, theme: 'colored', position: 'top-right' };

const Forgot_password_page = () => {
    const initialValues = { password: '', confirm_password: '' };
    const { pattern } = useParams();
    let navigate = useNavigate();
    let [auth, setauth] = useState();
    const [isShowNewPassword, setIsShowNewPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [loading, setloading] = useState();
    const validationSchema = Yup.object().shape({
        password: Yup.string().min(8).required("New password is a required."),
        confirm_password: Yup.string().required("Confirm password is required.").oneOf([Yup.ref("password"), null], "Passwords must match."),
    });
    const checkTokenValidity = async () => {
        try {
            const response = await apiClient.get(`${ipaddress}/CheckPasswordResetToken/${pattern}/`);
            const { data } = response;
            if (data?.status) {
                toast.success(data.message, toastConfigRight);
                setauth(true);
            } else { toast.error(data.message || "Invalid token response.", toastConfigRight) }
        } catch (error) {
            // Extract error message if available, otherwise use a fallback
            const errorMessage = error?.response?.data && typeof error.response.data === "string"
                ? error.response.data
                : "An unexpected error occurred. Please try again.";
            toast.error(errorMessage, toastConfigRight);
        }
    };
    useEffect(() => {
        if (pattern) { checkTokenValidity() }
    }, [pattern])
    const resetPassword = async (values) => {
        try {
            const formdata = new FormData();
            formdata.append("token", pattern);
            formdata.append("password", values.password);
            const response = await axiosInstance.post(`${ipaddress}/PasswordReset/`, formdata);
            const result = response.data; // Handle API Response
            return { status: result?.status || false, message: result?.message || "Unknown response from server." };
        } catch (error) {
            console.log("Error occurred:", error);
            const errorMessage = error?.response?.data && typeof error.response.data === "string" ? error.response.data : "Something went wrong. Please try again.";
            return { status: false, message: errorMessage };
        }
    };
    return (
        <div>
            {loading ? (<Preloader />) : (
                <div className='bg-light d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                    {
                        auth ? <>
                            <div className="container h-100">
                                <div className="row h-100 d-flex align-items-center">
                                    <div className='col-lg-6 p-0 m-auto'>
                                        <div className='bg-white loginpageform1 forgot-form py-sm-4 shadow rounded  h-100 pb-2 px-4 d-flex flex-column align-items-center position-relative'>
                                            <h3 className='forgot-title mb-3' style={{ fontSize: '35px', color: '#5D5FE3' }}>Reset Your Password</h3>
                                            <div className="w-100">
                                                <Formik
                                                    initialValues={initialValues}
                                                    validationSchema={validationSchema}
                                                    onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
                                                        try {
                                                            const response = await resetPassword(values);
                                                            if (response.status) {
                                                                toast.success(response.message, toastConfigRight); // Notify success
                                                                resetForm(); // Reset form on success
                                                                setloading(false);
                                                                setauth(false);
                                                                navigate('/loginpage');
                                                            } else {
                                                                toast.error(response.message, toastConfigRight); // Notify failure
                                                            }
                                                        } catch (error) {
                                                            console.error("Submission Error:", error);
                                                            setErrors({ apiError: "An unexpected error occurred. Please try again." }); // Display fallback error
                                                        } finally {
                                                            setSubmitting(false); // End submission state
                                                        }
                                                    }}
                                                >
                                                    {({ values, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
                                                        <Form className='p-2 px-2'>
                                                            <div className="mb-2">
                                                                <label htmlFor="floatingPassword" style={{ color: '#8E9696' }} className='mb-2'>New Password <span className="required">*</span></label>
                                                                <div className="input-group mb-3 bg-light border rounded">
                                                                    <input
                                                                        type={isShowNewPassword ? "text" : "password"}
                                                                        name='password'
                                                                        className="form-control shadow-none border-0 bg-transparent"
                                                                        style={{ height: '50px' }}
                                                                        id="password"
                                                                        value={values.password}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur} />
                                                                    {
                                                                        isShowNewPassword ?
                                                                            <span onClick={() => { setIsShowNewPassword(!isShowNewPassword) }} style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                                                                <svg fill="#98a2b3" width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 3.71875 2.28125 L 2.28125 3.71875 L 8.5 9.90625 L 19.59375 21 L 21.5 22.9375 L 28.28125 29.71875 L 29.71875 28.28125 L 23.5 22.0625 C 27.734375 19.964844 30.574219 16.851563 30.75 16.65625 L 31.34375 16 L 30.75 15.34375 C 30.480469 15.042969 24.085938 8 16 8 C 14.042969 8 12.195313 8.429688 10.5 9.0625 Z M 16 10 C 18.152344 10 20.1875 10.605469 22 11.4375 C 22.644531 12.515625 23 13.734375 23 15 C 23 16.816406 22.296875 18.476563 21.15625 19.71875 L 18.3125 16.875 C 18.730469 16.363281 19 15.714844 19 15 C 19 13.34375 17.65625 12 16 12 C 15.285156 12 14.636719 12.269531 14.125 12.6875 L 12.09375 10.65625 C 13.335938 10.273438 14.636719 10 16 10 Z M 6.6875 10.90625 C 3.480469 12.878906 1.398438 15.175781 1.25 15.34375 L 0.65625 16 L 1.25 16.65625 C 1.507813 16.945313 7.429688 23.425781 15.0625 23.9375 C 15.371094 23.96875 15.683594 24 16 24 C 16.316406 24 16.628906 23.96875 16.9375 23.9375 C 17.761719 23.882813 18.566406 23.773438 19.34375 23.59375 L 17.5625 21.8125 C 17.054688 21.929688 16.539063 22 16 22 C 12.140625 22 9 18.859375 9 15 C 9 14.46875 9.070313 13.949219 9.1875 13.4375 Z M 7.25 12.9375 C 7.089844 13.613281 7 14.300781 7 15 C 7 16.738281 7.488281 18.339844 8.34375 19.71875 C 6.054688 18.40625 4.304688 16.867188 3.40625 16 C 4.152344 15.277344 5.496094 14.078125 7.25 12.9375 Z M 24.75 12.9375 C 26.503906 14.078125 27.84375 15.277344 28.59375 16 C 27.695313 16.867188 25.917969 18.4375 23.625 19.75 C 24.484375 18.371094 25 16.738281 25 15 C 25 14.300781 24.910156 13.609375 24.75 12.9375 Z" /></svg>
                                                                            </span> :
                                                                            <span onClick={() => { setIsShowNewPassword(!isShowNewPassword) }} style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                                                                </svg>
                                                                            </span>
                                                                    }

                                                                </div>
                                                                <ErrorMessage className="validation-error" name='password' component='div' />
                                                            </div>
                                                            <div className="mb-2">
                                                                <label htmlFor="floatingPassword" style={{ color: '#8E9696' }} className='mb-2'>Confirm Password <span className="required">*</span></label>
                                                                <div className="input-group mb-3 bg-light border rounded">
                                                                    <input
                                                                        type={isShowConfirmPassword ? "text" : "password"}
                                                                        name='confirm_password'
                                                                        className="form-control shadow-none border-0 bg-transparent"
                                                                        style={{ height: '50px' }}
                                                                        id="confirm_password"
                                                                        value={values.confirm_password}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur} />
                                                                    {
                                                                        isShowConfirmPassword ?
                                                                            <span onClick={() => { setIsShowConfirmPassword(!isShowConfirmPassword) }} style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                                                                <svg fill="#98a2b3" width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 3.71875 2.28125 L 2.28125 3.71875 L 8.5 9.90625 L 19.59375 21 L 21.5 22.9375 L 28.28125 29.71875 L 29.71875 28.28125 L 23.5 22.0625 C 27.734375 19.964844 30.574219 16.851563 30.75 16.65625 L 31.34375 16 L 30.75 15.34375 C 30.480469 15.042969 24.085938 8 16 8 C 14.042969 8 12.195313 8.429688 10.5 9.0625 Z M 16 10 C 18.152344 10 20.1875 10.605469 22 11.4375 C 22.644531 12.515625 23 13.734375 23 15 C 23 16.816406 22.296875 18.476563 21.15625 19.71875 L 18.3125 16.875 C 18.730469 16.363281 19 15.714844 19 15 C 19 13.34375 17.65625 12 16 12 C 15.285156 12 14.636719 12.269531 14.125 12.6875 L 12.09375 10.65625 C 13.335938 10.273438 14.636719 10 16 10 Z M 6.6875 10.90625 C 3.480469 12.878906 1.398438 15.175781 1.25 15.34375 L 0.65625 16 L 1.25 16.65625 C 1.507813 16.945313 7.429688 23.425781 15.0625 23.9375 C 15.371094 23.96875 15.683594 24 16 24 C 16.316406 24 16.628906 23.96875 16.9375 23.9375 C 17.761719 23.882813 18.566406 23.773438 19.34375 23.59375 L 17.5625 21.8125 C 17.054688 21.929688 16.539063 22 16 22 C 12.140625 22 9 18.859375 9 15 C 9 14.46875 9.070313 13.949219 9.1875 13.4375 Z M 7.25 12.9375 C 7.089844 13.613281 7 14.300781 7 15 C 7 16.738281 7.488281 18.339844 8.34375 19.71875 C 6.054688 18.40625 4.304688 16.867188 3.40625 16 C 4.152344 15.277344 5.496094 14.078125 7.25 12.9375 Z M 24.75 12.9375 C 26.503906 14.078125 27.84375 15.277344 28.59375 16 C 27.695313 16.867188 25.917969 18.4375 23.625 19.75 C 24.484375 18.371094 25 16.738281 25 15 C 25 14.300781 24.910156 13.609375 24.75 12.9375 Z" /></svg>
                                                                            </span> :
                                                                            <span onClick={() => { setIsShowConfirmPassword(!isShowConfirmPassword) }} style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                                                                </svg>
                                                                            </span>
                                                                    }
                                                                </div>
                                                                <ErrorMessage className="validation-error" name='confirm_password' component='div' />
                                                            </div>
                                                            <div className="text-center">
                                                                <button type='submit' className='btn Login-btn btn-md py-2 px-5 text-white fw-medium' >
                                                                    {loading ? 'Loading...' : 'Continue'}
                                                                </button>
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </> : <>
                            <div className="invalid-text p-3 text-center rounded d-flex flex-column align-items-center justify-content-center">
                                <img src={require('../../img/landing_page/Group 385.png')} alt="Error" className="mb-3" height={40} />
                                <h4 className="mb-3">Invalid URL</h4>
                                <section>
                                    <p>Go to login page: <a href={domain} className="text-decoration-none">click here</a></p>
                                </section>
                            </div>

                        </>
                    }
                </div >
            )}
        </div >
    )
}

export default Forgot_password_page