import { useState } from "react"
import {
    Container,
    Row,
    Col,
    Button,
    Input,
    Card,
    CardBody,
    Badge,
    Form,
    FormGroup,
    Label,
    InputGroup,
    InputGroupText,
    Collapse,
} from "reactstrap"

import { Navbar } from "../Navbar/Navbar" // Import your Navbar component

import "./UniversitySearch.scss" // Import your CSS file for custom styles

export const UniversitySearch = () => {
    const [isEngineeringOpen, setIsEngineeringOpen] = useState(true)
    const [isOtherCategoriesOpen, setIsOtherCategoriesOpen] = useState(false)

    const toggleEngineering = () => setIsEngineeringOpen(!isEngineeringOpen)
    const toggleOtherCategories = () => setIsOtherCategoriesOpen(!isOtherCategoriesOpen)

    const universities = [
        { id: 1, name: "Guru Nanak Dev University", location: "Visakhapatnam", color: "bg-light-purple" },
        { id: 2, name: "Guru Nanak Dev University", location: "Amritsar", color: "bg-light-pink" },
        { id: 3, name: "Guru Nanak Dev University", location: "Kalyan-Dombivali", color: "bg-light-green" },
        { id: 4, name: "Guru Nanak Dev University", location: "Vijayawada", color: "bg-light-yellow" },
        { id: 5, name: "Guru Nanak Dev University", location: "Pimpri-Chinchwad", color: "bg-light-blue" },
        { id: 6, name: "Guru Nanak Dev University", location: "Navi Mumbai", color: "bg-light-orange" },
        { id: 7, name: "Guru Nanak Dev University", location: "Amritsar", color: "bg-light-purple" },
    ]

    return (
        <div className="university-search">
            {/* Header */}
            <Navbar activeHeader={true} />
            <Container className="p-0">
                <Row className="g-0">
                    {/* Sidebar */}
                    <Col md={3} lg={2} className="border-end sidebar d-none d-md-block">
                        <div className="p-3">
                            <Button color="link" className="text-danger p-0 mb-4">
                                <i className="bi bi-x me-1"></i> Reset Filters
                            </Button>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0 fw-medium">Select Degree</h6>
                                    <i className="bi bi-chevron-down small"></i>
                                </div>
                                <Form>
                                    <FormGroup check className="mb-2">
                                        <Input type="checkbox" id="bachelor" defaultChecked />
                                        <Label check for="bachelor">
                                            Bachelor's
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check className="mb-2">
                                        <Input type="checkbox" id="masters" />
                                        <Label check for="masters">
                                            Masters
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input type="checkbox" id="doctoral" />
                                        <Label check for="doctoral">
                                            Doctoral
                                        </Label>
                                    </FormGroup>
                                </Form>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0 fw-medium">Select Discipline</h6>
                                    <i className="bi bi-chevron-down small"></i>
                                </div>
                                <div className="discipline-list">
                                    <div className="d-flex justify-content-between align-items-center py-1">
                                        <span>All</span>
                                        <i className="bi bi-chevron-right small"></i>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-1">
                                        <span>Medical</span>
                                        <i className="bi bi-chevron-right small"></i>
                                    </div>
                                    <div
                                        className="d-flex justify-content-between align-items-center py-1 text-primary fw-medium"
                                        onClick={toggleEngineering}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <span>Engineering & Technology</span>
                                        <i className={`bi bi-chevron-${isEngineeringOpen ? "down" : "right"} small`}></i>
                                    </div>

                                    <Collapse isOpen={isEngineeringOpen}>
                                        <div className="ps-3 mt-2">
                                            <FormGroup check className="mb-2">
                                                <Input type="checkbox" id="cs" />
                                                <Label check for="cs">
                                                    Computer Science
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check className="mb-2">
                                                <Input type="checkbox" id="it" />
                                                <Label check for="it">
                                                    Information Technology
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check className="mb-2">
                                                <Input type="checkbox" id="telecom" />
                                                <Label check for="telecom">
                                                    Telecommunication
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check className="mb-2">
                                                <Input type="checkbox" id="instrument" defaultChecked />
                                                <Label check for="instrument">
                                                    Instrumentation
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check className="mb-2">
                                                <Input type="checkbox" id="civil" />
                                                <Label check for="civil">
                                                    Civil
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check className="mb-2">
                                                <Input type="checkbox" id="mechanical" />
                                                <Label check for="mechanical">
                                                    Mechanical
                                                </Label>
                                            </FormGroup>
                                        </div>
                                    </Collapse>

                                    <div className="d-flex justify-content-between align-items-center py-1">
                                        <span>Design</span>
                                        <i className="bi bi-chevron-right small"></i>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-1">
                                        <span>Music</span>
                                        <i className="bi bi-chevron-right small"></i>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-1">
                                        <span>Travel & Tourism</span>
                                        <i className="bi bi-chevron-right small"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="mb-2 fw-medium">Reviews</h6>
                                <Form>
                                    <FormGroup check className="mb-2">
                                        <Input type="checkbox" id="topRanked" defaultChecked />
                                        <Label check for="topRanked">
                                            <i className="bi bi-star-fill text-warning me-1"></i> Top Ranked
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check className="mb-2">
                                        <Input type="checkbox" id="4.5up" />
                                        <Label check for="4.5up">
                                            <i className="bi bi-star-fill text-warning me-1"></i> 4.5 up
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check className="mb-2">
                                        <Input type="checkbox" id="4up" />
                                        <Label check for="4up">
                                            <i className="bi bi-star-fill text-warning me-1"></i> 4 up
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input type="checkbox" id="3.5up" />
                                        <Label check for="3.5up">
                                            <i className="bi bi-star-fill text-warning me-1"></i> 3.5 up
                                        </Label>
                                    </FormGroup>
                                </Form>
                            </div>

                            <div className="mb-4">
                                <h6 className="mb-2 fw-medium">University Fees Range</h6>
                                <div className="position-relative pt-4 pb-2">
                                    <div className="range-slider">
                                        <div className="range-track"></div>
                                        <div className="range-selection"></div>
                                        <div className="range-handle range-handle-min"></div>
                                        <div className="range-handle range-handle-max"></div>
                                    </div>
                                </div>
                                <div className="small text-secondary">₹9,235 - ₹4,00,235</div>
                            </div>

                            <div>
                                <h6 className="mb-2 fw-medium">Format</h6>
                                <Form>
                                    <FormGroup check className="mb-2">
                                        <Input type="checkbox" id="fullTime" />
                                        <Label check for="fullTime">
                                            Full Time
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check className="mb-2">
                                        <Input type="checkbox" id="partTime" />
                                        <Label check for="partTime">
                                            Part Time
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check className="mb-2">
                                        <Input type="checkbox" id="onCampus" />
                                        <Label check for="onCampus">
                                            On Campus
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input type="checkbox" id="online" />
                                        <Label check for="online">
                                            Online
                                        </Label>
                                    </FormGroup>
                                </Form>
                            </div>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col md={9} lg={10} className="main-content">
                        <div className="p-3 p-md-4">
                            <h2 className="mb-3 fw-bold">Universities (1929)</h2>

                            <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                                <Badge pill className="bg-light text-dark d-flex align-items-center p-2">
                                    <span className="badge-dot bg-warning me-1"></span>
                                    Bachelors
                                </Badge>
                                <Badge pill className="bg-light text-dark d-flex align-items-center p-2">
                                    <span className="badge-dot bg-warning me-1"></span>
                                    Instrumentation
                                </Badge>
                                <Badge pill className="bg-light text-dark d-flex align-items-center p-2">
                                    <span className="badge-dot bg-warning me-1"></span>
                                    Top Ranked
                                </Badge>

                                <div className="ms-auto d-flex flex-wrap gap-2 mt-2 mt-md-0">
                                    <InputGroup size="sm">
                                        <Input value="Punjab" />
                                        <InputGroupText className="bg-white text-danger">
                                            <i className="bi bi-x"></i>
                                        </InputGroupText>
                                    </InputGroup>

                                    <div className="btn-group">
                                        <Button color="light" className="active">
                                            <i className="bi bi-list"></i>
                                        </Button>
                                        <Button color="light">
                                            <i className="bi bi-grid"></i>
                                        </Button>
                                    </div>

                                    <Button color="light">
                                        <i className="bi bi-arrow-down-up"></i>
                                    </Button>
                                </div>
                            </div>

                            <div className="university-cards">
                                {universities.map((university) => (
                                    <Card key={university.id} className="mb-3 border">
                                        <CardBody>
                                            <div className="d-flex">
                                                <div className={`university-logo ${university.color} me-3 me-md-4`}>
                                                    <span>GNU</span>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <i className="bi bi-building text-warning me-2"></i>
                                                        <h5 className="mb-0 fw-medium">Guru Nanak Dev University</h5>
                                                        <div className="ms-auto">
                                                            <i className="bi bi-star-fill text-warning"></i>
                                                            <span className="ms-1">4.5</span>
                                                        </div>
                                                    </div>

                                                    <Row className="mb-2">
                                                        <Col xs={12} md={6} className="mb-2 mb-md-0">
                                                            <div className="d-flex align-items-center text-secondary small">
                                                                <i className="bi bi-geo-alt me-2"></i>
                                                                {university.location}
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <div className="d-flex align-items-center text-secondary small">
                                                                <i className="bi bi-calendar me-2"></i>
                                                                1989
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <div className="d-flex align-items-center text-secondary small mb-2">
                                                        <i className="bi bi-mortarboard me-2"></i>
                                                        AICTE
                                                    </div>

                                                    <div className="d-flex align-items-center text-secondary small mb-3">
                                                        <i className="bi bi-people me-2"></i>
                                                        Bachelors, Masters, Doctorals
                                                    </div>

                                                    <div className="text-end">
                                                        <Button color="link" className="text-primary p-0 fw-medium">
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

