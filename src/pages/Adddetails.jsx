// After Email validation and OTP Verification the user need to add their details

import React, { useState, useContext } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ipaddress } from '../App';
import { Context } from '../context/Context_provider';
import First_navabr from '../components/First_navabr';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toast } from 'react-toastify';
import apiClient from '../pages/Middlewares/axiosConfig';
import axiosInstance from './axiosInstance';
import axios from 'axios';
import { setAccessToken } from './authService';
import { Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { setEncryptedData, getDecryptedData, removeData } from '../utils/helperFunctions';

const Adddetails = ({ value, email, organization_name, password }) => {
  const userdata = JSON.parse(getDecryptedData('user'))

  const renderTooltip = (value) => (
    <Tooltip id="button-tooltip">
      {value}
    </Tooltip>
  );

  const { translate_value, setAddsubjects_layout } = useContext(Context);
  let navigate = useNavigate();
  const [firstname, setFirstname] = useState();
  const [lastname, setlastname] = useState();
  const [nickname, setnickname] = useState("");
  const [coursename, setcoursename] = useState(0);
  const [type, settype] = useState('');
  const [degrees, setdegrees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [btn_status, setbtn_status] = useState(false);
  const [loading, setloading] = useState();
  const [success, setsuccess] = useState(false);
  const [error, seterror] = useState(false);

  useEffect(() => {
    if (value == true) {
      apiClient.get(`${ipaddress}/SendDegrees/`)
        .then((r) => { setdegrees(r.data) })
        .catch(() => { console.log("Joined degrees fetching error") })
    }
  }, [value])

  // Fetch programs
  const fetch_programs = (id) => {
    apiClient.get(`${ipaddress}/ProgramsView/${id}/`)
      .then((r) => {
        setCourses(r.data)
      }).catch(() => { console.log("Joined courses fetching error") })
  }
  // --------------To get the firstname and lastname from email-------------------------------
  const [beforeDot, setBeforeDot] = useState("");
  const [afterDot, setAfterDot] = useState("");
  useEffect(() => {
    const emailParts = email.split('@');
    let first_name = '';
    let last_name = '';

    if (emailParts[0].includes('.')) {
      first_name = emailParts[0].split('.')[0];
      last_name = emailParts[0].split('.')[1];
    } else if (emailParts[0].includes('_')) {
      console.log(emailParts[0]);
      first_name = emailParts[0].split('_')[0];
      last_name = emailParts[0].split('_')[1];
    } else {
      first_name = emailParts[0];
      last_name = emailParts[1];
    }

    setFirstname(first_name);
    setlastname(last_name);

  }, [email]);

  var initialValues = {
    title: '',
    firstname: firstname || '',
    lastname: lastname || '',
    nickname: '',
    type: '',
    program_name: ''
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("title is a required."),
    firstname: Yup.string().required("firstname is a required."),
    lastname: Yup.string().required("lastname is a required."),
    nickname: Yup.string().required("nicname is required."),
    type: Yup.string().required("degrees is required."),
    program_name: Yup.string().required("program name is required."),
  });

  const senduserdata = (values) => {
    setloading(true);
    const formdata = new FormData();
    formdata.append('title', values.title);
    formdata.append('first_name', values.firstname);
    formdata.append('last_name', values.lastname);
    formdata.append('nickname', values.nickname);
    formdata.append('course_name', coursename);
    formdata.append('degree', values.type);
    formdata.append('email', email);
    setFirstname(values.firstname);
    setlastname(values.lastname);
    setnickname(values.nickname);
    settype(values.type);
    apiClient.post(`${ipaddress}/UserRegistrationAPIView/`, formdata)
      .then((r) => {
        generate_token();
        setAddsubjects_layout(true);
        setloading(false);
      })
  }

  const generate_token = () => {
    apiClient.post(`${ipaddress}/api/token/`, { email: email, password: password })
      .then((r) => {
        setAccessToken(r.data.access, r.data.refresh);
        signin();
      })
      .catch((err) => { console.error("Token error", err) })
  }

  const signin = () => {
    // console.log("Triggered")
    apiClient.get(`${ipaddress}/UserDetails/${email}/`)
      .then((r) => {
        setEncryptedData('user', JSON.stringify(r.data), 180);
        navigate('/dashboard/mainpage');
      }).catch((err) => { console.log("ERROR", err) })
  }

  //  Validate nickame
  const [loading1, setloading1] = useState();
  const [val, setval] = useState("");
  const verifyNickname = (value) => {
    setloading1(true)
    if (value.length > 0) {
      setval('Checking...')
      apiClient.get(`${ipaddress}/admin_app/NickNameCheck/${value}/`)
        .then((r) => {
          document.getElementById('span').style.color = "black";
          setloading1(false);
          if (r.data.message === 'Not There') {
            setsuccess(true);
            seterror(false);
            setbtn_status(true);
          } else {
            seterror(true);
            setsuccess(false);
            setbtn_status(false);
          }
        }).catch((err) => { console.log("Nickname error", err) })
    } else {
      setbtn_status(false);
    }
  }
  const [showprogram, setShowprogram] = useState(false);
  const [program_name, setprogram_name] = useState('');
  const [filteredprograms, setfilteredprograms] = useState([]);
  const searchProgram = (value) => {
    if (value.length > 0) {
      // console.log(value.toLowerCase())
      setShowprogram(true)
      const programs = courses.filter((x) => {
        if (x.program_name.toLowerCase().includes(value.toLowerCase())) {
          return x
        }
      })
      // console.log(programs)
      setfilteredprograms(programs);
    } else {
      setfilteredprograms([]);
    }
  }

  //  ------------------------------------------ADD COURSE-------------------------------------------------
  const [newcourse, setNewcourse] = useState("");
  const [state, setstate] = useState(false);
  const addcourse = () => {
    setloading(true)
    const formdata = new FormData();
    formdata.append('course_name', newcourse);
    formdata.append('degree', type);
    formdata.append('first_name', firstname);
    formdata.append('last_name', lastname);
    formdata.append('nickname', nickname);
    formdata.append('email', email);
    apiClient.post(`${ipaddress}/UserRegistrationAPIView/`, formdata)
      .then((r) => {
        setloading(false);
        setAddsubjects_layout(true);
        // console.log("Course Added Successfully")
        setstate(true);
        setTimeout(() => {
          generate_token()
        }, 3000);
      }).catch((error) => { console.error("Error adding course:", error) });
  };

  return (
    <div className={`bg-light pt-3 ${value ? 'd-block' : 'd-none'}`} style={{ height: '100vh' }}>
      <div className='container animate__animated animate__fadeIn'>
        <div>
          <First_navabr />
        </div>
        <div className='text-center mt-4'>
          <img src={require('../img/images_icons/2c35e26927acc836b92bc5c724acb417.jpg')} className='rounded-circle' width={150} height={150} alt="add-de" />
          <h4 className='fw-medium mt-4 pb-2' style={{ fontSize: '32px', lineHeight: 'normal', letterSpacing: '0.64px' }}>Hello {firstname}! You are about to set up</h4>
        </div>
        <div className='mt-4'>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => senduserdata(values)}>
            {({ values, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
              <Form action="" className='m-0 w-100'>
                <div className='row mb-2'>
                  <div className="col-lg-2">
                    <label for="formGroupExampleInput1" className="form-label text-secondary">Title<span style={{ color: 'red' }}>*</span></label>
                    <select
                      className="form-control py-3"
                      value={values.title}
                      id="formGroupExampleInput1"
                      name='title'
                      onChange={handleChange}
                      onBlur={handleBlur}>
                      <option value="" disabled>Select Title</option>
                      <option value="student">Student</option>
                      <option value="professor">Professor</option>
                      <option value="alumni">Alumni</option>
                    </select>
                    <ErrorMessage className="validation-error" name='title' component='div' />
                  </div>
                </div>
                <div className='row'>
                  <div className="mb-3 col-lg-6">
                    <label for="formGroupExampleInput1" className="form-label text-secondary d-flex align-items-center" ><span className='me-2'>{translate_value.signup_page.first_name}<span style={{ color: 'red' }}>*</span></span>
                      {/* <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={renderTooltip("First Name")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF845D" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                      </svg>
                    </OverlayTrigger> */}
                    </label>
                    <input
                      type="text"
                      name='firstname'
                      value={values.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control py-3"
                      id="formGroupExampleInput1"
                      placeholder='Enter your Firstname' />
                    <ErrorMessage className="validation-error" name='firstname' component='div' />
                  </div>

                  <div className="mb-3 col-lg-6">
                    <label for="formGroupExampleInput1" className="form-label text-secondary d-flex align-items-center" ><span className='me-2'>{translate_value.signup_page.last_name}<span style={{ color: 'red' }}>*</span></span>
                      {/* <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={renderTooltip("Last Name")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF845D" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                      </svg>
                    </OverlayTrigger> */}
                    </label>
                    <input
                      type="text"
                      className="form-control py-3"
                      name='lastname'
                      id="formGroupExampleInput1"
                      placeholder='Enter your Lastname'
                      value={values.lastname}
                      onChange={handleChange}
                      onBlur={handleBlur} />
                    <ErrorMessage className="validation-error" name='lastname' component='div' />
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label for="formGroupExampleInput1" className="form-label text-secondary d-flex align-items-center" ><span className='me-2'>{translate_value.signup_page.nick_name}<span style={{ color: 'red' }}>*</span></span>
                      {/* <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={renderTooltip("Nickname")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF845D" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                      </svg>
                    </OverlayTrigger> */}
                    </label>
                    <div className="input-group rounded border bg-white">
                      <input
                        type="text"
                        className="form-control border-0 py-3 bg-transparent"
                        id="formGroupExampleInput1"
                        placeholder='Enter your Nickname'
                        maxLength={12}
                        // onChange={(e) => {

                        //   setTimeout(() => {
                        //     setnickname(e.target.value)
                        //     verifyNickname(e.target.value)
                        //   }, 1000)
                        // }} 
                        name='nickname'
                        value={values.nickname}
                        onChange={(e) => { handleChange(e); verifyNickname(e.target.value) }}
                        onBlur={handleBlur} />

                      <span id='span' className={`input-group-text bg-transparent border-0 ${values.nickname.length > 0 ? '' : 'd-none'}`}>
                        {loading1 ? (<div className="spinner-border text-info spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>) : (
                          <span className='ms-2' style={{ fontSize: '13px' }}><span className={`${success ? '' : 'd-none'}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check2-circle" viewBox="0 0 16 16">
                            <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                            <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                          </svg></span>
                          </span>
                        )}
                      </span>
                    </div>
                    <ErrorMessage className="validation-error" name='nickname' component='div' />
                    <span className={`${error ? '' : 'd-none'}`} style={{ fontSize: '13px', color: '#ff845d' }}>Nickname already exist</span>
                  </div>

                  <div className="mb-3 col-lg-6 ">
                    <label for="formGroupExampleInput1" className="form-label text-secondary" >Select the Degree</label>
                    <select
                      className="form-control py-3"
                      id="formGroupExampleInput1"
                      name='type'
                      //  onChange={(e) => { settype(e.target.value); fetch_programs(e.target.value) }}
                      value={values.degrees}
                      onChange={(e) => { handleChange(e); fetch_programs(e.target.value) }}
                      onBlur={handleBlur}
                    >
                      <option value="">Select the Degree</option>
                      {degrees && degrees.map((x, index) => {
                        return (
                          <option key={index} value={x.id}>{x.name}</option>
                        )
                      })}
                    </select>
                    <ErrorMessage className="validation-error" name='type' component='div' />
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label for="formGroupExampleInput" className="form-label text-secondary">Program</label>
                    <div className="input-group bg-white border py-2">
                      <input
                        type="text"
                        // onChange={(e) => { setprogram_name(e.target.value); searchProgram(e.target.value) }}
                        className="form-control border-0 bg-transparent country-input"
                        placeholder="Search and select program"
                        aria-label="Username"
                        name='program_name'
                        aria-describedby="basic-addon1"
                        value={values.program_name}
                        onChange={(e) => { handleChange(e); searchProgram(e.target.value) }}
                        onBlur={handleBlur}
                      />
                    </div>

                    {/* --------------------------------SEARCH BAR FOR PROGRAM----------------------------------- */}
                    <div className={`px-3 py-2 bg-light border border-top-0 ${showprogram && filteredprograms.length > 0 ? '' : 'd-none'}`} style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                      {filteredprograms.map((x, index) => {
                        const backgroundColor = `rgba(93, 95, 227, ${(index % 2 === 0) ? 0.1 : 0.2})`; // alternating background color
                        return (
                          <p onClick={() => { setcoursename(x.pid); setprogram_name(x.program_name); setFieldValue("program_name", x.program_name); setShowprogram(!showprogram) }}
                            className="m-0 p-2" style={{ cursor: 'pointer', backgroundColor, transition: 'background-color 0.3s', borderRadius: '5px' }}>
                            {x.program_name}
                          </p>
                        )
                      })}
                    </div>
                    <ErrorMessage className="validation-error" name='program_name' component='div' />
                  </div>

                  <div className='text-start'>
                    <a href="" className='text-decoration-none fw-medium' style={{ color: '#FF845D' }} data-bs-toggle="modal" data-bs-target="#addcoursemodal">Didn't find the program</a>
                  </div>

                  <div className="mb-3 col-12 text-center mt-3">
                    <button disabled={error ? true : false} className='text-white fw-medium btn py-2' type='submit' style={{ backgroundColor: '#585FE3' }}>
                      {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* --------------------------------------------ADD COURSE--------------------------------------------------------- */}
      <div className="modal fade" id="addcoursemodal" tabIndex="-1" aria-labelledby="addcoursemodalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body px-2 px-lg-5 py-5 mb-4 mt-2">
              <div className='d-flex flex-column align-items-center'>
                <h3 className='pb-4'>{translate_value.signup_page.add_course}</h3>
                <input type="text" name="" id="newcourseInput" className='form-control py-2' onChange={(e) => { setNewcourse(e.target.value) }} />
              </div>
              <div className='mt-4'>
                <button className='btn text-white w-100' style={{ backgroundColor: '#5D5FE3' }} data-bs-dismiss="modal" onClick={() => {
                  (newcourse.trim() === '') ? alert('Course name cannot be empty') : addcourse();
                }}>{translate_value.login_page.submit}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* TOAST MESSAGE */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex justify-content-between">
            <span id='toastbody'></span>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>

      <div className={`${state ? '' : 'd-none'}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', width: '100%', top: 0, height: '100%' }}>
        <div className="row m-0">
          <div className="bg-white col-md-8 col-lg-6 p-3 pt-4 rounded mx-auto mt-3">
            <p className='justify-content-center d-flex align-items-center m-0 fw-medium fs-5'><img src={require('../img/check__2_-removebg-preview.png')} width={30} alt="add-de" className='me-2' />Request successfully sent to the Admin</p>
            <p className='m-0 mt-2 text-center'>Wait for Admin approval</p>
            <div className='text-end'>
              <button className='btn btn-sm text-white px-3' style={{ backgroundColor: '#5d5fe3' }}
                onClick={() => { setstate(false); navigate('/loginpage') }}>Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Adddetails
