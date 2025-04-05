import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [active, setActive] = useState('home');
    const headerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Only add the scroll event listener on larger screens
        if (window.innerWidth > 991 && headerRef.current) {
            const updateScroll = () => {
                const windowScrollTop = window.pageYOffset / 3;
                headerRef.current.style.transform = `translate3d(0, ${windowScrollTop}px, 0)`;
            };

            window.addEventListener('scroll', updateScroll);
            return () => window.removeEventListener('scroll', updateScroll);
        }
    }, []); // Empty dependency array to run only once on mount

    const handleNavigation = (path, key) => {
        setActive(key);
        navigate(path);
    };

    const navItems = [
        { label: 'Home', key: 'home', path: '/' },
        { label: 'New Home', key: 'new_home', path: '/v2/home' },
        { label: 'About us', key: 'about_us', path: '/our_team' },
        { label: 'Stories', key: 'stories', path: '/stories' },
        { label: 'FAQs', key: 'faq', path: '/Getting_started' },
        { label: 'Contact us', key: 'contact_us', path: '/contact_us' },
    ];

    return (
        <div ref={headerRef} style={{ height: '100vh', backgroundColor: '#3C147D', overflow: 'hidden' }}>
            {/* Desktop Navbar */}
            <div className="d-none d-lg-block">
                <div className="container py-3 d-flex justify-content-between align-items-center">
                    <div className="w-25 d-flex align-items-center">
                        <img className="img-fluid" src={require('../../../img/landing_page/OBJECTS(1).png')} alt="Logo" />
                        <img className="ms-3 img-fluid" src={require('../../../img/landing_page/lernen hub.png')} alt="Logo" />
                    </div>
                    <ul
                        className="d-flex justify-content-end w-75 align-items-center gap-5"
                        style={{ listStyleType: 'none', cursor: 'pointer', margin: 0, padding: 0 }}
                    >
                        {navItems.map(item => (
                            <li
                                key={item.key}
                                className={`list ${active === item.key ? 'text-decoration-underline' : 'text-decoration-none'}`}
                                onClick={() => handleNavigation(item.path, item.key)}
                                style={{ color: active === item.key ? '#5D5FE3' : '#fff' }}
                            >
                                {item.label}
                            </li>
                        ))}
                        <li>
                            <button onClick={() => navigate('/loginpage')} className="btn list py-3 text-white bg-transparent border border-white">
                                Login / Signup
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile Navbar */}
            <nav className="navbar bg-transparent d-block d-lg-none">
                <div className="container d-flex justify-content-between align-items-center">
                    <a className="navbar-brand" href="#">
                        <img src={require('../../../img/landing_page/Group 377.png')} width={120} alt="Brand Logo" />
                    </a>
                    <svg
                        data-bs-toggle="offcanvas"
                        data-bs-target="#landingpage_offcanvas"
                        aria-controls="landingpage_offcanvas"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="#fff"
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

            <div className="container main-land-div">
                {/* Additional content goes here */}
            </div>
        </div>
    );
};
