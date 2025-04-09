import React, { useState } from 'react';
import { Container, Card, Button } from "react-bootstrap";
import './Features.scss';
import Slider from 'react-slick';
import slideOne from '../../../img/v2/autoslide1.png'
import slideTwo from '../../../img/v2/autoslide2.png'
import slideThree from '../../../img/v2/autoslide3.png'
import slideFour from '../../../img/v2/autoslide4.png'
import slideFive from '../../../img/v2/autoslide5.png'
import shadowImg from '../../../img/v2/image.png'


export const Features = () => {
    // Filter state
    const [activeFilter, setActiveFilter] = useState("All")

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

    let settings = {
        infinite: false,
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
                    infinite: false,
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
        autoplay: false,
        speed: 5000,
        autoplaySpeed: 1000,
        cssEase: "linear",
        arrows: false,
    };

    // Filter categories
    const filters = ["All", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism"]
    const SchoolFilters = ["All", "Elementary", "Secondary", "Religious", "Boarding", "Special Education Schools", "International", "Preschools"]
    const sliderImages = [slideOne, slideTwo, slideThree, slideFour, slideFive]

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

            <section className="university-listing school-listing bg-light">
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
                                <img src={image} alt={image} className='w-100 h-100' />
                                <img src={shadowImg} alt={shadowImg} className='slider-shadow' />
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
        </main>
    )
}
