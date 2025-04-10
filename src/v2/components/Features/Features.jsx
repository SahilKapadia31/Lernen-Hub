import React, { useState } from 'react';
import { Container, Card, Button } from "react-bootstrap";
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

export const Features = () => {
    // Filter state
    const [activeFilter, setActiveFilter] = useState("All")
    const [hoveredCardId, setHoveredCardId] = useState(null);

    const activeCardId = hoveredCardId || '01';

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
            color: '#6865cf',
            features: [
                'Find subject-wise discussions, upload your notes, and connect with peers.',
                'Mark key points and highlight important PDFs for future reference.',
                'Create flashcards anytime, anywhere – learn at your pace.'
            ],
            cta: {
                text: 'Join Now',
                action: () => console.log('Student signup')
            },
            additionalText: 'Ready to take charge of your learning?'
        },
        {
            id: '02',
            category: 'Teachers & Professors',
            title: 'Learn, Engage, and Grow',
            color: '#ff7f50',
            features: [
                'Share resources, notes, and assignments securely, and collaborate with colleagues in private spaces.',
                'Foster engaging discussions, moderate content, and answer student questions.',
                'Stay connected with students beyond the classroom, even after the bell rings.'
            ],
            cta: {
                text: 'Join Now',
                action: () => console.log('Teacher signup')
            },
            additionalText: 'Let\'s bring your teaching online – Get started today!'
        },
        {
            id: '03',
            category: 'Parents',
            title: 'Stay Involved, Without Overbearing',
            color: '#ffd700',
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
            additionalText: 'Sign up today and stay connected!'
        },
        {
            id: '04',
            category: 'Institutions',
            title: 'A Complete Digital Learning Hub',
            color: '#00cc99',
            features: [
                'Create a dedicated space for your students and faculty to interact, share content, and collaborate.',
                'Offer structured content and discussions while securely sharing documents.',
                'Monitor student engagement and ensure a smooth, organized learning environment.'
            ],
            cta: {
                text: 'Join Now',
                action: () => console.log('Institution signup')
            },
            additionalText: 'Set up your institution\'s space today – no need to build an LMS from scratch!'
        }
    ];

    let settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const autoPlaySettings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        speed: 5000,
        autoplaySpeed: 1000,
        cssEase: "linear",
        arrows: false,
    };

    // Filter categories
    const filters = ["All", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism"]
    const SchoolFilters = ["All", "Elementary", "Secondary", "Religious", "Boarding", "Special Education Schools", "International", "Preschools"]
    const sliderImages = [
        { name: 'DANCING', logo: dancing, alt: 'Dancing' },
        { name: 'CRICKET', logo: cricket, alt: 'Cricket' },
        { name: 'SCHOOL SUBJECTS', logo: school_subject, alt: 'School Subjects' },
        { name: 'DRAWING', logo: drawing, alt: 'Drawing' },
        { name: 'MUSIC', logo: music, alt: 'Music' },
    ]
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

    return (
        <main>
            <section className="university-listing">
                <Container>
                    <h1 className='fw-semibold text-dark text-center display-5 university-title mb-5'>
                        Discover a variety of universities <br className="d-none d-md-block" /> offering a wide range of programs.
                    </h1>

                    <div className="filter-container d-flex flex-wrap gap-2 justify-content-center mb-4">
                        {filters.map((filter) => (
                            <Button
                                key={filter}
                                variant={activeFilter === filter ? "active-filter" : "outline-secondary"}
                                className="rounded-pill px-4 py-2 mb-2"
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                    <div className="slider-container mt-4">
                        <Slider {...settings}>
                            {filteredUniversities.map((university) => (
                                <div className="px-1" key={university.id}>
                                    <Card className="slider-card border shadow-sm hover-shadow transition">
                                        <Card.Body className="d-flex flex-column position-relative">
                                            <div className="text-center mb-2">
                                                <div
                                                    className={`university-logo rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                                                    style={{
                                                        backgroundColor: university.logoColor,
                                                    }}
                                                >
                                                    <span className="university-logo-text h3 mb-0 fw-bold" style={{ color: university.textColor }}>{university.logo}</span>
                                                </div>
                                            </div>

                                            <div className="university-info small text-muted mb-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.79164 14.1666V7.91664H6.04164V14.1666H4.79164ZM9.37497 14.1666V7.91664H10.625V14.1666H9.37497ZM2.30768 17.0833V15.8333H17.6923V17.0833H2.30768ZM13.9583 14.1666V7.91664H15.2083V14.1666H13.9583ZM2.30768 6.24997V5.06414L9.99997 1.2981L17.6923 5.06414V6.24997H2.30768ZM5.26268 4.99997H14.7373L9.99997 2.7083L5.26268 4.99997Z" fill="#1C262C" />
                                                    </svg>
                                                    <span className="ms-2 text-truncate fw-semibold text-black">{university.name}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-geo-alt me-2 university-icon"></i>
                                                    <span>{university.location}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-calendar me-2 university-icon"></i>
                                                    <span>{university.founded}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-award me-2 university-icon"></i>
                                                    <span>{university.accreditation}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-mortarboard me-2 university-icon"></i>
                                                    <span>{university.degrees}</span>
                                                </div>
                                            </div>

                                            <div className="university-rating px-2 gap-1 fs-12px mt-3 me-3">
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

                    <div className="text-center mt-5">
                        <Button className="explore py-2 px-4">
                            Explore All Universities
                            <span className="border-start border-1 mx-2"></span>
                            <i className="bi bi-box-arrow-up-right fs-5"></i>
                        </Button>
                    </div>
                </Container>
            </section>

            <section className="university-listing bg-light">
                <Container>
                    <h1 className='fw-semibold text-dark text-center display-5 university-title mb-5'>
                        Find a school that aligns with <br className="d-none d-md-block" /> your child's needs, values, and goals.
                    </h1>

                    <div className="filter-container d-flex flex-wrap gap-2 justify-content-center mb-4">
                        {SchoolFilters.map((filter) => (
                            <Button
                                key={filter}
                                variant={activeFilter === filter ? "active-filter" : "outline-secondary"}
                                className="rounded-pill px-4 py-2 mb-2"
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                    <div className="slider-container mt-4">
                        <Slider {...settings}>
                            {filteredUniversities.map((university) => (
                                <div className="px-1" key={university.id}>
                                    <Card className="slider-card border shadow-sm hover-shadow transition">
                                        <Card.Body className="d-flex flex-column position-relative">
                                            <div className="text-center mb-2">
                                                <div
                                                    className={`university-logo rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                                                    style={{
                                                        backgroundColor: university.logoColor,
                                                    }}
                                                >
                                                    <span className="university-logo-text h3 mb-0 fw-bold" style={{ color: university.textColor }}>{university.logo}</span>
                                                </div>
                                            </div>

                                            <div className="university-info small text-muted mb-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.79164 14.1666V7.91664H6.04164V14.1666H4.79164ZM9.37497 14.1666V7.91664H10.625V14.1666H9.37497ZM2.30768 17.0833V15.8333H17.6923V17.0833H2.30768ZM13.9583 14.1666V7.91664H15.2083V14.1666H13.9583ZM2.30768 6.24997V5.06414L9.99997 1.2981L17.6923 5.06414V6.24997H2.30768ZM5.26268 4.99997H14.7373L9.99997 2.7083L5.26268 4.99997Z" fill="#1C262C" />
                                                    </svg>
                                                    <span className="ms-2 text-truncate fw-semibold text-black">{university.name}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-geo-alt me-2 university-icon"></i>
                                                    <span>{university.location}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-calendar me-2 university-icon"></i>
                                                    <span>{university.founded}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-award me-2 university-icon"></i>
                                                    <span>{university.accreditation}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-mortarboard me-2 university-icon"></i>
                                                    <span>{university.degrees}</span>
                                                </div>
                                            </div>

                                            <div className="university-rating px-2 gap-1 fs-12px mt-3 me-3">
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

                    <div className="text-center mt-5">
                        <Button className="explore py-2 px-4">
                            Explore All Universities
                            <span className="border-start border-1 mx-2"></span>
                            <i className="bi bi-box-arrow-up-right fs-5"></i>
                        </Button>
                    </div>
                </Container>
            </section>

            <section className='slider-section'>
                <div className="slider-container m-0">
                    <Slider {...autoPlaySettings}>
                        {sliderImages?.map((image, index) => (
                            <div key={index} className='slider-image'>
                                <img src={image.logo} alt={image.alt} className='' />
                                <img src={shadowImg} alt={shadowImg} className='slider-shadow' />
                                <p className='position-absolute text-center z-1 bottom-0 text-white pb-4 fw-semibold fs-5 start-0 end-0'>{image.name}</p>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            <section className="university-listing ">

            </section>
            <section className="university-listing">
                <Container>
                    <h1 className='fw-semibold text-dark text-center display-5 university-title mb-5'>
                        Featured study centres and tutors offering specialized courses to help students excel in their academic pursuits.
                    </h1>

                    <div className="filter-container d-flex flex-wrap gap-2 justify-content-center mb-4">
                        {filters.map((filter) => (
                            <Button
                                key={filter}
                                variant={activeFilter === filter ? "active-filter" : "outline-secondary"}
                                className="rounded-pill px-4 py-2 mb-2"
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                    <div className="slider-container mt-4">
                        <Slider {...settings}>
                            {filteredUniversities.map((university) => (
                                <div className="px-1" key={university.id}>
                                    <Card className="slider-card border shadow-sm hover-shadow transition">
                                        <Card.Body className="d-flex flex-column position-relative">
                                            <div className="text-center mb-2">
                                                <div
                                                    className={`university-logo rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                                                    style={{
                                                        backgroundColor: university.logoColor,
                                                    }}
                                                >
                                                    <span className="university-logo-text h3 mb-0 fw-bold" style={{ color: university.textColor }}>{university.logo}</span>
                                                </div>
                                            </div>

                                            <div className="university-info small text-muted mb-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.79164 14.1666V7.91664H6.04164V14.1666H4.79164ZM9.37497 14.1666V7.91664H10.625V14.1666H9.37497ZM2.30768 17.0833V15.8333H17.6923V17.0833H2.30768ZM13.9583 14.1666V7.91664H15.2083V14.1666H13.9583ZM2.30768 6.24997V5.06414L9.99997 1.2981L17.6923 5.06414V6.24997H2.30768ZM5.26268 4.99997H14.7373L9.99997 2.7083L5.26268 4.99997Z" fill="#1C262C" />
                                                    </svg>
                                                    <span className="ms-2 text-truncate fw-semibold text-black">{university.name}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-geo-alt me-2 university-icon"></i>
                                                    <span>{university.location}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-calendar me-2 university-icon"></i>
                                                    <span>{university.founded}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-award me-2 university-icon"></i>
                                                    <span>{university.accreditation}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-mortarboard me-2 university-icon"></i>
                                                    <span>{university.degrees}</span>
                                                </div>
                                            </div>

                                            <div className="university-rating px-2 gap-1 fs-12px mt-3 me-3">
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

                    <div className="text-center mt-5">
                        <Button className="explore py-2 px-4">
                            Explore All Universities
                            <span className="border-start border-1 mx-2"></span>
                            <i className="bi bi-box-arrow-up-right fs-5"></i>
                        </Button>
                    </div>

                    <div className=" mt-5 d-flex flex-wrap justify-content-between">
                        {universityPartners?.map((university) => (
                            <img key={university.name} src={university.logo} alt={university.alt} className='university-logos' />
                        ))}
                    </div>
                </Container>
            </section>
            {/* <section className='about-us'>
                <Container>
                    <div className="d-flex">
                        <Card className="">
                            <Card.Body className="d-flex flex-column position-relative">

                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </section> */}

            <section className="university-partners-section">
                <Container>
                    <div className="pathway-cards-container">
                        {userPathways.map((pathway) => (
                            <Card
                                key={pathway.id}
                                className={`pathway-card ${pathway.id === activeCardId ? 'expanded' : 'collapsed'}`}
                                onMouseEnter={() => setHoveredCardId(pathway.id)}
                                onMouseLeave={() => setHoveredCardId(null)}
                            >
                                <Card.Body className="d-flex flex-column">
                                    <div className="pathway-header">
                                        <h3 className="pathway-category" style={{ color: pathway.color }}>
                                            {pathway.id === '01' && 'For '}{pathway.category}
                                        </h3>
                                        {pathway.title && (
                                            <h4
                                                className={`pathway-title ${pathway.id !== activeCardId ? 'hidden' : ''}`}
                                                style={{ color: pathway.color }}
                                            >
                                                {pathway.title}
                                            </h4>
                                        )}
                                    </div>

                                    <div className={`pathway-content ${pathway.id !== activeCardId ? 'hidden' : ''}`}>
                                        {pathway.features.length > 0 && (
                                            <ul className="pathway-features">
                                                {pathway.features.map((feature, index) => (
                                                    <li key={index}>{feature}</li>
                                                ))}
                                            </ul>
                                        )}

                                        {pathway.additionalText && (
                                            <div className="pathway-footer">
                                                <h5 className="pathway-prompt">{pathway.additionalText}</h5>
                                                {pathway.cta && (
                                                    <Button
                                                        className="pathway-cta"
                                                        style={{ backgroundColor: pathway.color }}
                                                        onClick={pathway.cta.action}
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
        </main>
    )
}

