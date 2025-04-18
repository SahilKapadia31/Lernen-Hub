import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap'


export const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer className="bg-footer text-white py-4">
            <Container>
                <div className="my-5 py-5">
                    <Row className="mb-4">
                        <Col xs={12} md={4} className="mb-4 mb-md-0">
                            <div className="d-flex align-items-center" onClick={() => navigate('/')}>
                                <img className="img-fluid" src={require('../../../img/landing_page/OBJECTS (1).png')} style={{ height: '40px' }} alt="Logo" />
                                <img className="ms-3 img-fluid" src={require('../../../img/landing_page/lernen hub.png')} style={{ height: '25px' }} alt="Logo" />
                            </div>
                            <div className='mt-5'>
                                <h5 className="text-white mb-3">Location</h5>
                                <p className="text-white fw-normal mb-0">
                                    Hauptstraße 150, 10827 Berlin,
                                    <br />
                                    Germany
                                </p>
                            </div>
                        </Col>

                        <Col xs={6} md={2} className="mb-4 mb-md-0">
                            <h5 className="text-warning mb-3">Users</h5>
                            <ul className="list-unstyled">
                                <li className="mb-3">
                                    <a href="/universities" className="text-white text-decoration-none">
                                        Universities
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="/schools" className="text-white text-decoration-none">
                                        Schools
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="/coaching-centres" className="text-white text-decoration-none">
                                        Coaching Centres
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="/tutors" className="text-white text-decoration-none">
                                        Tutors
                                    </a>
                                </li>
                            </ul>
                        </Col>

                        <Col xs={6} md={2} className="mb-4 mb-md-0">
                            <h5 className="text-warning mb-3">Profiles</h5>
                            <ul className="list-unstyled">
                                <li className="mb-3">
                                    <a href="/" className="text-white text-decoration-none">
                                        Home
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="/about" className="text-white text-decoration-none">
                                        About Us
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="/stories" className="text-white text-decoration-none">
                                        Stories
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="/contact" className="text-white text-decoration-none">
                                        Contact us
                                    </a>
                                </li>
                            </ul>
                        </Col>

                        <Col xs={6} md={2} className="mb-4 mb-md-0">
                            <h5 className="text-warning mb-3">Social</h5>
                            <ul className="list-unstyled">
                                <li className="mb-3">
                                    <a href="https://linkedin.com" className="text-white text-decoration-none">
                                        <i className="bi bi-linkedin me-2"></i> LinkedIn
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="https://instagram.com" className="text-white text-decoration-none">
                                        <i className="bi bi-instagram me-2"></i> Instagram
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="https://facebook.com" className="text-white text-decoration-none">
                                        <i className="bi bi-facebook me-2"></i> Facebook
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="https://twitter.com" className="text-white text-decoration-none">
                                        <i className="bi bi-twitter-x me-2"></i> X (Twitter)
                                    </a>
                                </li>
                            </ul>
                        </Col>

                        <Col xs={6} md={2} className="mb-4 mb-md-0">
                            <h5 className="text-warning mb-3">Support / Help</h5>
                            <ul className="list-unstyled">
                                <li className="mb-3">
                                    <a href="mailto:support@lernenhub.com" className="text-white text-decoration-underline">
                                        support@lernenhub.com
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="/help" className="text-white text-decoration-none">
                                        Help Center
                                    </a>
                                </li>
                                <li className='mt-3'><a href="/learn-hub-demo/#/superadmin/login"  target='_blank'  className="text-white text-decoration-none">Super Admin</a></li>
                                <li className='mt-3'><a href="/learn-hub-demo/#/organization/login" target='_blank'  className="text-white text-decoration-none">Organization Admin</a></li>
                            </ul>
                        </Col>
                    </Row>

                    <hr className="border-secondary my-4" />

                    <Row className="align-items-center">
                        <Col xs={12} md={8} className="mb-3 mb-md-0">
                            <div className="d-flex flex-wrap gap-4">
                                <a href="/terms" className="text-white text-decoration-none small">
                                    Terms of use
                                </a>
                                <a href="/privacy" className="text-white text-decoration-none small">
                                    Privacy Policy
                                </a>
                                <a href="/cookies" className="text-white text-decoration-none small">
                                    Cookies Settings
                                </a>
                            </div>
                        </Col>
                        <Col xs={12} md={4} className="text-md-end">
                            <p className="text-white mb-0 small d-flex align-items-center justify-content-start justify-content-md-end">
                                <span className="me-1">©</span> LernenHub
                            </p>
                        </Col>
                    </Row>
                </div>
            </Container>
        </footer>
    )
}
