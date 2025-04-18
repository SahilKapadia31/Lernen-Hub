import React from "react";

const OrganizationDashboard = () => {
  return (
    <>
      <div class="row g-4">
        <div class="col-xl-4 col-lg-4">
          <div class="row g-4">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  <h6 class="mb-3 text-muted" title="Number of Customers">
                    Active Students
                  </h6>
                  <h4 class="mb-3" id="active-users-count">
                    551
                  </h4>
                  {/* <p class="mb-0 text-success">
                    <svg
                      class="align-top"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    5.27%
                  </p>
                  <p class="mb-0 text-muted small">Since last month</p> */}
                </div>
              </div>
            </div>
          
          </div>
        </div>
        <div class="col-xl-4 col-lg-4">
          <div class="row g-4">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  <h6 class="mb-3 text-muted" title="Number of Customers">
                    Active Staff
                  </h6>
                  <h4 class="mb-3" id="active-users-count">
                    551
                  </h4>
                 
                </div>
              </div>
            </div>
         
          </div>
        </div>
        <div class="col-xl-4 col-lg-4">
          <div class="row g-4">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  <h6 class="mb-3 text-muted" title="Number of Customers">
                    Active Programs
                  </h6>
                  <h4 class="mb-3" id="active-users-count">
                    551
                  </h4>
                 
                </div>
              </div>
            </div>
         
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationDashboard;
