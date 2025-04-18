import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../../context/Context_provider';
import { Formik, ErrorMessage, Form, useFormik, Field } from 'formik';
import * as Yup from 'yup';
import { useRef } from "react";
import { toast } from 'react-toastify';
import apiClient from '../../../pages/Middlewares/axiosConfig';
import { setAccessToken } from '../../../pages/authService';
import axiosInstance from '../../../pages/axiosInstance';
import { ModalFooter, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { ipaddress, domain, ipaddress3 } from '../../../App';
import "./loginDialog.scss";
import { setEncryptedData, getDecryptedData, removeData } from '../../../../src/utils/helperFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/authSlice';

// SVG Initial...
import close_icon from '../../../assets/svg/model_close.svg';
import logo from '../../../img/landing_page/logo-full.svg'
import eyeFillSvg from '../../../../src/assets/svg/eye-fill.svg';
import eyeNoneSvg from '../../../../src/assets/svg/eye-cross.svg';
import spinnerSvg from '../../../../src/assets/svg/spinner.svg';

const initialValues = { email: "", password: "" };
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

const initialForgotValues = { email: "" };
const validationForgotSchema = Yup.object().shape({
    email: Yup.string()
        .email("Enter a valid email address")
        .test(
            "domain-validation",
            "Email must contain a valid domain",
            (value) => {
                if (!value) return false;
                const parts = value.split("@");
                return parts.length === 2 && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(parts[1]);
            }
        ).required("Email is a required field.")
});

const toastConfig = { autoClose: 3000, theme: 'colored', position: 'top-center' };

const LoginpageDialog = ({ show, handleClose, redirectUrl }) => {

    const [formType, setFormType] = useState('login');
    const [currentCity, setCurrentCity] = useState();
    const [emailValidateForm, setEmailValidateForm] = useState(true);
    const { translate_value } = useContext(Context);
    const [password_type, setPassword_type] = useState(false);
    const [isForget, setForget] = useState(false);
    const [isForgetSuccess, setForgetSuccess] = useState(false);
    const dispatch = useDispatch();
    let navigate = useNavigate();

    // ----------------------------------------------Login-------------------------------------------------------------
    const [loading, setloading] = useState();
    const [forgotPassLoading, setForgotPassLoading] = useState(false);

    const generate_token = async (values) => {
        try {
            setloading(true);
            const response = await apiClient.post(`${ipaddress}/api/token/`, values);
            setAccessToken(response.data.access, response.data.refresh);
            dispatch(loginSuccess({ user: response.data.user }));
            setEncryptedData("user", JSON.stringify(response.data.user), 180);
            let navigateURL = redirectUrl ? redirectUrl : '/'
            navigate(navigateURL);
            setloading(false);
            handleClose();
        } catch (err) {
            setloading(false);
            console.log("Token error", err);
            toast.error('Invalid Email and Password', toastConfig);
        }
    };

    const getCurrentCitybyIP = async () => {
        try {
            const response = await fetch('http://ip-api.com/json');
            const data = await response.json();
            if (data && data.city) {
                setCurrentCity(data.city);
            } else {
                console.error('City not found in response:', data);
            }
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };


    // const verifiedlogin = async (values) => {
    //     const { email, password } = values;
    //     const payload = { userid: email, password };
    //     const toastOptions = { autoClose: 3000 };
    //     try {
    //         const response = await axiosInstance.post(`${ipaddress}/UserLogin/`, payload);
    //         dispatch(loginSuccess({ user: response.data }));
    //         setEncryptedData("user", JSON.stringify(response.data), 180);
    //         navigate('/dashboard/page');
    //         setloading(false);
    //     } catch (error) {  // Handle login error
    //         setloading(false);
    //         const errorMessage = error.response?.data?.message || 'Invalid Email and Password';
    //         toast.error(errorMessage, toastOptions);
    //     } finally {
    //         setloading(false); // Stop loading
    //     }
    // };

    const forgotpassword = async (values) => {
        try {
            setForgotPassLoading(true);
            const forgotPasswordUrl = `${domain}/forgot_password/`;
            const formdata = new FormData();
            formdata.append('email', values.email);
            formdata.append('url', forgotPasswordUrl) // Construct the forgot password URL dynamically and append it 
            // formdata.append('url', 'https://lernen-hub.de/forgot_password/');
            const response = await axiosInstance.post(`${ipaddress}/ForgetPassword/`, formdata); // Make the API call
            if (response.status === 200) { // Handle success
                toast.success('Password reset email sent successfully!', { autoClose: 3000, theme: 'colored', position: 'top-right' });
                setForget(false);
                setForgetSuccess(true);
                setForgotPassLoading(false);
            } else if (response.status === 404) {
                toast.success(response, toastConfig);
                setForgotPassLoading(false);
            } else {
                toast.error('Failed to send password reset email.', toastConfig);
                setForgotPassLoading(false);
            }
        } catch (error) {
            console.log('Error occurred:', error);
            setForgotPassLoading(false);
            const errorMessage = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data
                : 'Something went wrong. Please try again.') : 'An unexpected error occurred. Please try again.';
            toast.error(errorMessage, toastConfig);
        }
    };

    // ----------------------------------------------SignUp OTP Verification-------------------------------------------------------------
    const [university, setUniversity] = useState("");
    const [domains, setdomains] = useState([]);
    const [isChecked, setisChecked] = useState(false);
    const [showTerms, setShowTerms] = React.useState(false);
    const [otpToken, setOtpToken] = useState("");
    const search_domain = (value) => { // To get the university email id domains
        // ----------------------------------------------To check the condition for @ and then it will call API------------------------
        const atIndex = value.indexOf('@');
        if (atIndex !== -1 && atIndex < value.length - 1 && value.length > 0) {
            const inputAfterAt = value.substring(atIndex + 1);
            apiClient.get(`${ipaddress}/SendDomains/${inputAfterAt}/`)
                .then((r) => {
                    setdomains(r.data); //  console.log("Domains",r.data)
                }).catch((err) => { console.log("Error", err); });
        } else { setdomains([]) }
    }

    const [otpvalidationform, setotpvalidationform] = useState(false);
    const fetchOTP = async () => {
        if (!university) { // Check for empty fields
            toast.error('Email is required', { autoClose: 3000, theme: 'colored', position: 'top-center' });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validate email format
        if (!emailRegex.test(university)) {
            toast.error('Invalid email format', { autoClose: 3000, theme: 'colored', position: 'top-center' });
            return;
        }
        setloading(true);
        setOtp(new Array(6).fill(""));
        setTimer(120);
        setOTPValid(true);
        const universityMail = new FormData();
        universityMail.append('email', university);
        try {
            const response = await apiClient.post(`${ipaddress}/userverification/v2/`, universityMail);
            if (response && response.data.status === false) {
                toast.warn(response.data.message, { autoClose: 3000 });
            } else {
                setOtpToken(response.data);
                setEmailValidateForm(false);
                setotpvalidationform(true);
                toast.success('OTP sent successfully!', { autoClose: 3000, theme: 'colored', position: 'top-center' });
            }
        } catch (error) {
            if (error.response) { // Errors from the server
                toast.error(`Server error: ${error.response.data.message || 'Unexpected error'}`, { autoClose: 3000, theme: 'colored', position: 'top-center' });
            } else if (error.request) { // No response received
                toast.error('Network error: No response from server', { autoClose: 3000, theme: 'colored', position: 'top-center' });
            } else {  // Other errors
                console.log("Error in request setup", error.message);
                toast.error(`Unexpected error: ${error.message}`, { autoClose: 3000, theme: 'colored', position: 'top-center' });
            }
        } finally {
            setloading(false); // Stop loading
        }
    };

    // Yup validation schema for OTP
    const validationSchema = Yup.object({
        otp: Yup.array().of(Yup.string()
            .length(1, 'Each OTP input should be 1 digit long')
            .matches(/^[0-9]$/, 'Only digits are allowed') // Regex to allow only digits
            .required('OTP digit is required')
        ).length(6, 'OTP must have exactly 6 digits') // Ensure OTP is 6 digits
    });

    const inputRefs = useRef([]);
    const [otploading, setOtpLoading] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(30)
    const [otpValid, setOTPValid] = useState(true);
    const handleotpChange = (e, index, setFieldValue) => {
        const value = e.target.value;
        setFieldValue(`otp[${index}]`, value);
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value !== "" && index < 5) { inputRefs.current[index + 1].focus() }
        }
    };

    const handlePaste = (e, setFieldValue) => {
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        const otpArray = pasteData.split('');
        setOtp(otpArray);
        otpArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                setFieldValue(`otp[${index}]`, char);
                inputRefs.current[index].value = char;
            }
        });
    };

    const sendOtp = async (enteredOtp) => {
        if (!enteredOtp) { // Check for empty fields
            setOtp(new Array(6).fill(""));
            return;
        }
        setOtpLoading(true);
        const emailOtp = new FormData();
        emailOtp.append('token', otpToken?.token);
        emailOtp.append('otp', enteredOtp);
        try {
            const response = await apiClient.post(`${ipaddress}/userverification/validate/`, emailOtp);
            if (response?.data?.message === 'OTP validated successfully') {
                setOtpToken("");
                setotpvalidationform(false);
                setEmailValidateForm(false);
                setOtp(new Array(6).fill(""));
                toast.success('OTP validated successfully', { autoClose: 3000, position: 'top-center' });
                setOtpLoading(false);
            } else {
                toast.error(response?.data?.message || 'Unexpected error', { autoClose: 3000, position: 'top-center' });
                setOtpLoading(false);
            }
        } catch (error) {
            setOtpLoading(false);
            if (error.response) { // Errors from the server
                toast.error(`Server error: ${error.response.data.message || 'Unexpected error'}`, { autoClose: 3000, theme: 'colored', position: 'top-center' });
            } else if (error.request) { // No response received
                toast.error('Network error: No response from server', { autoClose: 3000, theme: 'colored', position: 'top-center' });
            } else {  // Other errors
                console.log("Error in request setup", error.message);
                toast.error(`Unexpected error: ${error.message}`, { autoClose: 3000, theme: 'colored', position: 'top-center' });
            }
        } finally {
            setOtpLoading(false);
            setloading(false); // Stop loading
        }
    };

    const signUpInitialValues = {
        fullname: '',
        email: university || '',
        password: '',
    };

    const signUpValidationSchema = Yup.object({
        fullname: Yup.string().required('Full name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    // ----------------------------------------------SignUp Final-------------------------------------------------------------
    const [passwordType, setPasswordType] = useState(false);
    const [formData, setFormData] = useState({ isTeacher: null, isJoinCode: null, joinCode: null, firstName: null, lastName: null, dob: null });

    const handleTeacherSelection = (value) => {
        setFormData((prev) => ({ ...prev, isTeacher: value }));
    };

    const handleJoinCodeSelection = (value) => {
        setFormData((prev) => ({ ...prev, isJoinCode: value }));

        if (value == false) {
            setFormData((prev) => ({ ...prev, joinCode: null, firstName: null, lastName: null, dob: null }));
        }
    };

    const handleJoinForm = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleCreateAccount = async (values) => {
        try {
            setloading(true)
            const payload = {
                "type": formData.isTeacher ? "Staff" : "Student",
                "email": university,
                "fullname": values.fullname,
                "password": values.password,
            }

            if (formData?.joinCode && formData?.firstName && formData?.lastName && formData?.dob) {
                payload["join_code"] = formData?.joinCode
                payload["first_name"] = formData?.firstName
                payload["last_name"] = formData?.lastName
                payload["date_of_birth"] = formData?.dob
            }

            const response = await axiosInstance.post(`${ipaddress3}/public/signup-user/`, payload);

            if (response.status) {
                toast.success('Registered successfully!', { autoClose: 3000, theme: 'colored', position: 'top-center' });
                generate_token({ email: payload.email, password: payload.password })
            } else {
                toast.error('Error!!! Please try again', { autoClose: 3000, theme: 'colored', position: 'top-center' });
            }
            setloading(false)
        } catch (err) {
            console.log("Error in handleCreateAccount", err);
            toast.error('Error!!! Please try again', { autoClose: 3000, theme: 'colored', position: 'top-center' });
            setloading(false)
        }

    }

    const resetSignup = () => {
        setUniversity('');
        setFormData({ isTeacher: null });
        setisChecked(false);
        setShowTerms(false);
        setloading(false);
        setFormType('login');
        setEmailValidateForm(true);
        setotpvalidationform(false);
    }

    useEffect(() => {
        if (show) {
            resetSignup();
        }
    }, [show])

    useEffect(() => {
        getCurrentCitybyIP();
    }, []);
    return (
        <>
            <Modal isOpen={show} size={"md"} backdrop="static" centered>
                {formType == 'login' ?
                    <div className="row mt-lg-2 login-dialog">
                        <div className="col-lg-12">
                            <div className='row'>
                                <div className='col-lg-10 p-0 m-auto'>
                                    <div className='h-100 px-3 d-flex flex-column align-items-center position-relative'>
                                        <div className='d-flex align-items-center mt-3 justify-content-center w-100'>
                                            <img src={logo} />
                                            <img src={close_icon} className='close-icon' onClick={handleClose} />
                                        </div>
                                        <p className='login-title'>Login to get started!</p>
                                        <div className="w-100">
                                            <Formik
                                                initialValues={initialValues}
                                                validationSchema={validationSchema}
                                                onSubmit={(values) => generate_token(values)}
                                            >
                                                {({ values, handleChange, handleBlur, setFieldValue }) => (
                                                    <Form className='p-2 px-2'>
                                                        <div className="mb-2">
                                                            <label htmlFor="floatingInput" style={{ color: '#8E9696' }} className='mb-2'>{translate_value.login_page.email}<span className='text-danger'>*</span></label>
                                                            <input type="text" id="email" name="email" className="form-control shadow-none bg-light"
                                                                style={{ height: '50px' }} value={values.email} onChange={handleChange} onBlur={handleBlur} />
                                                            <ErrorMessage className="validation-error" name='email' component='div' />
                                                        </div>
                                                        <div className="mb-2">
                                                            <label htmlFor="floatingPassword" style={{ color: '#8E9696' }} className='mb-2'>{translate_value.login_page.password}<span className='text-danger'>*</span></label>
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
                                                        <div className='text-end mb-2'>
                                                            <button type="button" className='forgot-btn' onClick={() => setForget(true)} >{translate_value.login_page.forgot_password}</button>
                                                        </div>
                                                        <div className="text-center" style={{ pointerEvents: loading ? 'none' : 'inherit', opacity: loading ? '0.8' : 1 }}>
                                                            <button type='submit' className='btn w-100 Login-btn btn-md py-2 px-5 text-white fw-medium text-capitalize' >
                                                                {loading &&
                                                                    <img src={spinnerSvg} alt="spinner" style={{ width: '20px', marginRight: '10px' }} />
                                                                }&nbsp;{translate_value.login_page.submit}
                                                            </button>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                            <div className='px-2 position-relative'>
                                                <span className='orspan'>Or</span>
                                                <hr></hr>
                                                <div className='border w-100 mb-4 d-flex align-items-center gap-3 px-3' style={{ pointerEvents: loading ? 'none' : 'inherit', opacity: loading ? '0.8' : 1 }}>
                                                    {/* <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=fill"> <g id="email"> <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M7 2.75C5.38503 2.75 3.92465 3.15363 2.86466 4.1379C1.79462 5.13152 1.25 6.60705 1.25 8.5V15.5C1.25 17.393 1.79462 18.8685 2.86466 19.8621C3.92465 20.8464 5.38503 21.25 7 21.25H17C18.615 21.25 20.0754 20.8464 21.1353 19.8621C22.2054 18.8685 22.75 17.393 22.75 15.5V8.5C22.75 6.60705 22.2054 5.13152 21.1353 4.1379C20.0754 3.15363 18.615 2.75 17 2.75H7ZM19.2285 8.3623C19.5562 8.10904 19.6166 7.63802 19.3633 7.31026C19.1101 6.98249 18.6391 6.9221 18.3113 7.17537L12.7642 11.4616C12.3141 11.8095 11.6858 11.8095 11.2356 11.4616L5.6886 7.17537C5.36083 6.9221 4.88982 6.98249 4.63655 7.31026C4.38328 7.63802 4.44367 8.10904 4.77144 8.3623L10.3185 12.6486C11.3089 13.4138 12.691 13.4138 13.6814 12.6486L19.2285 8.3623Z" fill="#000000"></path> </g> </g> </g></svg> */}
                                                    <p className='signup' onClick={() => setFormType('signup')}>New to Lernen-Hub? Sign Up</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    :
                    emailValidateForm ?
                        <div className="row mt-lg-2 login-dialog">
                            <div className="col-lg-12">
                                <div className='row'>
                                    <div className='col-lg-10 p-0 m-auto'>
                                        <div className='h-100 px-3 d-flex flex-column align-items-center position-relative'>
                                            <div className='d-flex align-items-center mt-3 justify-content-center w-100'>
                                                <img src={logo} />
                                                <img src={close_icon} className='close-icon' onClick={handleClose} />
                                            </div>
                                            <p className='login-title'>Create account to get started!</p>
                                            <div className="w-100">
                                                <div className='p-2'>
                                                    <div className="mb-2">
                                                        <label htmlFor="floatingInput" style={{ color: '#8E9696' }} className='mb-2'>{translate_value.login_page.email}<span className='text-danger'>*</span></label>
                                                        <input type="email" placeholder='Enter email' required id="email" name="email" className="form-control shadow-none bg-light"
                                                            style={{ height: '50px' }} value={university} onChange={(e) => { setUniversity(e.target.value) }} onKeyUp={(e) => search_domain(e.target.value)} />
                                                    </div>
                                                    <div className={`${domains.length > 0 ? '' : 'd-none'} bg-light border border-top-0 px-2 py-2 shadow-sm rounded`} style={{ maxHeight: '160px', overflowY: 'scroll' }}>
                                                        {domains && (
                                                            domains.map((x) => {
                                                                return (
                                                                    <p key={x.domain} className="m-0 mb-1" style={{ fontSize: '14px', cursor: 'pointer' }} onClick={() => {
                                                                        const atIndex = university.indexOf('@');
                                                                        if (atIndex !== -1) {
                                                                            const partBeforeAt = university.substring(0, atIndex + 1);
                                                                            setUniversity(partBeforeAt + x.domain);
                                                                        }
                                                                        setdomains([]);
                                                                    }}>{x.domain}</p>
                                                                )
                                                            })
                                                        )}
                                                    </div>

                                                    <div className="d-flex mt-3 mb-2">
                                                        <input type="checkbox" onClick={() => { setisChecked(!isChecked) }} checked={isChecked} />
                                                        <p className="m-0 ms-2 text-secondary terms">By signing up you &nbsp;
                                                            <span className="text-decoration-underline fw-medium text-dark" style={{ cursor: 'pointer' }} onClick={() => { setShowTerms(!showTerms); }}>
                                                                {translate_value.signup_page.agree}
                                                            </span>
                                                            <span className="required">*</span>
                                                        </p>
                                                    </div>
                                                    {currentCity && <div className='mb-3'>
                                                        <i class="bi bi-geo-alt-fill me-1"></i> <span className=' fw-bolder'>{currentCity}</span> is your current location. <span className=' text-decoration-underline fw-bolder'> Change</span>
                                                    </div>}
                                                    {showTerms && (
                                                        <div className="terms-conditions mt-2" style={{ width: '100%' }}>
                                                            <ul className="list-unstyled list-terms">
                                                                <ul className="terms-container ps-4 mt-2">
                                                                    <h className="fw-bold">Terms and Conditions: </h>
                                                                    <li className="fw-bold">Personal Information: <span className="fw-normal">Provide accurate personal details for your profile.</span></li>
                                                                    <li className="fw-bold">Verification: <span className="fw-normal">Verify your email to complete the sign-up process.</span></li>
                                                                    <li className="fw-bold">Privacy Policy: <span className="fw-normal">Review and accept our privacy policy.</span></li>
                                                                    <li className="fw-bold">Data Protection: <span className="fw-normal">Your data is protected and used in accordance with our privacy policy.</span></li>
                                                                </ul>
                                                            </ul>
                                                        </div>
                                                    )}
                                                    <div className="text-center" style={{ pointerEvents: loading ? 'none' : 'inherit', opacity: loading ? '0.8' : 1 }}>
                                                        <button onClick={(e) => { fetchOTP() }} type='submit' className='btn w-100 Login-btn btn-md py-2 px-5 text-white fw-medium' disabled={(isChecked && university.length) ? false : true} >
                                                            {loading &&
                                                                <img src={spinnerSvg} alt="spinner" style={{ width: '20px', marginRight: '10px' }} />
                                                            }&nbsp;{translate_value.signup_page.get_otp}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className='px-2 position-relative'>
                                                    <span className='orspan'>Or</span>
                                                    <hr />
                                                    <div className='border w-100 mb-4 d-flex align-items-center gap-3 px-3'>
                                                        {/* <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=fill"> <g id="email"> <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M7 2.75C5.38503 2.75 3.92465 3.15363 2.86466 4.1379C1.79462 5.13152 1.25 6.60705 1.25 8.5V15.5C1.25 17.393 1.79462 18.8685 2.86466 19.8621C3.92465 20.8464 5.38503 21.25 7 21.25H17C18.615 21.25 20.0754 20.8464 21.1353 19.8621C22.2054 18.8685 22.75 17.393 22.75 15.5V8.5C22.75 6.60705 22.2054 5.13152 21.1353 4.1379C20.0754 3.15363 18.615 2.75 17 2.75H7ZM19.2285 8.3623C19.5562 8.10904 19.6166 7.63802 19.3633 7.31026C19.1101 6.98249 18.6391 6.9221 18.3113 7.17537L12.7642 11.4616C12.3141 11.8095 11.6858 11.8095 11.2356 11.4616L5.6886 7.17537C5.36083 6.9221 4.88982 6.98249 4.63655 7.31026C4.38328 7.63802 4.44367 8.10904 4.77144 8.3623L10.3185 12.6486C11.3089 13.4138 12.691 13.4138 13.6814 12.6486L19.2285 8.3623Z" fill="#000000"></path> </g> </g> </g></svg> */}
                                                        <p className='signup' onClick={() => { setFormType('login'); resetSignup(); }}>Already have an account? Login</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        :
                        otpvalidationform ?
                            <div className="login-dialog">
                                <div className="rounded px-3 py-4 mx-auto">
                                    <div className="text-center">
                                        <h3 className="mb-3 fw-bold otp-verification-title">{translate_value.signup_page.otp_verification}</h3>
                                        <p className="otp-verification-message">Please enter the 6 digit OTP <br />
                                            that has been sent to your registered Email Id</p>
                                    </div>

                                    <Formik
                                        initialValues={{ otp: otp }}// Initialize OTP values as an array
                                        validationSchema={validationSchema}
                                        onSubmit={(values) => {
                                            sendOtp(values.otp.join('')); // Join the OTP digits and send it
                                        }}
                                    >
                                        {({ setFieldValue, errors, touched }) => (
                                            <Form>
                                                <div className="px-lg-4">
                                                    <div className="row" style={{ pointerEvents: loading ? 'none' : '', opacity: loading ? '0.5' : '1' }}>
                                                        <div className="col-sm-12 d-flex justify-content-evenly pb-1">
                                                            {otp.map((data, index) => (
                                                                <Field key={index} name={`otp[${index}]`} validate={null} // We don't need extra validation here, as Yup handles it
                                                                >
                                                                    {({ field }) => (
                                                                        <input
                                                                            type="text"
                                                                            className={`form-control otp-input`}
                                                                            ref={el => inputRefs.current[index] = el}
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            maxLength={1}
                                                                            onChange={(e) => handleotpChange(e, index, setFieldValue)}
                                                                            onPaste={(e) => handlePaste(e, setFieldValue)}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            ))}
                                                        </div>
                                                        {errors.otp && <p className="text-danger m-0 mt-1 ps-4 text-center otp-font">{'Please Enter Your Requested OTP.'}</p>}
                                                    </div>

                                                    <div className="mt-3 otp-font d-flex flex-column align-items-center" style={{ marginInline: '40px', pointerEvents: loading ? 'none' : '', opacity: loading ? '0.5' : '1' }}>
                                                        <p className="otp-font" style={{ fontSize: '14px' }}>OTP will valid only for <span style={{ color: 'red' }}>{timer} Seconds</span></p>
                                                        <div className="d-flex otp-font" style={{ fontSize: '14px' }}>
                                                            <p className="text mb-0">Did't got a code?&nbsp;</p>
                                                            <button className="btn p-0 verify-otp-btn-new otp-font" onClick={(e) => { e.preventDefault(); fetchOTP() }}>{translate_value.signup_page.resend_otp}</button>
                                                            {loading && <img src={spinnerSvg} alt="spinner" style={{ width: '20px', marginRight: '10px' }} />}
                                                        </div>
                                                    </div>

                                                    <div className="otp-action-button" style={{ pointerEvents: loading ? 'none' : '', opacity: loading ? '0.5' : '1' }}>
                                                        <button className="btn Login-btn text-white w-100 rounded" type="submit" style={{ pointerEvents: otploading ? 'none' : 'inherit', opacity: otploading ? '0.8' : 1 }}>
                                                            {otploading && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" /></path></svg>}
                                                            &nbsp;{translate_value.signup_page.verify_otp}
                                                        </button>
                                                        <button className="btn w-100 rounded" style={{ color: 'red', border: '2px solid rgb(198, 17, 17)' }} onClick={() => { setEmailValidateForm(true); setotpvalidationform(false) }}>Cancel</button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                            :
                            <div className="row mt-lg-2 login-dialog signup-dialog">
                                <div className="col-lg-12">
                                    <div className='row'>
                                        <div className='col-lg-10 p-0 m-auto'>
                                            <div className='h-100 px-3 d-flex flex-column align-items-center position-relative'>
                                                <div className='d-flex align-items-center mt-3 justify-content-center w-100'>
                                                    <img src={logo} alt="logo" />
                                                    <img src={close_icon} className='close-icon' alt="close" onClick={handleClose} />
                                                </div>
                                                <p className='login-title'>Create account to get started!</p>
                                                <div className="w-100">
                                                    <Formik
                                                        initialValues={signUpInitialValues}
                                                        validationSchema={signUpValidationSchema}
                                                        onSubmit={handleCreateAccount}
                                                    >
                                                        {({ values, handleChange, handleBlur }) => (
                                                            <Form className='p-2 px-2'>
                                                                <div className="mb-2">
                                                                    <label className='mb-2'>Email: <span className=' fw-bold'>{values.email}</span> </label>
                                                                </div>

                                                                <div className="mb-2">
                                                                    <label className='mb-2'>Full Name<span className='text-danger'>*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        name="fullname"
                                                                        className="form-control shadow-none bg-light"
                                                                        style={{ height: '50px' }}
                                                                        value={values.fullname}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                    <ErrorMessage name='fullname' component='div' className="validation-error" />
                                                                </div>



                                                                <div className="mb-2">
                                                                    <label className='mb-2'>Password<span className='text-danger'>*</span></label>
                                                                    <div className="input-group bg-light border rounded">
                                                                        <input
                                                                            type={passwordType ? "text" : "password"}
                                                                            name="password"
                                                                            className="form-control shadow-none border-0 bg-transparent"
                                                                            style={{ height: '50px' }}
                                                                            value={values.password}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <span className="input-group-text border-0 bg-transparent text-secondary" style={{ cursor: 'pointer' }}>
                                                                            <img
                                                                                src={passwordType ? eyeNoneSvg : eyeFillSvg}
                                                                                alt="toggle"
                                                                                style={{ width: '20px' }}
                                                                                onClick={() => setPasswordType(!passwordType)}
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <ErrorMessage name='password' component='div' className="validation-error" />
                                                                </div>


                                                                <div className="mb-3 d-flex justify-content-between mt-3">
                                                                    <label className="mb-2">Are you a professor or teacher?</label>
                                                                    <div className="form-check form-switch">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            id="isTeacherSwitch"
                                                                            checked={formData.isTeacher || false}
                                                                            onChange={(e) => handleTeacherSelection(e.target.checked)}
                                                                        />
                                                                        {/* <label className="form-check-label" htmlFor="isTeacherSwitch">
                                                                            {formData.isTeacher ? "Yes" : " No"}
                                                                        </label> */}
                                                                    </div>
                                                                </div>


                                                                <div className="mb-3 d-flex justify-content-between mt-3">
                                                                    <label className="mb-2">Have join code?</label>
                                                                    <div className="form-check form-switch">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            id="isJoinCodeSwitch"
                                                                            checked={formData.isJoinCode || false}
                                                                            onChange={(e) => handleJoinCodeSelection(e.target.checked)}
                                                                        />
                                                                        {/* <label className="form-check-label" htmlFor="isJoinCodeSwitch">
                                                                            {formData.isJoinCode ? "Yes" : " No"}
                                                                        </label> */}
                                                                    </div>
                                                                </div>


                                                                {formData.isJoinCode === true && (
                                                                    <>
                                                                        <div className="mb-2">
                                                                            <label className='mb-2'>First Name<span className='text-danger'>*</span></label>
                                                                            <input
                                                                                placeholder='Enter first name'
                                                                                type="text"
                                                                                name="firstName"
                                                                                className="form-control shadow-none bg-light"
                                                                                style={{ height: '50px' }}
                                                                                value={formData.firstName}
                                                                                onChange={handleJoinForm}
                                                                            />
                                                                        </div>
                                                                        <div className="mb-2">
                                                                            <label className='mb-2'>Last Name<span className='text-danger'>*</span></label>
                                                                            <input
                                                                                placeholder='Enter last name'
                                                                                type="text"
                                                                                name="lastName"
                                                                                className="form-control shadow-none bg-light"
                                                                                style={{ height: '50px' }}
                                                                                value={formData.lastName}
                                                                                onChange={handleJoinForm}
                                                                            />
                                                                        </div>
                                                                        <div className="mb-2">
                                                                            <label className='mb-2'>Date of Birth<span className='text-danger'>*</span></label>
                                                                            <input
                                                                                placeholder='Enter Date of Birth'
                                                                                type="date"
                                                                                name="dob"
                                                                                className="form-control shadow-none bg-light"
                                                                                style={{ height: '50px' }}
                                                                                value={formData.dob}
                                                                                onChange={handleJoinForm}
                                                                            />
                                                                        </div>
                                                                        <div className="mb-2">
                                                                            <label className='mb-2'>Join Code<span className='text-danger'>*</span></label>
                                                                            <input
                                                                                placeholder='Enter join code'
                                                                                type="text"
                                                                                name="joinCode"
                                                                                className="form-control shadow-none bg-light"
                                                                                style={{ height: '50px' }}
                                                                                value={formData.joinCode}
                                                                                onChange={handleJoinForm}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                )}


                                                                <div className="text-center" style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.8 : 1 }}>
                                                                    <button disabled={(formData.isTeacher == null ? true : false) || (formData.isJoinCode && formData.joinCode == null ? true : false)} type="submit" className="btn w-100 Login-btn btn-md py-2 px-5 text-white fw-medium">
                                                                        {loading && <img src={spinnerSvg} alt="spinner" style={{ width: '20px', marginRight: '10px' }} />}
                                                                        Create Account
                                                                    </button>
                                                                </div>
                                                            </Form>
                                                        )}
                                                    </Formik>

                                                    <div className='px-2 position-relative'>
                                                        <span className='orspan'>Or</span>
                                                        <hr />
                                                        <div className='border w-100 mb-4 d-flex align-items-center gap-3 px-3'>
                                                            {/* <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=fill"> <g id="email"> <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M7 2.75C5.38503 2.75 3.92465 3.15363 2.86466 4.1379C1.79462 5.13152 1.25 6.60705 1.25 8.5V15.5C1.25 17.393 1.79462 18.8685 2.86466 19.8621C3.92465 20.8464 5.38503 21.25 7 21.25H17C18.615 21.25 20.0754 20.8464 21.1353 19.8621C22.2054 18.8685 22.75 17.393 22.75 15.5V8.5C22.75 6.60705 22.2054 5.13152 21.1353 4.1379C20.0754 3.15363 18.615 2.75 17 2.75H7ZM19.2285 8.3623C19.5562 8.10904 19.6166 7.63802 19.3633 7.31026C19.1101 6.98249 18.6391 6.9221 18.3113 7.17537L12.7642 11.4616C12.3141 11.8095 11.6858 11.8095 11.2356 11.4616L5.6886 7.17537C5.36083 6.9221 4.88982 6.98249 4.63655 7.31026C4.38328 7.63802 4.44367 8.10904 4.77144 8.3623L10.3185 12.6486C11.3089 13.4138 12.691 13.4138 13.6814 12.6486L19.2285 8.3623Z" fill="#000000"></path> </g> </g> </g></svg> */}
                                                            <p className='signup' onClick={() => { resetSignup(); setFormType('login'); }}>Already have an account? Login</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </div >
                }
            </Modal>

            <Modal isOpen={isForget} size={"md"} backdrop="static" centered>
                <ModalHeader className='text-center' toggle={() => setForget(false)} ></ModalHeader>
                <ModalBody>
                    <div className='py-2'><h6 className=" fw-bold text-center fs-3 text-dark mb-0" id="staticBackdropLabel">Forgot Password</h6></div>
                    <Formik initialValues={initialForgotValues} validationSchema={validationForgotSchema} onSubmit={forgotpassword}>
                        {({ values, handleChange, handleBlur, setFieldValue }) => (
                            <Form action="" className='p-2 px-4' >
                                <p className='text-center'>Please enter your registered email ID</p>
                                <div className="form-floating mb-4">
                                    <input type="text" id="floatingInput3" name="email" value={values.email} placeholder="name@example.com" style={{ height: '50px' }}
                                        className="form-control shadow-none" onChange={handleChange} onBlur={handleBlur} />
                                    <label htmlFor="floatingInput3" className='fw-normal'>Email</label>
                                    <ErrorMessage className="validation-error" name='email' component='div' />
                                </div>
                                <div className="text-center" style={{ pointerEvents: forgotPassLoading ? 'none' : 'inherit', opacity: forgotPassLoading ? '0.8' : 1 }}>
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

            <Modal isOpen={isForgetSuccess} centered size="md" backdrop="static">
                <ModalBody className="text-center py-5">
                    <img
                        src={require('../../../img/check__2_-removebg-preview.png')}
                        width={70}
                        alt="Success Icon"
                        className="mb-3"
                    />
                    <h5 className="text-success fw-semibold mb-2">
                        Password Reset Link Sent!
                    </h5>
                    <p className="text-secondary mb-1">
                        We've sent a link to your registered email address.
                    </p>
                    <p className="text-secondary">
                        Please check your inbox to continue.
                    </p>
                </ModalBody>

                <div className="d-flex justify-content-center pb-4">
                    <button className="btn btn-success px-4" onClick={() => setForgetSuccess(false)}>Okay</button>
                </div>
            </Modal>
        </>
    );
};
export default LoginpageDialog;