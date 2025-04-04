import React, { useState, useEffect, useContext } from "react";
import CardFlip from "react-card-flip";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context_provider";
import {
    Button,
    Container,
    Row,
    Col,
    Card,
    CardImg,
    CardBody,
    CardTitle,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Label,
    Input,
} from "reactstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {
    FaRandom,
    FaRedo,
    FaSyncAlt,
    FaStop,
    FaVolumeMute,
    FaVolumeUp,
    FaArrowRight,
    FaArrowLeft,
} from "react-icons/fa";
import { GiClick } from "react-icons/gi";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FlashCard.scss";
import { ipaddress2 } from "../../App";
import { getDecryptedData } from "../../utils/helperFunctions";
import axiosInstance from "../axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import InputRange from "react-input-range";
import Tooltip from "react-bootstrap/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import Tour from "reactour";
import { closeTour } from "../../features/tourSlice";
import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";
import { toast } from "react-toastify";
const flashcardData = [
    {
        flash_card_set_id: 30,
        flashcard_id: "FCADF28934",
        term: "Newton’s Law of Gravitation",
        definition:
            "The directions of this force are along the line joining the two bodies",
        d_image_url:
            "https://api.lernen-hub.de/media/definition_image/71f0a2VCL5L._AC_UF10001000_QL80__HQcvCJZ.jpg",
        t_image_url:
            "https://api.lernen-hub.de/media/term_image/11th_Commerce__21264.jpg",
    },
    {
        flash_card_set_id: 30,
        flashcard_id: "FCA2418F59",
        term: "Characteristics of Gravitational Force",
        definition:
            "The characteristics of gravitational force are as follows:\n\nIt is always attractive in nature\n\nIt obeys the inverse square law.",
        d_image_url: "https://api.lernen-hub.de/media/definition_image/images.png",
        t_image_url: "https://api.lernen-hub.de/media/term_image/22874_front.webp",
    },
    {
        flash_card_set_id: 30,
        flashcard_id: "FCA6194820",
        term: "Principle of Superposition of Gravitation",
        definition:
            "It states that the resultant gravitational force acting on a particle due to the number",
        d_image_url:
            "https://api.lernen-hub.de/media/definition_image/video-game-lover-bag.jpeg",
        t_image_url:
            "https://api.lernen-hub.de/media/term_image/66801d9453f4fd2ec00cf917-aursear-pink-school-backpacks-set-for.jpg",
    },
];

const tourConfig = [
    {
        selector: "#EQ__Toggel",
        content: ({ goTo, inDOM }) => (
            <div>
                Fine-tune your audio experience by adjusting the EQ settings. Customize the vocal tone, volume, and playback speed to match your preferences. Select a voice type and tweak the sliders for optimal sound quality. Click 'Save' to apply changes or 'Reset' to restore defaults.,
                <br />
                <i className="fas fa-caret-right card-arrow-tour" aria-hidden="true" ></i>
            </div>
        )

    },
    // {
    //     selector: "#Audio__Toggel",
    //     content: `Toggle Audio`,
    // },
    {
        selector: "#Tap_Flip",
        content: `Tap to flip, use forword or backword arrow to navigate`,
        highlightedSelectors: ["#control_btn"],
    },
    {
        selector: "#Play_Buttons",
        content: `Play flashcards in Shuffle, Loop, or Repeat mode`,
    },
    {
        selector: "#Pause_Buttons",
        content: `Stop Auto-Play`,
    },
];
const FlashcardReader = () => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate()
    const [isFlipped, setIsFlipped] = useState(false);
    const [flashcardData, setFlashcardData] = useState([]);
    const [flashcardSet, setFlashcardSet] = useState();
    const [suggestedFlashsets, setSuggestedFlashsets] = useState([]);
    const [genderVoiceType, setGenderVoiceType] = useState();
    const [speakLanguaue, setSpeakLanguaue] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mode, setMode] = useState(null);
    const [isReading, setIsReading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [shuffledIndexes, setShuffledIndexes] = useState([]);
    const [readIndexes, setReadIndexes] = useState(new Set());
    const [modalMessage, setModalMessage] = useState(
        "Are you sure you want to stop reading?"
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [configModal, setConfigModal] = useState(false);
    const [mute, setMute] = useState(false);
    const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
    const [pendingMode, setPendingMode] = useState(null);
    const [readingDefinition, setReadingDefinition] = useState(false);
    const [isBookmarkedFlashcard, setIsBookmarkedFlashcard] = useState(false)
    const [settings, setSettings] = useState({
        voicetype: "Male",
        pitch: 1, // Default 1 (mid-range)
        volume: mute ? 0 : 1, // Ensure mute is applied
        rate: 1, // Default 1 (normal speed)
    });
    const [tempSettings, setTempSettings] = useState({ ...settings });

    let { flashset_id } = useParams();
    let { id } = useParams();
    let { type } = useParams();
    const renderTooltip3 = (value) => (
        <Tooltip id="button-tooltip">{value}</Tooltip>
    );
    let {
        translate_value,
        addsubjects_layout,
        setgroup_visible,
        setstudylist_visible,
        setcourse_visible,
        navbar_dropdown_visible,
        setnavbar_dropdown_visible,
    } = useContext(Context);
    useEffect(() => {
        fetchSuggestedFlashsets();
        getflashcards();
    }, []);

    useEffect(() => {
        if (isReading) {
            readFlashcard();
        }
    }, [currentIndex, isReading]);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };
    // ------------------------------To get all the Saved Flashsets--------------------------------------------------
    const fetchSuggestedFlashsets = async () => {
        try {
            const selectedSubTab = sessionStorage.getItem('selectedSubTab');

            if (!selectedSubTab) {
                console.warn("No selected sub-tab found.");
                return;
            }

            const { user_id } = user;
            let url = null;

            switch (selectedSubTab) {
                case "flashcard_studylist":
                    url = axiosInstance.post(`${ipaddress2}/FlashcardStudylistRetrive/`, { study_list_id: id, user_id });
                    break;
                case "public":
                    url = axiosInstance.get(`${ipaddress2}/flashcardsetsRetrive/${id}/${user_id}/`);
                    break;
                case "myflashcards":
                    url = axiosInstance.get(`${ipaddress2}/myflashset/${user_id}/${id}/`);
                    break;
                case "created_flashcard":
                    url = axiosInstance.get(`${ipaddress2}/UserFlashcardsetsRetrive/${user_id}/`);
                    break;
                case "saved_flashcard":
                    url = axiosInstance.post(`${ipaddress2}/SavedStudylistFlashsets/`, { user_id });
                    break;
                default:
                    console.warn("Invalid sub-tab selection:", selectedSubTab);
                    return;
            }

            const response = await url;

            if (response?.data) {
                let data = response.data;
                if (selectedSubTab == "flashcard_studylist") {
                    data = response.data.study_lists.map(({ flashset_details, ...rest }) => ({
                        ...rest,
                        ...flashset_details
                    }));
                }
                if (selectedSubTab == "saved_flashcard") {
                    data = response.data.map(({ flashset_details, ...rest }) => ({
                        ...rest,
                        ...flashset_details
                    }));
                }
                const filteredData = data.filter((item) => item.flashset_id !== flashset_id);
                setSuggestedFlashsets(filteredData);
            }
        } catch (error) {
            console.error("Error fetching flashsets:", error);
        }
    };

    const fetchBookmarkedflashcards = () => {
        if (flashcardSet && flashcardSet.flashcards_data.length) {
            const bookmarked_flashcards = flashcardSet.flashcards_data.filter((flashCardItem) => flashCardItem?.bookmark_status)
            if (bookmarked_flashcards.length > 0) {
                setFlashcardData(bookmarked_flashcards);
                setCurrentIndex(0)
                setIsBookmarkedFlashcard(true)
                setDropdownOpen(false)
            } else {
                toast.error("No Flashcard Bookmarked")
            }
        }
    };
    const getflashcards = () => {
        // console.log("Flashindexcount",flashcardsindex)
        axiosInstance
            .get(`${ipaddress2}/flashcardsList/${flashset_id}/${user.user_id}/`)
            .then((r) => {
                const data = r.data;
                if(data && data.flashcards_data.length){
                    navigate(`/filterflashcard/${type}/${id}/${flashset_id}`)
                }else{
                    toast.error("No flashset available to play");
                    return;
                }
                setFlashcardSet(data);
                setIsBookmarkedFlashcard(false)
                setDropdownOpen(false)
                // const { language, gender_voicetype } = data;
                // if (language && gender_voicetype) {
                //     setGenderVoiceType(gender_voicetype);
                //     const voiceMapping = {
                //         EN: {
                //             Male: 'UK English Male',
                //             Female: 'UK English Female',
                //         },
                //         DE: {
                //             Male: 'Deutsch Male',
                //             Female: 'Deutsch Female',
                //         }
                //     };
                //     const selectedVoice = voiceMapping[language]?.[gender_voicetype] || '';
                //     setSpeakLanguaue(selectedVoice);
                // }
                const { language } = data; // Only extract language

                if (language) {
                    const voiceMapping = {
                        EN: "UK English",
                        DE: "Deutsch",
                    };

                    const selectedVoice = voiceMapping[language] || "";
                    setSpeakLanguaue(selectedVoice);
                }

                setFlashcardData(r.data.flashcards_data);
            })
            .catch(() => {
                console.log("Particular Flashset details2 Fetching Error");
            });
    };

    const readFlashcard = () => {
        const card = flashcardData[currentIndex];
        if (!card) return;
        if (typeof responsiveVoice !== "undefined") {
            window.responsiveVoice.speak(
                card.term,
                speakLanguaue + " " + settings.voicetype,
                {
                    rate: settings.rate,
                    volume: mute ? 0 : settings.volume,
                    pitch: settings.pitch,
                    onend: () => {
                        setReadingDefinition(true);
                        setTimeout(() => {
                            setIsFlipped(true);
                            window.responsiveVoice.speak(
                                card.definition,
                                speakLanguaue + " " + settings.voicetype,
                                {
                                    rate: settings.rate,
                                    volume: mute ? 0 : settings.volume,
                                    pitch: settings.pitch,
                                    onend: () => {
                                        setReadingDefinition(false);
                                        setTimeout(() => {
                                            setIsFlipped(false);
                                            if (mode === "shuffle") {
                                                handleNextShuffledCard();
                                            } else if (mode === "loop") {
                                                setCurrentIndex(
                                                    (prev) => (prev + 1) % flashcardData.length
                                                );
                                            } else if (mode === "repeat") {
                                                readFlashcard();
                                            }
                                        }, 1000);
                                    },
                                }
                            );
                        }, 1000);
                    },
                }
            );
        }
    };

    const toggleAudioModal = () => {
        setIsAudioModalOpen(!isAudioModalOpen);
    };
    const confirmReadingMode = (mode) => {
        if (!isReading) {
            setPendingMode(mode);
            setIsAudioModalOpen(true);
        } else {
            toggleConfirmModal();
        }
    };

    const handleAudioChoice = (useAudio) => {
        if (!useAudio) {
            setMute(() => {
                setSettings((prevSettings) => ({
                    ...prevSettings,
                    volume: 0,
                }));
                return true;
            });
        }
        setIsAudioModalOpen(false);
        startReading(pendingMode);
    };

    const toggleConfirmModal = () => {
        setIsConfirmModalOpen(!isConfirmModalOpen);
    };

    const handleConfirm = () => {
        setIsReading(false);
        setMode(null);
        setMute(false);
        setSettings((prevSettings) => ({
            ...prevSettings,
            volume: 1,
        }));
        if (typeof responsiveVoice !== "undefined") {
            window.responsiveVoice.cancel();
        }
        if (readingDefinition) {
            setIsFlipped(false);
        }
        setCurrentIndex(0);
        toggleConfirmModal();
    };
    const startReading = (selectedMode) => {
        if (isReading) {
            toggleConfirmModal();
        } else {
            setMode(selectedMode);
            if (selectedMode === "shuffle") {
                setReadIndexes(new Set());
                setCurrentIndex(Math.floor(Math.random() * flashcardData.length));
            }
            setTimeout(() => {
                setIsReading(true);
            }, 1000);
        }
    };

    const handleNextShuffledCard = () => {
        setReadIndexes((prevIndexes) => {
            const updatedIndexes = new Set(prevIndexes);
            updatedIndexes.add(currentIndex);
            if (updatedIndexes.size === flashcardData.length) {
                setMode("");
                setIsReading(false);
                return updatedIndexes;
            }
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * flashcardData.length);
            } while (updatedIndexes.has(newIndex));

            setCurrentIndex(newIndex);
            return updatedIndexes;
        });
    };

    const stopReading = () => {
        if (isReading) {
            setModalMessage("Are you sure you want to stop reading?");
            toggleConfirmModal();
        }
    };

    const toggleResetConfigModal = () => {
        setTempSettings({
            voicetype: "Male",
            pitch: 1,
            volume: mute ? 0 : 1,
            rate: 1,
        });
    };

    const handleTempConfigChange = ({ target: { name, value } }) => {
        const formattedValue =
            name === "voicetype" ? value : parseFloat(parseFloat(value).toFixed(2)); // Format and ensure it's a number
        if (name === "volume") {
            setMute(formattedValue === 0);
        }
        setTempSettings((prevTempSettings) => ({
            ...prevTempSettings,
            [name]: formattedValue,
        }));
    };

    const saveConfig = () => {
        setSettings(tempSettings);
        toggleConfigModal();
    };

    const toggleConfigModal = () => {
        setConfigModal(!configModal);
        setTempSettings(settings);
    };

    // const toggleMute = () => {
    //     setMute(!mute);
    //     setSettings(...settings, volume = !mute)
    // };
    const toggleMute = () => {
        setMute((prevMute) => {
            const newMute = !prevMute;
            setSettings((prevSettings) => ({
                ...prevSettings,
                volume: newMute ? 0 : 1,
            }));
            return newMute;
        });
    };
    const handleNextCard = () => {
        setIsFlipped(false)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcardData.length);

    };

    const handlePrevCard = () => {
        setIsFlipped(false)
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? flashcardData.length - 1 : prevIndex - 1
        );
    };

    const accentColor = "rgb(93, 95, 227)";
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [tourKey, setTourKey] = useState(0);
    const [tourCurrentStep, setTourCurrentStep] = useState(0);
    const tourState = useSelector((state) => state.tour);
    useEffect(() => {
        setIsTourOpen(tourState?.isTourOpen);
        setTourKey(tourState?.tourKey);
        console.log("tourState?.isTourOpen", tourState?.isTourOpen);
        if (tourState?.isTourOpen == true) {
            onTourCurrentStep(0);
        } else {
            setConfigModal(false);
        }
    }, [tourState]);

    const dispatch = useDispatch();
    const closeTourGuide = () => {
        document.getElementById("Play_Buttons").style.visibility = "visible";
        document.getElementById("Pause_Buttons").style.visibility = "visible";
        dispatch(closeTour());
    };

    useEffect(() => {
        closeTourGuide();
    }, []);

    useEffect(() => {
        if (isTourOpen) {
            disableBodyScroll(document.body);
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
        } else {
            enableBodyScroll(document.body);
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            clearAllBodyScrollLocks();
        }
    }, [isTourOpen]);

    useEffect(() => {
        setTimeout(() => {
            const playButtonsElement = document.getElementById("Play_Buttons");
            const pauseButtonsElement = document.getElementById("Pause_Buttons");
            if (playButtonsElement) {
                if (tourCurrentStep === 1) {
                    playButtonsElement.style.visibility = "hidden";
                    pauseButtonsElement.style.visibility = "hidden";
                } else {
                    playButtonsElement.style.visibility = "visible";
                    pauseButtonsElement.style.visibility = "visible";
                }
            }
        }, 100);
    }, [tourCurrentStep]);

    const onTourCurrentStep = (step) => {
        console.log("step", step);
        console.log("tourState?.isTourOpen", tourState?.isTourOpen);
        if (tourState?.isTourOpen) {
            setTimeout(() => {
                var ___reactour = document.querySelector("#___reactour>div");
                if (step == 0) {
                    if (___reactour) {
                        const ___reactourClassName = ___reactour.className;
                        document.querySelector(
                            "#___reactour>div"
                        ).className = `${___reactourClassName} no-opacity`;
                    }
                    setConfigModal(configModal === true ? false : true);
                } else {
                    if (___reactour) {
                        const ___reactourClassName = ___reactour.className;
                        document.querySelector("#___reactour>div").className =
                            ___reactourClassName.replace("no-opacity", "");
                    }
                    setConfigModal(false);
                }
            }, 100);
        }


        setTourCurrentStep(step);
    };

    return (
        <Container className="mt-5" id="FlashcardRead">
            <div className='mb-3'>
                <Link className='nav_paths text-decoration-none' style={{ color: 'rgb(93, 95, 227)', textTransform: 'capitalize', fontWeight: 600 }} onClick={() => navigate(-1)}>
                    <svg fill="rgb(93, 95, 227" width="12px" height="12px" viewBox="0 0 52 52" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="4"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g data-name="Group 132" id="Group_132"> <path d="M38,52a2,2,0,0,1-1.41-.59l-24-24a2,2,0,0,1,0-2.82l24-24a2,2,0,0,1,2.82,0,2,2,0,0,1,0,2.82L16.83,26,39.41,48.59A2,2,0,0,1,38,52Z"></path> </g> </g></svg>
                    &nbsp;&nbsp;
                    {'Go Back'}
                </Link>
            </div>
            <Card className="my-2">
                {" "}
                {/* Added mt-4 for margin top */}
                <CardBody>
                    <div className="d-flex justify-content-between align-items-start align-items-lg-center">
                        {" "}
                        {/* Added flexbox for alignment */}
                        <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-start">
                            <div>
                                {flashcardSet && (
                                    <CardTitle className="flashcard-title mb-0 text-start">
                                        <span style={{ fontWeight: "700", textTransform: 'capitalize' }}>
                                            {flashcardSet.name}
                                        </span>
                                        {isBookmarkedFlashcard ? <span className="bookmarked fw-bold">Bookmarked</span> : ''}
                                    </CardTitle>
                                )}
                            </div>
                            <div className="d-block d-lg-none">
                                <h5 className="flashcard-title mb-0">
                                    {currentIndex + 1} / {flashcardData.length}
                                </h5>
                            </div>
                        </div>
                        <div className="d-flex gap-2 float-end p-2">
                            {!mute && (
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 250 }}
                                    overlay={renderTooltip3("Adjust Speech Settings")}
                                >
                                    <i
                                        id="EQ__Toggel"
                                        className="fa fa-sliders mt-1 me-2"
                                        aria-hidden="true"
                                        style={{ cursor: "pointer", fontSize: "17px" }}
                                        onClick={toggleConfigModal}
                                    ></i>
                                </OverlayTrigger>
                            )}
                            {/* <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={renderTooltip3(" Mute")}>
                                <Button id="Audio__Toggel" onClick={toggleMute} style={{ padding: 0, border: 'none', color: 'black', background: 'transparent' }}> 
                                    {mute ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                                </Button>
                            </OverlayTrigger> */}
                            {/* <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} style={{ background: 'transprent' }}>
                                <DropdownToggle caret></DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>Bookmarked Flashcards</DropdownItem>
                                    <DropdownItem>All Flashcards</DropdownItem>
                                </DropdownMenu>
                            </Dropdown> */}
                            <span className="ms-1" style={{ cursor: "pointer" }} onClick={toggleDropdown}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                </svg>
                            </span>
                            <div className={`bg-white border rounded p-2 ${dropdownOpen ? "" : "d-none"}`} style={{ position: "absolute", right: "50px", zIndex: "1" }}>
                                <span className="d-block border-bottom pb-1" style={{ cursor: "pointer" }} onClick={() => { fetchBookmarkedflashcards(); }}>
                                    Bookmarked Flashcards
                                </span>
                                <span className="pt-1" style={{ cursor: "pointer" }} onClick={() => { toggleDropdown(); getflashcards(); }}>
                                    All Flashcards
                                </span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Row>
                <Col md={{ size: 6, offset: 3 }} className="d-none d-lg-block">
                    <div className="d-flex align-items-center justify-content-center">
                        <h5 className="flashcard-title mb-2 border py-2 px-2">
                            {currentIndex + 1} / {flashcardData.length}
                        </h5>
                    </div>
                </Col>
                <Col md={{ size: 6, offset: 3 }} id="Tap_Flip">
                    <CardFlip isFlipped={isFlipped} flipDirection="horizontal">
                        <Card
                            className="p-3 flashcard-card front position-relative bg-white"
                            onClick={flipCard}
                            style={{ cursor: "grab" }}
                        >
                            <p className="flash-que fw-bold">Question : {currentIndex + 1} </p>
                            {/* Added classes */}
                            <div className="overflow-y-auto mt-3 mt-lg-0 d-flex flex-column align-items-center justify-content-center" style={{ height: '315px' }}>
                                {flashcardData[currentIndex]?.t_image_url && (
                                    <div className="image-container">
                                        {" "}
                                        {/* Container for image */}
                                        <CardImg
                                            top
                                            src={flashcardData[currentIndex]?.t_image_url}
                                            alt="Term"
                                        />{" "}
                                        {/* Removed inline styles */}
                                    </div>
                                )}
                                {flashcardData[currentIndex]?.term && (
                                    <CardBody className="overflow-y">
                                        <CardTitle tag="h5" className="mb-0">
                                            {flashcardData[currentIndex]?.term}
                                        </CardTitle>
                                    </CardBody>
                                )}
                            </div>

                            <div className="flip-hint text-center mt-2">
                                <span role="img" aria-label="hand click">
                                    <GiClick />
                                </span>{" "}
                                Click card to flip
                            </div>
                        </Card>
                        <Card
                            className="p-3 flashcard-card back position-relative bg-white"
                            onClick={flipCard}
                            style={{ cursor: "grab" }}
                        >
                            <p className="flash-ans fw-bold">Answer : {currentIndex + 1} </p> {/* Added classes */}
                            <div className="overflow-y-auto mt-3 mt-lg-0 d-flex flex-column align-items-center justify-content-center" style={{ height: '450px' }}>
                                {flashcardData[currentIndex]?.d_image_url && (
                                    <div className="image-container">
                                        {" "}
                                        {/* Container for image */}
                                        <CardImg
                                            top
                                            src={flashcardData[currentIndex]?.d_image_url}
                                            alt="Definition"
                                        />{" "}
                                        {/* Removed inline styles */}
                                    </div>
                                )}
                                {flashcardData[currentIndex]?.definition && (
                                    <CardBody>
                                        <CardTitle tag="h5">
                                            {flashcardData[currentIndex]?.definition}
                                        </CardTitle>
                                    </CardBody>
                                )}
                            </div>
                        </Card>
                    </CardFlip>
                </Col>
            </Row>
            <div className="reading-controls d-flex justify-content-between border mt-2" id="control_btn">
                <button
                    className="control-button"
                    onClick={() => handlePrevCard()}
                    disabled={
                        (isReading && mode != "shuffle") || flashcardData.length <= 1
                    }
                >
                    <FaArrowLeft /> {/* Previous Icon */}
                </button>
                <div className="d-flex gap-2">
                    <div id="Play_Buttons">
                        <button
                            disabled={isReading && mode != "shuffle"}
                            className={`control-button ${mode === "shuffle" ? "active animation-beats" : ""
                                }`}
                            onClick={() => confirmReadingMode("shuffle")}
                        >
                            <FaRandom />
                        </button>
                        <button
                            disabled={isReading && mode != "loop"}
                            className={`control-button ${mode === "loop" ? "active animation-beats" : ""
                                }`}
                            onClick={() => confirmReadingMode("loop")}
                        >
                            <FaSyncAlt />
                        </button>
                        <button
                            disabled={isReading && mode != "repeat"}
                            className={`control-button ${mode === "repeat" ? "active animation-beats" : ""
                                }`}
                            onClick={() => confirmReadingMode("repeat")}
                        >
                            <FaRedo />
                        </button>
                    </div>
                    <div>
                        <button
                            id="Pause_Buttons"
                            className="control-button stop-button"
                            onClick={stopReading}
                        >
                            <FaStop />
                        </button>
                    </div>
                </div>
                <button
                    className="control-button"
                    onClick={() => handleNextCard()}
                    disabled={
                        (isReading && mode != "shuffle") || flashcardData.length <= 1
                    }
                >
                    <FaArrowRight /> {/* Next Icon */}
                </button>
            </div>
            {(suggestedFlashsets && suggestedFlashsets.length > 0) ?
                <div className="col-md-12 mt-5 py-2 border-top pt-4">
                    <div className="d-flex">
                        <h6 style={{ cursor: "pointer", fontSize: "13px" }} className={`border-primary fw-bold text-primary rounded-pill border py-2 px-3`}>
                            Suggested Flashsets
                        </h6>
                    </div>
                    {/* -----------------------------------------------Saved flashsets section---------------------------------------------- */}
                    <div className={`mt-3`}>
                        <div className="mt-3 px-2">
                            {suggestedFlashsets.map((x) => {
                                return (
                                    <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded border'>
                                        <div className="row m-0 align-items-center ps-2 ps-lg-3">
                                            <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center rounded" style={{ overflow: 'hidden' }}>
                                                <div className='d-flex align-items-center justify-content-center' style={{ backgroundColor: '#CFF4D2', height: '100px', width: '100px', border: '0.5px solid #21B3A9' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                                        <path d="M8.28125 41.2501L6.51042 40.5209C5.43403 40.0696 4.71354 39.2883 4.34896 38.1772C3.98438 37.0661 4.04514 35.9723 4.53125 34.8959L8.28125 26.7709V41.2501ZM16.6146 45.8334C15.4688 45.8334 14.4879 45.4255 13.6719 44.6095C12.8559 43.7935 12.4479 42.8126 12.4479 41.6668V29.1668L17.9688 44.4793C18.0729 44.7223 18.1771 44.9567 18.2813 45.1824C18.3854 45.4081 18.5243 45.6251 18.6979 45.8334H16.6146ZM27.3438 45.6251C26.2326 46.0418 25.1563 45.9897 24.1146 45.4689C23.0729 44.948 22.3438 44.1321 21.9271 43.0209L12.6563 17.6043C12.2396 16.4932 12.2743 15.4081 12.7604 14.3491C13.2465 13.29 14.0451 12.5696 15.1563 12.1876L30.8854 6.45844C31.9965 6.04178 33.0729 6.09386 34.1146 6.61469C35.1563 7.13553 35.8854 7.9515 36.3021 9.06261L45.5729 34.4793C45.9896 35.5904 45.9549 36.6755 45.4688 37.7345C44.9826 38.7935 44.184 39.514 43.0729 39.8959L27.3438 45.6251ZM22.8646 20.8334C23.4549 20.8334 23.9497 20.6338 24.349 20.2345C24.7483 19.8352 24.9479 19.3404 24.9479 18.7501C24.9479 18.1598 24.7483 17.665 24.349 17.2657C23.9497 16.8664 23.4549 16.6668 22.8646 16.6668C22.2743 16.6668 21.7795 16.8664 21.3802 17.2657C20.9809 17.665 20.7813 18.1598 20.7813 18.7501C20.7813 19.3404 20.9809 19.8352 21.3802 20.2345C21.7795 20.6338 22.2743 20.8334 22.8646 20.8334Z" fill="#21B3A9" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="col-10 col-lg-10 d-flex flex-column ">
                                                <div className="row m-0 border-bottom">
                                                    <div className='d-flex justify-content-between'>
                                                        <Link to={`/viewflashcard/subject/${id}/${x.flashset_id}`} className='fw-bold w-75 text-primary text-decoration-none'>{x.name}</Link>
                                                        <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={renderTooltip3("Play")}>
                                                            <Link className="text-decoration-none" style={{ color: "#5d5fe3" }} to={``} onClick={() => { flashset_id = x.flashset_id; getflashcards() }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
                                                                    <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z" />
                                                                </svg>
                                                                {/* <span className="" style={{ fontSize: "14px" }}>Play</span> */}
                                                            </Link>
                                                        </OverlayTrigger>
                                                    </div>
                                                    <p className='mt-1 d-flex align-items-center' style={{ fontSize: '14px', color: '#5D5FE3' }}>
                                                        <Link to={`/profile/${x.user_id}`}><img src={x.profile_pic} width={28} height={28} className={`me-1 rounded-circle  ${x.profile_pic != null ? '' : 'd-none'}`} /></Link>
                                                        {x.nickname != undefined ? (<span className={`rounded-circle bg-warning text-white p-1 ${x.profile_pic != null ? 'd-none' : 'd-flex align-items-center justify-content-center'}`} style={{ height: '30px', width: '30px' }}>{x.nickname.slice(0, 1)}{x.nickname.slice(-1)}</span>) : (<></>)}
                                                        <span className='ms-1'> <Link to={`/profile/${x.user_id}`}>{x.nickname}</Link> <span className='ms-1 text-secondary'>{x.time_since_created}</span></span></p>
                                                </div>
                                                <div className="m-0 d-flex align-items-center mt-2">

                                                    <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696" />
                                                    </svg> <span className='ms-2'>{x.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
                                                    <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path d="M4.5012 21.146L4.29688 21.0618C3.74533 20.8228 3.37507 20.4255 3.18609 19.8699C2.99712 19.3144 3.02416 18.7742 3.26721 18.2493L4.5012 15.5891V21.146ZM9.46914 22.7966C8.89622 22.7966 8.40577 22.5926 7.99779 22.1846C7.5898 21.7766 7.38581 21.2862 7.38581 20.7133V16.5867L9.38503 22.1195C9.43711 22.2544 9.48919 22.3749 9.54128 22.4811C9.59336 22.5873 9.6628 22.6924 9.74961 22.7966H9.46914ZM13.5116 21.8511C13.2365 21.966 12.9654 21.9499 12.6983 21.803C12.4312 21.6561 12.2403 21.4384 12.1254 21.15L7.48997 8.44164C7.37513 8.16654 7.38582 7.89444 7.52203 7.62534C7.65825 7.35622 7.86391 7.16625 8.13901 7.05542L16.0036 4.19083C16.2787 4.07597 16.5431 4.092 16.7969 4.23891C17.0506 4.38582 17.2349 4.6035 17.3498 4.89195L21.9852 17.5602C22.1 17.8487 22.0994 18.1308 21.9832 18.4066C21.867 18.6824 21.6647 18.8757 21.3762 18.9865L13.5116 21.8511ZM11.6326 10.4168C11.9277 10.4168 12.1751 10.317 12.3748 10.1173C12.5744 9.91767 12.6743 9.67027 12.6743 9.37513C12.6743 9.07999 12.5744 8.8326 12.3748 8.63294C12.1751 8.43329 11.9277 8.33346 11.6326 8.33346C11.3375 8.33346 11.0901 8.43329 10.8904 8.63294C10.6908 8.8326 10.5909 9.07999 10.5909 9.37513C10.5909 9.67027 10.6908 9.91767 10.8904 10.1173C11.0901 10.317 11.3375 10.4168 11.6326 10.4168ZM13.143 20.8335L21.0076 17.9689L16.3722 5.20846L8.5076 8.07305L13.143 20.8335Z" fill="#8E9696" />
                                                    </svg> <span className='ms-2'>{x.flashcards_count} <span className='d-lg-inline d-none'>Flashcards</span></span></span>

                                                    <span className=''>
                                                        <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                        </svg><span className='ms-2'>{x.viewcount}</span></span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                :
                ''
            }
            <Modal isOpen={isConfirmModalOpen} toggle={toggleConfirmModal} centered>
                <ModalHeader toggle={toggleConfirmModal}>Confirmation</ModalHeader>
                <ModalBody>{modalMessage}</ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleConfirm}>
                        OK
                    </Button>
                    <Button color="secondary" onClick={toggleConfirmModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={configModal} toggle={toggleConfigModal} centered id="box2">
                <ModalHeader>
                    <div className="d-flex justify-content-end">
                        <h5>{translate_value.flashcard.flashcard_Setting_title}</h5>
                        <div style={{ paddingLeft: "216px" }}>
                            <OverlayTrigger
                                placement="left"
                                delay={{ show: 250, hide: 250 }}
                                overlay={renderTooltip3("Settings applied from the next card.")}
                            >
                                <i
                                    className="fa fa-exclamation-circle"
                                    aria-hidden="true"
                                    style={{ color: "#dc3545", cursor: "pointer" }}
                                ></i>
                            </OverlayTrigger>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody className="p-4">
                    <div className="voice-type-container">
                        <Label className="mb-3">
                            {translate_value.flashcard.var_setting_voicetype}
                        </Label>
                        <div className="d-flex gap-4">
                            <Label className="voice-type-option">
                                <Input
                                    type="radio"
                                    name="voicetype"
                                    value="Male"
                                    checked={tempSettings.voicetype === "Male"}
                                    onChange={handleTempConfigChange}
                                />
                                <span className="custom-radio ps-1"></span>
                                Male
                            </Label>
                            <Label className="voice-type-option">
                                <Input
                                    type="radio"
                                    name="voicetype"
                                    value="Female"
                                    checked={tempSettings.voicetype === "Female"}
                                    onChange={handleTempConfigChange}
                                />
                                <span className="custom-radio ps-1"></span>
                                Female
                            </Label>
                        </div>
                    </div>

                    <hr />
                    <div className="mb-5">
                        <Label className="mb-3" for="pitch">
                            {translate_value.flashcard.var_setting_tone}{" "}
                        </Label>
                        <InputRange
                            maxValue={2}
                            minValue={0}
                            step={0.01}
                            value={tempSettings.pitch}
                            onChange={(value) =>
                                handleTempConfigChange({ target: { name: "pitch", value } })
                            }
                        />
                    </div>
                    <hr />
                    <div className="mb-5">
                        <Label className="mb-3" for="volume">
                            {translate_value.flashcard.var_setting_vol}
                        </Label>
                        <InputRange
                            maxValue={1}
                            minValue={0}
                            step={0.01}
                            value={tempSettings.volume}
                            onChange={(value) =>
                                handleTempConfigChange({ target: { name: "volume", value } })
                            }
                        />
                    </div>
                    <hr />
                    <div className="mb-4">
                        <Label className="mb-3" for="rate">
                            {translate_value.flashcard.var_setting_speed}
                        </Label>
                        <InputRange
                            maxValue={1.5}
                            minValue={0}
                            step={0.01}
                            value={tempSettings.rate}
                            onChange={(value) =>
                                handleTempConfigChange({ target: { name: "rate", value } })
                            }
                        />
                    </div>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-between">
                    <button className="border-secondary btn btn-sm" onClick={toggleResetConfigModal}>
                        {translate_value.common_words.Reset}
                    </button>
                    <div className="d-flex gap-2">
                        <Button style={{ backgroundColor: 'rgb(93, 95, 227)' }} size="sm" onClick={saveConfig}>
                            {translate_value.common_words.Save}
                        </Button>
                        <Button color="danger" size="sm" onClick={toggleConfigModal}>
                            {translate_value.common_words.Cancel}
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isAudioModalOpen} toggle={toggleAudioModal}>
                <ModalHeader toggle={toggleAudioModal}>Audio Preference</ModalHeader>
                <ModalBody>Would you like to play the audio or mute it?</ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => handleAudioChoice(true)}>
                        Audio
                    </Button>
                    <Button color="secondary" onClick={() => handleAudioChoice(false)}>
                        Mute
                    </Button>
                </ModalFooter>
            </Modal>
            <Tour
                onRequestClose={closeTourGuide}
                key={tourKey}
                steps={tourConfig}
                isOpen={isTourOpen}
                rounded={5}
                accentColor={accentColor}
                disableInteraction={true}
                closeWithMask={false}
                showArrow={true}
                getCurrentStep={(step) => {
                    onTourCurrentStep(step);
                }}
                styles={{
                    maskArea: (base) => ({
                        ...base,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                    }),
                    maskWrapper: (base) => ({
                        ...base,
                        backgroundColor: "transparent",
                    }),
                }}
                lastStepNextButton={<button className="btn btn-sm btn-success" onClick={() => setIsTourOpen(false)}>Done</button>}
            />
        </Container>
    );
};

export default FlashcardReader;
