import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav, Accordion, ProgressBar, Badge, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ipaddress3 } from '../../../App';
import axiosInstance from '../../../pages/axiosInstance';
import { getDecryptedData } from '../../../utils/helperFunctions';
import { Navbar } from '../Navbar/Navbar';
import LoginpageDialog from '../login/loginDialog';
import './UniversitiesInfo.scss';
import UniInfo1 from '../../../img/v2/uniInfo1.png'
import UniInfo2 from '../../../img/v2/uniInfo2.png'
import UniInfo3 from '../../../img/v2/uniInfo3.png'
import UniInfo4 from '../../../img/v2/uniInfo4.png'
import UniInfo5 from '../../../img/v2/uniInfo5.png'
import UniLogo from '../../../img/v2/UniLogo.png'
import FileSVG from '../../../img/v2/File-dot.svg'
import BookSVG from '../../../img/v2/book.svg'
import SendSVG from '../../../img/v2/send.svg'
import Exclamation from '../../../img/v2/exclamation.svg'
import DoubleStar from '../../../img/v2/double-star.svg'
import YellowStar from '../../../img/v2/star-yellow.svg'
import HandShake from '../../../img/v2/handshake.svg'
import Infrastructure from '../../../img/v2/Infrastructure.svg'
import Accommodation from '../../../img/v2/Accommodation.svg'
import BagSVG from '../../../img/v2/bag.svg'
import CapSVG from '../../../img/v2/cap.svg'
import AccountIcon from '../../../img/v2/People.svg'
import LocationSVG from '../../../img/v2/location.svg'
import News1 from '../../../img/v2/news1.png'
import News2 from '../../../img/v2/news2.png'
import News3 from '../../../img/v2/new3.png'
import NewsSVG from '../../../img/v2/News.svg'
import Adddetails from '../../../pages/Adddetails';

const UniversitiesInfo = () => {
    const headerRef = useRef(null);
    const user = JSON.parse(getDecryptedData('user'));

    const { university_id } = useParams()
    const [selected, setSelected] = useState('all');
    const [joinUniversity, setJoinUniversity] = useState(false);
    const [isBlurred, setIsBlurred] = useState(true);
    const [orgDetails, setOrgDetails] = useState();
    const [orgProgram, setOrgProgram] = useState();
    const [orgInfo, setOrgInfo] = useState();
    const [orgLogo, setOrgLogo] = useState();
    const [showLogin, setShowLogin] = useState(false);
    const [galleryImages, setGalleryImages] = useState([UniInfo2, UniInfo4, UniInfo3, UniInfo5]);

    useEffect(() => {
        getAllOrganizationDetails();
        if (window.innerWidth > 991 && headerRef.current) {
            const updateScroll = () => {
                const windowScrollTop = window.pageYOffset / 3;
                headerRef.current.style.transform = `translate3d(0, ${windowScrollTop}px, 0)`;
            };

            window.addEventListener('scroll', updateScroll);
            return () => window.removeEventListener('scroll', updateScroll);
        }


    }, []);

    useEffect(() => {
        const shouldOpenJoin = localStorage.getItem("openJoinAfterLogin");
        if (shouldOpenJoin === "true" && user) {
            setJoinUniversity(true);
            localStorage.removeItem("openJoinAfterLogin");
        }
        if (user) {
            setIsBlurred(false);
        }
    }, [user]);

    const getAllOrganizationDetails = async () => {
        try {
            const response = await axiosInstance.get(`${ipaddress3}/public/organization/${university_id}/`);
            if (response?.data?.status) {
                const Data = response.data.data;
                setOrgDetails(Data);
                setOrgLogo(Data?.full_details?.logo_url);
                setOrgInfo(Data?.organization);
                setOrgProgram(Data?.programs);

                try {
                    // Parse image gallery string to array of URLs
                    const parsedImages = JSON.parse(Data?.full_details.images?.replace(/^'+|'+$/g, ''));
                    const urls = Array.isArray(parsedImages)
                        ? parsedImages.map(img => img?.url)
                        : [];
                    setGalleryImages(urls); // ✅ This is important!
                } catch (e) {
                    console.error("Error parsing image gallery:", e);
                    setGalleryImages([]); // fallback to empty array
                }
            }
        } catch (err) {
            console.error('Error in getAllOrganizationCount:', err);
        }
    };

    const extractProgramNames = (programs = []) => {
        const names = [];
        programs.forEach(item => {
            if (item?.name) {
                names.push(item.name);
            }
        });

        console.log("---names", names)
        return names;
    };


    const handleLoginClick = () => {
        if (!user) {
            setShowLogin(true);
        }
        else {
            setIsBlurred(false);
        }
    };

    const handleJoinDialog = () => {
        if (!user) {
            localStorage.setItem("openJoinAfterLogin", "true");
            setShowLogin(true);
        } else {
            setJoinUniversity(true);
        }
    };

    const SempleData = {
        name: orgInfo?.university_name,
        location: `${orgInfo?.address}, ${orgInfo?.city}, ${orgInfo?.state}, ${orgInfo?.country}`,
        established: "1989",
        approval: orgInfo?.is_verifed ? "Verifed" : "Verification Pending",
        courses: orgDetails?.programs?.length > 0
            ? extractProgramNames(orgDetails?.programs)
            : ["Courses join Pending"],
        rating: "4.5",
        images: {
            main: orgDetails?.full_details?.logo_url,
            gallery: Array.isArray(galleryImages) ? galleryImages : []
        }
    }

    const tabSection = [
        { label: 'Overview', icon: <img src={FileSVG} width={18} height={18} />, id: 'overview' },
        { label: 'Disciplines & Fees', icon: <img src={BookSVG} width={18} height={18} />, id: 'disciplines' },
        { label: 'Location', icon: <i className="bi bi-geo-alt"></i>, id: 'location' },
        { label: 'Ratings & Review', icon: <i className="bi bi-star"></i>, id: 'ratings' },
        { label: 'News & Events', icon: <i className="bi bi-megaphone"></i>, id: 'news' },
        { label: 'Website', icon: <i className="bi bi-globe"></i>, id: 'website' },
        { label: 'Download Brochure', icon: <i className="bi bi-download"></i>, id: 'brochure' }
    ];

    const ratingsData = [
        { label: '4-5', count: 76 },
        { label: '3-4', count: 8 },
        { label: '2-3', count: 2 },
        { label: '1-2', count: 11 },
    ];

    const UniBasicInfo = {
        overview: orgDetails?.full_details?.overview,
        disciplines: {
            bachelors: [
                {
                    title: "B.Tech",
                    eligibility: "10+2 Minimum 50% | AIEEE, PJEE Entrance Test | Max. age 24 years",
                    details: "—"
                },
                {
                    title: "B.Des - Bachelor of Design (4 years)",
                    eligibility: "10+2 Minimum 50% | UCEED exam",
                    details: ` 
                    <p>B.Des Communication Design – INR 125,000 per annum</p>
                    <p>B.Des Industrial Design – INR 125,000 per annum</p>
                    <p>B.Des Fashion Design – INR 125,000 per annum</p>
                    <p>B.Des Interior Design – INR 125,000 per annum</p>
                  `
                },
                {
                    title: "B.Sc",
                    eligibility: "10+2 Minimum 50% | Max. age 24 years",
                    details: "—"
                },
                {
                    title: "B.Arch",
                    eligibility: "10+2 Minimum 50% | UCEED exam",
                    details: "—"
                },
                {
                    title: "B.BA",
                    eligibility: "10+2 Minimum 50% | UCEED exam",
                    details: "—"
                }
            ],
            masters: "Masters course details will go here.",
            phd: "PhD course details will go here."
        }
    };

    const Review = [
        {
            id: 1,
            name: "Swaraj Singh",
            date: "Nov 12",
            rating: 4,
            initial: "S",
            comment:
                "Very professional tile supplier, my project went very smoothly, for different projects they also give me different programs and suggestions."
        },
        {
            id: 2,
            name: "Priya Mehta",
            date: "Oct 28",
            rating: 5,
            initial: "P",
            comment:
                "Highly recommend! Great service and excellent support during the selection process. Truly satisfied."
        },
        {
            id: 3,
            name: "Aman Kapoor",
            date: "Sep 15",
            rating: 3,
            initial: "A",
            comment:
                "Average experience, delivery took a bit longer than expected. However, the product quality was decent."
        }
    ];

    const locationData = {
        name: orgInfo?.university_name,
        image: orgLogo,
        latitude: 31.6340,
        longitude: 74.8723
    };

    const googleMapUrl = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}&hl=es;z=14&output=embed`;

    // src/data/newsData.js

    const newsData = [
        {
            id: 1,
            title: "GNDU Fee Structure 2025: Detailed Breakdown for UG & PG Programs Announced",
            author: "Astha Tripathy",
            date: "17 Dec 2024",
            authorImage: "https://randomuser.me/api/portraits/women/1.jpg",
            thumbnail: News1,
        },
        {
            id: 2,
            title: "GBDU Spot Round Counseling 2023 Seat Allotment Result Out; Check Important Dates & Direct Link Here",
            author: "Saktikant Das",
            date: "17 Dec 2024",
            authorImage: "https://randomuser.me/api/portraits/men/2.jpg",
            thumbnail: News2,
        },
        {
            id: 3,
            title: "NIFT 2023 5th Seat Allotment List Out for UG, PG Courses @gnduadmissions.in;  Check Details & Direct Link Here",
            author: "Sanjay Malhotra",
            date: "17 Dec 2024",
            authorImage: "https://randomuser.me/api/portraits/men/3.jpg",
            thumbnail: News3,
        },
    ];



    const totalCount = 97;
    const averageRating = 4.5;
    const categories = ["Academic", "Faculty", "Placement", "Infrastructure", "Accommodation", "Social Life"];
    const icons = [CapSVG, AccountIcon, BagSVG, Infrastructure, Accommodation, HandShake];
    return (
        <>

            <Navbar background={'#282088'}/>
            <div className="university-info py-5" ref={headerRef}>
                <Container>
                    <Row>
                        <Col md={6}>
                            <Card className="main-image-card mb-4">
                                <Card.Img variant="top" src={SempleData.images.main} />
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Row className="g-2">
                                {SempleData.images.gallery.map((img, idx) => (
                                    <Col xs={6} key={idx}>
                                        <Card className={`small-image-card ${idx === 3 ? 'position-relative' : ''}`}>
                                            <Card.Img variant="top" src={SempleData.images.gallery[idx]} />
                                            {idx === 3 && (
                                                <Button variant="dark" className="view-photos-btn">
                                                    <i className="bi bi-image-fill"></i> View All Photos
                                                </Button>
                                            )}
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>

                    <div className="university-details mt-4">
                        <h4 className="fw-bold mb-2 uni-name">
                            {SempleData.name}
                            <span className='badge rounded-pill ms-2'>
                                <span className="rating">
                                    <img className='me-2' src={YellowStar} width={18} height={18} />
                                </span>
                                <span className='rating-test'> {SempleData.rating}</span>
                            </span>
                        </h4>
                        <div className="details-icons d-flex flex-wrap gap-4">
                            <span><i className="bi bi-geo-alt me-2"></i>{SempleData.location}</span>
                            <span><i className="bi bi-calendar me-2"></i>{SempleData.established}</span>
                            <span>
                                <i className="me-2">
                                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.125 10.6698L10.5448 6.25L9.65375 5.35896L6.125 8.88792L4.35896 7.12188L3.46792 8.01292L6.125 10.6698ZM7 15.9006C5.19764 15.4091 3.70542 14.3482 2.52333 12.7179C1.34111 11.0876 0.75 9.265 0.75 7.25V2.45521L7 0.115417L13.25 2.45521V7.25C13.25 9.265 12.6589 11.0876 11.4767 12.7179C10.2946 14.3482 8.80236 15.4091 7 15.9006ZM7 14.5833C8.44444 14.125 9.63889 13.2083 10.5833 11.8333C11.5278 10.4583 12 8.93056 12 7.25V3.3125L7 1.44542L2 3.3125V7.25C2 8.93056 2.47222 10.4583 3.41667 11.8333C4.36111 13.2083 5.55556 14.125 7 14.5833Z" fill="#4D5555" />
                                    </svg>
                                </i>{SempleData.approval}
                            </span>
                            <span>
                                <i className="bi bi-mortarboard me-2"></i>
                                {SempleData.courses.join(', ')}
                            </span>
                        </div>
                    </div>
                </Container>

                <div className='new-sub-nav mt-4'>
                    <div className="navbar-custom">
                        <nav className="navbar navbar-expand-lg container" >
                            <ul className="navbar-nav d-flex justify-content-around w-100">
                                {tabSection.map((tab, index) => {
                                    const isWebsite = tab.id === 'website';
                                    const isBrochure = tab.id === 'brochure';

                                    // Destination logic
                                    let href = `#${tab.id}`;
                                    if (isWebsite) href = orgDetails?.full_details?.website || '#';
                                    if (isBrochure) href = 'https://www.utu.ac.in/35uthfest/PDF/Brochure_UThfest.pdf';

                                    return (
                                        <li className="nav-item text-center" key={index}>
                                            <a
                                                href={href}
                                                className="nav-link"
                                                target={isWebsite || isBrochure ? '_blank' : '_self'}
                                                rel={isWebsite || isBrochure ? 'noopener noreferrer' : undefined}
                                            >
                                                {tab.icon} {tab.label}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>
                </div>


                <Container>
                    <Row className="mt-5 gap-2">
                        <Col md={3} >
                            <Card className="text-center p-3 shadow-sm">
                                <Card.Img variant="top" className="img-fluid mb-3" src={orgLogo} style={{ maxHeight: '200px', objectFit: 'contain' }} />
                                <Button variant="primary" className="mb-2"><img className='me-2' src={SendSVG} width={18} height={18} />Contact University</Button>
                                <Button variant="outline-primary" className="mb-2"><i className="bi bi-share me-2"></i>Share Details</Button>
                                <Button variant="outline-danger" className="mb-2"><img className='me-2' src={Exclamation} width={18} height={18} />Report University</Button>
                                <Button variant="outline-primary" className="mb-2" onClick={() => handleJoinDialog()}><i className="bi bi-plus me-2"></i>Join University</Button>
                                <div className="rate-university mt-2">
                                    <p className="mb-1">Rate University</p>
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="bi bi-star mx-2"></i>
                                    ))}
                                </div>
                            </Card>
                        </Col>

                        <Col md={8} className='custom-tabs'>
                            {orgProgram && <>
                                <div id='overview'>
                                    <h5 className="fw-bold mb-3">
                                        <img src={FileSVG} width={18} height={18} /> Overview
                                    </h5>
                                    <p>{orgDetails?.full_details?.overview}</p>
                                </div>
                                <div id="disciplines">
                                    <h5 className="fw-bold mt-5 mb-3">
                                        <img className="me-2" src={BookSVG} width={18} height={18} alt="book-icon" />
                                        Disciplines
                                    </h5>

                                    <Tab.Container defaultActiveKey={orgProgram[0]?.name}>
                                        <Nav variant="tabs">
                                            {orgProgram.map((item) => (
                                                <Nav.Item key={item?.id}>
                                                    <Nav.Link eventKey={item?.name}>
                                                        <div className="tab-text">{item?.name}</div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            ))}
                                        </Nav>

                                        <Tab.Content className="mt-3">
                                            {orgProgram.map((item) => (
                                                <Tab.Pane eventKey={item?.name} key={item?.id}>
                                                    {item?.programs?.length > 0 ? (
                                                        <Accordion flush>
                                                            {item.programs.map((program) => (
                                                                <Accordion.Item eventKey={program?.pid.toString()} key={program?.pid}>
                                                                    <Accordion.Header>
                                                                        {program?.program_name}
                                                                        {(program?.program_description || program?.eligibility) && (
                                                                            <span className="small ms-auto"> Eligibility: {program?.eligibility || '10+2 Minimum 50% | AIEEE, PJEE Entrance Test | Max. age 24 years'}</span>
                                                                        )}
                                                                    </Accordion.Header>
                                                                    <Accordion.Body>
                                                                        {program?.subjects && program.subjects.length > 0 ? (
                                                                            <ul>
                                                                                {program?.subjects.map((subject) => (
                                                                                    <li className=' m-2' key={subject?.course_id}>{subject?.course_name}</li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : (
                                                                            <p>No subjects listed.</p>
                                                                        )}
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            ))}
                                                        </Accordion>
                                                    ) : (
                                                        <p style={{ height: '47px', padding: '12px' }}>No programs available.</p>
                                                    )}
                                                </Tab.Pane>
                                            ))}
                                        </Tab.Content>
                                    </Tab.Container>
                                </div>
                            </>}
                            <div id='ratings'>
                                <h5 className="fw-bold mt-5 mb-1"><img className='me-2' src={DoubleStar} width={18} height={18} />Ratings & Review</h5>
                                <Row className="mb-4">
                                    <Col md={6} className="rating-section">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="fw-bold"> </div>
                                            <div className="fw-bold"><img className='me-2' src={YellowStar} width={20} height={20} />{averageRating} / 5 <small className="text-muted">({totalCount})</small></div>
                                        </div>
                                        {ratingsData.map((rating, i) => (
                                            <div className="d-flex align-items-center mb-2" key={i}>
                                                <span className="me-2 fw-bolder"><img className='me-2' src={YellowStar} width={12} height={12} />{rating.label}</span>
                                                <ProgressBar now={(rating.count / totalCount) * 100} className="flex-grow-1 me-2 rating-progress" />
                                                <span className=' fw-bold'>{rating.count}</span>
                                            </div>
                                        ))}
                                    </Col>
                                    <Col md={12} className="d-flex flex-wrap gap-1 justify-content-start rating-card-box my-4">
                                        {categories.map((item, i) => (
                                            <div
                                                key={i}
                                                className="text-center p-2 rounded"
                                                style={{ width: '130px' }}
                                            >
                                                <div className="icon-box">
                                                    <img src={icons[i]} alt={item} />
                                                </div>
                                                <div className="fw-bolder text-dark">{item}</div>
                                                <div className="rating-badge mt-2 mx-auto text-black fw-bolder">
                                                    <img src={YellowStar} width={12} height={12} alt="Star" />
                                                    4.5
                                                </div>
                                            </div>
                                        ))}
                                    </Col>
                                </Row>
                                <div className="mb-3 filter-buttons ">
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className={`me-2 rounded-pill  ${selected === 'all' ? 'active' : ''}`}
                                        onClick={() => setSelected('all')}
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className={`me-2 rounded-pill  ${selected === 'recent' ? 'active' : ''}`}
                                        onClick={() => setSelected('recent')}
                                    >
                                        Most Recent
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className={`rounded-pill  ${selected === 'oldest' ? 'active' : ''}`}
                                        onClick={() => setSelected('oldest')}
                                    >
                                        Oldest
                                    </Button>
                                </div>

                                <div className="mt-4 review-list-section">
                                    {Review.map(({ id, name, date, rating, comment, initial }, index) => (
                                        <div key={id} className="review-item d-flex align-items-start">
                                            <div className={`avatar`}>
                                                {initial}
                                            </div>
                                            <div className="review-content">
                                                <div className="fw-bold">{name}</div>
                                                <small className=" fw-medium d-block">{date}</small>
                                                <div className="text-muted small">{comment}</div>
                                            </div>
                                            <div className="rating ms-auto fw-bold d-flex align-items-center">
                                                <img src={YellowStar} width={12} height={12} alt="Star" className="me-1" /> {rating}
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="link" className="ms-5 py-0 pe-0 ps-2" style={{ color: '#4547C9' }}>Load More</Button>
                                </div>

                            </div>
                            <div className="position-relative">

                                {/* Login Overlay */}
                                {isBlurred && (
                                    <div
                                        className=" position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.47)',
                                            backdropFilter: 'blur(8px)',
                                            zIndex: 9999
                                        }}
                                    >
                                        <Button variant="primary" size="lg" onClick={handleLoginClick}>
                                            Login
                                        </Button>
                                    </div>
                                )}

                                {/* Blurred Content */}
                                <div style={{ filter: isBlurred ? 'blur(6px)' : 'none', pointerEvents: isBlurred ? 'none' : 'auto' }}>

                                    {/* Location Section */}
                                    <div className='maps mt-4' id='location'>
                                        <h5 className="mb-3 fw-bold">
                                            <img className='me-2' src={LocationSVG} alt="location-icon" />
                                            Location
                                        </h5>
                                        <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                                            <iframe
                                                title="University Location"
                                                src={googleMapUrl}
                                                width="100%"
                                                height="400"
                                                style={{ border: 0 }}
                                                allowFullScreen=""
                                                loading="lazy"
                                            ></iframe>
                                            <Card
                                                className="shadow d-flex flex-row align-items-center px-3 py-2"
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: '370px',
                                                    borderRadius: '16px'
                                                }}
                                            >
                                                <img
                                                    src={locationData.image}
                                                    alt={locationData.name}
                                                    className="me-3"
                                                    style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '12px' }}
                                                />
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">{locationData.name}</h6>
                                                    </div>
                                                    <i className="bi bi-chevron-right fs-5"></i>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>

                                    {/* News & Events Section */}
                                    <div className='news-section mt-5' id='news'>
                                        <div className="news-events">
                                            <h5 className="section-title my-4">
                                                <img src={NewsSVG} alt="news" className="me-1" /> News & Events
                                            </h5>

                                            {newsData.map((item, idx) => (
                                                <div className="news-card" key={idx}>
                                                    <Row className="align-items-start">
                                                        <Col xs={3} md={2}>
                                                            <Image src={item.thumbnail} className="news-thumb" />
                                                        </Col>
                                                        <Col xs={9} md={10}>
                                                            <div className="news-meta d-flex justify-content-between align-items-start">
                                                                <a href="#" className="news-title">
                                                                    {item.title}
                                                                </a>
                                                                <span className="news-date">{item.date}</span>
                                                            </div>
                                                            <div className="news-author mt-2 d-flex align-items-center">
                                                                <Image src={item.authorImage} roundedCircle width="28" height="28" className="me-2" />
                                                                <span className="author-name text-muted">By {item.author}</span>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <hr />
                                                </div>
                                            ))}

                                            <Button variant="link" className="p-0" style={{ color: '#4547C9' }}>
                                                Load More
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Col>
                    </Row>

                </Container>


                <Adddetails
                    show={joinUniversity}
                    university_id={university_id}
                    handleClose={() => { setJoinUniversity(false); }}
                    orgLogo={orgLogo}
                />

                <LoginpageDialog
                    show={showLogin}
                    handleClose={() => setShowLogin(false)}
                    redirectUrl={`/universities_info/${university_id}`}
                />
            </div>
        </>
    );
};

export default UniversitiesInfo;
