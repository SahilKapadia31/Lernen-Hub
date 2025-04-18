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

// Yup validation schema for OTP
const validationSchema = Yup.object({
  otp: Yup.array().of(Yup.string()
    .length(1, 'Each OTP input should be 1 digit long')
    .matches(/^[0-9]$/, 'Only digits are allowed') // Regex to allow only digits
    .required('OTP digit is required')
  ).length(6, 'OTP must have exactly 6 digits') // Ensure OTP is 6 digits
});

const createPasswordInitialValues = { password: '', confirm_password: '' };
const createPasswordValidationSchema = Yup.object().shape({
  password: Yup.string().min(6).required("password is a required."),
  confirm_password: Yup.string().required("Confirm password is required.").oneOf([Yup.ref("password"), null], "Passwords must match."),
});

const Signuppage = () => {
  const navigate = useNavigate();
  const { translate_value } = useContext(Context);
  const [loading, setloading] = useState();
  const [otpvalidationform, setotpvalidationform] = useState(false);
  const [isChecked, setisChecked] = useState(false);
  const [validatedform, setvalidatedform] = useState(false);
  const [passwordtype, setPasswordtype] = useState(true);
  const [passwordtype2, setPasswordtype2] = useState(true);
  const [signupform, setsignupform] = useState(1);
  const [formData, setFormData] = useState({
    phone_number: "",
    phone_number_extension: "",
    email: "",
    password: "",
    nickname: "",
    title: "",
    first_name: "",
    last_name: ""
  });
  const [otploading, setOtpLoading] = useState(false);

  // const handleChange = (e) => {
  //   setFormData(prevData => {
  //     const updatedData = { ...prevData, [e.target.name]: e.target.value };
  //     if (updatedData.phone_number_extension.length != 10) {
  //       document.getElementById('alternate_phone').style.color = "red"
  //       document.getElementById('alternate_phone').textContent = "*Phone Number Must be 10 Characters Only";
  //     } else {
  //       document.getElementById('alternate_phone').textContent = "";
  //     }
  //     if (updatedData.phone_number.length != 10) {
  //       document.getElementById('phone').style.color = "red"
  //       document.getElementById('phone').textContent = "*Phone Number Must be 10 Characters Only";
  //     } else {
  //       document.getElementById('phone').textContent = "";
  //     }
  //     if (updatedData.nickname.length > 6) {
  //       document.getElementById('nick').textContent = "*Nickname should not be more than 6 characters";
  //     } else {
  //       document.getElementById('nick').textContent = "";
  //     }
  //     if (updatedData.password.length > 8) {
  //       document.getElementById('pass').style.color = "green"
  //       document.getElementById('pass').innerHTML = '<i className="fa-solid fa-circle-check"></i> Good'
  //     } else {
  //       document.getElementById('pass').style.color = "red"
  //       document.getElementById('pass').innerHTML = '<i className="fa-solid fa-circle-xmark"></i> Provide Strong Password'
  //     }
  //     // console.log(updatedData.password.length + 1);
  //     return updatedData; // Return the updated state
  //   });
  // };
  const [backendotp, setBackendotp] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    let emaildata = { "email": formData.email }
    try {
      const response = await apiClient.post(`${ipaddress}/userverification/`, emaildata); // console.log("OTP",response.data)
      if (response.data === 'This email is already registered with other account') {
        const toastLiveExample = document.getElementById('liveToast2')
        document.getElementById('toastbody2').style.color = "red"
        document.getElementById('toastbody2').textContent = "This email is already registered !!!"
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
      } else { setBackendotp(response.data) }
    } catch (error) { console.error("Error generating OTP") }
  };

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [showOptions, setShowOptions] = useState(true);
  const [showcity, setShowcity] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredcities, setFilteredcities] = useState([]);
  const [domains, setdomains] = useState([]);

  useEffect(() => { // console.log("otp fetched : ",backendotp)
    apiClient.get(`${ipaddress}/DisplayCityAndCountry/`)
      .then((r) => { // console.log("Countries and Cities",r.data)
        setCountries(r.data.countries)
        setCities(r.data.cities)
      }).catch((err) => { console.log("Error", err); });
  }, [backendotp]);

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
  //  -----------------------------------------SEARCH COUNTRY------------------------------------------------------
  const searchCountries = (value) => {
    setShowOptions(true);
    setcountry(value);
    const filteredData = countries.filter(c => c.toLowerCase().includes(value.toLowerCase()));
    setFilteredCountries(filteredData);
  }
  // ----------------------------------------------NEW VALIDATIONS------------------------------------------------------
  const [university, setUniversity] = useState("");
  // const universityData=(e)=>{ setUniversity(e.target.value)}
  // -----------------------------------------------OTP TIMER FUNCTIONALITY---------------------------------------------------
  const [otpToken, setOtpToken] = useState("");
  const [timer, setTimer] = useState(30)
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpValid, setOTPValid] = useState(true);
  const inputRefs = useRef([]);

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

  useEffect(() => {
    let interval;
    if (otpValid && timer > 0) {
      interval = setInterval(() => { setTimer(prevTimer => prevTimer - 1) }, 1000);
    } else if (timer === 0) {
      setOTPValid(false);
      setBackendotp({});
      setOtp(new Array(6).fill(""));
    }
    return () => clearInterval(interval); // To Clear interval when timer expires
  }, [timer]);

  const [otpStatus, setOTPStatus] = useState(false);
  const [otpError, setOTPError] = useState("");
  const sendOtp = async (enteredOtp) => {
    // console.log(enteredOtp);
    // setvalidatedform(true);
    // setotpvalidationform(false);
    // setOTPStatus(false);
    // return;
    setOtpLoading(true);
    if (!enteredOtp) { // Check for empty fields
      setOTPStatus(true);
      setOTPError("Please Enter Your Requested OTP.")
      setOtp(new Array(6).fill(""));
      return;
    }
    const emailOtp = new FormData();
    emailOtp.append('token', otpToken?.token);
    emailOtp.append('otp', enteredOtp);
    try {
      const response = await apiClient.post(`${ipaddress}/userverification/validate/`, emailOtp);
      if (response?.data?.message === 'OTP validated successfully') {
        setvalidatedform(true);
        setOTPStatus(false);
        setOTPError("");
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
  const [message, setmessage] = useState("");
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

  const [password, setPassword] = useState("");
  const [retypepassword, setretypePassword] = useState("");
  // --------------------------------------------SEND EMAIL AND PASSWORD----------------------------------------------
  const [city, setCity] = useState("");
  const [country, setcountry] = useState("");
  const [country_id, setcountry_id] = useState();
  const [UserUniversity, setUserUniversity] = useState("");
  const [UserUniversityid, setUserUniversityid] = useState("");
  const [universitystatus, setuniversitystatus] = useState();
  const [fetched_university_details, setfetched_university_details] = useState([])
  const fetch_country = (value) => {
    if (value.length > 0) {
      apiClient.get(`${ipaddress}/CountryListView/${value}/`)
        .then((r) => {
          setFilteredCountries(r.data); // console.log("Countries",r.data)
        }).catch((err) => { console.log("Error", err); });
    }
  }
  // -----------------------------------------SEARCH CITY-----------------------------------------------------------
  const searchCities = (value) => {
    if (value.length > 0) {
      apiClient.get(`${ipaddress}/CityListView/${country_id}/${value}/`)
        .then((r) => {
          setCities(r.data); // console.log("Filtered cities",r.data)
        }).catch((err) => { console.log("Error", err); });
    }
  }
  const [load1, setload1] = useState();
  const senddata = (value) => {
    setload1(true);
    const formdata = new FormData();
    formdata.append('email', university);
    formdata.append('password', value.password);
    const universitydata = new FormData();
    universitydata.append('email', university);
    apiClient.post(`${ipaddress}/UserRegistrationAPIView/`, formdata)
      .then((r) => {
        setsignupform(3);
      }).catch((err) => {
        console.log("Error", err);
        setload1(false);
      })
    apiClient.post(`${ipaddress}/UserUniversityAddition/`, universitydata)
      .then((r) => {
        // console.log("Email successfullllll",r.data)
        if (r.data === "university is not present") {
          setuniversitystatus(true);
          setCity("");
          setcountry("");
          setUserUniversity("");
          setUserUniversityid(0);
          setload1(false);
        } else {
          setuniversitystatus(false);
          setfetched_university_details(r.data);
          setcountry(r.data[0].country);
          setCity(r.data[0].city);
          // setcountry("Germany")
          setUserUniversity(r.data[0].university_name);
          setUserUniversityid(r.data[0].university_id);
          setload1(false);
        }
      }).catch(() => { setload1(false) })
  }
  // ---------------------------------- Fetch the university based on the selected city-------------------------------------
  const fetchMatcheduniversity = (city_name) => {
    fetched_university_details.map((x) => {
      if (x.city === city_name) {
        setUserUniversity(x.university_name);
        setUserUniversityid(x.university_id);
      } else {
        console.log("Fetch the university on the selected city!");
      }
    })
  }
  // ---------------------------------------------SEND UNIVERSITY DATA AND ID----------------------------------------------
  const [value, setvalue] = useState(false)
  const senduniversitydata = (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append('email', university)
    formdata.append('university_id', UserUniversityid)
    apiClient.put(`${ipaddress}/UserUniversityAddition/`, formdata)
      .then((r) => {
        document.getElementById('signup').style.display = 'none'; // console.log("University ID sent successfully",r.data)
        setvalue(true)
      }).catch((err) => { console.log("Error", err) })
  }
  // ------------------------------------------------ADD UNIVERSITY------------------------------------------------------
  const [universityname, setuniversityname] = useState("");
  const [state, setstate] = useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const adduniversity = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('email', university);
    formdata.append('university_name', universityname);
    formdata.append('country', country);
    formdata.append('city', city);
    apiClient.put(`${ipaddress}/UserUniversityAddition/`, formdata)
      .then((r) => { setstate(true) }).catch((err) => { console.log("Error", err) })
  }
  const renderTooltip = (value) => (<Tooltip id="button-tooltip">{value}</Tooltip>);
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }} className="bg-light pb-4">
      <div id="signup" className="signup">
        <div className="container">
          <First_navabr />
          <div className="row mt-lg-2 signup-div">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-10 p-0 forms-div m-auto">
                  {/* --------------------------------------FORM 1-------------------------------------------- */}
                  {signupform == 1 &&
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
                            <input type="text" className="form-control bg-light py-2" style={{height:'50px'}}  placeholder="Enter your University Email Id" value={university} aria-label="Username" name="university_mailid" onChange={(e) => {
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
                  }
                  {/* --------------------------------------FORM 2-------------------------------------------- */}
                  {signupform == 2 &&
                    <div className="bg-white shadow rounded pb-2 px-4 h-100 position-relative signupform2">
                      <h3 className="page6-month text-center mb-0" style={{ fontSize: '35px', color: '#5D5FE3' }}>{translate_value.signup_page.signup}</h3>
                      <Formik
                        initialValues={createPasswordInitialValues}
                        validationSchema={createPasswordValidationSchema}
                        onSubmit={senddata}>
                        {({ values, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
                          <Form className='p-2 px-2'>
                            <div className="row">
                              <div className="col-12">
                                <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.password1}</label>
                                <div className="input-group bg-light rounded border py-2">
                                  <input
                                    type={passwordtype ? 'password' : 'text'}
                                    name="password"
                                    className="form-control border-0 bg-transparent country-input"
                                    onChange={(e) => { setPassword(e.target.value); handleChange(e) }}
                                    placeholder="must be atleast 6 characters"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1" />
                                  {
                                    !passwordtype ?
                                      <span onClick={() => { setPasswordtype(!passwordtype) }} style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                        <svg fill="#98a2b3" width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 3.71875 2.28125 L 2.28125 3.71875 L 8.5 9.90625 L 19.59375 21 L 21.5 22.9375 L 28.28125 29.71875 L 29.71875 28.28125 L 23.5 22.0625 C 27.734375 19.964844 30.574219 16.851563 30.75 16.65625 L 31.34375 16 L 30.75 15.34375 C 30.480469 15.042969 24.085938 8 16 8 C 14.042969 8 12.195313 8.429688 10.5 9.0625 Z M 16 10 C 18.152344 10 20.1875 10.605469 22 11.4375 C 22.644531 12.515625 23 13.734375 23 15 C 23 16.816406 22.296875 18.476563 21.15625 19.71875 L 18.3125 16.875 C 18.730469 16.363281 19 15.714844 19 15 C 19 13.34375 17.65625 12 16 12 C 15.285156 12 14.636719 12.269531 14.125 12.6875 L 12.09375 10.65625 C 13.335938 10.273438 14.636719 10 16 10 Z M 6.6875 10.90625 C 3.480469 12.878906 1.398438 15.175781 1.25 15.34375 L 0.65625 16 L 1.25 16.65625 C 1.507813 16.945313 7.429688 23.425781 15.0625 23.9375 C 15.371094 23.96875 15.683594 24 16 24 C 16.316406 24 16.628906 23.96875 16.9375 23.9375 C 17.761719 23.882813 18.566406 23.773438 19.34375 23.59375 L 17.5625 21.8125 C 17.054688 21.929688 16.539063 22 16 22 C 12.140625 22 9 18.859375 9 15 C 9 14.46875 9.070313 13.949219 9.1875 13.4375 Z M 7.25 12.9375 C 7.089844 13.613281 7 14.300781 7 15 C 7 16.738281 7.488281 18.339844 8.34375 19.71875 C 6.054688 18.40625 4.304688 16.867188 3.40625 16 C 4.152344 15.277344 5.496094 14.078125 7.25 12.9375 Z M 24.75 12.9375 C 26.503906 14.078125 27.84375 15.277344 28.59375 16 C 27.695313 16.867188 25.917969 18.4375 23.625 19.75 C 24.484375 18.371094 25 16.738281 25 15 C 25 14.300781 24.910156 13.609375 24.75 12.9375 Z" /></svg>
                                      </span> :
                                      <span onClick={() => { setPasswordtype(!passwordtype) }} style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                        </svg>
                                      </span>
                                  }
                                </div>
                                <ErrorMessage className="validation-error" name='password' component='div' />
                              </div>
                              <div className="col-12 mt-3">
                                <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.password2}</label>
                                <div className="input-group bg-light rounded border py-2">
                                  <input
                                    type={passwordtype2 ? 'password' : 'text'}
                                    name="confirm_password"
                                    className="form-control border-0 bg-transparent country-input"
                                    onChange={(e) => { setretypePassword(e.target.value); handleChange(e) }}
                                    aria-label="Username"
                                    placeholder={translate_value.signup_page.password_placeholder2}
                                    aria-describedby="basic-addon1" />
                                  {
                                    !passwordtype2 ?
                                      <span onClick={() => { setPasswordtype2(!passwordtype2) }} style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                        <svg fill="#98a2b3" width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 3.71875 2.28125 L 2.28125 3.71875 L 8.5 9.90625 L 19.59375 21 L 21.5 22.9375 L 28.28125 29.71875 L 29.71875 28.28125 L 23.5 22.0625 C 27.734375 19.964844 30.574219 16.851563 30.75 16.65625 L 31.34375 16 L 30.75 15.34375 C 30.480469 15.042969 24.085938 8 16 8 C 14.042969 8 12.195313 8.429688 10.5 9.0625 Z M 16 10 C 18.152344 10 20.1875 10.605469 22 11.4375 C 22.644531 12.515625 23 13.734375 23 15 C 23 16.816406 22.296875 18.476563 21.15625 19.71875 L 18.3125 16.875 C 18.730469 16.363281 19 15.714844 19 15 C 19 13.34375 17.65625 12 16 12 C 15.285156 12 14.636719 12.269531 14.125 12.6875 L 12.09375 10.65625 C 13.335938 10.273438 14.636719 10 16 10 Z M 6.6875 10.90625 C 3.480469 12.878906 1.398438 15.175781 1.25 15.34375 L 0.65625 16 L 1.25 16.65625 C 1.507813 16.945313 7.429688 23.425781 15.0625 23.9375 C 15.371094 23.96875 15.683594 24 16 24 C 16.316406 24 16.628906 23.96875 16.9375 23.9375 C 17.761719 23.882813 18.566406 23.773438 19.34375 23.59375 L 17.5625 21.8125 C 17.054688 21.929688 16.539063 22 16 22 C 12.140625 22 9 18.859375 9 15 C 9 14.46875 9.070313 13.949219 9.1875 13.4375 Z M 7.25 12.9375 C 7.089844 13.613281 7 14.300781 7 15 C 7 16.738281 7.488281 18.339844 8.34375 19.71875 C 6.054688 18.40625 4.304688 16.867188 3.40625 16 C 4.152344 15.277344 5.496094 14.078125 7.25 12.9375 Z M 24.75 12.9375 C 26.503906 14.078125 27.84375 15.277344 28.59375 16 C 27.695313 16.867188 25.917969 18.4375 23.625 19.75 C 24.484375 18.371094 25 16.738281 25 15 C 25 14.300781 24.910156 13.609375 24.75 12.9375 Z" /></svg>
                                      </span> :
                                      <span onClick={() => { setPasswordtype2(!passwordtype2) }} style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                        </svg>
                                      </span>
                                  }
                                </div>
                                <ErrorMessage className="validation-error" name='confirm_password' component='div' />
                              </div>
                            </div>
                            <div className="text-center mt-3">
                              <button className="btn w-100 signup-btn btn-md py-2 px-2 px-md-5 text-white fw-medium" type="submit">
                                <span className={`spinner-border spinner-border-sm ${load1 ? '' : 'd-none'}`} aria-hidden="true"></span>
                                <span className={`${load1 ? 'ms-2' : 'd-none'}`} role="status">Loading...</span>
                                <span className={`${load1 ? 'd-none' : ''}`}>{translate_value.signup_page.next}</span>
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                      <div className="mt-2">
                        <p className="text-center">Already have an Account? <span><Link to={'/loginpage'} style={{ textDecoration: 'none' }}>login here</Link></span></p>
                      </div>
                    </div>
                  }
                  {/* ----------------------------------------FORM 3---------------------------------------------- */}
                  {signupform == 3 &&
                    <div className="bg-white shadow rounded pb-2 px-4 h-100 position-relative signupform3" onClick={() => { setShowOptions(false); setShowcity(false) }}>
                     <h3 className="page6-month text-center mb-0" style={{ fontSize: '35px', color: '#5D5FE3' }}>{translate_value.signup_page.signup}</h3>
                      {/* <h3 className="page6-month mb-0 text-center" style={{ fontSize: '35px', color: '#5D5FE3' }}>{translate_value.signup_page.signup}</h3> */}
                      <p className="fw-bold text-center mb-0" style={{ color: '#5d5fe3' }}>Kindly Add your University</p>
                      <form action="" className="p-2">
                        <div className="row">
                          <div className="col-12">
                            <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.country}</label>
                            <div className="input-group bg-light border py-2">
                              <input type="text" value={country} disabled={message === "University is not present" ? false : true} onChange={(e) => {
                                setcountry(e.target.value)
                                fetch_country(e.target.value)
                              }} className="form-control border-0 bg-transparent country-input" placeholder="Select the City" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            {/* --------------------------------SEARCH BAR FOR COUNTRY----------------------------------- */}
                            <div className={`px-3 py-2 bg-light border border-top-0 ${country.length > 0 && filteredCountries.length > 0 ? '' : 'd-none'}`} style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                              {filteredCountries.map((x) => {
                                return (
                                  <>
                                    <p onClick={() => { setcountry(x.name); setFilteredCountries([]); setcountry_id(x.id); }} className="m-0" style={{ cursor: 'pointer' }}>{x.name}</p>
                                  </>
                                )
                              })}
                            </div>
                          </div>
                          <div className="col-12 mt-3">
                            <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.city}</label>
                            <div className="input-group bg-light border py-2">
                              <input type="text" value={city} onChange={(e) => {
                                setCity(e.target.value)
                                searchCities(e.target.value)
                              }} className="form-control border-0 bg-transparent country-input" disabled={message === "University is not present" ? false : true} placeholder={translate_value.signup_page.city_placeholder} aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            {/* --------------------------------SEARCH BAR FOR CITY----------------------------------- */}
                            <div className={`px-3 py-2 bg-light border border-top-0 ${message === "University is not present" && city.length > 0 && cities.length > 0 ? '' : 'd-none'}`} style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                              {cities.map((x) => {
                                return (
                                  <>
                                    <p onClick={() => { fetchMatcheduniversity(x.name); setCity(x.name); setCities([]); }} className="m-0" style={{ cursor: 'pointer' }}>{x.name}</p>
                                  </>
                                )
                              })}
                            </div>
                          </div>
                          <div className={`col-12 mt-3 ${message === "University is not present" ? 'd-none' : ''}`}>
                            <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.university}</label>
                            <div className="input-group mb-3 bg-light rounded border py-2">
                              <input type="text" value={UserUniversity} disabled={message === "University is not present" ? false : true} className="form-control border-0 bg-transparent country-input" placeholder={translate_value.signup_page.university_placeholder} aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                          </div>
                          <div className={`text-center ${message === "University is not present" ? 'mt-4' : 'd-none'}`}>
                            <a href="" className='btn text-decoration-none fw-medium text-white py-2 px-2 px-md-4' style={{ backgroundColor: '#5d5fe3' }} data-bs-toggle="modal" data-bs-target="#adduniversitymodal">Add your University</a>
                          </div>
                        </div>
                        <div className={`text-center ${message === "University is not present" ? '' : 'my-2'}`}>
                          <button disabled={message === "University is not present" ? true : false} className="btn w-100 signup-btn btn-md py-2 px-2 px-md-5 text-white fw-medium" type="submit" onClick={senduniversitydata}>
                            {translate_value.signup_page.next}
                          </button>
                        </div>
                      </form>
                    </div>
                  }
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
                  <svg className='login-img3 d-none d-lg-block' style={{ position: 'absolute', animation: 'spin 6s linear infinite'}} xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
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
            <div className="bg-white rounded shadow mx-auto pb-5">
              <div className="text-end px-2 pt-2">
                <button onClick={() => {
                  if (message === "University is not present") {
                    setsignupform(3);
                    setvalidatedform(false);
                  } else {
                    setsignupform(2);
                    setvalidatedform(false);
                  }
                }} className={`border-0 ms-auto btn btn-sm mt-2 text-decoration-underline`} style={{ color: '#FF845D' }}>Close</button>
              </div>
              <div className='d-flex flex-column pb-2 align-items-center justify-content-center mt-3' style={{ height: '200px' }}>
                <img src={require('../../img/images_icons/tick.png')} className=" animate__animated animate__bounceIn" width={70} alt="sign-up" />
                <p className='m-0 mt-3 fs-2 animate__animated animate__bounceIn' style={{ color: '#34a853', fontSize: '32px', lineHeight: 'normal', fontWeight: 450, letterSpacing: '0.64px' }}>OTP Verification</p>
                <p className='m-0 fs-3 animate__animated animate__bounceIn' style={{ color: '#34a853', fontSize: '32px', lineHeight: 'normal', fontWeight: 450, letterSpacing: '0.64px' }}>Successfull</p>
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

      {/* --------------------------------------------ADD UNIVERSITY--------------------------------------------------------- */}
      <div className="modal fade" id="adduniversitymodal" tabIndex="-1" aria-labelledby="addcoursemodalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body px-2  px-lg-5 py-5 mb-4 mt-2">
              <div className='d-flex flex-column align-items-center'>
                <h3 className='pb-4'>Add University Name</h3>
                <input type="text" name="" id="" className='form-control py-2' onChange={(e) => { setuniversityname(e.target.value) }} />
              </div>
              <div className='mt-4'>
                <button className='btn text-white w-100 px-3' data-bs-dismiss="modal" style={{ backgroundColor: '#5D5FE3' }} onClick={adduniversity}>Submit for Admin Approval</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Adddetails value={value} email={university} university_name={UserUniversity} password={password} />

      <div className={state ? '' : 'd-none'}>
        <div className="admin-request-success">
          <div className="bg-white rounded p-3 gap-3 justify-content-center d-flex align-items-center flex-column">
            <img src={require('../../img/check__2_-removebg-preview.png')} width={50} alt="sign-up" className='me-2' />
            <p className='mb-0 fw-medium fs-5 text-center'>Request successfully sent to the Admin</p>
            <p className='mb-0 text-center'>Wait for Admin approval</p>
            <div className='text-end'>
              <button className='btn btn-sm text-white px-3 fw-bold' style={{ backgroundColor: '#5d5fe3' }} onClick={() => { setstate(false); navigate('/loginpage') }}>Ok</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Signuppage;