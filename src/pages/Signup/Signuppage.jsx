import React from "react";
import "animate.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import apiClient from '../../pages/Middlewares/axiosConfig';
import axios from "axios";
import Adddetails from "../Adddetails";
import { ipaddress } from "../../App";
import { Context } from "../../context/Context_provider";
import First_navabr from "../../components/First_navabr";
import { toast } from "react-toastify";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useRef } from "react";
import * as bootstrap from 'bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import './Signuppage.css';

import goIcon from '../../img/go-icon.svg'

const Signuppage = () => {
  const navigate = useNavigate();
  const { translate_value } = useContext(Context);
  const inputRefs = useRef([]);
  const [loading, setloading] = useState();
  const renderTooltip = (value) => (<Tooltip id="button-tooltip">{value}</Tooltip>);

  const [university, setUniversity] = useState("");
  const [domains, setdomains] = useState([]);
  const [isChecked, setisChecked] = useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
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

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30)
  const [otpValid, setOTPValid] = useState(true);
  const [message, setmessage] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpvalidationform, setotpvalidationform] = useState(false);
  const [backendotp, setBackendotp] = useState({});

  const fetchOTP = async () => {
    if (!university) { // Check for empty fields
      toast.error('Email is required', { autoClose: 3000, theme: 'colored' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validate email format
    if (!emailRegex.test(university)) {
      toast.error('Invalid email format', { autoClose: 3000, theme: 'colored' });
      return;
    }
    setloading(true); // Start loading
    setOtp(new Array(6).fill("")); // Reset OTP array
    setTimer(120); // Set timer to 120 seconds
    setOTPValid(true); // Reset OTP validity
    const universityMail = new FormData();
    universityMail.append('email', university);
    try {
      const response = await apiClient.post(`${ipaddress}/userverification/`, universityMail);
      if (response.data === 'This email is already registered with other account') {
        toast.warn('This Email is already registered', { autoClose: 3000 });
      } else {
        setmessage(response.data.message);
        setOtpToken(response.data);
        setotpvalidationform(true);
        setBackendotp(response.data);
        toast.success('OTP sent successfully!', { autoClose: 3000, theme: 'colored' });
      }
    } catch (error) {
      if (error.response) { // Errors from the server
        toast.error(`Server error: ${error.response.data.message || 'Unexpected error'}`, { autoClose: 3000, theme: 'colored' });
      } else if (error.request) { // No response received
        toast.error('Network error: No response from server', { autoClose: 3000, theme: 'colored' });
      } else {  // Other errors
        console.log("Error in request setup", error.message);
        toast.error(`Unexpected error: ${error.message}`, { autoClose: 3000, theme: 'colored' });
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


  const [validatedform, setvalidatedform] = useState(false);
  const [otploading, setOtpLoading] = useState(false);
  const [value, setvalue] = useState(false)

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
        setvalidatedform(true);
        setOtpToken("");
        setotpvalidationform(false);
        setOtp(new Array(6).fill(""));
        toast.success('OTP validated successfully', { autoClose: 3000 });
        setOtpLoading(false);
      } else {
        toast.error(response?.data?.message || 'Unexpected error', { autoClose: 3000 });
        setOtpLoading(false);
      }
    } catch (error) {
      setOtpLoading(false);
      if (error.response) { // Errors from the server
        toast.error(`Server error: ${error.response.data.message || 'Unexpected error'}`, { autoClose: 3000, theme: 'colored' });
      } else if (error.request) { // No response received
        toast.error('Network error: No response from server', { autoClose: 3000, theme: 'colored' });
      } else {  // Other errors
        console.log("Error in request setup", error.message);
        toast.error(`Unexpected error: ${error.message}`, { autoClose: 3000, theme: 'colored' });
      }
    } finally {
      setOtpLoading(false);
      setloading(false); // Stop loading
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }} className="bg-light pb-4">
      <div id="signup" className="signup">
        <div className="container">
          <First_navabr />
          <div className="row mt-lg-2 signup-div">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-10 p-0 forms-div m-auto">
                  <div className="bg-white shadow rounded pb-2 px-4 h-100 position-relative signupform1">
                    <h3 className="page6-month mb-0 text-center" style={{ fontSize: '35px', color: '#5D5FE3' }}>{translate_value.signup_page.signup}</h3>
                    <div className="pt-4">
                      <div className="">
                        <label htmlFor="formGroupExampleInput" className="form-label signup-labels d-flex align-items-center" style={{ fontSize: '16px', color: '#6c757d' }}>
                          <span className="me-2">{translate_value.signup_page.university} {translate_value.login_page.email}</span>
                          <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={renderTooltip("Only University Emails are allowed")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF845D" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                            </svg>
                          </OverlayTrigger>
                        </label>
                        <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 250 }} overlay={renderTooltip("Only University Emails are allowed")}>
                          <input type="text" className="form-control bg-light py-2" style={{ height: '50px' }} placeholder="Enter your University Email Id" value={university} aria-label="Username" name="university_mailid" onChange={(e) => {
                            setUniversity(e.target.value)
                            search_domain(e.target.value)
                          }} aria-describedby="basic-addon1" />
                        </OverlayTrigger>
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
                      <div className="d-flex mt-3">
                        <input type="checkbox" onClick={() => { setisChecked(!isChecked) }} checked={isChecked} />
                        <p className="m-0 ms-2 text-secondary terms">By signing up you &nbsp;
                          <span className="text-decoration-underline fw-medium text-dark" style={{ cursor: 'pointer' }} onClick={() => { setShowTerms(!showTerms); }}>
                            {translate_value.signup_page.agree}
                          </span>
                          <span className="required">*</span>
                        </p>
                      </div>
                      {showTerms && (
                        <div className="terms-conditions mt-2" style={{ width: '100%' }}>
                          <ul className="list-unstyled list-terms">
                            <ul className="terms-container ps-4 text-muted mt-2">
                              <h className="fw-bold">Terms and Conditions: </h>
                              <li className="fw-bold">Personal Information: <span className="fw-normal">Provide accurate personal details for your profile.</span></li>
                              <li className="fw-bold">Verification: <span className="fw-normal">Verify your email to complete the sign-up process.</span></li>
                              <li className="fw-bold">Privacy Policy: <span className="fw-normal">Review and accept our privacy policy.</span></li>
                              <li className="fw-bold">Data Protection: <span className="fw-normal">Your data is protected and used in accordance with our privacy policy.</span></li>
                            </ul>
                          </ul>
                        </div>
                      )}
                      <div className="text-center mt-4" style={{ pointerEvents: loading ? 'none' : 'inherit', opacity: loading ? '0.8' : 1 }}>
                        <button onClick={(e) => { fetchOTP() }} className="btn w-100 btn-md py-2 px-2 px-md-5 fw-bold btn-otp" disabled={(isChecked) ? false : true}>
                          {loading && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" /></path></svg>}
                          &nbsp;{translate_value.signup_page.get_otp}
                        </button>
                      </div>
                    </div>

                    <div className="bottom_div">
                      <p className="text-center mb-0 d-lg-none" style={{ fontSize: '14px' }}>Already have an Account? <span><Link to={'/loginpage'} style={{ textDecoration: 'none' }} className="fw-bold">Login here</Link></span></p>
                      <p className='assistance mb-0' onClick={() => navigate('/contact_us')}>Need Assistance?</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className='row m-0 mt-5 mt-lg-0' style={{ position: 'relative' }}>
                <div className='main-login ' style={{ position: 'relative', padding: '20px' }}>
                  <p style={{ letterSpacing: '3px' }}>The Student Community </p>
                  <h1 className='fw-bold login-header' style={{ color: '#2A3941' }}>Improve</h1>
                  <h1 className='fw-bold login-header' style={{ color: '#2A3941' }}>comprehension</h1>
                  <h1 className='fw-bold login-header' style={{ color: '#FF845D' }}>together</h1>
                  <svg className='login-img3 d-none d-lg-block' style={{ position: 'absolute', animation: 'spin 6s linear infinite' }} xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
                    <path d="M28.43 77.66L0 49.23L0.0700073 48.96L10.4 10.4L10.67 10.33L49.23 0L77.66 28.43L77.59 28.7L67.26 67.26L66.99 67.33L28.43 77.66ZM1.08002 48.95L28.72 76.59L66.48 66.47L76.6 28.71L48.96 1.06998L11.2 11.19L1.08002 48.95Z" fill="#5D5FE3" />
                  </svg>
                  <img className='login-img1 align-items-center d-none d-lg-block' style={{ position: 'absolute', animation: 'moveAnimation 6s linear infinite', width: '115px', height: '127px' }} src={require('../../img//images_icons/Group-removebg-preview.png')} alt="sign-up" />
                  <img className='login-img2 align-items-center d-none  d-lg-block' style={{ position: 'absolute', height: '135px', width: '31px' }} src={require('../../img/images_icons/login-image.png')} alt="sign-up" />
                  <p className='mt-3 align-items-center already-have-account' style={{ color: '#2A3941', fontSize: '32px' }}>{translate_value.signup_page.already_have_account}</p>
                  <Link to='/loginpage' className='btn p-3 px-5 fw-bold sigin-btn' style={{ color: '#5D5FE3', border: '2px solid #5D5FE3' }}> {translate_value.signup_page.please_login_here}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------Enter and verify OTP Form--------------------------------------------- */}
        <div className={`${otpvalidationform ? 'd-flex align-items-center' : 'd-none'}`} style={{ backgroundColor: 'rgb(0, 0, 0,0.6)', width: '100%', top: 0, left: 0, position: 'absolute', zIndex: 6, height: '100%' }}>
          <div className="otp-form mx-auto">
            <div className="bg-white rounded shadow p-3 mx-auto">
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
                      <div className="row">
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

                      <div className="mt-3 otp-font d-flex flex-column align-items-center" style={{ marginInline: '40px' }}>
                        <p className="otp-font" style={{ fontSize: '14px' }}>OTP will valid only for <span style={{ color: 'red' }}>{timer} Seconds</span></p>
                        <div className="d-flex otp-font" style={{ fontSize: '14px' }}>
                          <p className="text">Did't got a code?&nbsp;</p>
                          <button className="btn p-0 verify-otp-btn-new otp-font" disabled={otpValid} onClick={(e) => { e.preventDefault(); fetchOTP() }}>{translate_value.signup_page.resend_otp}</button>
                        </div>
                      </div>

                      <div className="otp-action-button" style={{ marginInline: '40px' }}>
                        <button className="btn verify-otp-btn w-100 rounded" type="submit" style={{ pointerEvents: otploading ? 'none' : 'inherit', opacity: otploading ? '0.8' : 1 }}>
                          {otploading && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" /></path></svg>}
                          &nbsp;{translate_value.signup_page.verify_otp}
                        </button>
                        <button className="btn w-100 rounded" style={{ color: 'red', border: '2px solid rgb(198, 17, 17)' }} onClick={() => { setotpvalidationform(false) }}>Cancel</button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        {/* ---------------------------------------------OTP Successfull Message layout----------------------------------------------- */}
        <div className={`${validatedform ? 'd-flex align-items-center' : 'd-none'}`} style={{ backgroundColor: 'rgb(0, 0, 0,0.6)', width: '100%', top: 0, left: 0, position: 'absolute', zIndex: 6, height: '100%' }}>
          <div className="otp-form mx-auto">
            <div className="bg-white rounded shadow">
              <div className='d-flex flex-column align-items-center justify-content-center gap-5  ' style={{ height: '400px' }}>
                <img src={require('../../img/images_icons/tick.png')} className=" animate__animated animate__bounceIn" width={70} alt="sign-up" />
                <p className='m-0 animate__animated animate__bounceIn' style={{ color: '#34a853', fontSize: '18px', lineHeight: 'normal', fontWeight: 600, letterSpacing: '0.64px' }}>OTP verified successfully!!!</p>
                {/* <p className='m-0 fs-3 animate__animated animate__bounceIn' style={{ color: '#34a853', fontSize: '32px', lineHeight: 'normal', fontWeight: 450, letterSpacing: '0.64px' }}>Successfull</p> */}
                <div className="">
                  <button onClick={() => {
                    document.getElementById('signup').style.display = 'none';
                    setvalue(true);
                    setvalidatedform(false);
                  }} className={`btn btn-success`}>Continue &nbsp;&nbsp;<img src={goIcon} width={15}/></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOAST MESSAGE */}
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-body d-flex justify-content-between">
              <span id='toastbody'></span>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>

        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div id="liveToast2" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-body d-flex justify-content-between align-items-center">
              <span id='toastbody2'></span>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </div>

      <Adddetails value={value} email={university} />

    </div >
  );
};

export default Signuppage;