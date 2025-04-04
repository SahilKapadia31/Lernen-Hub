import React from "react";
import seacrh_icon from '../../../../img/search-icon.svg';
import verticle_line_icon from '../../../../img/verticle-line-icon.svg';
import eye_icon from '../../../../img/eye-icon.svg'
import './my-programs.scss'
const OrganizationDashboard = () => {

  const programs = [
    { name: 'Engineering' },
    { name: 'Medical' },
    { name: 'Law' },
    { name: 'Management' },
    { name: 'Pharmacy' },
    { name: 'Architecture' },
    { name: 'Nursing' },
    { name: 'Dentistry' },
    { name: 'Computer Science' },
    { name: 'Mass Communication' },
    { name: 'Agriculture' },
    { name: 'Hotel Management' },
    { name: 'Education' },
    { name: 'Fashion Design' },
    { name: 'Fine Arts' },
    { name: 'Veterinary Science' },
    { name: 'Social Work' },
    { name: 'Paramedical Sciences' },
    { name: 'Aviation' },
    { name: 'Physical Education' }
  ];

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
              <input type="text" name="" placeholder="Search here..." className="search-input form-control" />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="programs">
              <div className="row">
                {programs && programs.length > 0 ?
                  programs.map(items =>
                    <div className="col-md-4 mb-4 h-auto">
                      <div className="program-details h-100">
                        <div className="program-name">
                          {items.name}
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-2 py-2 show">
                          <img src={eye_icon} className="eye-icon" />
                          <p className="view">View Courses</p>
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-2 py-1 show">
                          <img src={eye_icon} className="eye-icon" />
                          <p className="view">View Students</p>
                        </div>
                      </div>
                    </div>
                  ) : ''
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationDashboard;
