import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom/dist';


export const Navbar = () => {
    const [active, setActive] = useState('home');

    const navigate = useNavigate();

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

    return (
        <>
            {/* Desktop Navbar */}
            <div className="d-none d-lg-block">
                <div className="container ">
                    <div className="py-3 d-flex justify-content-between align-items-center" style={{ height: '5rem' }}>
                        <div className="d-flex align-items-center" onClick={() => navigate('/')}>
                            <img className="img-fluid" src={require('../../../img/landing_page/OBJECTS (1).png')} style={{ height: '30px' }} alt="Logo" />
                            <img className="ms-3 img-fluid" src={require('../../../img/landing_page/lernen hub.png')} style={{ height: '20px' }} alt="Logo" />
                        </div>
                        <ul className="d-flex justify-content-end align-items-center gap-5"
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
                            </li>
                        </ul>
                        <div className="d d-flex gap-4 align-items-center">
                            <i className="bi bi-search text-white fs-4"></i>
                            <button onClick={() => navigate('/loginpage')} className="btn py-2 px-4 text-white bg-transparent border border-white">
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navbar */}
            <nav className="navbar bg-transparent d-block d-lg-none">
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


        </>
    );
};
