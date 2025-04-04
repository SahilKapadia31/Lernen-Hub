import React from 'react'
import Landing_page_navbar from './Landing_page_navbar'
import Collapse from 'react-bootstrap/Collapse';
import { useState } from 'react';
import Footer from './Footer';
import Backtotop from '../pages/Backtotop';
import { useNavigate } from 'react-router-dom';

const Community_page = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);
  const [open7, setOpen7] = useState(false);
  const [open8, setOpen8] = useState(false);

  return (
    <div>
      <Landing_page_navbar />
      <div className='mt-3 row m-0 px-2 px-md-5 justify-content-center faq-div py-4 py-md-3' style={{ backgroundColor: '#F3F0FF' }}>
        <div className='col-6 col-md-2 d-flex flex-column align-items-center justify-content-center'>
          <img src={require('../img/landing_page/Group 405.png')} alt="community" />
          <p onClick={() => { navigate('/getting_started') }} style={{ fontSize: '17px', color: '#2A3941', cursor: 'pointer' }} className='our-team-text4 mt-2'>Getting Started</p>
        </div>
        <div className='col-6 col-md-2 d-flex flex-column align-items-center justify-content-center'>
          <img src={require('../img/landing_page/Group 404.png')} alt="community" />
          <p onClick={() => { navigate('/product_guidelines') }} style={{ fontSize: '17px', color: '#2A3941', cursor: 'pointer' }} className='our-team-text4 mt-2'>Product Guides</p>
        </div>
        <div className='col-6 col-md-2 d-flex flex-column align-items-center justify-content-center'>
          <img src={require('../img/landing_page/Group 403.png')} alt="community" />
          <p onClick={() => { navigate('/faq') }} style={{ fontSize: '17px', color: '#2A3941', cursor: 'pointer' }} className='our-team-text4 mt-2'>Help & FAQs</p>
        </div>
        <div className='col-6 col-md-2 d-flex flex-column align-items-center justify-content-center'>
          <img src={require('../img/landing_page/Group 402.png')} alt="community" />
          <p onClick={() => { navigate('/Technical_Guidelines') }} style={{ fontSize: '17px', color: '#2A3941', cursor: 'pointer' }} className='our-team-text4 mt-2'>Technical Guides</p>
        </div>
        <div className='col-6 col-md-2 d-flex flex-column align-items-center justify-content-center'>
          <img src={require('../img/landing_page/Group 400.png')} alt="community" />
          <p onClick={() => { navigate('/community') }} style={{ fontSize: '17px', color: '#5d5fe3', cursor: 'pointer', borderBottom: '2px solid #5d5fe3' }} className='our-team-text4 mt-2'>Community</p>
        </div>
      </div>

      <div className='pb-5' style={{ backgroundColor: '#F9F9FB' }}>
        <div className='container'>
          <div className='py-3 pt-4'>
            <p className='privacy-policy-head2'>Respect and Inclusion</p>
            <div>
              <p className='d-flex justify-content-between border-bottom align-items-center m-0 border-top py-3' style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}><span className='privacy-policy-text'>How do public groups work?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M14.375 20.625H15.625V15.625H20.625V14.375H15.625V9.375H14.375V14.375H9.375V15.625H14.375V20.625ZM15.0041 26.25C13.4484 26.25 11.9858 25.9548 10.6163 25.3644C9.24687 24.774 8.05562 23.9727 7.0425 22.9606C6.02938 21.9485 5.2274 20.7583 4.63656 19.39C4.04552 18.0219 3.75 16.5599 3.75 15.0041C3.75 13.4484 4.04521 11.9858 4.63562 10.6162C5.22604 9.24687 6.02729 8.05562 7.03937 7.0425C8.05146 6.02937 9.24167 5.2274 10.61 4.63656C11.9781 4.04552 13.4401 3.75 14.9959 3.75C16.5516 3.75 18.0142 4.04521 19.3838 4.63563C20.7531 5.22604 21.9444 6.02729 22.9575 7.03938C23.9706 8.05146 24.7726 9.24167 25.3634 10.61C25.9545 11.9781 26.25 13.4401 26.25 14.9959C26.25 16.5516 25.9548 18.0142 25.3644 19.3837C24.774 20.7531 23.9727 21.9444 22.9606 22.9575C21.9485 23.9706 20.7583 24.7726 19.39 25.3634C18.0219 25.9545 16.5599 26.25 15.0041 26.25ZM15 25C17.7917 25 20.1562 24.0312 22.0938 22.0938C24.0312 20.1562 25 17.7917 25 15C25 12.2083 24.0312 9.84375 22.0938 7.90625C20.1562 5.96875 17.7917 5 15 5C12.2083 5 9.84375 5.96875 7.90625 7.90625C5.96875 9.84375 5 12.2083 5 15C5 17.7917 5.96875 20.1562 7.90625 22.0938C9.84375 24.0312 12.2083 25 15 25Z" fill="#5D5FE3" />
                </svg></span></p>
              <p></p>
              <Collapse in={open}>
                <div id="example-collapse-text">
                  Public groups are organized by city, allowing students from different universities in the same area to collaborate and discuss. It’s like a local study jam with people who understand your academic struggles.
                </div>
              </Collapse>
            </div>
            <div>
              <p className='d-flex justify-content-between border-bottom align-items-center m-0 border-top py-3' style={{ cursor: 'pointer' }} onClick={() => setOpen2(!open2)}
                aria-controls="example-collapse-text"
                aria-expanded={open2}><span className='privacy-policy-text'>How do private groups work?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M14.375 20.625H15.625V15.625H20.625V14.375H15.625V9.375H14.375V14.375H9.375V15.625H14.375V20.625ZM15.0041 26.25C13.4484 26.25 11.9858 25.9548 10.6163 25.3644C9.24687 24.774 8.05562 23.9727 7.0425 22.9606C6.02938 21.9485 5.2274 20.7583 4.63656 19.39C4.04552 18.0219 3.75 16.5599 3.75 15.0041C3.75 13.4484 4.04521 11.9858 4.63562 10.6162C5.22604 9.24687 6.02729 8.05562 7.03937 7.0425C8.05146 6.02937 9.24167 5.2274 10.61 4.63656C11.9781 4.04552 13.4401 3.75 14.9959 3.75C16.5516 3.75 18.0142 4.04521 19.3838 4.63563C20.7531 5.22604 21.9444 6.02729 22.9575 7.03938C23.9706 8.05146 24.7726 9.24167 25.3634 10.61C25.9545 11.9781 26.25 13.4401 26.25 14.9959C26.25 16.5516 25.9548 18.0142 25.3644 19.3837C24.774 20.7531 23.9727 21.9444 22.9606 22.9575C21.9485 23.9706 20.7583 24.7726 19.39 25.3634C18.0219 25.9545 16.5599 26.25 15.0041 26.25ZM15 25C17.7917 25 20.1562 24.0312 22.0938 22.0938C24.0312 20.1562 25 17.7917 25 15C25 12.2083 24.0312 9.84375 22.0938 7.90625C20.1562 5.96875 17.7917 5 15 5C12.2083 5 9.84375 5.96875 7.90625 7.90625C5.96875 9.84375 5 12.2083 5 15C5 17.7917 5.96875 20.1562 7.90625 22.0938C9.84375 24.0312 12.2083 25 15 25Z" fill="#5D5FE3" />
                </svg></span></p>
              <p></p>
              <Collapse in={open2}>
                <div id="example-collapse-text">
                  Private groups are like study clubs—you create them, and only people with the group ID can join. Share notes, discuss topics, and create flashcards with your own handpicked crew!
                </div>
              </Collapse>
            </div>
          </div>
          <div className='py-3'>
            <p className='privacy-policy-head2'>Content Standards</p>
            <div>
              <p className='d-flex justify-content-between border-bottom align-items-center m-0 border-top py-3' style={{ cursor: 'pointer' }} onClick={() => setOpen3(!open3)}
                aria-controls="example-collapse-text"
                aria-expanded={open3}><span className='privacy-policy-text'>What happens when I create a new subject or public group?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M14.375 20.625H15.625V15.625H20.625V14.375H15.625V9.375H14.375V14.375H9.375V15.625H14.375V20.625ZM15.0041 26.25C13.4484 26.25 11.9858 25.9548 10.6163 25.3644C9.24687 24.774 8.05562 23.9727 7.0425 22.9606C6.02938 21.9485 5.2274 20.7583 4.63656 19.39C4.04552 18.0219 3.75 16.5599 3.75 15.0041C3.75 13.4484 4.04521 11.9858 4.63562 10.6162C5.22604 9.24687 6.02729 8.05562 7.03937 7.0425C8.05146 6.02937 9.24167 5.2274 10.61 4.63656C11.9781 4.04552 13.4401 3.75 14.9959 3.75C16.5516 3.75 18.0142 4.04521 19.3838 4.63563C20.7531 5.22604 21.9444 6.02729 22.9575 7.03938C23.9706 8.05146 24.7726 9.24167 25.3634 10.61C25.9545 11.9781 26.25 13.4401 26.25 14.9959C26.25 16.5516 25.9548 18.0142 25.3644 19.3837C24.774 20.7531 23.9727 21.9444 22.9606 22.9575C21.9485 23.9706 20.7583 24.7726 19.39 25.3634C18.0219 25.9545 16.5599 26.25 15.0041 26.25ZM15 25C17.7917 25 20.1562 24.0312 22.0938 22.0938C24.0312 20.1562 25 17.7917 25 15C25 12.2083 24.0312 9.84375 22.0938 7.90625C20.1562 5.96875 17.7917 5 15 5C12.2083 5 9.84375 5.96875 7.90625 7.90625C5.96875 9.84375 5 12.2083 5 15C5 17.7917 5.96875 20.1562 7.90625 22.0938C9.84375 24.0312 12.2083 25 15 25Z" fill="#5D5FE3" />
                </svg></span></p>
              <p></p>
              <Collapse in={open3} className='pb-3'>
                <div id="example-collapse-text"> It goes to our admin team for a quick validation to make sure it’s not a duplicate or something random (like a group dedicated to &quot;The Art of Procrastination&quot;... unless it’s academic). For more on content creation, visit our Terms and Conditions.
                </div>
              </Collapse>
            </div>
          </div>
          <div className='py-3'>
            <p className='privacy-policy-head2'>Networking Opportunities</p>
            <div>
              <p className='d-flex justify-content-between border-bottom align-items-center m-0 border-top py-3' style={{ cursor: 'pointer' }} onClick={() => setOpen5(!open5)}
                aria-controls="example-collapse-text"
                aria-expanded={open5}><span className='privacy-policy-text'>Can I collaborate with students from other universities?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M14.375 20.625H15.625V15.625H20.625V14.375H15.625V9.375H14.375V14.375H9.375V15.625H14.375V20.625ZM15.0041 26.25C13.4484 26.25 11.9858 25.9548 10.6163 25.3644C9.24687 24.774 8.05562 23.9727 7.0425 22.9606C6.02938 21.9485 5.2274 20.7583 4.63656 19.39C4.04552 18.0219 3.75 16.5599 3.75 15.0041C3.75 13.4484 4.04521 11.9858 4.63562 10.6162C5.22604 9.24687 6.02729 8.05562 7.03937 7.0425C8.05146 6.02937 9.24167 5.2274 10.61 4.63656C11.9781 4.04552 13.4401 3.75 14.9959 3.75C16.5516 3.75 18.0142 4.04521 19.3838 4.63563C20.7531 5.22604 21.9444 6.02729 22.9575 7.03938C23.9706 8.05146 24.7726 9.24167 25.3634 10.61C25.9545 11.9781 26.25 13.4401 26.25 14.9959C26.25 16.5516 25.9548 18.0142 25.3644 19.3837C24.774 20.7531 23.9727 21.9444 22.9606 22.9575C21.9485 23.9706 20.7583 24.7726 19.39 25.3634C18.0219 25.9545 16.5599 26.25 15.0041 26.25ZM15 25C17.7917 25 20.1562 24.0312 22.0938 22.0938C24.0312 20.1562 25 17.7917 25 15C25 12.2083 24.0312 9.84375 22.0938 7.90625C20.1562 5.96875 17.7917 5 15 5C12.2083 5 9.84375 5.96875 7.90625 7.90625C5.96875 9.84375 5 12.2083 5 15C5 17.7917 5.96875 20.1562 7.90625 22.0938C9.84375 24.0312 12.2083 25 15 25Z" fill="#5D5FE3" />
                </svg></span></p>
              <p></p>
              <Collapse in={open5}>
                <div id="example-collapse-text">
                  Absolutely! The platform connects students globally for collaboration under the public group communities.
                </div>
              </Collapse>
            </div>
            <div>
              <p className='d-flex justify-content-between border-bottom align-items-center m-0 border-top py-3' style={{ cursor: 'pointer' }} onClick={() => setOpen6(!open6)}
                aria-controls="example-collapse-text"
                aria-expanded={open6}><span className='privacy-policy-text'>How do I join special interest groups?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M14.375 20.625H15.625V15.625H20.625V14.375H15.625V9.375H14.375V14.375H9.375V15.625H14.375V20.625ZM15.0041 26.25C13.4484 26.25 11.9858 25.9548 10.6163 25.3644C9.24687 24.774 8.05562 23.9727 7.0425 22.9606C6.02938 21.9485 5.2274 20.7583 4.63656 19.39C4.04552 18.0219 3.75 16.5599 3.75 15.0041C3.75 13.4484 4.04521 11.9858 4.63562 10.6162C5.22604 9.24687 6.02729 8.05562 7.03937 7.0425C8.05146 6.02937 9.24167 5.2274 10.61 4.63656C11.9781 4.04552 13.4401 3.75 14.9959 3.75C16.5516 3.75 18.0142 4.04521 19.3838 4.63563C20.7531 5.22604 21.9444 6.02729 22.9575 7.03938C23.9706 8.05146 24.7726 9.24167 25.3634 10.61C25.9545 11.9781 26.25 13.4401 26.25 14.9959C26.25 16.5516 25.9548 18.0142 25.3644 19.3837C24.774 20.7531 23.9727 21.9444 22.9606 22.9575C21.9485 23.9706 20.7583 24.7726 19.39 25.3634C18.0219 25.9545 16.5599 26.25 15.0041 26.25ZM15 25C17.7917 25 20.1562 24.0312 22.0938 22.0938C24.0312 20.1562 25 17.7917 25 15C25 12.2083 24.0312 9.84375 22.0938 7.90625C20.1562 5.96875 17.7917 5 15 5C12.2083 5 9.84375 5.96875 7.90625 7.90625C5.96875 9.84375 5 12.2083 5 15C5 17.7917 5.96875 20.1562 7.90625 22.0938C9.84375 24.0312 12.2083 25 15 25Z" fill="#5D5FE3" />
                </svg></span></p>
              <p></p>
              <Collapse in={open6}>
                <div id="example-collapse-text">Search for groups by keyword or browse categories to find ones that match your interests.</div>
              </Collapse>
            </div>
          </div>
          <div className='py-3'>
            <p className='privacy-policy-head2'>Contribution to the Community</p>
            <div>
              <p className='d-flex justify-content-between border-bottom align-items-center m-0 border-top py-3' style={{ cursor: 'pointer' }} onClick={() => setOpen7(!open7)}
                aria-controls="example-collapse-text"
                aria-expanded={open7}><span className='privacy-policy-text'>How do I report inappropriate content?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M14.375 20.625H15.625V15.625H20.625V14.375H15.625V9.375H14.375V14.375H9.375V15.625H14.375V20.625ZM15.0041 26.25C13.4484 26.25 11.9858 25.9548 10.6163 25.3644C9.24687 24.774 8.05562 23.9727 7.0425 22.9606C6.02938 21.9485 5.2274 20.7583 4.63656 19.39C4.04552 18.0219 3.75 16.5599 3.75 15.0041C3.75 13.4484 4.04521 11.9858 4.63562 10.6162C5.22604 9.24687 6.02729 8.05562 7.03937 7.0425C8.05146 6.02937 9.24167 5.2274 10.61 4.63656C11.9781 4.04552 13.4401 3.75 14.9959 3.75C16.5516 3.75 18.0142 4.04521 19.3838 4.63563C20.7531 5.22604 21.9444 6.02729 22.9575 7.03938C23.9706 8.05146 24.7726 9.24167 25.3634 10.61C25.9545 11.9781 26.25 13.4401 26.25 14.9959C26.25 16.5516 25.9548 18.0142 25.3644 19.3837C24.774 20.7531 23.9727 21.9444 22.9606 22.9575C21.9485 23.9706 20.7583 24.7726 19.39 25.3634C18.0219 25.9545 16.5599 26.25 15.0041 26.25ZM15 25C17.7917 25 20.1562 24.0312 22.0938 22.0938C24.0312 20.1562 25 17.7917 25 15C25 12.2083 24.0312 9.84375 22.0938 7.90625C20.1562 5.96875 17.7917 5 15 5C12.2083 5 9.84375 5.96875 7.90625 7.90625C5.96875 9.84375 5 12.2083 5 15C5 17.7917 5.96875 20.1562 7.90625 22.0938C9.84375 24.0312 12.2083 25 15 25Z" fill="#5D5FE3" />
                </svg></span></p>
              <p></p>
              <Collapse in={open7}>
                <div id="example-collapse-text">
                  Click on the "Report" button near the content to notify our moderation team. Also, Yes, visit the user's profile and select "Report User. Your reports are confidential, and your identity will not be disclosed to the reported party.
                </div>
              </Collapse>
            </div>
          </div>
          <div className='py-3'>
            <p className='privacy-policy-head2'>Recognition and Rewards</p>
            <div>
              <p className='d-flex justify-content-between border-bottom align-items-center m-0 border-top py-3' style={{ cursor: 'pointer' }} onClick={() => setOpen8(!open8)}
                aria-controls="example-collapse-text"
                aria-expanded={open8}><span className='privacy-policy-text'>Does the platform offer any rewards for active participation?.</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M14.375 20.625H15.625V15.625H20.625V14.375H15.625V9.375H14.375V14.375H9.375V15.625H14.375V20.625ZM15.0041 26.25C13.4484 26.25 11.9858 25.9548 10.6163 25.3644C9.24687 24.774 8.05562 23.9727 7.0425 22.9606C6.02938 21.9485 5.2274 20.7583 4.63656 19.39C4.04552 18.0219 3.75 16.5599 3.75 15.0041C3.75 13.4484 4.04521 11.9858 4.63562 10.6162C5.22604 9.24687 6.02729 8.05562 7.03937 7.0425C8.05146 6.02937 9.24167 5.2274 10.61 4.63656C11.9781 4.04552 13.4401 3.75 14.9959 3.75C16.5516 3.75 18.0142 4.04521 19.3838 4.63563C20.7531 5.22604 21.9444 6.02729 22.9575 7.03938C23.9706 8.05146 24.7726 9.24167 25.3634 10.61C25.9545 11.9781 26.25 13.4401 26.25 14.9959C26.25 16.5516 25.9548 18.0142 25.3644 19.3837C24.774 20.7531 23.9727 21.9444 22.9606 22.9575C21.9485 23.9706 20.7583 24.7726 19.39 25.3634C18.0219 25.9545 16.5599 26.25 15.0041 26.25ZM15 25C17.7917 25 20.1562 24.0312 22.0938 22.0938C24.0312 20.1562 25 17.7917 25 15C25 12.2083 24.0312 9.84375 22.0938 7.90625C20.1562 5.96875 17.7917 5 15 5C12.2083 5 9.84375 5.96875 7.90625 7.90625C5.96875 9.84375 5 12.2083 5 15C5 17.7917 5.96875 20.1562 7.90625 22.0938C9.84375 24.0312 12.2083 25 15 25Z" fill="#5D5FE3" />
                </svg></span></p>
              <p></p>
              <Collapse in={open8}>
                <div id="example-collapse-text">Yes, users can earn badges and recognition for contributions like sharing valuable content and helping others.</div>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Backtotop />
    </div>
  )
}
export default Community_page;