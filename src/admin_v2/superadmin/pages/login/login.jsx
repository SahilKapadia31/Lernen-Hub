import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ModalFooter, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useDispatch } from 'react-redux';

import FirstNavbar from '../../../../components/First_navabr';
import { Context } from '../../../../context/Context_provider';
import { setSuperAccessToken } from '../../../../pages/authService';
import axiosInstance from '../../components/services/axiosInstance';
import { setEncryptedData, getDecryptedData, removeData } from '../../../../../src/utils/helperFunctions';
import { loginSuccess } from '../../../../features/authSlice';

// SVG Initial...
import eyeFillSvg from '../../../../../src/assets/svg/eye-fill.svg';
import eyeNoneSvg from '../../../../../src/assets/svg/eye-cross.svg';
import spinnerSvg from '../../../../../src/assets/svg/spinner.svg';

//Style
import "./login.scss";

// Formik Initializations
const initialValues = { email: "superadmin@lernen-hub.de", password: "Welcome@@2025" };
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Enter a valid email address")
        .test(
            "domain-validation",
            "Email must contain a valid domain",
            (value) => {
                if (!value) return false; // Ensure value exists
                const parts = value.split("@");
                return parts.length === 2 && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(parts[1]);
            }
        ).required("Email is a required field."),
    password: Yup.string().required("Password is a required field.")
});
const validationForgotSchema = Yup.object().shape({
    email: Yup.string()
        .email("Enter a valid email address")
        .test(
            "domain-validation",
            "Email must contain a valid domain",
            (value) => {
                if (!value) return false; // Ensure value exists
                const parts = value.split("@");
                return parts.length === 2 && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(parts[1]);
            }
        ).required("Email is a required field.")
});
const initialForgotValues = { email: "" }; // Initial form values
const toastConfig = { autoClose: 3000, theme: 'colored', position: 'top-center' };// Centralized toast configuration

const SuperAdminLogin = ({ setemailvalidation }) => {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const { translate_value } = useContext(Context);
    const [password_type, setPassword_type] = useState(false);
    const [isForget, setForget] = useState(false);
    const [isForgetSuccess, setForgetSuccess] = useState(false);

    const [loading, setloading] = useState();
    const [forgotPassLoading, setForgotPassLoading] = useState(false);

    const generate_token = async (values) => {
        try {
            setloading(true);
            const response = await axiosInstance.post(`/api/token/`, values);
            setSuperAccessToken(response.data.access, response.data.refresh);
            verifiedlogin(values);
        } catch (err) {
            setloading(false);
            console.log("Token error", err);
            toast.error('Invalid Email and Password', toastConfig);
        }
    };

    const verifiedlogin = async (values) => {
        const { email, password } = values;
        const payload = { email: email, password };
        const toastOptions = { autoClose: 3000 };
        try {
            const response = await axiosInstance.post(`/superadmin/login/`, payload);
            dispatch(loginSuccess({user:response.data.user,role:response.data.roles}));
            setEncryptedData("superUser", JSON.stringify(response.data.user), 180);
            setEncryptedData("superRole", JSON.stringify(response.data.roles), 180);
            navigate('/superadmin/dashboard');
            setloading(false);
        } catch (error) {  // Handle login error
            setloading(false);
            const errorMessage = error.response?.data?.message || 'Invalid Email and Password';
            toast.error(errorMessage, toastOptions);
        } finally {
            setloading(false); // Stop loading
        }
    };

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState();
    const verifyemaildata = (e) => { setEmail(e.target.value) };
    const verifyEmail = (e) => {
        e.preventDefault();
        axiosInstance.post(`/userverification/`).then((r) => { setOtp(r.data.otp) });
    };
    const [newotp, setNewotp] = useState("");
    const otpdata = (e) => { setNewotp(e.target.value) };
    const submitOtp = (e) => {
        e.preventDefault();
        if (newotp === otp) { axiosInstance.put(`/CheckEmailForThreeMonths/${email}/`).then((r) => { setNewotp("") }) }
        // Else Part not Manage if Cases Open
    };

    const forgotpassword = async (values) => {
        // try {
        //     setForgotPassLoading(true);
        //     const forgotPasswordUrl = `${domain}/forgot_password/`;
        //     const formdata = new FormData();
        //     formdata.append('email', values.email);
        //     formdata.append('url', forgotPasswordUrl)
        //     const response = await axiosInstance.post(`/ForgetPassword/`, formdata); // Make the API call
        //     if (response.status === 200) { // Handle success
        //         toast.success('Password reset email sent successfully!', { autoClose: 3000, theme: 'colored', position: 'top-right' });
        //         setForget(false);
        //         setForgetSuccess(true);
        //         setForgotPassLoading(false);
        //     } else if (response.status === 404) {
        //         toast.success(response, toastConfig);
        //         setForgotPassLoading(false);
        //     } else {
        //         toast.error('Failed to send password reset email.', toastConfig);
        //         setForgotPassLoading(false);
        //     }
        // } catch (error) {
        //     console.log('Error occurred:', error);
        //     setForgotPassLoading(false);
        //     const errorMessage = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data
        //         : 'Something went wrong. Please try again.') : 'An unexpected error occurred. Please try again.';
        //     toast.error(errorMessage, toastConfig);
        // }
    };
    
    return (
        <div className='bg-light pb-4 superadmin-login' style={{ minHeight: '100vh' }}>
            <div className="container">
                <FirstNavbar />
                <div className="row mt-lg-2 loginform-div">
                    <div className="col-lg-12">
                        <div className='row'>
                            <h3 className='page6-month mb-0 text-center mb-3' style={{ fontSize: '24px', color: '#5D5FE3' }}>{'Super Admin'}</h3>
                            <div className='col-lg-5 p-0 forms-div m-auto'>
                                <div className='bg-white loginpageform1 shadow rounded h-100 px-3 d-flex flex-column align-items-center position-relative'>
                                    <h3 className='page6-month mb-0' style={{ fontSize: '24px', color: '#5D5FE3' }}>{translate_value.login_page.login}</h3>
                                    <div className="w-100">
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={validationSchema}
                                            onSubmit={(values) => generate_token(values)}
                                        >
                                            {({ values, handleChange, handleBlur, setFieldValue }) => (
                                                <Form className='p-2 px-2 mb-3'>
                                                    <div className="mb-2">
                                                        <label htmlFor="floatingInput" style={{ color: '#8E9696' }} className='mb-2'>{translate_value.login_page.email}</label>
                                                        <input type="text" id="email" name="email" className="form-control shadow-none bg-light"
                                                            style={{ height: '50px' }} value={values.email} onChange={handleChange} onBlur={handleBlur} />
                                                        <ErrorMessage className="validation-error" name='email' component='div' />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label htmlFor="floatingPassword" style={{ color: '#8E9696' }} className='mb-2'>{translate_value.login_page.password}</label>
                                                        <div className="input-group bg-light border rounded">
                                                            <input type={password_type ? "text" : "password"} name='password' className="form-control shadow-none border-0 bg-transparent"
                                                                style={{ height: '50px' }} id="floatingPassword" value={values.password} onChange={handleChange} onBlur={handleBlur} />
                                                            <span style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                                                {password_type ?
                                                                    <span onClick={() => { setPassword_type(!password_type) }} style={{ cursor: 'pointer' }} id="basic-addon2">
                                                                        <img src={eyeNoneSvg} alt="eye" style={{ width: '20px' }} />
                                                                    </span> :
                                                                    <img className="text-secondary bi bi-eye-fill" onClick={() => { setPassword_type(!password_type) }} src={eyeFillSvg} alt="eye" style={{ width: '20px' }} />
                                                                }
                                                            </span>
                                                        </div>
                                                        <ErrorMessage className="validation-error" name='password' component='div' />
                                                    </div>
                                                    <div className='text-end mb-4'>
                                                        <button type="button" className='forgot-btn' onClick={() => setForget(true)} >{translate_value.login_page.forgot_password}</button>
                                                    </div>
                                                    <div className="text-center" style={{ pointerEvents: loading ? 'none' : 'inherit', opacity: loading ? '0.8' : 1 }}>
                                                        <button type='submit' className='btn w-100 Login-btn btn-md py-2 px-5 text-white fw-medium' >
                                                            {loading &&
                                                                <img src={spinnerSvg} alt="spinner" style={{ width: '20px', marginRight: '10px' }} />
                                                            }&nbsp;{translate_value.login_page.submit}
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
                </div>
            </div>
            <div className="modal fade modal-md" id="verifyemail" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="d-flex p-2">
                            <button type="button" className="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div>
                            <h3 className=" fw-bold text-center fs-2 text-primary" id="staticBackdropLabel">Enter Your Email</h3>
                        </div>
                        <div className="modal-body">
                            <form action="" className='p-2 px-4' onSubmit={verifyEmail}>
                                <div className="form-floating mb-4">
                                    <input type="text" name='userid' className="form-control shadow-none" id="floatingInput1" placeholder="name@example.com" onChange={verifyemaildata} value={email} />
                                    <label htmlFor="floatingInput1" className='fw-normal'>Email</label>
                                </div>
                                <div className="text-center">
                                    <button type='submit' className='btn Login-btn btn-md py-3 w-100 text-white fw-medium' data-bs-toggle="modal" data-bs-target="#otpmodal">Verify Email</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="otpmodal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header text-center">
                            <h1 className="modal-title fs-5 mx-auto" id="exampleModalToggleLabel2">Enter the OTP</h1>
                        </div>
                        <div className="modal-body">
                            <form action="" className="p-2 px-4" onSubmit={submitOtp}>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-floating mb-4">
                                            <input onChange={otpdata} value={newotp} type="text" className="form-control shadow-none" id="floatingInput2" placeholder="name@example.com"
                                                name="first_name" />
                                            <label htmlFor="floatingInput2" className="fw-normal" >Enter Your OTP</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button className="btn signup-btn btn-md py-3 w-100 text-white fw-medium" type="submit" data-bs-target="#login" data-bs-dismiss="modal">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isForget} size={"md"} backdrop="static">
                <ModalHeader className='text-center' toggle={() => setForget(false)} ></ModalHeader>
                <ModalBody>
                    <div className='py-3'><h6 className=" fw-bold text-center fs-3 text-dark" id="staticBackdropLabel">Forgot Password</h6></div>
                    <Formik initialValues={initialForgotValues} validationSchema={validationForgotSchema} onSubmit={forgotpassword}>
                        {({ values, handleChange, handleBlur, setFieldValue }) => (
                            <Form action="" className='p-2 mt-3 px-4 mb-5' >
                                <p className='text-center'>Please enter your registered email ID</p>
                                <div className="form-floating mb-4">
                                    <input type="text" id="floatingInput3" name="email" value={values.email} placeholder="name@example.com" style={{ height: '50px' }}
                                        className="form-control shadow-none" onChange={handleChange} onBlur={handleBlur} />
                                    <label htmlFor="floatingInput3" className='fw-normal'>Email</label>
                                    <ErrorMessage className="validation-error" name='email' component='div' />
                                </div>
                                <div className="text-center mt-5" style={{ pointerEvents: forgotPassLoading ? 'none' : 'inherit', opacity: forgotPassLoading ? '0.8' : 1 }}>
                                    <button type='submit' className='btn Login-btn btn-md py-2 w-100 text-white fw-medium'>
                                        {forgotPassLoading && <img src={spinnerSvg} alt="spinner" style={{ width: '20px', marginRight: '10px' }} />}
                                        &nbsp;Submit
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
                <div className='modal-f-footer'>
                </div>
            </Modal>
            <Modal isOpen={isForgetSuccess} centered size={"md"} backdrop="static">
                <ModalBody>
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '300px' }}>
                        <img src={require('../../../../img/check__2_-removebg-preview.png')} width={70} alt="login" />
                        <p className="m-0 mt-3" style={{ color: '#34a853', fontSize: '16px' }}> We've Sent the link to reset the password</p>
                        <p className="m-0" style={{ color: '#34a853', fontSize: '16px' }}>in your registered Email ID </p>
                        <span style={{ color: '#34a853', fontSize: '16px' }}>Please check your Inbox</span>
                    </div>
                </ModalBody>
                <ModalFooter className='justify-content-end'>
                    <button className="btn btn-outline-secondary" onClick={() => setForgetSuccess(false)}>Close </button>
                </ModalFooter>
            </Modal>
            <div className="toast-container position-fixed top-0 end-0 p-3">
                <div id="liveToast2" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-body d-flex justify-content-between px-4 py-2">
                        <span id='toastbody2'></span>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SuperAdminLogin;