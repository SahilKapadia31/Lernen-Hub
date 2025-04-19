import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom/dist';
import LoginpageDialog from '../login/loginDialog';
import { getDecryptedData, setEncryptedData } from '../../../utils/helperFunctions';
import axiosInstance from '../../../pages/axiosInstance';
import { ipaddress3 } from '../../../App';
import logo_blue from "../../../assets/svg/logo-blue.svg";
import logo_white from "../../../assets/svg/logo-white.svg"
export const Navbar = ({ background, activeHeader }) => {
    const user = JSON.parse(getDecryptedData('user'));

    const [showLogin, setShowLogin] = useState(false);
    const [active, setActive] = useState('home');
    const [scrolled, setScrolled] = useState(false);

    const navigate = useNavigate();

    // Add scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            // Change navbar style after scrolling 100px
            if (window.scrollY > 300) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleNavigation = (path, key) => {
        setActive(key);
        navigate(path);
    };

    const navItems = [
        { label: 'Universities', key: 'universities', path: '/' },
        { label: 'Schools', key: 'schools', path: '/v2/home/schools' },
        { label: 'Coaching Centres', key: 'coaching_centres', path: '/v2/home/coaching_centres' },
        { label: 'Tutors', key: 'tutors', path: '/v2/home/tutors' },
    ];


    // Navbar style based on scroll position
    const navbarStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled || activeHeader ? '#fff' : '#282088', // Change background color based on scroll
        borderBottom: scrolled || activeHeader ? '1px solid #ccc' : 'none',
        // boxShadow: scrolled || activeHeader ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
    };

    // Text and button styles based on scroll position
    const textStyle = {
        color: scrolled || activeHeader ? '#5D5FE3' : '#fff',
        transition: 'color 0.3s ease',
    };

    const buttonStyle = {
        backgroundColor: scrolled || activeHeader ? '#4547C9' : 'transparent',
        borderColor: scrolled || activeHeader ? '#5D5FE3' : '#fff',
        color: scrolled || activeHeader ? '#fff' : '#fff',
        transition: 'all 0.3s ease',
    };

    const handleLogout = () => {
        localStorage.clear()
        window.location.href = "/"
    }

    const getUserProfile = async () => {
        try {
            const response = await axiosInstance.get(`${ipaddress3}/auth/getUserProfile/`);
            console.log(response);

        } catch (err) {
            console.log('Error in getUserProfile', err);
        }
    }

    useEffect(() => {
        if (user) {
            getUserProfile();
        }
    }, [user])

    const handleSelectUniverisity = (selectedUniversity) => {
        //navigate('/#/dashboard/page')
    }

    return (
        <>
            {/* Desktop Navbar */}
            <div className="d-none d-lg-block" style={navbarStyle}>
                <div className="container">
                    <div className="py-3 d-flex justify-content-between align-items-center" style={{ height: '5rem' }}>
                        <div className="d-flex align-items-center" onClick={() => navigate('/')}>
                            {
                                (scrolled || activeHeader) ?
                                    <img src={logo_blue} />
                                    :
                                    <img src={logo_white} />
                            }
                        </div>
                        <ul className="d-flex justify-content-end align-items-center gap-5"
                            style={{ listStyleType: 'none', cursor: 'pointer', margin: 0, padding: 0 }}
                        >
                            {navItems.map(item => (
                                <li
                                    key={item.key}
                                    className={`list ${active === item.key ? 'text-decoration-underline' : 'text-decoration-none'}`}
                                    onClick={() => handleNavigation(item.path, item.key)}
                                    style={{
                                        ...textStyle,
                                        color: active === item.key ? '#5D5FE3' : (scrolled || activeHeader ? '#333' : '#fff')
                                    }}
                                >
                                    {item.label}
                                </li>
                            ))}
                            <li>
                            </li>
                        </ul>
                        <div className="d d-flex gap-4 align-items-center">
                            <i className="bi bi-search fs-4" style={{ ...textStyle, color: (scrolled || activeHeader ? '#4547C9' : '#fff') }}></i>
                            {!user ?
                                <button onClick={() => setShowLogin(true)} className={`btn py-2 px-4 border ${(scrolled || activeHeader ? '#4547C9' : 'border-white bg-transparent')}`}
                                    style={{ ...textStyle, background: (scrolled || activeHeader ? '#4547C9' : '#fff'), color: (scrolled || activeHeader ? '#fff' : '#fff') }}>
                                    Log In
                                </button>
                                :
                                <div>
                                    <a href="#" class="nav-link dropdown-toggle no-caret py-0 pe-0 " role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src="https://mimity-admin904.netlify.app/assets/img/user/user1.svg" width="32" alt="User" class="rounded-circle" loading="lazy" />
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-start" >
                                        <li className='text-capitalize px-3'>{user.first_name}</li>
                                        <li>
                                            <div class="dropdown-divider"></div>
                                        </li>
                                        {user?.organizations && user.organizations.length > 0 && (<li className='text-capitalize px-3 fw-bold'>{'Joined University'}</li>)}
                                        {user?.organizations && user.organizations.length > 0 &&
                                            user?.organizations.map(item =>
                                                <li><Link class="dropdown-item" to={'/dashboard/page'} onClick={() => {
                                                    setEncryptedData('SELECTED_UNIVERSITY', item, 180);
                                                }}>{item?.university_name}</Link></li>
                                            )}
                                        <li>
                                            <div class="dropdown-divider"></div>
                                        </li>
                                        <li><a class="dropdown-item" onClick={handleLogout}>Sign out</a></li>
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navbar */}
            <nav className="navbar d-block d-lg-none" style={{
                ...navbarStyle,
                backgroundColor: scrolled || activeHeader ? '#fff' : '#2e1a91',
            }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <Link className="navbar-brand">
                        <img src={require('../../../img/landing_page/Group 377.png')} width={120} alt="Brand Logo" />
                    </Link>
                    <svg
                        data-bs-toggle="offcanvas"
                        data-bs-target="#landingpage_offcanvas"
                        aria-controls="landingpage_offcanvas"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill={scrolled || activeHeader ? '#333' : '#fff'}
                        className="bi bi-justify-right"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
                        />
                    </svg>
                </div>
            </nav>

            <LoginpageDialog
                show={showLogin}
                handleClose={() => setShowLogin(false)}
            />
            {/* Offcanvas Menu (No changes needed here) */}
            <div id="landingpage_offcanvas" className="offcanvas offcanvas-end d-sm-block d-lg-none d-xl-none overflow-hidden" tabIndex="-1" aria-labelledby="offcanvasExampleLabel" data-bs-scroll="false" data-bs-backdrop="false">
                <div className="offcanvas-header d-flex align-items-center">
                    <img src={require('../../../img/landing_page/Group 385.png')} width={120} alt="spage" />
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

            {/* Add padding to body content to prevent navbar overlap */}
            <div style={{ paddingTop: '5rem' }}></div>
        </>
    );
};
