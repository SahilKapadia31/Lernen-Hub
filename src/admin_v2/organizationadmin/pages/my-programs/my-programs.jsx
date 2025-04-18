import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "../../components/services/axiosInstance";
import ShowSubject from "./show-subject/show-subject";
import seacrh_icon from "../../../../img/search-icon.svg";
import verticle_line_icon from "../../../../img/verticle-line-icon.svg";
import eye_icon from "../../../../img/eye-icon.svg";
import "./my-programs.scss";
import { use } from "react";
import { Modal, Button } from "react-bootstrap";
import SortableHeader from "../../components/SortableHeader";
const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const staffData = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [userPrograms, setUserPrograms] = useState([]);
  const [showSubject, setShowSubject] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showStudent, setShowStudent] = useState(false);

  const getUserPrograms = async () => {
    try {
      setSelectedProgram(null);
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/userProgram/${staffData?.user?.id}/`
      );
      if (response.data && response.data.data.length) {
        let userPrograms = response.data.data;
        userPrograms.forEach((program) => {
          const allCourses = [];

          // Gather all courses from all semesters
          program.semester.forEach((semester) => {
            allCourses.push(...semester.courses);
          });

          // Get unique courses using a Set
          const uniqueCourses = new Set(allCourses);

          // Add the total_courses key to the program object
          program["total_courses"] = uniqueCourses.size;
        });

        setUserPrograms(userPrograms);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Error in getUserPrograms", err);
    }
  };

  useEffect(() => {
    getUserPrograms();
  }, []);

  const [studentList, setStudentList] = useState([])
  const getStudents = async (program_id) => {
    try {
      setStudentList([])
      setIsLoading(true);
      const response = await axiosInstance.get(`/getAllStudentsbyProgram/${program_id}/`);
      if (response.data && response.data.data.length) {
        setStudentList(response.data.data);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Error in getStudents", err);
    }
  };
  return (
    <>
      <div className="myprogram-dashboard">
        {/* <div class="row g-4">
          <div class="col-xl-4 col-lg-4">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body p-md-4">
                  <div className="d-flex gap-1">
                    <div className="profile">
                      <img src="https://mimity-admin904.netlify.app/assets/img/user/user1.svg" width={50} />
                      <p className="name">lernen hub</p>
                      <p className="post-name">Online study platform</p>
                    </div>
                    <div className="details">
                      <div className="card">
                        <div className="card-body d-flex align-items-center justify-content-center flex-column">
                          <div className="d-flex align-items-center justify-content-center flex-column">
                            <img src="https://img.icons8.com/ios-filled/50/student-female.png" alt="student-female" />
                            <p className="title-type">Students</p>
                          </div>
                          <div>
                            <p className="count">5</p>
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-body d-flex align-items-center justify-content-center flex-column">
                          <div className="d-flex align-items-center justify-content-center flex-column">
                            <img src="https://img.icons8.com/ios-filled/50/student-female.png" alt="student-female" />
                            <p className="title-type">Students</p>
                          </div>
                          <div>
                            <p className="count">5</p>
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-body d-flex align-items-center justify-content-center flex-column">
                          <div className="d-flex align-items-center justify-content-center flex-column">
                            <img src="https://img.icons8.com/ios-filled/50/student-female.png" alt="student-female" />
                            <p className="title-type">Students</p>
                          </div>
                          <div>
                            <p className="count">5</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-lg-4">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body p-md-4">
                  <svg
                    class="position-absolute end-0 me-3 text-muted"
                    width="28"
                    height="28"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  <h6 class="mb-3 text-muted" title="Number of Customers">
                    Views Per Minute
                  </h6>
                  <h4 class="mb-3" id="active-views-count">
                    493
                  </h4>
                  <p class="mb-0 text-danger">
                    <svg
                      class="align-top"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    1.08%
                  </p>
                  <p class="mb-0 text-muted small">Since last month</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-lg-4">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body p-md-4">
                  <svg
                    class="position-absolute end-0 me-3 text-muted"
                    width="28"
                    height="28"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  <h6 class="mb-3 text-muted" title="Number of Customers">
                    Views Per Minute
                  </h6>
                  <h4 class="mb-3" id="active-views-count">
                    493
                  </h4>
                  <p class="mb-0 text-danger">
                    <svg
                      class="align-top"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    1.08%
                  </p>
                  <p class="mb-0 text-muted small">Since last month</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="row">
          <div className="col-md-6 m-auto">
            <div className="search position-relative">
              <img src={seacrh_icon} className="search-icon" />
              <img src={verticle_line_icon} className="line-icon" />
              <input
                type="text"
                name=""
                placeholder="Search here..."
                className="search-input form-control"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="programs">
              <div className="row">
                {userPrograms && userPrograms.length > 0
                  ? userPrograms.map((programs) => (
                    <div className="col-md-4 mb-4 h-auto">
                      <div className="program-details shadow h-100">
                        <div className="program-name" onClick={()=> navigate(`/organization/show-documents/${programs?.program_id}`)}>
                          {programs?.program_name}
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-2 py-2 show">
                          <img src={eye_icon} className="eye-icon" />
                          {programs?.total_courses > 0 ? (
                            <p
                              className="view"
                              onClick={() => {
                                setShowSubject(true);
                                setSelectedProgram(programs);
                              }}
                            >
                              View Subjects
                            </p>
                          ) : (
                            <p
                              className="view"
                              style={{ pointerEvents: "none" }}
                            >
                              View Subjects
                            </p>
                          )}
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-2 py-1 show">
                          <img src={eye_icon} className="eye-icon" />
                          <p className="view" onClick={() => { setShowStudent(true); getStudents(programs?.program_id);setSelectedProgram(programs) }}>
                            View Students
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showStudent} onHide={() => setShowStudent(false)} size="lg" centered>
        <Modal.Header closeButton className="border-bottom">
            <h5 className="mb-0 d-flex gap-2 align-items-center">Student Details <span className="program-type text-uppercase">{selectedProgram?.program_name}</span></h5> 
        </Modal.Header>
        <Modal.Body className="table-div">
          <table className="table fs-9 mb-0">
            <thead>
              <tr style={{ textTransform: "uppercase" }}>
                <th width="5%">
                  <h5 className="sort mb-0 text-center">#</h5>
                </th>
                <th width="35%">
                  <h5 className="sort mb-0 text-center">Full Name</h5>
                </th>
                <th width="35%">
                  <h5 className="sort mb-0 text-center">Email</h5>
                </th>
                <th width="25%">
                  <h5 className="sort mb-0 text-center">Status</h5>
                </th>
              </tr>
            </thead>
            <tbody>
              {(studentList && studentList.length > 0) ?
                studentList.map((student,index) =>
                  <tr>
                    <td className="text-center text-capitalize">{index+1}</td>
                    <td className="text-center text-capitalize">{student?.first_name + " " + student?.last_name}</td>
                    <td className="text-center">{student?.email}</td>
                    <td className={`text-center`} ><span className={`${student?.is_active ? 'active_status' : 'inactive'}`}>{student?.is_active ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ):
                <tr>
                  <td colSpan={4} className="text-center">No Record</td>
                </tr>
                }
            </tbody>
          </table>
        </Modal.Body>
      </Modal>

      <ShowSubject
        show={showSubject}
        handleClose={() => setShowSubject(false)}
        selectedProgram={selectedProgram}
      />

      {isLoading && <Loading loading={true} loaderColor="#000" />}
    </>
  );
};

export default OrganizationDashboard;
