import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const script = document.createElement('script'); // Dynamically load the Iubenda script
        script.src = "https://cdn.iubenda.com/iubenda.js";
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script) };
    }, []);
    const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' };
    return (
        <div>
            <style>
                {`
                .footer-text {
                    display: block;
                    font-size: 14px;
                    color: white; 
                    line-height: 1.5;
                    margin: 10px 0;
                }
                .footer-link-button {
                    text-decoration: none;
                    background-color: #5A2EBB;
                    color: white;
                    padding: 10px 15px;
                    margin-right: 10px;
                    border-radius: 25px;
                    display: inline-block;
                    font-size: 14px;
                    font-weight: bold;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    transition: background-color 0.3s ease, box-shadow 0.3s ease;
                }

                .footer-link-button:hover {
                    background-color: #3E148F;
                    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
                }

                /* Responsive Styles */
                @media (max-width: 768px) {
                    .footer-link-button {
                        padding: 8px 12px;
                        font-size: 12px;
                        margin-right: 8px;
                        border-radius: 20px;
                    }
                    .footer-text {
                        color: white;
                        font-size: 12px;
                        line-height: 1.4; 
                        text-align: center;
                        margin: 8px 0;
                    }
                }

                @media (max-width: 480px) {
                    .footer-link-button {
                        padding: 6px 10px;
                        font-size: 10px;
                        margin-right: 6px;
                    }
                    .footer-text {
                        font-size: 10px;
                        color: white;
                        line-height: 1.3;
                    }
                }
            `}
            </style>

            <div className='animate__animated animate__fadeIn footer' style={{ backgroundColor: '#3C147D' }}>
                <div className="container m-0 d-flex align-items-center mx-auto flex-column" style={{ height: '100%' }}>
                    <div className="row m-0 w-100 footer-row1 align-items-center">
                        <div className="col-md-5">
                            <div>
                                <img src={require('../img/landing_page/Group 377.png')} alt="footer" />
                                <div className='mt-5'>
                                    <span className='footer-text d-block'>Verantwortlich gemäß § 5 TMG:</span>
                                    <span className='footer-text d-block'>Dipeshkumar Khandelwal</span>
                                    <span className='footer-text d-block'>Krugenofen 14-16</span>
                                    <span className='footer-text d-block'>52066 Aachen</span>
                                    <span className='footer-text d-block'></span>
                                    <p className='footer-text d-block'>Germany</p>
                                    <span className='footer-text d-block'>Telefon: +49 (0) 176 87328837</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className='footer-subdiv d-flex justify-content-between ms-md-auto mt-5 mt-md-0'>
                                <ul className='footer-ul'>
                                    <p className='footer-ul-head' style={{ cursor: 'pointer' }}>Support / Help</p>
                                    <li><span className='footer-ul-li' style={{ cursor: 'pointer' }}>info@lernen-hub.de</span></li>
                                    <li className='mt-3'><span className='footer-ul-li text-decoration-none' onClick={() => { navigate('/support') }}>Help Center</span></li>
                                    <li className='mt-3'><span className='footer-ul-li text-decoration-none' onClick={() => { navigate('/faq') }}>FAQs</span></li>
                                </ul>
                                <ul className='footer-ul'>
                                    <p className='footer-ul-head'>Profiles</p>
                                    <li><span className='footer-ul-li text-decoration-none'>Home</span></li>
                                    <li className='mt-3'><span className='footer-ul-li text-decoration-none' onClick={() => { navigate('/our_team') }}>About Us</span> </li>
                                    <li className='mt-3'><span className='footer-ul-li text-decoration-none' onClick={() => { navigate('/stories') }}>Stories</span></li>
                                    <li className='mt-3'><span className='footer-ul-li text-decoration-none' onClick={() => { navigate('/contact_us') }}>Contact us</span></li>
                                </ul>
                                <ul className='footer-ul'>
                                    <p className='footer-ul-head'>Social</p>
                                    <li><span className='footer-ul-li text-decoration-none'>LinkedIn</span></li>
                                    <li className='mt-3'><span className='footer-ul-li text-decoration-none'>Instagram</span></li>
                                    <li className='mt-3'><span className='footer-ul-li text-decoration-none'>Facebook</span></li>
                                    <li className='mt-3'><span className='footer-ul-li text-decoration-none'>Twitter</span></li>
                                    <li className='mt-3'><a href="/learn-hub-demo/#/superadmin/login"  target='_blank'><span className='footer-ul-li text-decoration-none'>Super Admin</span></a></li>
                                    <li className='mt-3'><a href="/learn-hub-demo/#/organization/login" target='_blank'><span className='footer-ul-li text-decoration-none'>Organization Admin</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <span className='footer-text d-block'>
                        *Hinweis: Dieses Projekt befindet sich derzeit in einer Betaversion und ist noch kein eingetragenes Unternehmen.
                    </span>
                    <div className='border-top border-white w-100' style={containerStyle}>
                        <div className='footer-links mt-5' style={containerStyle}>
                            <a href="https://www.iubenda.com/terms-and-conditions/43142553" className="footer-link-button" title="Terms and Conditions" target="_blank" rel="noopener noreferrer">
                                Terms and Conditions
                            </a>
                            <a href="https://www.iubenda.com/privacy-policy/43142553" className="footer-link-button" title="Privacy Policy" target="_blank" rel="noopener noreferrer">
                                Privacy Policy
                            </a>
                            <a href="https://www.iubenda.com/privacy-policy/43142553/cookie-policy" className="footer-link-button" title="Cookie Policy" target="_blank" rel="noopener noreferrer">
                                Cookie Policy
                            </a>
                            <span className='footer-subdiv2-text ms-5'>
                                <img src={require('../img/landing_page/copyright_FILL0_wght200_GRAD0_opsz24 (1) 1.png')} className='me-1' alt="footer" />
                                LernenHub 2025
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Footer;