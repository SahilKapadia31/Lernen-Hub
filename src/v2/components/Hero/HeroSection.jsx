import React, { useState, useRef, useEffect } from 'react';
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
    const headerRef = useRef(null);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const cardData = [
        { title: "Universities", count: 366 },
        { title: "Schools", count: 229 },
        { title: "Study Centers", count: 357 },
        { title: "Tutors", count: 149 },
    ];

    useEffect(() => {
        // Only add the scroll event listener on larger screens
        if (window.innerWidth > 991 && headerRef.current) {
            const updateScroll = () => {
                const windowScrollTop = window.pageYOffset / 3;
                headerRef.current.style.transform = `translate3d(0, ${windowScrollTop}px, 0)`;
            };

            window.addEventListener('scroll', updateScroll);
            return () => window.removeEventListener('scroll', updateScroll);
        }
    }, []);

    return (
        <div className='hero-section' ref={headerRef}>
            <Navbar />
            <div className="container">
                <div className="main-land-div">
                    <h1 className='fw-semibold text-white text-center display-5 hero-title'>
                        Your personalized path to the <br className="d-none d-md-block" /> right learning institution.
                    </h1>

                    <div className='hero-search'>
                        {/* City Selector Dropdown */}
                        <ButtonDropdown className='city-dropdown' isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle caret color="light" className='border-0 rounded-end-0 d-flex align-items-center justify-content-between'>
                                <i className="bi bi-geo-alt fs-5 me-1 text-orange"></i>
                                Select City
                            </DropdownToggle>
                            <br className='vr' />
                            <DropdownMenu>
                                <DropdownItem header>Select City</DropdownItem>
                                <DropdownItem>New York</DropdownItem>
                                <DropdownItem>Los Angeles</DropdownItem>
                                <DropdownItem>Chicago</DropdownItem>
                                <DropdownItem>Houston</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>

                        {/* Search Input */}
                        {window.innerWidth >= 992 ? <> <Input
                            placeholder="Search Universities, Schools, Study Centres, Tutors Or Discipline"
                            className='search-input'
                        />

                            {/* Search Button */}
                            <div className="search-button-container">
                                <Button className='search-button'>
                                    <i className="bi bi-search text-white fs-5"></i>
                                </Button>
                            </div></> : <div className='d-flex search-bar-Sf '>
                            <Input
                                placeholder="Search Universities, Schools, Study Centres, Tutors Or Discipline"
                                className='search-input'
                            />

                            {/* Search Button */}
                            <div className="search-button-container">
                                <Button className='search-button'>
                                    <i className="bi bi-search text-white fs-5"></i>
                                </Button>
                            </div>
                        </div>}

                    </div>

                    <div className="card-container">
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
            <Features />
        </div>
    );
};