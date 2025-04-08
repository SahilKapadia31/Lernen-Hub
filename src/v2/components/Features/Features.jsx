import React, { useState } from 'react';
import { Container, Card, Button } from "react-bootstrap";
import './Features.scss';
import Slider from 'react-slick';


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

    // Filter categories
    const filters = ["All", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism", "Engineering", "Medical", "Designing", "Music", "Travel & Tourism"]

    // Filter universities based on selected category
    const filteredUniversities =
        activeFilter === "All" ? universities : universities.filter((uni) => uni.categories.includes(activeFilter))

    return (
        <main className="pb-5">
            <Container>
                <section className="py-5">
                    <h1 className='fw-semibold text-dark text-center display-5 hero-title'>
                        Discover a variety of universities <br className="d-none d-md-block" /> offering a wide range of programs.
                    </h1>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {filters.map((filter) => (
                            <Button
                                key={filter}
                                variant={activeFilter === filter ? "active-filter" : "outline-secondary"}
                                className="rounded-pill px-4"
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                </section>

                {/* University Listings */}
                <section className="">
                    <div className="slider-container">
                        <Slider {...settings}>
                            {filteredUniversities.map((university) => (
                                <Card key={university.id} className="h-100 slider-card border shadow-sm hover-shadow transition">
                                    <Card.Body className="d-flex flex-column position-relative">
                                        <div className="text-center mb-3">
                                            <div
                                                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style={{
                                                    width: "90px",
                                                    height: "90px",
                                                    backgroundColor: university.logoColor,
                                                }}
                                            >
                                                <span className="h3 mb-0 fw-bold" style={{ color: `${university.textColor}` }}>{university.logo}</span>
                                            </div>
                                        </div>

                                        <div className="small text-muted mb-3">
                                            <div className="d-flex align-items-center mb-2">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4.79164 14.1666V7.91664H6.04164V14.1666H4.79164ZM9.37497 14.1666V7.91664H10.625V14.1666H9.37497ZM2.30768 17.0833V15.8333H17.6923V17.0833H2.30768ZM13.9583 14.1666V7.91664H15.2083V14.1666H13.9583ZM2.30768 6.24997V5.06414L9.99997 1.2981L17.6923 5.06414V6.24997H2.30768ZM5.26268 4.99997H14.7373L9.99997 2.7083L5.26268 4.99997Z" fill="#1C262C" />
                                                </svg>
                                                <span className="ms-2 text-truncate fw-semibold text-black">{university.name}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-geo-alt me-2" style={{ fontSize: "1rem" }}></i>
                                                <span>{university.location}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-calendar me-2" style={{ fontSize: "1rem" }}></i>
                                                <span>{university.founded}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-award me-2" style={{ fontSize: "1rem" }}></i>
                                                <span>{university.accreditation}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-mortarboard me-2" style={{ fontSize: "1rem" }}></i>
                                                <span>{university.degrees}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center px-2 gap-1 fs-12px mt-3 me-3 border border-1 bg-body-secondary rounded-pill position-absolute top-0 end-0">
                                            <i className="bi bi-star-fill text-warning" style={{ fontSize: "13px" }}></i>
                                            <span className='fw-bold'>{university.rating}</span>
                                        </div>

                                        <Button variant="outline-primary" className="mt-auto w-100">
                                            View Details
                                        </Button>
                                    </Card.Body>
                                </Card>

                            ))}
                        </Slider>
                    </div>
                </section>
            </Container>

        </main>
    )
}
