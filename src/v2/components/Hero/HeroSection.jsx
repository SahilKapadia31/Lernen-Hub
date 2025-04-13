import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar/Navbar';
import './Hero.scss';

import {
    Button,
    ButtonDropdown,
    Card,
    CardBody,
    CardTitle,
    CardText,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input
} from 'reactstrap';
import { Features } from '../Features/Features';

export const HeroSection = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    // Track window resize to adjust responsive elements
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const cardData = [
        { title: "Universities", count: 366 },
        { title: "Schools", count: 229 },
        { title: "Study Centers", count: 357 },
        { title: "Tutors", count: 149 },
    ];

    // Determine placeholder text based on screen size
    const getPlaceholder = () => {
        if (windowWidth <= 400) {
            return "Search...";
        } else if (windowWidth <= 768) {
            return "Search universities, schools...";
        } else {
            return "Search Universities, Schools, Study Centres, Tutors Or Discipline";
        }
    };

    return (
        <>
            <div className='hero-section'>
                <Navbar />
                <div className="container">
                    <div className="main-land-div">
                        <h1 className='fw-semibold text-white text-center display-5 hero-title'>
                            Your personalized path to the <br className="d-none d-md-block" /> right learning institution.
                        </h1>

                        <div className='hero-search d-flex align-items-stretch mx-auto px-0 px-md-2'>
                            {/* City Selector Dropdown */}
                            <ButtonDropdown className='city-dropdown h-100' isOpen={dropdownOpen} toggle={toggleDropdown}>
                                <DropdownToggle caret color="light" className='border-0 rounded-end-0 d-flex align-items-center justify-content-center h-100'>
                                    <i className="bi bi-geo-alt fs-5 me-1 text-orange"></i>
                                    <span className="dropdown-text">
                                        {windowWidth <= 576 ? "City" : "Select City"}
                                    </span>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem header>Select City</DropdownItem>
                                    <DropdownItem>New York</DropdownItem>
                                    <DropdownItem>Los Angeles</DropdownItem>
                                    <DropdownItem>Chicago</DropdownItem>
                                    <DropdownItem>Houston</DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>

                            {/* Search Input */}
                            <Input
                                placeholder={getPlaceholder()}
                                className='search-input flex-grow-1 rounded-0 border-0'
                            />

                            {/* Search Button */}
                            <div className="search-button-container d-flex align-items-center bg-white rounded-end h-100">
                                <Button className='search-button d-flex align-items-center justify-content-center m-1'>
                                    <i className="bi bi-search text-white"></i>
                                </Button>
                            </div>
                        </div>

                        <div className="card-container px-md-2">
                            {cardData.map((card, index) => (
                                <Card key={index} className="custom-card text-white">
                                    <CardBody>
                                        <CardTitle tag="h5" className='mb-1'>{card.title}</CardTitle>
                                        <CardText className="d-flex align-items-center justify-content-between fw-light">
                                            {card.count}
                                            <i className="bi bi-box-arrow-up-right text-orange fs-5"></i>
                                        </CardText>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="contact-btn rounded-circle d-inline-flex align-items-center justify-content-center">
                    <i class="bi bi-telephone-fill"></i>
                </div>
            </div>
            <Features />
        </>

    );
};