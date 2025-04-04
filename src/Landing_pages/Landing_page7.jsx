import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import Framer Motion for animations

const Landing_page7 = () => {
  const navigate = useNavigate();

  return (
    <div className='py-4' style={{ background: '#F3F0FF' }}>
      <div className='container py-5'>
        <div className="row" style={{ height: '100%' }}>

          {/* Left Section: How to Sign Up */}
          <motion.div
            className="col-lg-6 d-flex flex-column align-items-start justify-content-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p className='page6-head m-0'
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ fontWeight: 'bold', fontSize: '3.5rem', color: '#5d5fe3' }}
            >
              Signup  ...
            </motion.p>

            <h2 className='mb-4' style={{ fontWeight: 'bold', fontSize: '2.5rem', color: '#5d5fe3' }}>
              Organization Students Only
            </h2>
            <ul style={{ color: '#333', fontSize: '1.1rem' }}>
              <li className='mb-3'>
                <strong>Step 1:</strong> Click on the
                <a href="https://lernen-hub.de/signuppage" style={{ color: '#5d5fe3', textDecoration: 'none' }}>
                  “Signup Now”
                </a> button below.
              </li>
              <li className='mb-3'><strong>Step 2:</strong> Enter your Organization Email id</li>
              <li className='mb-3'><strong>Step 3:</strong> Confirm your email via OTP</li>
              <li className='mb-3'><strong>Step 4:</strong> Select your Study Program</li>
              <li className='mb-3'><strong>Step 5:</strong> Log in to start using the platform and access all features!</li>
            </ul>

            <motion.button
              className='btn text-white py-3 px-4 mt-5'
              style={{ backgroundColor: '#5d5fe3', borderRadius: '5px', fontSize: '1.2rem' }}
              onClick={() => { navigate('/signuppage') }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Signup Now
            </motion.button>
          </motion.div>

          {/* Right Section: Benefits of Signing Up */}
          <motion.div
            className="col-lg-6 mt-5 mt-lg-0 bg-white p-4"
            style={{ border: '0.5px solid #5d5fe3', borderRadius: '10px' }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >

            <div className='h-100 px-2 py-2' style={{ backgroundColor: '#F3F0FF' }}>
              {[
                {
                  img: 'computer (1) 1.png',
                  title: 'Ad-Free Learning',
                  description: 'Study more efficiently without interruptions. Zero ads, zero distractions.'
                },
                {
                  img: 'sync (1) 1.png',
                  title: 'Document Access',
                  description: 'Download your study materials anytime, anywhere. Study offline and stay ahead.'
                },
                {
                  img: 'detective (1) 1.png',
                  title: 'Anonymous Posting',
                  description: 'Speak freely, share boldly. Post anonymously and engage in genuine peer-to-peer learning.'
                },
                /*{
                  img: 'euro (1) 1.png',
                  title: 'Full Refund* on Course Completion',
                  description: 'Complete your course within the official period, and receive a full refund. Commit to your success, risk-free!'
                },*/
                {
                  img: 'group 1.png',
                  title: 'City Group Exposure',
                  description: 'Expand your study network. Connect with peers across cities and exchange diverse insights.'
                },
                {
                  img: 'chat (1) 1.png',
                  title: 'Private Study Groups',
                  description: 'Study better together. Create private groups and conquer academic challenges with friends.'
                }
              ].map((item, index) => (
                <motion.div
                  className='row m-0 py-3 pb-4'
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="col-2 d-flex align-items-center">
                    <img src={require(`../img/landing_page/${item.img}`)} alt={item.title} style={{ width: '40px', height: '40px' }} />
                  </div>
                  <div className="col-10">
                    <p className='page6-subdiv-head m-0' style={{ fontWeight: 'bold', color: '#5d5fe3' }}>{item.title}</p>
                    <span className='page6-subdiv-text' style={{ color: '#333' }}>{item.description}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Landing_page7;
