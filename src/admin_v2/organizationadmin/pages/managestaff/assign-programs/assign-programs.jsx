import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./assign-programs.scss";
import { useSelector } from "react-redux";
import Loading from "react-fullscreen-loading";
import AddPrograms from "./add-program/add-program";
import { toast } from "react-toastify";
import axiosInstance from "../../../components/services/axiosInstance";
const SettingsModal = ({ show, handleClose, staffDetails, submitForm, programList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const orgData = useSelector((state) => state.auth);

  const [subjectsList, setSubjectsList] = useState([]);
  const [userPrograms, setUserPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [openAddPrograms, setOpenAddPrograms] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [associatedSubjects, setAssociatedSubjects] = useState(null);
  const getUserPrograms = async () => {
    try {
      setUserPrograms([]);
      setSubjectsList([]);
      setSelectedProgram(null);
      setIsLoading(true)
      const response = await axiosInstance.get(`/userProgram/${staffDetails?.user_id}/`);
      if (response.data && response.data.data.length) {
        console.log("", programList);

        const updatedPrograms = response.data.data.map(program => {
          const programDetails = programList.find(p => p.pid === program.program_id);
          return { ...program, program_name: programDetails ? programDetails.program_name : null };
        });

        setUserPrograms(updatedPrograms)
        setSelectedProgram(updatedPrograms[0]);
        getSubjectAssociation(updatedPrograms[0])
      } else {
        setIsLoading(false)
      }
    } catch (err) {
      setIsLoading(false)
      console.log("Error in getAllSubjects", err);
    }
  }


  const getSubjectAssociation = async (program) => {
    try {
      setIsLoading(true)

      // Open default semester
      if (program?.semester && program?.semester.length) {
        setSelectedSemester(program?.semester[0])
      }

      const response = await axiosInstance.get(`/userProgramCourseAssociation/${staffDetails?.user_id}/${program.program_id}/`);
      if (response.data) {
        setAssociatedSubjects(response.data)
        getProgramSubjects(program.program_id, response.data, program?.semester[0]);
      }
    } catch (err) {
      setIsLoading(false)
      console.log("Error in getSubjectAssociation", err);
    }
  }

  const getProgramSubjects = async (program_id, subjectAssociationData, selectedSemester) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`/courses/${program_id}/${orgData?.role?.organization_id}/`);
      if (response.data.status) {
        let subjectList = response.data.data || [];

        // Filter subject which are associated with program semester
        subjectList = subjectList.filter(subject => subject?.semester?.includes(selectedSemester?.start_sem_id))

        subjectList = subjectList.map(item => ({
          ...item,
          is_selected: subjectAssociationData?.find(assItem => assItem.course_id === item.course_id) ? true : false,
          association_id: subjectAssociationData?.find(assItem => assItem.course_id === item.course_id)?.id || null,
        }));
        setSubjectsList(subjectList)
        setIsLoading(false)
      }
    } catch (err) {
      setIsLoading(false)
      console.log("Error in getProgramSubjects", err);
    }
  };

  useEffect(() => {
    if (show) {
      getUserPrograms();
    }
  }, [show]);

  const [settingStep, setSettingStep] = useState(1);
  const [step, setStep] = useState(1);

  const changeStep = (index) => setSettingStep(index + 1);
  const onSearch = () => console.log("Filtering", searchTerm);
  const clearKeyFilter = () => setSearchTerm("");
  const onChangeSetting = (item) => {
    item.is_visible = !item.is_visible;
    console.log("Setting changed", item);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredSubjects = subjectsList.filter(item =>
    item.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createSubjectAssociation = async (course_id, program_id) => {
    try {
      setIsLoading(true)
      const payload = {
        "program_id": program_id,
        "course_id": course_id,
        "option_id": orgData?.role?.option_id,
        "organization_id": orgData?.role?.organization_id,
        "user_id": staffDetails?.user_id,
        "semester_id": selectedSemester?.start_sem_id
      }

      const response = await axiosInstance.post(`/userProgramCourseAssociation/`, payload);
      if (response.data) {
        toast.success("Course assigned successfully")
        getSubjectAssociation(selectedProgram);
      }
    } catch (err) {
      setIsLoading(false)
      console.log("Error in createSubjectAssociation", err);
      toast.error("Error!!! Please try again")
    }
  }

  const deleteSubjectAssociation = async (id, program_id) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.delete(`/userProgramCourseAssociation/${id}/`);
      if (response.data) {
        toast.success("Course removed successfully")
        getSubjectAssociation(selectedProgram);
      }
    } catch (err) {
      setIsLoading(false)
      console.log("Error in deleteSubjectAssociation", err);
      toast.error("Error!!! Please try again")
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header className="border-bottom" closeButton>
          <Modal.Title className="dialog-title">Setting</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mt-4 row">
            <div className="px-2 col-lg-3 main-tab-section">
              <div className="row">
                <div className="col-md-12">
                  <div className="border card" style={{ cursor: 'pointer', boxShadow: 'none' }} onClick={() => setOpenAddPrograms(true)}>
                    <div className={`card-body px-4 py-2 rounded`} style={{ backgroundColor: '#5d5fe3', color: '#fff', boxShadow: 'none' }}>
                      Add Programs
                    </div>
                  </div>
                </div>
              </div>
              <hr></hr>
              <div className="row" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {(userPrograms && userPrograms.length > 0) ?
                  userPrograms.map((program) =>
                    <div className="mb-1 col-md-12">
                      <div className="card" style={{ boxShadow: 'none', cursor: 'pointer' }} onClick={() => { getSubjectAssociation(program); setSelectedProgram(program) }}>
                        <div className={`card-body px-4 py-2 text-uppercase ${selectedProgram.program_id == program?.program_id ? "active-program" : "pending-program border"}`}>
                          {program.program_name}
                        </div>
                      </div>
                    </div>
                  ) :
                  <div className="mb-1 col-md-12">
                    <p className="mb-0">Please add program</p>
                  </div>
                }
              </div>
            </div>
            <div className="px-2 col-lg-9 main-table-section">
              <div className="mb-2 row">
                {/* Search Bar */}
                <div className="col-lg-11">
                  <div className="form-group has-search position-relative">
                    <input
                      type="text"
                      name="search"
                      className="form-control form-control-draft"
                      placeholder="Search subject"
                      id="searchInput"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter and Clear Buttons */}
                <div className="gap-2 px-0 col-lg-1 d-flex">
                  <button type="button" className="btn btn-sm btn-warning btn-filter-section" onClick={() => {
                    setSearchTerm("");
                    //  clearFilter();
                  }} >
                    <span>Clear</span>
                  </button>
                </div>
              </div>
              <ol className="px-0 pt-0 pb-0 mb-2 bg-transparent breadcrumb align-items-center">
                {(selectedProgram && selectedProgram.semester) && selectedProgram.semester.map((sem, i) => (
                  <li key={i}>
                    <span className={`badge-nav mx-1 my-1 ${selectedSemester?.start_sem_id === sem?.start_sem_id ? "active-group" : ""}`} onClick={() => { getProgramSubjects(selectedProgram?.program_id, associatedSubjects, sem); setSelectedSemester(sem); }}>
                      {sem.samester_name}
                    </span>
                  </li>
                ))}
              </ol>
              {/* <hr></hr> */}
              <div className={`card card-config border`} style={{ height: '400px', overflowY: 'auto' }}>
                <div className="vertical-divider">
                  <div className="p-2 table-responsive">
                    {/* Table for Visibility Settings */}
                    <table className="table mb-0 align-items-center table-flush table-striped h-100 ng-star-inserted">
                      <thead className="thead-light">
                        <tr>
                          <th>#</th>
                          <th style={{ textAlign: 'left' }}>Subject</th>
                          <th>Asign</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredSubjects && filteredSubjects.length > 0) ?
                          filteredSubjects.map((subject, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td className="table-user" style={{ textAlign: 'left', textTransform: 'uppercase  ' }}>
                                {subject.course_name}
                              </td>
                              <td className="table-user">
                                <Form.Check
                                  type="switch"
                                  id={`switch-${subject?.course_id}`}
                                  checked={subject.is_selected}
                                  onChange={() => subject.is_selected ? deleteSubjectAssociation(subject.association_id, subject.program_id) : createSubjectAssociation(subject.course_id, subject.program_id)}
                                //className={`me-2 fw-bold d-flex justify-content-center gap-2 ${item.status ? "text-success" : "text-danger"}`}
                                //label={item.status ? "Active" : "Inactive"}
                                />
                              </td>
                            </tr>
                          ))
                          :
                          <tr>
                            <td colSpan={3}>{'No Subject Found'}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <AddPrograms
        show={openAddPrograms}
        handleClose={() => { setOpenAddPrograms(false); }}
        getUserPrograms={getUserPrograms}
        user_id={staffDetails?.user_id}
        userPrograms={userPrograms}
        programList={programList}
      />
      {isLoading && <Loading loading={true} loaderColor="#000" />}
    </>
  );
};

export default SettingsModal;
