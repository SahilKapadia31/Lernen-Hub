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
                    dots: true
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
                                    <Card.Body className="d-flex flex-column">
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
                                            <h2 className="h5 card-title">{university.name}</h2>
                                        </div>

                                        <div className="small text-muted mb-3">
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

                                        <div className="d-flex align-items-center mb-3">
                                            <i className="bi bi-star-fill me-2 text-warning" style={{ fontSize: "1rem" }}></i>
                                            <span>{university.rating}</span>
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
