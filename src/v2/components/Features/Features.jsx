import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Container, Button, Card } from "react-bootstrap";
import './Features.scss';
import Slider from 'react-slick';
import dancing from '../../../img/v2/autoslide1.png'
import cricket from '../../../img/v2/autoslide2.png'
import school_subject from '../../../img/v2/autoslide3.png'
import drawing from '../../../img/v2/autoslide4.png'
import music from '../../../img/v2/autoslide5.png'
import shadowImg from '../../../img/v2/image.png'


import pennLogo from '../../../img/v2/uni5.png';
import glasgowLogo from '../../../img/v2/uni4.png';
import brownLogo from '../../../img/v2/uni3.png';
import liverpoolLogo from '../../../img/v2/uni2.png';
import dokuzLogo from '../../../img/v2/uni1.png';

import form from '../../../img/v2/form.png';
import bank from '../../../img/v2/bank.png';
import doc from '../../../img/v2/doc.png';


import { Col, Row } from 'reactstrap';
import { Footer } from '../Footer/Footer';
import { Link } from 'react-router-dom';

export const Features = () => {
    // Filter state
    const [activeFilter, setActiveFilter] = useState("All")
    const [progress, setProgress] = useState(0);

    const [activeCardId, setActiveCardId] = useState('01'); // Default active card
    const [hoveredCardId, setHoveredCardId] = useState(null);

    // Set active card when hovered (for desktop) and clicked (for mobile)
    const handleCardInteraction = (pathwayId) => {
        setHoveredCardId(pathwayId);
        setActiveCardId(pathwayId);
    };

    // Mock university data
    const universities = [
        {
            id: 1,
            name: "Guru Nanak Dev University",
            logo: "GNU",
            logoColor: "#E9E7FF",
            textColor: "#A29BEB",
            location: "Amritsar",
            founded: "1989",
            accreditation: "AICTE",
            degrees: "Bachelors, Masters, Doctorals",
            rating: 4.5,
            categories: ["Engineering", "Medical"],
        },
        {
            id: 2,
            name: "Srirama Chandra Bhanja Medical College",
            logo: "SCB",
            logoColor: "#FAE4F2",
            textColor: "#C89EBA",
            location: "Amritsar",
            founded: "1989",
            accreditation: "AICTE",
            degrees: "Bachelors, Masters, Doctorals",
            rating: 4.5,
            categories: ["Medical"],
        },
        {
            id: 3,
            name: "National Institute of Design",
            logo: "NID",
            logoColor: "#E3F4E3",
            textColor: "#14C265",
            location: "Ahmedabad",
            founded: "1961",
            accreditation: "AICTE",
            degrees: "Bachelors, Masters",
            rating: 4.7,
            categories: ["Designing"],
        },
        {
            id: 4,
            name: "Berklee College of Music",
            logo: "BCM",
            logoColor: "#FFF8DE",
            textColor: "#F2BD65",
            location: "Boston",
            founded: "1945",
            accreditation: "NASM",
            degrees: "Bachelors, Masters",
            rating: 4.8,
            categories: ["Music"],
        },
        {
            id: 5,
            name: "École Hôtelière de Lausanne",
            logo: "EHL",
            logoColor: "#E9E7FF",
            textColor: "#A29BEB",
            location: "Lausanne",
            founded: "1893",
            accreditation: "NECHE",
            degrees: "Bachelors, Masters",
            rating: 4.9,
            categories: ["Travel & Tourism"],
        },
        {
            id: 6,
            name: "Massachusetts Institute of Technology",
            logo: "MIT",
            logoColor: "#FAE4F2",
            textColor: "#C89EBA",
            location: "Cambridge",
            founded: "1861",
            accreditation: "NECHE",
            degrees: "Bachelors, Masters, Doctorals",
            rating: 4.9,
            categories: ["Engineering"],
        },
        {
            id: 7,
            name: "Johns Hopkins University",
            logo: "JHU",
            logoColor: "#E3F4E3",
            textColor: "#14C265",
            location: "Baltimore",
            founded: "1876",
            accreditation: "MSCHE",
            degrees: "Bachelors, Masters, Doctorals",
            rating: 4.8,
            categories: ["Medical"],
        },
        {
            id: 8,
            name: "Rhode Island School of Design",
            logo: "RISD",
            logoColor: "#FFF8DE",
            textColor: "#F2BD65",
            location: "Providence",
            founded: "1877",
            accreditation: "NASAD",
            degrees: "Bachelors, Masters",
            rating: 4.7,
            categories: ["Designing"],
        },
    ]

    const userPathways = [
        {
            id: '01',
            category: 'Students',
            title: 'Learn, Engage, and Grow',
            color: '#ACADFF',
            features: [
                'Find subject-wise discussions, upload your notes, and connect with peers.',
                'Mark key points and highlight important PDFs for future reference.',
                'Create flashcards anytime, anywhere – learn at your pace.'
            ],
            cta: {
                text: 'Join Now',
                action: () => console.log('Student signup')
            },
            additionalText: 'Ready to take charge of your learning?',
            btnBGColor: '#4547C9',

        },
        {
            id: '02',
            category: 'Teachers & Professors',
            title: 'Learn, Engage, and Grow',
            color: '#FF784E',
            features: [
                'Share resources, notes, and assignments securely, and collaborate with colleagues in private spaces.',
                'Foster engaging discussions, moderate content, and answer student questions.',
                'Stay connected with students beyond the classroom, even after the bell rings.'
            ],
            cta: {
                text: 'Join Now',
                action: () => console.log('Teacher signup')
            },
            additionalText: 'Let\'s bring your teaching online – Get started today!',
            btnBGColor: '#FF784E',

        },
        {
            id: '03',
            category: 'Parents',
            title: 'Stay Involved, Without Overbearing',
            color: '#FFB82D',
            features: [
                'Track your child\'s learning progress through discussions, assignments, and activity updates.',
                'Ensure a safe and distraction-free environment for learning.',
                'Communicate with teachers to stay in the loop, but without interfering in day-to-day learning.',
                'Access study materials and resources to support your child\'s success.'
            ],
            cta: {
                text: 'Join Now',
                action: () => console.log('Parent signup')
            },
            additionalText: 'Sign up today and stay connected!',
            btnBGColor: '#FFB82D',

        },
        {
            id: '04',
            category: 'Institutions',
            title: 'A Complete Digital Learning Hub',
            color: '#14C265',
            features: [
                'Create a dedicated space for your students and faculty to interact, share content, and collaborate.',
                'Offer structured content and discussions while securely sharing documents.',
                'Monitor student engagement and ensure a smooth, organized learning environment.'
            ],
            cta: {
                text: 'Join Now',
                action: () => console.log('Institution signup')
            },
            additionalText: 'Set up your institution\'s space today – no need to build an LMS from scratch!',
            btnBGColor: '#14C265',

        }
    ];

    let settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        dots: false,
        arrows: true,
        swipeToSlide: true,
        className: "slider-settings responsive-settings",
        adaptiveHeight: false, // Keep this false to maintain uniform height
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: true
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 0,
                    arrows: true
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    centerMode: true,
                    centerPadding: '0px' // Changed to 0px to ensure no partial cards are visible
                }
            }
        ]
    };

    // Filter categories
    const filters = ["All", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism"]
    const SchoolFilters = ["All", "Elementary", "Secondary", "Religious", "Boarding", "Special Education Schools", "International", "Preschools"]
    const sliderImages = useMemo(() => [
        { name: 'DANCING', logo: dancing, alt: 'Dancing' },
        { name: 'CRICKET', logo: cricket, alt: 'Cricket' },
        { name: 'SCHOOL SUBJECTS', logo: school_subject, alt: 'School Subjects' },
        { name: 'DRAWING', logo: drawing, alt: 'Drawing' },
        { name: 'MUSIC', logo: music, alt: 'Music' },
    ], []);
    const universityPartners = [
        { name: 'University of Pennsylvania', logo: pennLogo, alt: 'Penn University Logo' },
        { name: 'University of Glasgow', logo: glasgowLogo, alt: 'Glasgow University Logo' },
        { name: 'Brown University', logo: brownLogo, alt: 'Brown University Logo' },
        { name: 'University of Liverpool', logo: liverpoolLogo, alt: 'Liverpool University Logo' },
        { name: 'Dokuz Eylul University', logo: dokuzLogo, alt: 'Dokuz Eylul University Logo' }
    ];

    // Filter universities based on selected category
    const filteredUniversities =
        activeFilter === "All" ? universities : universities.filter((uni) => uni.categories.includes(activeFilter))

    //slider section
    const trackRef = useRef(null);
    const containerRef = useRef(null);
    const [duplicateCount, setDuplicateCount] = useState(3); // Start with 3 sets

    useEffect(() => {
        if (!trackRef.current || !containerRef.current || !sliderImages || sliderImages.length === 0) return;

        // Calculate how many copies we need to ensure no visible gaps
        const calculateDuplicates = () => {
            const containerWidth = containerRef.current.offsetWidth;
            const slideWidth = 330; // Fixed slide width
            const slidesCount = sliderImages.length;
            const singleSetWidth = slideWidth * slidesCount;

            // We need enough copies to fill at least twice the container width
            // This ensures no visible gaps during animation
            const minimumWidth = containerWidth * 2;
            const requiredSets = Math.ceil(minimumWidth / singleSetWidth) + 1; // Add 1 extra set for safety

            setDuplicateCount(Math.max(3, requiredSets)); // At least 3 sets

            return requiredSets;
        };

        // Create the smooth infinite animation
        const createSmoothAnimation = () => {
            // First set is the starting point (0%)
            // We animate to exactly one set width (not the entire track)
            const singleSetWidth = (trackRef.current.scrollWidth / duplicateCount);

            const styleEl = document.createElement('style');
            const animationName = `infiniteScroll-${Date.now()}`; // Unique name to avoid conflicts

            styleEl.innerHTML = `
        @keyframes ${animationName} {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${singleSetWidth}px);
          }
        }
      `;
            document.head.appendChild(styleEl);

            // Apply animation to the track
            trackRef.current.style.animationName = animationName;

            // When animation ends, immediately reset position without animation
            const handleAnimationIteration = () => {
                // When one loop completes, instantly jump back by one set width (without animation)
                trackRef.current.style.animationPlayState = 'paused';
                trackRef.current.style.transform = 'translateX(0)';

                // Force reflow
                void trackRef.current.offsetWidth;

                // Resume animation from beginning
                trackRef.current.style.animationPlayState = 'running';
            };

            trackRef.current.addEventListener('animationiteration', handleAnimationIteration);

            // Animation duration based on content length
            const duration = Math.max(20, sliderImages.length * 3);
            trackRef.current.style.animationDuration = `${duration}s`;

            return () => {
                trackRef.current?.removeEventListener('animationiteration', handleAnimationIteration);
                document.head.removeChild(styleEl);
            };
        };

        // Adjust on window resize
        const handleResize = () => {
            calculateDuplicates();
        };

        window.addEventListener('resize', handleResize);

        // Set up animation after a short delay to ensure DOM is ready
        const cleanupAnimation = setTimeout(createSmoothAnimation, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(cleanupAnimation);
        };
    }, [sliderImages, duplicateCount]);

    // Create multiple sets of images based on calculated duplication count
    const getProcessedImages = () => {
        if (!sliderImages || sliderImages.length === 0) return [];

        let result = [];
        for (let i = 0; i < duplicateCount; i++) {
            result = [...result, ...sliderImages.map((image, index) => ({
                ...image,
                key: `set-${i}-${index}`
            }))];
        }

        return result;
    };

    const processedImages = getProcessedImages();


    const CounterItem = ({ target, label, suffix = '', progress }) => {
        // Calculate the current count based on the common progress value
        const count = Math.floor(target * progress);

        return (
            <div className="counter-item text-center px-2">
                <span className="counter-number">
                    {count}{suffix}
                </span>
                <p className="text-capitalize fw-semibold mb-0">{label}</p>
            </div>
        );
    };


    const duration = 2000; // Duration in milliseconds for the animation

    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            // Calculate new progress between 0 and 1
            const newProgress = Math.min(elapsed / duration, 1);
            setProgress(newProgress);

            // Stop updating when progress reaches 1
            if (newProgress === 1) {
                clearInterval(interval);
            }
        }, 40);

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, [duration]);


    return (
        <main>
            <section className="university-listing py-5 py-md-7">
                <Container>
                    <h1 className='fw-semibold text-dark text-center display-5 university-title mb-4 mb-md-5 px-2'>
                        Discover a variety of universities <br className="d-none d-md-block" /> offering a wide range of programs.
                    </h1>

                    <div className="filter-container d-flex flex-nowrap flex-md-wrap justify-content-start justify-content-md-center mb-4 px-3 px-md-0 overflow-auto">
                        {filters.map((filter) => (
                            <Button
                                key={filter}
                                variant={activeFilter === filter ? "active-filter" : "outline-secondary"}
                                className="rounded-pill px-3 px-md-4 py-2 me-2 mb-2 flex-shrink-0"
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                    <div className="slider-container mt-4 px-0 px-md-3 mx-auto">
                        <Slider {...settings}>
                            {filteredUniversities.map((university) => (
                                <div className="h-100 card-wrapper" key={university.id}>
                                    <Card className="slider-card border shadow-sm h-100 mx-auto">
                                        <Card.Body className="d-flex flex-column position-relative p-3 p-md-4 h-100">
                                            <div className="text-center mb-3">
                                                <div
                                                    className="university-logo rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                    style={{
                                                        backgroundColor: university.logoColor,

                                                    }}
                                                >
                                                    <span className="university-logo-text h3 mb-0 fw-bold" style={{ color: university.textColor }}>{university.logo}</span>
                                                </div>
                                            </div>

                                            <div className="university-info small text-muted mb-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                                                        <path d="M4.79164 14.1666V7.91664H6.04164V14.1666H4.79164ZM9.37497 14.1666V7.91664H10.625V14.1666H9.37497ZM2.30768 17.0833V15.8333H17.6923V17.0833H2.30768ZM13.9583 14.1666V7.91664H15.2083V14.1666H13.9583ZM2.30768 6.24997V5.06414L9.99997 1.2981L17.6923 5.06414V6.24997H2.30768ZM5.26268 4.99997H14.7373L9.99997 2.7083L5.26268 4.99997Z" fill="#1C262C" />
                                                    </svg>
                                                    <span className="ms-2 text-truncate fw-semibold text-black">{university.name}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-geo-alt me-2 university-icon flex-shrink-0"></i>
                                                    <span className="text-truncate">{university.location}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-calendar me-2 university-icon flex-shrink-0"></i>
                                                    <span>{university.founded}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-award me-2 university-icon flex-shrink-0"></i>
                                                    <span className="text-truncate">{university.accreditation}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-mortarboard me-2 university-icon flex-shrink-0"></i>
                                                    <span className="text-truncate">{university.degrees}</span>
                                                </div>
                                            </div>

                                            <div className="university-rating px-2 gap-1 fs-12px position-absolute top-0 end-0 mt-3 me-3">
                                                <i className="bi bi-star-fill text-warning rating-star"></i>
                                                <span className='fw-bold'>{university.rating}</span>
                                            </div>

                                            <Button className="view-details mt-auto w-100 py-2">
                                                View Details
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <div className="text-center mt-4 mt-md-5">
                        <Button className="explore py-2 px-4">
                            <Link to={"/v2/home/university"} className="text-decoration-none text-white">
                                Explore All Universities
                                <span className="border-start border-1 mx-2"></span>
                                <i className="bi bi-box-arrow-up-right"></i>
                            </Link>
                        </Button>
                    </div>
                </Container>
            </section>

            <section className="university-listing bg-light py-5 py-md-7">
                <Container>
                    <h1 className='fw-semibold text-dark text-center display-5 university-title mb-4 mb-md-5 px-2'>
                        Find a school that aligns with <br className="d-none d-md-block" /> your child's needs, values, and goals.
                    </h1>

                    <div className="filter-container d-flex flex-nowrap flex-md-wrap justify-content-start justify-content-md-center mb-4 px-3 px-md-0 overflow-auto">
                        {SchoolFilters.map((filter, i) => (
                            <Button
                                key={i}
                                variant={activeFilter === filter ? "active-filter" : "outline-secondary"}
                                className="rounded-pill px-3 px-md-4 py-2 me-2 mb-2 flex-shrink-0"
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                    <div className="slider-container mt-4 px-0 px-md-3 mx-auto">
                        <Slider {...settings}>
                            {filteredUniversities.map((university) => (
                                <div className="h-100 card-wrapper" key={university.id}>
                                    <Card className="slider-card border shadow-sm h-100 mx-auto">
                                        <Card.Body className="d-flex flex-column position-relative p-3 p-md-4 h-100">
                                            <div className="text-center mb-3">
                                                <div
                                                    className="university-logo rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                    style={{
                                                        backgroundColor: university.logoColor,

                                                    }}
                                                >
                                                    <span className="university-logo-text h3 mb-0 fw-bold" style={{ color: university.textColor }}>{university.logo}</span>
                                                </div>
                                            </div>

                                            <div className="university-info small text-muted mb-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                                                        <path d="M4.79164 14.1666V7.91664H6.04164V14.1666H4.79164ZM9.37497 14.1666V7.91664H10.625V14.1666H9.37497ZM2.30768 17.0833V15.8333H17.6923V17.0833H2.30768ZM13.9583 14.1666V7.91664H15.2083V14.1666H13.9583ZM2.30768 6.24997V5.06414L9.99997 1.2981L17.6923 5.06414V6.24997H2.30768ZM5.26268 4.99997H14.7373L9.99997 2.7083L5.26268 4.99997Z" fill="#1C262C" />
                                                    </svg>
                                                    <span className="ms-2 text-truncate fw-semibold text-black">{university.name}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-geo-alt me-2 university-icon flex-shrink-0"></i>
                                                    <span className="text-truncate">{university.location}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-calendar me-2 university-icon flex-shrink-0"></i>
                                                    <span>{university.founded}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-award me-2 university-icon flex-shrink-0"></i>
                                                    <span className="text-truncate">{university.accreditation}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-mortarboard me-2 university-icon flex-shrink-0"></i>
                                                    <span className="text-truncate">{university.degrees}</span>
                                                </div>
                                            </div>

                                            <div className="university-rating px-2 gap-1 fs-12px position-absolute top-0 end-0 mt-3 me-3">
                                                <i className="bi bi-star-fill text-warning rating-star"></i>
                                                <span className='fw-bold'>{university.rating}</span>
                                            </div>

                                            <Button className="view-details mt-auto w-100 py-2">
                                                View Details
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <div className="text-center mt-4 mt-md-5">
                        <Button className="explore py-2 px-4">
                            Explore All School
                            <span className="border-start border-1 mx-2"></span>
                            <i className="bi bi-box-arrow-up-right"></i>
                        </Button>
                    </div>
                </Container>
            </section>

            <section className="slider-section">
                <div ref={containerRef} className="slider-container">
                    <div ref={trackRef} className="slider-track">
                        {processedImages.map((image, index) => (
                            <div key={image.key || index} className="slider-image">
                                <img src={image.logo} alt={image.alt} />
                                {shadowImg && <img src={shadowImg} alt="shadow" className="slider-shadow" />}
                                <p>{image.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="counter-section bg-light py-4">
                <div className="container">
                    <div className="counter d-flex flex-wrap justify-content-evenly align-items-center px-0 px-lg-5">
                        <CounterItem target={120} label="CLASSES" suffix="+" progress={progress} />
                        <CounterItem target={25} label="Teachers" suffix="K+" progress={progress} />
                        <CounterItem target={300} label="Members" suffix="K+" progress={progress} />
                    </div>
                </div>
            </section>


            <section className="university-listing py-5 py-md-7">
                <Container>
                    <h1 className='fw-semibold text-dark text-center display-5 university-title mb-4 mb-md-5 px-2'>
                        Featured study centres and tutors offering specialized courses to help students excel in their academic pursuits.
                    </h1>

                    <div className="filter-container d-flex flex-nowrap flex-md-wrap justify-content-start justify-content-md-center mb-4 px-3 px-md-0 overflow-auto">
                        {filters.map((filter) => (
                            <Button
                                key={filter + "2"}
                                variant={activeFilter === filter ? "active-filter" : "outline-secondary"}
                                className="rounded-pill px-3 px-md-4 py-2 me-2 mb-2 flex-shrink-0"
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                    <div className="slider-container mt-4 px-0 px-md-3 mx-auto">
                        <Slider {...settings}>
                            {filteredUniversities.map((university) => (
                                <div className="h-100 card-wrapper" key={university.id + "2"}>
                                    <Card className="slider-card border shadow-sm h-100 mx-auto">
                                        <Card.Body className="d-flex flex-column position-relative p-3 p-md-4 h-100">
                                            <div className="text-center mb-3">
                                                <div
                                                    className="university-logo rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                    style={{
                                                        backgroundColor: university.logoColor,

                                                    }}
                                                >
                                                    <span className="university-logo-text h3 mb-0 fw-bold" style={{ color: university.textColor }}>{university.logo}</span>
                                                </div>
                                            </div>

                                            <div className="university-info small text-muted mb-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                                                        <path d="M4.79164 14.1666V7.91664H6.04164V14.1666H4.79164ZM9.37497 14.1666V7.91664H10.625V14.1666H9.37497ZM2.30768 17.0833V15.8333H17.6923V17.0833H2.30768ZM13.9583 14.1666V7.91664H15.2083V14.1666H13.9583ZM2.30768 6.24997V5.06414L9.99997 1.2981L17.6923 5.06414V6.24997H2.30768ZM5.26268 4.99997H14.7373L9.99997 2.7083L5.26268 4.99997Z" fill="#1C262C" />
                                                    </svg>
                                                    <span className="ms-2 text-truncate fw-semibold text-black">{university.name}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-geo-alt me-2 university-icon flex-shrink-0"></i>
                                                    <span className="text-truncate">{university.location}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-calendar me-2 university-icon flex-shrink-0"></i>
                                                    <span>{university.founded}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-award me-2 university-icon flex-shrink-0"></i>
                                                    <span className="text-truncate">{university.accreditation}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-mortarboard me-2 university-icon flex-shrink-0"></i>
                                                    <span className="text-truncate">{university.degrees}</span>
                                                </div>
                                            </div>

                                            <div className="university-rating px-2 gap-1 fs-12px position-absolute top-0 end-0 mt-3 me-3">
                                                <i className="bi bi-star-fill text-warning rating-star"></i>
                                                <span className='fw-bold'>{university.rating}</span>
                                            </div>

                                            <Button className="view-details mt-auto w-100 py-2">
                                                View Details
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <div className="text-center mt-4 mt-md-5">
                        <Button className="explore py-2 px-4">
                            Explore All
                            <span className="border-start border-1 mx-2"></span>
                            <i className="bi bi-box-arrow-up-right"></i>
                        </Button>
                    </div>

                    <div className=" mt-5 d-flex justify-content-between flex-wrap align-items-center">
                        {universityPartners?.map((university) => (
                            <img key={university.name} src={university.logo} alt={university.alt} className='university-logos' />
                        ))}
                    </div>
                </Container>
            </section>

            <section className="university-partners-section">
                <Container>
                    <div className="pathway-cards-container py-5">
                        {userPathways.map((pathway) => (
                            <Card
                                key={pathway.id}
                                className={`pathway-card ${pathway.id === activeCardId ? 'expanded' : 'collapsed'}`}
                                onMouseEnter={() => handleCardInteraction(pathway.id)}
                                onMouseLeave={() => setHoveredCardId(null)}
                                onClick={() => handleCardInteraction(pathway.id)} // Add click handler for mobile
                            >
                                <Card.Body className="d-flex flex-column">
                                    <div className="pathway-header">
                                        <h3 className="pathway-category" style={{ color: pathway.color }}>
                                            {pathway.id === '01' && 'For '}{pathway.category}
                                        </h3>
                                        {pathway.title && (
                                            <h3
                                                className={`pathway-title ${pathway.id !== activeCardId ? 'hidden' : ''}`}
                                                style={{ color: pathway.color }}
                                            >
                                                {pathway.title}
                                            </h3>
                                        )}
                                    </div>

                                    <div className={`pathway-content h-100 ${pathway.id !== activeCardId ? 'hidden' : ''}`}>
                                        {pathway.features.length > 0 && (
                                            <ul className="pathway-features text-white">
                                                {pathway.features.map((feature, index) => (
                                                    <li key={index}>{feature}</li>
                                                ))}
                                            </ul>
                                        )}

                                        {pathway.additionalText && (
                                            <div className="pathway-footer">
                                                <h5 className="pathway-prompt w-75">{pathway.additionalText}</h5>
                                                {pathway.cta && (
                                                    <Button
                                                        className="pathway-cta text-center"
                                                        style={{
                                                            backgroundColor: pathway.btnBGColor,
                                                            boxShadow: `0 0 25px ${pathway.btnBGColor}`
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent card activation when clicking button
                                                            pathway.cta.action();
                                                        }}
                                                    >
                                                        {pathway.cta.text}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pathway-number">
                                        <span style={{ color: pathway.color }}>{pathway.id}</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            <section className="onboarding-page">
                <Container>
                    <div className="my-5 py-5">
                        <Row className="justify-content-center mb-5">
                            <Col xs={12} className="text-center">
                                <h1 className="section-title">Simple Steps to Begin</h1>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col xs={12} sm={6} md={3} className="mb-4">
                                <Card className="onboarding-card text-center h-100 bg-transparent shadow-none">
                                    <div className="icon-wrapper">
                                        <img src={form} alt="Sign up form" style={{ width: '60px', height: '60px' }} />
                                    </div>
                                    <div className="step-number">1. Sign Up</div>
                                    <p className="step-description">
                                        Choose your role: Student, Teacher, Institution, or Parent.
                                    </p>
                                </Card>
                            </Col>

                            <Col xs={12} sm={6} md={3} className="mb-4">
                                <Card className="onboarding-card text-center h-100 bg-transparent shadow-none">
                                    <div className="icon-wrapper">
                                        <img src={bank} alt="Institution building" style={{ width: '60px', height: '60px' }} />
                                    </div>
                                    <div className="step-number">2. Create Your Space</div>
                                    <p className="step-description">
                                        Connect with your institution or set up your own.
                                    </p>
                                </Card>
                            </Col>

                            <Col xs={12} sm={6} md={3} className="mb-4">
                                <Card className="onboarding-card text-center h-100 bg-transparent shadow-none">
                                    <div className="icon-wrapper">
                                        <img src={doc} alt="Document" style={{ width: '60px', height: '60px' }} />
                                    </div>
                                    <div className="step-number">3. Start Engaging</div>
                                    <p className="step-description">
                                        Upload notes, join discussions, create flashcards, or share resources.
                                    </p>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="justify-content-center mt-4">
                            <Col xs={12} sm={8} md={3} lg={4} className="text-center">
                                <Button className="get-started-btn">
                                    Get Started
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
            <Footer />
        </main>
    )
}

