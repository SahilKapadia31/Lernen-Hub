import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from "react-select";
import { toast } from 'react-toastify';

import First_navabr from '../components/First_navabr';
import axiosInstance from './axiosInstance';
import axios from 'axios';

import { ipaddress, ipaddress3 } from '../App';
import Loading from "react-fullscreen-loading";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from 'react-redux';

const Adddetails = ({ show, handleClose, university_id, orgLogo }) => {
  const studentData = useSelector((state)=>state.auth.user);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState({ success: false, error: false });

  const [programTypeList, setProgramTypeList] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [masterProgramList, setMasterProgramList] = useState([]);

  const initialValues = {
    degree: null,
    program: null,
    semester: null,
    course_id: null,
    firstName:  studentData?.first_name ||  '',
    lastName: studentData?.last_name || '',
    dob: '',
    joinCode: '',
  };  

  const getValidationSchema = (isJoinCode) => {
    if (isJoinCode) {
      return Yup.object().shape({
        firstName: Yup.string().required("First name is required."),
        lastName: Yup.string().required("Last name is required."),
        dob: Yup.date().required("Date of birth is required."),
        joinCode: Yup.string().required("Join code is required."),
      });
    }
  
    return Yup.object().shape({
      firstName: Yup.string().required("First name is required."),
      lastName: Yup.string().required("Last name is required."),
      degree: Yup.object().required("Degree is required."),
      program: Yup.object().required("Program is required."),
      semester: Yup.object().required("Semester is required."),
      course_id: Yup.object().required("Course is required."),
    });
  };  

  const [formData, setFormData] = useState({ isJoinCode: null, joinCode: null });
  const handleJoinCodeSelection = (value) => {
    setFormData((prev) => ({ ...prev, isJoinCode: value }));

    if (value == false) {
      setFormData((prev) => ({ ...prev, joinCode: null }));
    }
  };

  const handleJoinCode = (value) => {
    setFormData((prev) => ({ ...prev, joinCode: value }));
  };

  const fetchProgramTypes = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await axios.get(`${ipaddress3}/typeProgram/organization/${orgId}/`);
      const data = res.data?.data || [];
      const formatted = data.map(type => ({
        label: type.name,
        value: type.id,
      }));
      setProgramTypeList(formatted);
    } catch (err) {
      console.error("Error fetching program types", err);
    }
  };

  const fetchPrograms = async (orgId, typeId) => {
    if (!orgId || !typeId) return;
    try {
      const res = await axiosInstance.get(`${ipaddress3}/program/organization/${orgId}/${typeId}/`);
      const data = res.data?.data || [];
      const formatted = data.map(prog => ({
        label: prog.program_name,
        value: prog.pid,
      }));
      setProgramList(formatted);
      setMasterProgramList(data);
    } catch (err) {
      console.error("Error fetching programs", err);
    }
  };

  const fetchSemesters = (pid) => {
    if (!pid) return;
    const selected = masterProgramList.find(p => p.pid === pid);
    if (selected?.semester?.length > 0) {
      const formatted = selected.semester.map(sem => ({
        label: sem.sem_name,
        value: sem.semester_id,
      }));
      setSemesterList(formatted);
    } else {
      setSemesterList([]);
    }
  };

  const fetchCourses = async (pid, orgId, semId) => {
    if (!pid) return;
    try {
      console.log(pid, orgId, semId);
      const res = await axios.get(`${ipaddress3}/courses/${pid}/${orgId}/`);
      let subjectList = res.data?.data || [];
      subjectList = subjectList.filter(subject => subject?.semester?.includes(semId))
      subjectList = subjectList.map(subject => ({
        label: subject.course_name,
        value: subject.course_id,
      }));
      console.log(subjectList);

      setSubjectsList(subjectList);
    } catch (err) {
      console.error("Error fetching programs", err);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payloadWithoutJoinCode = {
        organization_id: university_id || null,
        first_name:values.firstName,
        last_name:values.lastName,
        degree_id: values.degree?.value || null,
        program_id: values.program?.value || null,
        semester_id: values.semester?.value || null,
        course_id: values.course_id?.value || null,
      };
      const payloadWithJoinCode = {
        organization_id: university_id || null,
        first_name:values.firstName,
        last_name:values.lastName,
        date_of_birth:values.dob,
        join_code:values.joinCode
      };

      const payload = formData.isJoinCode ? payloadWithJoinCode : payloadWithoutJoinCode;
      console.log(payload);
      setLoading(true)
      const res = await axios.post(`${ipaddress3}/public/home/joinOrganization`, payload);
      if (res && res.status) {
        toast.success("University joined successfully");
      }
      setLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false)
      toast.error("Something went wrong during joining.");
    } finally {

    }
  };

  useEffect(() => {
    if (show) {
      fetchProgramTypes(university_id);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} className="" size='lg' centered>
      <Modal.Body className="bg-light">
        <div className='container'>
          <div className='text-center mt-4'>
            <img src={orgLogo} className='rounded-circle' width={150} height={150} alt="avatar" />
            <h4 className='fw-medium mt-4'>Hello! You are about to set up</h4>
          </div>

          <Formik initialValues={initialValues} validationSchema={getValidationSchema(formData.isJoinCode)} onSubmit={handleSubmit} enableReinitialize>
            {({ values, handleChange, setFieldValue,resetForm  }) => (
              <Form>

                <div className="row">
                  <div className="mb-3 d-flex justify-content-between align-items-center mt-3">
                    <label>Have join code?</label>
                    <div className="form-check form-switch my-0 py-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isJoinCodeSwitch"
                        checked={formData.isJoinCode || false}
                        onChange={(e) => {resetForm();handleJoinCodeSelection(e.target.checked)}}
                      />
                    </div>
                  </div>

                  {formData.isJoinCode === true ? (
                    <>
                      <div className="mb-3 col-lg-6">
                        <label className='mb-2'>First Name<span className='text-danger'>*</span></label>
                        <input
                          placeholder='Enter first name'
                          type="text"
                          name="firstName"
                          className="form-control shadow-none"
                          style={{ height: '50px' }}
                          value={values.firstName}
                          onChange={handleChange}
                        />
                        <ErrorMessage name="firstName" component="div" className="text-danger" />
                      </div>
                      <div className="mb-3 col-lg-6">
                        <label className='mb-2'>Last Name<span className='text-danger'>*</span></label>
                        <input
                          placeholder='Enter last name'
                          type="text"
                          name="lastName"
                          className="form-control shadow-none"
                          style={{ height: '50px' }}
                          value={values.lastName}
                          onChange={handleChange}
                        />
                        <ErrorMessage name="lastName" component="div" className="text-danger" />
                      </div>
                      <div className="mb-3 col-lg-6">
                        <label className='mb-2'>Date of Birth<span className='text-danger'>*</span></label>
                        <input
                          placeholder='Enter Date of Birth'
                          type="date"
                          name="dob"
                          className="form-control shadow-none"
                          style={{ height: '50px' }}
                          value={values.dob}
                          onChange={handleChange}
                        />
                        <ErrorMessage name="dob" component="div" className="text-danger" />
                      </div>
                      <div className="mb-3 col-lg-6">
                        <label className='mb-2'>Join Code<span className='text-danger'>*</span></label>
                        <input
                          placeholder='Enter join code'
                          type="text"
                          name="joinCode"
                          className="form-control shadow-none"
                          style={{ height: '50px' }}
                          value={values.joinCode}
                          onChange={handleChange}
                        />
                        <ErrorMessage name="joinCode" component="div" className="text-danger" />
                      </div>
                    </>
                  ) : (<>
                      {/* Degree */}
                      <div className="mb-3 col-lg-6">
                        <label className='mb-2'>First Name<span className='text-danger'>*</span></label>
                        <input
                          placeholder='Enter first name'
                          type="text"
                          name="firstName"
                          className="form-control shadow-none"
                          style={{ height: '50px' }}
                          value={values.firstName}
                          onChange={handleChange}
                        />
                        <ErrorMessage name="firstName" component="div" className="text-danger" />
                      </div>
                      <div className="mb-3 col-lg-6">
                        <label className='mb-2'>Last Name<span className='text-danger'>*</span></label>
                        <input
                          placeholder='Enter last name'
                          type="text"
                          name="lastName"
                          className="form-control shadow-none"
                          style={{ height: '50px' }}
                          value={values.lastName}
                          onChange={handleChange}
                        />
                        <ErrorMessage name="lastName" component="div" className="text-danger" />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label text-secondary">Degree<span className='text-danger'>*</span></label>
                        <Select
                          name="degree"
                          options={programTypeList}
                          value={values.degree}
                          placeholder="Select Degree"
                          classNamePrefix="react-select"
                          onChange={(opt) => {
                            setFieldValue("degree", opt);
                            setFieldValue("program", null);
                            setFieldValue("semester", null);
                            setFieldValue("course_id", null);
                            fetchPrograms(university_id, opt?.value);
                          }}
                        />
                        <ErrorMessage name="degree" component="div" className="text-danger" />
                      </div>

                      {/* Program */}
                      <div className="col-lg-6 mb-3">
                        <label className="form-label text-secondary">Program<span className='text-danger'>*</span></label>
                        <Select
                          name="program"
                          options={programList}
                          value={values.program}
                          placeholder="Select Program"
                          classNamePrefix="react-select"
                          onChange={(opt) => {
                            setFieldValue("program", opt);
                            setFieldValue("semester", null);
                            fetchSemesters(opt?.value);
                          }}
                        />
                        <ErrorMessage name="program" component="div" className="text-danger" />
                      </div>

                      {/* Semester */}
                      <div className="col-lg-6 mb-3">
                        <label className="form-label text-secondary">Semester<span className='text-danger'>*</span></label>
                        <Select
                          name="semester"
                          options={semesterList}
                          value={values.semester}
                          placeholder="Select Semester"
                          classNamePrefix="react-select"
                          onChange={(opt) => {
                            setFieldValue("semester", opt);
                            setFieldValue("course_id", null);
                            fetchCourses(values.program.value, university_id, opt?.value)
                          }}
                        />
                        <ErrorMessage name="semester" component="div" className="text-danger" />
                      </div>

                      {/* Course */}
                      <div className="col-lg-6 mb-3">
                        <label className="form-label text-secondary">Course<span className='text-danger'>*</span></label>
                        <Select
                          name="course_id"
                          options={subjectsList}
                          value={values.course_id}
                          placeholder="Select Semester"
                          classNamePrefix="react-select"
                          onChange={(opt) => { setFieldValue("course_id", opt) }}
                        />
                        <ErrorMessage name="course_id" component="div" className="text-danger" />
                      </div>
                    </>)}
                  {/* Submit Button */}
                  <div className="col-12 text-center mt-3 gap-2 d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      {loading ? 'Joining...' : 'Join'}
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleClose}>
                      Cancel
                    </button>
                  </div>

                </div>
              </Form>
            )}
          </Formik>
        </div>

        {loading && <Loading loading={true} loaderColor="#000" />}
      </Modal.Body>
    </Modal>
  );
};

export default Adddetails;
