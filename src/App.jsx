import React, { useState, useEffect } from 'react';
import { HashRouter as BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import { ToastContainer } from 'react-toastify';
import 'bootstrap';
import * as bootstrap from 'bootstrap';
import TagManager from 'react-gtm-module'

//App Components
import Uploadpage from './pages/Uploadpage.jsx';
import Documents from './pages/Documents.jsx';
import Showpdfpage from './pages/ShowPDF/ShowPdf.jsx';//Flow The Folder structure
import Courses from './pages/Courses.jsx';
import Protect from './pages/Protect.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Subjects from './pages/Subjects.jsx';
import Flashcard from './pages/Flashcard.jsx';
import Rewards from './pages/Rewards.jsx';
import Groups from './pages/Groups.jsx';
import Groupchat from './pages/Groupchat/Groupchat.jsx';
import Viewflashcard from './pages/Viewflashcard.jsx';
import FlashSet from './pages/FlashSet.jsx';
import Matchflashcard from './pages/Matchflashcard.jsx';
import Translatedpdf from './pages/Translatedpdf.jsx';
import Filterflashcard from './pages/Filterflashcard.jsx';
import Studylist from './pages/Studylist.jsx';
import Loginpage from './pages/Login/Loginpage.jsx'; //Flow The Folder stru
import Signuppage from './pages/Signup/Signuppage.jsx'; //Flow The Folder structure
import UserFiles from './pages/UserFiles.jsx';
import Adddetails from './pages/Adddetails.jsx';
import Opengroups from './pages/Opengroups.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Group_document_upload from './pages/Group_document_upload.jsx';
import Forgot_password_page from './pages/ForgotPassword/ForgotPassword.jsx'
import Extracted_text from './pages/ShowPDF/PDFExtractedText.jsx';
import Add_additional_flashcards from './pages/Add_additional_flashcards.jsx';
import Flashcard_studylist from './pages/Flashcard_studylist.jsx';
import Group_flashcard from './pages/Group_flashcard.jsx';
import Shared_document_page from './pages/Shared_document_page.jsx';
import Protect1 from './pages/Protect1.jsx';
import Login_message from './pages/Login_message.jsx';
import Work_flow from './pages/Work_flow.jsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx';
import NeedHelp from './pages/NeedHelp/NeedHelp.jsx';
import NewFlashCard from './pages/FlashCard/FlashCard.jsx';
import NotFound from './pages/ErrorPage/404ErrorPage.jsx'; // 404 Page
import MapDemo from './pages/mapDemo.jsx';

//Landingpage Components
import Landing_page from './Landing_pages/Landing_page.jsx';
import Contact_us from './Landing_pages/Contact_us.jsx';
import Our_team from './Landing_pages/Our_team.jsx';
import FAQ from './Landing_pages/FAQ.jsx';
import Stories from './Landing_pages/Stories.jsx';
import Support from './Landing_pages/Support.jsx';
import Privacy_policy from './Landing_pages/Privacy_policy.jsx';
import Terms_of_use from './Landing_pages/Terms_of_use.jsx';
import Community_page from './Landing_pages/Community_page.jsx';
import Sales_team from './Landing_pages/Sales_team.jsx';
import ScrollToTop from './Landing_pages/Scroll_to_top.jsx';
import Getting_started from './Landing_pages/Getting_started.jsx';
import Product_guidelines from './Landing_pages/Product_guidelines.jsx';
import Technical_Guidelines from './Landing_pages/Technical_Guidelines.jsx';
import Videos from './Landing_pages/Videos.jsx';

//Adminpanel Components
import Users_page from './Admin_panel/Users_page.jsx';

import Organizationdetails from './Admin_panel/Organization_details.jsx';
import Admin_course from './Admin_panel/Admin_course.jsx';
import History from './Admin_panel/History.jsx';
import Admin_documents from './Admin_panel/Admin_documents.jsx';
import Admin_report from './Admin_panel/Admin_report.jsx';
import Specific_report_page from './Admin_panel/Specific_report_page.jsx';
import Comment_report from './Admin_panel/Comment_report.jsx';
import Admin_Loginpage from './Admin_panel/Admin_login.jsx';
import Pending_data from './Admin_panel/Pending_data.jsx';
import Help_request from './Admin_panel/Help_request.jsx';

//AdminV2
import OrganizationLayout from './admin_v2/organizationadmin/components/organization-layout.jsx'
import OrganizationAuthRoute from './admin_v2/organizationadmin/components/organization-authroute.jsx';
import OrganizationNonAuthRoute from './admin_v2/organizationadmin/components/organization-nonauthroute.jsx';
import OrganizationAdminLogin from './admin_v2/organizationadmin/pages/login/login.jsx';
import OrganizationDashboard from './admin_v2/organizationadmin/pages/dashboard/dashboard.jsx';
import ManageStaffList from './admin_v2/organizationadmin/pages/managestaff/lists/staff-lists.jsx';
import ManagestaffRoles from './admin_v2/organizationadmin/pages/manageroles/lists/role-lists.jsx';
import ManagestaffProgramTypes from './admin_v2/organizationadmin/pages/ProgramType/lists/programtype-lists.jsx';
import SuperAdminLayout from './admin_v2/superadmin/components/superadmin-layout.jsx';
import SuperAdminAuthRoute from './admin_v2/superadmin/components/superadmin-authroute.jsx';
import SuperAdminNonAuthRoute from './admin_v2/superadmin/components/superadmin-nonauthroute.jsx';
import SuperAdminLogin from './admin_v2/superadmin/pages/login/login.jsx';
import SuperAdminDashboard from './admin_v2/superadmin/pages/dashboard/dashboard.jsx';
import OrganizationList from './admin_v2/superadmin/pages/organization-list/organization-list.jsx';
import OrganizationPendingRequestList from './admin_v2/superadmin/pages/organization-list-pending/organization-pending-list.jsx';
import ManageProgram from './admin_v2/organizationadmin/pages/program/program.jsx';
import ManageSubjects from './admin_v2/organizationadmin/pages/subjects/subjects.jsx';
import MyPrograms from './admin_v2/organizationadmin/pages/my-programs/my-programs.jsx';
import ProgramDetails from './admin_v2/organizationadmin/pages/my-programs/program-details/program-details.jsx';
import DocumentUpload from './admin_v2/organizationadmin/pages/my-programs/program-details/components/uplod  documents.jsx';

//Private and Protected layout
import PublicLayouts from './Layouts/PublicLayout.jsx';
import ProtectedLayout from './Layouts/PrivateLayout.jsx';
import Layout from './components/Layout.jsx';

//CSS
import './App.css';
import './style.scss';
import 'react-toastify/dist/ReactToastify.css';
import './pdf.css'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import ManageStudent from './admin_v2/organizationadmin/pages/managestudent/lists/student-lists.jsx';

window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
const tagManagerArgs = { gtmId: 'GTM-NDD6WWG7' }
TagManager.initialize(tagManagerArgs)

// export const ipaddress = "https://api.lernen-hub.de";
// export const ipaddress2 = "https://api.lernen-hub.de";
// export const ipaddress3 = "http://learnhub.constantsys.com";
// export const domain = "https://lernen-hub.de";

// export const ipaddress = process.env.REACT_APP_API_URL;
// export const ipaddress2 = process.env.REACT_APP_API_URL;
// export const domain = process.env.REACT_APP_WEB_URL;


export const ipaddress = "http://52.66.114.136";
export const ipaddress2 = "http://52.66.114.136";
export const ipaddress3 = "http://52.66.114.136";
export const domain = "http://localhost:3000";

const App = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [translated_pdf_url, settranslated_pdf_url] = useState("");
  const [language, setLanguage] = useState("en");
  console.log(window.location);
  const pathname = window.location.hash;
  const isSuperAdmin = pathname.includes('/superadmin/');
  const isOrganization = pathname.includes('/organization/');
  return (
    <div>
      <BrowserRouter>
        <ToastContainer />
        <ScrollToTop />
        {isOrganization ?
          <OrganizationLayout>
            <Routes>
              <Route element={<OrganizationNonAuthRoute />}>
                <Route path="/organization" element={<Navigate to="/organization/login" replace />} />
                <Route path="/organization/login" element={<OrganizationAdminLogin />} />
              </Route>
              <Route element={<OrganizationAuthRoute />}>
                <Route path="/organization" element={<Navigate to="/organization/dashboard" replace />} />
                <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
                <Route path="/organization/staff" element={<ManageStaffList />} />
                <Route path="/organization/student" element={<ManageStudent />} />
                <Route path="/organization/roles" element={<ManagestaffRoles />} />
                <Route path="/organization/program-types" element={<ManagestaffProgramTypes />} />
                <Route path="/organization/programs/:program_type_id" element={<ManageProgram />} />
                <Route path="/organization/subjects/:program_id" element={<ManageSubjects />} />
                <Route path="/organization/my-programs" element={<MyPrograms />} />
                <Route path="/organization/program-details/:program-id" element={<ProgramDetails />} />
                <Route path="/organization/upload-documents" element={<DocumentUpload />} />
              </Route>
            </Routes>
          </OrganizationLayout>
          :
          isSuperAdmin ?
            <SuperAdminLayout>
              <Routes>
                <Route element={<SuperAdminNonAuthRoute />}>
                  <Route path="/superadmin" element={<Navigate to="/superadmin/login" replace />} />
                  <Route path="/superadmin/login" element={<SuperAdminLogin />} />
                </Route>
                <Route element={<SuperAdminAuthRoute />}>
                  <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />
                  <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
                  <Route path="/superadmin/organization-list" element={<OrganizationList />} />
                  <Route path="/superadmin/organization-pending-request" element={<OrganizationPendingRequestList />} />

                </Route>
              </Routes>
            </SuperAdminLayout>
            :
            <Layout>
              <Routes>
                {/* -------------------------------Use For Admin Panel Access Route--------------------------------- */}
                <Route path="/user_page" element={<Users_page />} />
                <Route path="/organization_details" element={<Organizationdetails />} />
                <Route path="/pending_details" element={<Pending_data />} />
                <Route path="/help_request" element={<Help_request />} />
                <Route path="/reported_comments" element={<Comment_report />} />
                <Route path="/admin_course/:organization_id" element={<Admin_course />} />
                <Route path="/admin_documents/:course_id" element={<Admin_documents />} />
                <Route path="/admin_report" element={<Admin_report />} />
                <Route path="/our_team" element={<Our_team />} />
                <Route path="/admin_login" element={<Admin_Loginpage />} />

                {/* -------------------------------Use For Web Public Access Route------------------------------- */}
                <Route element={<PublicLayouts />}>
                  <Route path="/" element={<Landing_page />} />
                  <Route path="/loginpage" element={<Loginpage />} />
                  <Route path="/contact_us" element={<Contact_us />} />
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/sales_team" element={<Sales_team />} />
                  <Route path="/terms_of_use" element={<Terms_of_use />} />
                  <Route path="/privacy_policy" element={<Privacy_policy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/getting_started" element={<Getting_started />} />
                  <Route path="/product_guidelines" element={<Product_guidelines />} />
                  <Route path="/Technical_Guidelines" element={<Technical_Guidelines />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/community" element={<Community_page />} />
                  <Route path="/forgot_password/:pattern" element={<Forgot_password_page />} />
                  <Route path='/signuppage' element={<Signuppage />} />
                  <Route path="/adddetails" element={<Adddetails />} />
                </Route>
                <Route element={<ProtectedLayout />}>
                  <Route path="/dashboard/:data" element={<Protect Child={Dashboard} language={language} />} />
                  <Route path="/uploadpage/:course_id/:course_name" element={<Uploadpage />} />
                  <Route path="/group_upload_page/:group_id" element={<Group_document_upload />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/subjects/:course_id/:course_name" element={<Subjects />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/showpdf/:id" element={<Protect1 Child={Showpdfpage} settranslated_pdf_url={settranslated_pdf_url} />} />
                  <Route path="/profile/:user_id" element={<Profile />} />
                  <Route path="/subjects_sidebar" element={<Profile />} />
                  <Route path="/userfiles/:user_id/:value" element={<UserFiles />} />
                  <Route path="/flashcard/" element={<Flashcard />} />
                  <Route path="/create_group_flashcard" element={<Group_flashcard />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/groups/:grouptype" element={<Opengroups />} />
                  <Route path="/groups/" element={<Groups />} />
                  <Route path="/groupchat/:grouptype/:group_id" element={<Groupchat />} />
                  <Route path="/viewflashcard/:type/:id/:flashset_id" element={<Viewflashcard />} />
                  <Route path="/add_additional_flashcard/:type/:id/:flashset_id" element={<Add_additional_flashcards />} />
                  <Route path="/flashset" element={<FlashSet />} />
                  <Route path="/matchflashcard/:flashset_id" element={<Matchflashcard />} />
                  {/* <Route path="/filterflashcard/:type/:id/:flashset_id" element={<Filterflashcard />} /> */}
                  <Route path="/filterflashcard/:type/:id/:flashset_id" element={<NewFlashCard />} />
                  {/* <Route path="/newfilterflashcard/:type/:id/:flashset_id" element={<NewFlashCard />} /> */}
                  <Route path="/translatedpdf" element={<Translatedpdf url={translated_pdf_url} />} />
                  <Route path="/extracted_text/:id" element={<Extracted_text />} />
                  <Route path="/studylist/:study_list_id" element={<Studylist />} />
                  <Route path="/flashcard_studylist/:study_list_id" element={<Flashcard_studylist />} />
                  <Route path="/shareddocument/:token/" element={<Shared_document_page />} />
                  <Route path="/work_flow" element={<Work_flow />} />
                  <Route path="/history/:user_id" element={<History />} />
                  <Route path="/report/:type/:id" element={<Specific_report_page />} />
                  <Route path="/help" element={<NeedHelp />} />
                  <Route path="/success" element={<Login_message />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/map-demo" element={<MapDemo />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
        }
        {/* -------------------------------Use For Web Protected Access (Login Validate)------------------------------- */}
      </BrowserRouter>
    </div>
  )
}

export default App;