import React, { useState, useRef } from 'react';
import DynamicMeta from "./DynamicMeta";
import Landing_page2 from './Landing_page2';
import Landing_page3 from './Landing_page3';
import Landing_page4 from './Landing_page4';
import Landing_page5 from './Landing_page5';
import Footer from './Footer';
import Landing_page6 from './Landing_page6';
import Landing_page7 from './Landing_page7';
import { useNavigate } from 'react-router-dom';
import Backtotop from '../pages/Backtotop';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import CookieConsent from './CookieConsent';

const Landing_page = () => {
    const sliderRef = useRef(null);
    const [state, setState] = useState('home');
    const [layout1, setlayout1] = useState(true);
    const [layout2, setlayout2] = useState(false);
    const [layout3, setlayout3] = useState(false);
    const [layout4, setlayout4] = useState(false);
    const [layout5, setlayout5] = useState(false);
    const [heading1, setheading1] = useState("Learning");
    const [heading2, setheading2] = useState("Meterial Hub");
    const [heading3, setheading3] = useState("Let's make learning easy & accessible for everyone");
    const navigate = useNavigate()
    const settings = {
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 5000,
        cssEase: "linear",
        dots: true,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
        arrows: false
    };
    const navigateToSlide = (index) => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }
    };
    return (
        <div>
            <DynamicMeta
                title="Lernenhub"
                description="Welcome to Lernenhub"
                image="https://lernenhub-general.s3.eu-central-1.amazonaws.com/assets/Lernen83.png"
            />
            <div className='' style={{ Height: '100vh', backgroundColor: '#3C147D', overflow: 'hidden' }}>
                <div >
                    <div className="d-none d-lg-block">
                        <div className="container py-3 d-flex justify-content-between">
                            <div className="w-25">
                                <img className="img-fluid" src={require('../img/landing_page/OBJECTS (1).png')} alt="spage" />
                                <img className="ms-3 img-fluid" src={require('../img/landing_page/lernen hub.png')} alt="spage" />
                            </div>
                            <ul className="d-flex justify-content-end w-75 align-items-center gap-5" style={{ listStyleType: 'none', cursor: 'pointer' }}>
                                <li className={`list ${state === 'home' ? 'text-decoration-underline' : 'text-decoration-none'}`} onClick={() => setState('home')} style={{ color: state === 'home' ? '#5D5FE3' : '#fff' }}>Home</li>
                                <li className={`list ${state === 'new_home' ? 'text-decoration-underline' : 'text-decoration-none'}`} onClick={() => { navigate('/v2/home'); setState('new_home'); }} style={{ color: state === 'home' ? '#5D5FE3' : '#fff' }}>New Home</li>
                                <li className={`list ${state === 'about_us' ? 'text-decoration-underline' : 'text-decoration-none'}`} onClick={() => { navigate('/our_team'); setState('about_us'); }} style={{ color: state === 'about_us' ? '#5D5FE3' : '#fff' }}>About us</li>
                                <li className={`list ${state === 'stories' ? 'text-decoration-underline' : 'text-decoration-none'}`} onClick={() => { navigate('/stories'); setState('stories'); }} style={{ color: state === 'stories' ? '#5D5FE3' : '#fff' }}>Stories</li>
                                <li className={`list ${state === "faq" ? 'text-decoration-underline' : 'text-decoration-none'}`} onClick={() => { navigate('/Getting_started'); setState("Getting_started") }} style={{ color: state === "stories" ? '#5D5FE3' : '#fff' }}>FAQs</li>
                                <li className={`list ${state === 'contact_us' ? 'text-decoration-underline' : 'text-decoration-none'}`} onClick={() => { setState('contact_us'); navigate('/contact_us'); }} style={{ color: state === 'contact_us' ? '#5D5FE3' : '#fff' }}>Contact us</li>
                                <li><button onClick={() => { navigate('/loginpage'); }} className="btn list py-3 text-white bg-transparent border border-white">Login / Signup</button></li>
                            </ul>
                        </div>
                    </div>
                    <nav className="navbar bg-transparent d-block d-lg-none">
                        <div className="container d-flex justify-content-between">
                            <a className="navbar-brand" href="#"><img src={require('../img/landing_page/Group 377.png')} width={120} alt="Brand Logo" /></a>
                            <svg data-bs-toggle="offcanvas" data-bs-target="#landingpage_offcanvas" aria-controls="landingpage_offcanvas" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-justify-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </div>
                    </nav>
                </div>
                <div className="container main-land-div">
                    {/* Auto play carousel */}
                    <div className="slider-container">
                        <Slider {...settings} ref={sliderRef}>
                            <div>
                                <div className="row home-div">
                                    <div className="col-lg-6 d-flex flex-column justify-content-center">
                                        <p className="head-text m-0">Verified</p>
                                        <p className="head-text m-0">Student Community</p>
                                        <p className="sub-head m-0 mt-2">Your Campus, Your Community</p>
                                    </div>
                                    <div className="col-lg-6 ps-0 d-flex justify-content-center align-items-center">
                                        <img className="img-layout animate__animated animate__fadeIn" src={require('../img/landing_page/Group 444 (2).png')} style={{ width: '100%' }} alt="landing_page_group" />
                                    </div>
                                </div>
                                <div className="row justify-content-center align-items-center m-0 sub-land-div">
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(0)}><img className="btn-img" src={require('../img/landing_page/Group 416.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(1)}><img className="btn-img" src={require('../img/landing_page/Group 417.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(2)}><img className="btn-img" src={require('../img/landing_page/Group 418.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(3)} ><img className="btn-img" src={require('../img/landing_page/Group 419.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(4)}><img className="btn-img" src={require('../img/landing_page/Group 420.png')} alt="landing_page" /></div>
                                </div>
                            </div>
                            <div>
                                <div className="row home-div">
                                    <div className="col-lg-6 d-flex flex-column justify-content-center">
                                        <p className="head-text m-0">Private</p>
                                        <p className="head-text m-0">Student Groups</p>
                                        <p className="sub-head m-0 mt-2">Your Own Circle, Your Own Club</p>
                                    </div>
                                    <div className="col-lg-6 ps-0 d-flex justify-content-center align-items-center">
                                        <img className="img-layout animate__animated animate__fadeIn" src={require('../img/landing_page/Group 446.png')} style={{ width: '100%' }} alt="landing_page_group" />
                                    </div>
                                </div>
                                <div className="row justify-content-center align-items-center m-0 sub-land-div">
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(0)}><img className='btn-img' src={require('../img/landing_page/Group 421.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(1)}><img className='btn-img' src={require('../img/landing_page/Group 422.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(2)}><img className="btn-img" src={require('../img/landing_page/Group 418.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(3)}><img className="btn-img" src={require('../img/landing_page/Group 419.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(4)}><img className="btn-img" src={require('../img/landing_page/Group 420.png')} alt="landing_page" /></div>
                                </div>
                            </div>
                            <div>
                                <div className="row home-div">
                                    <div className="col-lg-6 d-flex flex-column justify-content-center">
                                        <p className="head-text m-0">Downloadable</p>
                                        <p className="head-text m-0">Documents</p>
                                        <p className="sub-head m-0 mt-2">Connect, Collaborate, Succeed</p>
                                    </div>
                                    <div className="col-lg-6 ps-0 d-flex justify-content-center align-items-center">
                                        <img className="img-layout animate__animated animate__fadeIn" src={require('../img/landing_page/Group 447.png')} style={{ width: '100%' }} alt="landing_page_group" />
                                    </div>
                                </div>
                                <div className="row justify-content-center align-items-center m-0 sub-land-div">
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(0)}><img className='btn-img' src={require('../img/landing_page/Group 421.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(1)}><img className="btn-img" src={require('../img/landing_page/Group 417.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(2)}><img className='btn-img' src={require('../img/landing_page/Group 434.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(3)}><img className="btn-img" src={require('../img/landing_page/Group 419.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(4)}><img className="btn-img" src={require('../img/landing_page/Group 420.png')} alt="landing_page" /></div>
                                </div>
                            </div>
                            <div>
                                <div className="row home-div">
                                    <div className="col-lg-6 d-flex flex-column justify-content-center">
                                        <p className="head-text m-0">Interact</p>
                                        <p className="head-text m-0">And Earn*</p>
                                        <p className="sub-head m-0 mt-2">Every Contribution Counts</p>
                                    </div>
                                    <div className="col-lg-6 ps-0 d-flex justify-content-center align-items-center">
                                        <img className="img-layout animate__animated animate__fadeIn" src={require('../img/landing_page//Group 448.png')} style={{ width: '100%' }} alt="landing_page_group" />
                                    </div>
                                </div>
                                <div className="row justify-content-center align-items-center m-0 sub-land-div">
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(0)}><img className='btn-img' src={require('../img/landing_page/Group 421.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(1)}><img className="btn-img" src={require('../img/landing_page/Group 417.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(2)}><img className="btn-img" src={require('../img/landing_page/Group 418.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(3)}><img className='btn-img' src={require('../img/landing_page/Group 428.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(4)}><img className="btn-img" src={require('../img/landing_page/Group 420.png')} alt="landing_page" /></div>
                                </div>
                            </div>
                            <div>
                                <div className="row home-div">
                                    <div className="col-lg-6 d-flex flex-column justify-content-center">
                                        <p className="head-text m-0">Free Signup</p>
                                        <p className="head-text m-0">Platform</p>
                                        <p className="sub-head m-0 mt-2">Get in, We're all here!</p>
                                    </div>
                                    <div className="col-lg-6 ps-0 d-flex justify-content-center align-items-center">
                                        <img className="img-layout animate__animated animate__fadeIn" src={require('../img/landing_page/Group 449.png')} style={{ width: '100%' }} alt="landing_page_group" />
                                    </div>
                                </div>
                                <div className="row justify-content-center align-items-center m-0 sub-land-div">
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(0)}> <img className='btn-img' src={require('../img/landing_page/Group 421.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(1)}> <img className="btn-img" src={require('../img/landing_page/Group 417.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(2)}> <img className="btn-img" src={require('../img/landing_page/Group 418.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(3)}> <img className="btn-img" src={require('../img/landing_page/Group 419.png')} alt="landing_page" /></div>
                                    <div className="col-2 cursor" onClick={() => navigateToSlide(4)}> <img className='btn-img' src={require('../img/landing_page/Group 411.png')} alt="landing_page" /></div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
            {/* ----------------------------section 2 --------------------- */}
            <div id="landingpage_offcanvas" className="offcanvas offcanvas-end d-sm-block d-lg-none d-xl-none overflow-hidden" tabIndex="-1" aria-labelledby="offcanvasExampleLabel" data-bs-scroll="false" data-bs-backdrop="false">
                <div className="offcanvas-header d-flex align-items-center">
                    <img src={require('../img/landing_page/Group 385.png')} width={120} alt="spage" />
                    <svg data-bs-dismiss="offcanvas" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>
                </div>
                <div className="offcanvas-body">
                    <div className="pb-5">
                        <ul className="nav flex-column gap-3 text-start ps-0 mt-4">
                            <li className="nav-item">
                                <Link to='/' className="nav-link d-flex align-items-center">
                                    <span className="fw-medium" style={{ color: '#5d5fe3' }}><i className="fa-solid fa-house me-3" style={{ color: '#5d5fe3' }}></i>Home</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a onClick={() => { navigate('/our_team') }} className="nav-link" type="button">
                                    <span className="fw-medium" style={{ color: '#5d5fe3' }}><i className="fa-solid fa-user me-3" style={{ color: '#5d5fe3' }}></i>About Us</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <Link to='/stories' className="nav-link">
                                    <span className="fw-medium" style={{ color: '#5d5fe3' }}><i className="fa-solid fa-heart me-3" style={{ color: '#5d5fe3' }}></i>Stories</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/Getting_started' className="nav-link">
                                    <span className="fw-medium" style={{ color: '#5d5fe3' }}><i className="fa-solid fa fa-file me-3" style={{ color: '#5d5fe3' }}></i>FAQs</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/contact_us' className="nav-link">
                                    <span className="fw-medium" style={{ color: '#5d5fe3' }}><i className="fa-solid fa-phone me-3" style={{ color: '#5d5fe3' }}></i>Contact Us</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/loginpage' className="nav-link">
                                    <span className="fw-medium" style={{ color: '#5d5fe3' }}><i className="fa-solid fa-arrow-right me-3" style={{ color: '#5d5fe3' }}></i>Login / Sign-up</span></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* -----------------------------------------------------Landing page 6------------------------------------------------- */}
            <Landing_page6 />
            {/* -----------------------------------------------------Landing page 2------------------------------------------------- */}
            {/* -----------------------------------------------------Landing page 3------------------------------------------------- */}
            <Landing_page3 />
            {/* -----------------------------------------------------Landing page 4------------------------------------------------- */}
            <Landing_page4 />
            {/* -----------------------------------------------------Landing page 5------------------------------------------------- */}
            <Landing_page5 />
            <Landing_page2 />
            <Landing_page7 />
            {/* -----------------------------------------------------Footer------------------------------------------------- */}
            <Footer />
            <CookieConsent></CookieConsent>
            <Backtotop />
        </div >
    )
}
export default Landing_page;