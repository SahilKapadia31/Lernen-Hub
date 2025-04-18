import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "../../../components/services/axiosInstance";
import './show-subject.scss'
const ShowSubject = ({ show, handleClose, selectedProgram }) => {
    const staffData = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [associatedSubjects, setAssociatedSubjects] = useState([]);
   
    const getSubjectAssociation = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get(`/userProgramCourseAssociation/${staffData?.user?.id}/${selectedProgram.program_id}/`);
            if (response.data) {
                setAssociatedSubjects(response.data.data)
            }
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.log("Error in getSubjectAssociation", err);
        }
    }

    useEffect(() => {
        if(show){
            getSubjectAssociation(selectedProgram);
        }
    },[show])

    return (<>
        <Modal show={show} onHide={handleClose} size="md" top>
            <Modal.Header className="border-bottom" closeButton>
            <h5 className="mb-0 d-flex gap-2 align-items-center">Assigned Subjects <span className="program-type text-uppercase">{selectedProgram?.program_name}</span></h5> 
            </Modal.Header>
            <Modal.Body>
                <div className="row show-subject">
                    {/* <div className="col-lg-12">
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <div className="input-group navbar-input w-25" style={{ cursor: 'pointer', height: '45px' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#searchoffcanvas" aria-controls="searchoffcanvas">
                                <span className="input-group-text bg-white border-end-0" style={{ color: '#AAB0B0' }} id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <path d="M20.2965 20.9936L13.774 14.4712C13.2532 14.9145 12.6542 15.2577 11.9772 15.5008C11.3001 15.7439 10.6197 15.8654 9.93589 15.8654C8.26749 15.8654 6.85546 15.2879 5.69982 14.1329C4.54416 12.9778 3.96633 11.5666 3.96633 9.89908C3.96633 8.23158 4.54384 6.81924 5.69886 5.66205C6.85387 4.50486 8.26513 3.92627 9.93263 3.92627C11.6001 3.92627 13.0125 4.50409 14.1697 5.65973C15.3268 6.81538 15.9054 8.22741 15.9054 9.89583C15.9054 10.6196 15.7772 11.3201 15.5208 11.9972C15.2644 12.6743 14.9279 13.2532 14.5112 13.734L21.0337 20.2564L20.2965 20.9936ZM9.93589 14.8237C11.3181 14.8237 12.485 14.348 13.4365 13.3964C14.388 12.4449 14.8638 11.278 14.8638 9.89583C14.8638 8.51362 14.388 7.34676 13.4365 6.39523C12.485 5.4437 11.3181 4.96794 9.93589 4.96794C8.55368 4.96794 7.38682 5.4437 6.43529 6.39523C5.48378 7.34676 5.00802 8.51362 5.00802 9.89583C5.00802 11.278 5.48378 12.4449 6.43529 13.3964C7.38682 14.348 8.55368 14.8237 9.93589 14.8237Z" fill="#8E9696" />
                                </svg></span>
                                <input type="text" style={{ cursor: 'pointer' }} className="form-control nav-input ps-0 border-start-0" placeholder={'search'} aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            <button onClick={() => navigate('/organization/upload-documents')} className="btn ms-3 text-white navbar-btn" style={{ backgroundColor: '#5D5FE3', width: 'fit-content', whiteSpace: 'nowrap', height: '45px' }}><i className="fa-solid fa-plus me-2"></i>{'Upload'}</button>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="d-flex justify-content-between mb-4 px-2 px-lg-5 align-items-center bg-white shadow rounded mx-0 p-4 px-1">

                            <div className="profile-details d-flex justify-content-between flex-column flex-lg-row">
                                <div className="subject justify-content-lg-center" style={{ cursor: 'pointer' }}>
                                
                                    <span className="ms-2 fw-bold" style={{ fontSize: '14px', letterSpacing: '3.5px', cursor: 'pointer' }}>
                                        Software systems engineering M.Sc
                                    </span>

                                </div>

                                <div className="subject" style={{ cursor: 'pointer' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 35 35" fill="none">
                                        <path d="M16.7709 25.9135H18.2292V19.0677L21.2917 22.1302L22.3237 21.0898L17.5 16.266L12.6763 21.0898L13.7168 22.1218L16.7709 19.0677V25.9135ZM9.64744 30.625C8.97624 30.625 8.41582 30.4002 7.96617 29.9505C7.51651 29.5009 7.29169 28.9404 7.29169 28.2692V6.73075C7.29169 6.05956 7.51651 5.49913 7.96617 5.04948C8.41582 4.59983 8.97624 4.375 9.64744 4.375H21.1459L27.7084 10.9375V28.2692C27.7084 28.9404 27.4835 29.5009 27.0339 29.9505C26.5842 30.4002 26.0238 30.625 25.3526 30.625H9.64744ZM20.4167 11.6667V5.83333H9.64744C9.4231 5.83333 9.21744 5.92681 9.03046 6.11377C8.8435 6.30075 8.75002 6.50641 8.75002 6.73075V28.2692C8.75002 28.4936 8.8435 28.6992 9.03046 28.8862C9.21744 29.0732 9.4231 29.1667 9.64744 29.1667H25.3526C25.5769 29.1667 25.7826 29.0732 25.9696 28.8862C26.1565 28.6992 26.25 28.4936 26.25 28.2692V11.6667H20.4167Z" fill="#FF845D" />
                                    </svg>

                                    <span className="ms-2" style={{ fontSize: '14px', letterSpacing: '3.5px' }}>
                                        <span className="d-none d-lg-block">{'uploads'} : </span>
                                    </span>
                                    <span className="">{'0'}</span>
                                </div>

                                <div className="subject" style={{ cursor: 'pointer' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 35 35" fill="none">
                                        <path d="M25.4648 29.1666H10.8253V13.125L19.9679 4.09448L20.613 4.73954C20.7457 4.87227 20.8574 5.04241 20.9481 5.24996C21.0388 5.45748 21.0841 5.64818 21.0841 5.82206V6.05204L19.5922 13.125H29.7276C30.3371 13.125 30.8821 13.3652 31.3626 13.8457C31.8431 14.3262 32.0833 14.8712 32.0833 15.4807V17.2756C32.0833 17.4083 32.0684 17.5532 32.0385 17.7103C32.0086 17.8673 31.9693 18.0122 31.9207 18.145L27.9383 27.5849C27.7383 28.0336 27.4017 28.4094 26.9287 28.7123C26.4557 29.0152 25.9677 29.1666 25.4648 29.1666ZM12.2837 27.7083H25.4648C25.6704 27.7083 25.8807 27.6522 26.0957 27.54C26.3108 27.4278 26.4744 27.2409 26.5865 26.9791L30.625 17.5V15.4807C30.625 15.219 30.5409 15.004 30.3726 14.8357C30.2043 14.6674 29.9893 14.5833 29.7276 14.5833H17.7804L19.4688 6.61853L12.2837 13.7476V27.7083ZM10.8253 13.125V14.5833H5.83333V27.7083H10.8253V29.1666H4.375V13.125H10.8253Z" fill="#FF845D" />
                                    </svg>
                                    <span className="ms-2" style={{ fontSize: '14px', letterSpacing: '3.5px' }}>
                                        <span className="d-none d-lg-block">{'upvotes'} : </span></span><span className="">{'0'}
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex">

                                <div className="ms-2">
                                    <button onClick={() => navigate('/organization/upload-documents')} className="btn ms-3 text-white navbar-btn" style={{ backgroundColor: '#5D5FE3', width: 'fit-content', whiteSpace: 'nowrap', height: '45px' }}><i className="fa-solid fa-plus me-2"></i>{'Upload'}</button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-lg-12">
                        <div>
                            <ul className={`p-0 px-2 document`} style={{ listStyleType: 'none', maxHeight: '500px', overflowY: associatedSubjects.length > 5 ? 'scroll' : 'none' }}>
                                {associatedSubjects && (
                                    associatedSubjects.map((subjects) => (
                                        <li key={subjects.id} className='mb-2 py-3 border-bottom px-2 px-lg-3'>
                                            <Link className='text-decoration-none text-primary' style={{ fontSize: '16px', textTransform: 'capitalize', cursor: 'pointer', letterSpacing: '0.32px', lineHeight: 'normal', fontWeight: 450 }}>{subjects.course_name}</Link>
                                            <div className='mt-1 d-flex justify-content-between'>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M7.08333 14.5833H12.9167V13.75H7.08333V14.5833ZM7.08333 11.25H12.9167V10.4167H7.08333V11.25ZM5.51281 17.5C5.12927 17.5 4.80903 17.3715 4.55208 17.1146C4.29514 16.8576 4.16667 16.5374 4.16667 16.1539V3.84615C4.16667 3.4626 4.29514 3.14236 4.55208 2.88542C4.80903 2.62847 5.12927 2.5 5.51281 2.5H12.0833L15.8333 6.25V16.1539C15.8333 16.5374 15.7049 16.8576 15.4479 17.1146C15.191 17.3715 14.8707 17.5 14.4872 17.5H5.51281ZM11.6667 6.66667V3.33333H5.51281C5.38462 3.33333 5.2671 3.38675 5.16025 3.49358C5.05342 3.60043 5 3.71795 5 3.84615V16.1539C5 16.282 5.05342 16.3996 5.16025 16.5064C5.2671 16.6132 5.38462 16.6667 5.51281 16.6667H14.4872C14.6154 16.6667 14.7329 16.6132 14.8398 16.5064C14.9466 16.3996 15 16.282 15 16.1539V6.66667H11.6667Z" fill="#FF8A65" />
                                                    </svg>
                                                    <span className='ms-1 text-secondary text-decoration-none' style={{ fontSize: '13px' }}>{subjects?.document_count} Documents</span>
                                                </span>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M7.08333 14.5833H12.9167V13.75H7.08333V14.5833ZM7.08333 11.25H12.9167V10.4167H7.08333V11.25ZM5.51281 17.5C5.12927 17.5 4.80903 17.3715 4.55208 17.1146C4.29514 16.8576 4.16667 16.5374 4.16667 16.1539V3.84615C4.16667 3.4626 4.29514 3.14236 4.55208 2.88542C4.80903 2.62847 5.12927 2.5 5.51281 2.5H12.0833L15.8333 6.25V16.1539C15.8333 16.5374 15.7049 16.8576 15.4479 17.1146C15.191 17.3715 14.8707 17.5 14.4872 17.5H5.51281ZM11.6667 6.66667V3.33333H5.51281C5.38462 3.33333 5.2671 3.38675 5.16025 3.49358C5.05342 3.60043 5 3.71795 5 3.84615V16.1539C5 16.282 5.05342 16.3996 5.16025 16.5064C5.2671 16.6132 5.38462 16.6667 5.51281 16.6667H14.4872C14.6154 16.6667 14.7329 16.6132 14.8398 16.5064C14.9466 16.3996 15 16.282 15 16.1539V6.66667H11.6667Z" fill="#FF8A65" />
                                                    </svg>
                                                    <span className='ms-1 text-secondary text-decoration-none' style={{ fontSize: '13px' }}>{subjects?.document_count} Documents</span>
                                                </span>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M7.08333 14.5833H12.9167V13.75H7.08333V14.5833ZM7.08333 11.25H12.9167V10.4167H7.08333V11.25ZM5.51281 17.5C5.12927 17.5 4.80903 17.3715 4.55208 17.1146C4.29514 16.8576 4.16667 16.5374 4.16667 16.1539V3.84615C4.16667 3.4626 4.29514 3.14236 4.55208 2.88542C4.80903 2.62847 5.12927 2.5 5.51281 2.5H12.0833L15.8333 6.25V16.1539C15.8333 16.5374 15.7049 16.8576 15.4479 17.1146C15.191 17.3715 14.8707 17.5 14.4872 17.5H5.51281ZM11.6667 6.66667V3.33333H5.51281C5.38462 3.33333 5.2671 3.38675 5.16025 3.49358C5.05342 3.60043 5 3.71795 5 3.84615V16.1539C5 16.282 5.05342 16.3996 5.16025 16.5064C5.2671 16.6132 5.38462 16.6667 5.51281 16.6667H14.4872C14.6154 16.6667 14.7329 16.6132 14.8398 16.5064C14.9466 16.3996 15 16.282 15 16.1539V6.66667H11.6667Z" fill="#FF8A65" />
                                                    </svg>
                                                    <span className='ms-1 text-secondary text-decoration-none' style={{ fontSize: '13px' }}>{subjects?.document_count} Documents</span>
                                                </span>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

        {isLoading && <Loading loading={true} loaderColor="#000" />}
    </>)
}

export default ShowSubject;