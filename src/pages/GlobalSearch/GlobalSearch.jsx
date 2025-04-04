import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ipaddress } from '../../App';
import { Context } from '../../context/Context_provider';
import axiosInstance from '../axiosInstance';
import { getDecryptedData } from '../../utils/helperFunctions';
import './GlobalSearch.scss';
// VBM
const GlobalSearch = () => {
    const { translate_value, setCount4 } = useContext(Context);
    const navigate = useNavigate();
    const user = JSON.parse(getDecryptedData('user'));
    const [searchdata, setSearchdata] = useState("");
    const [AvailablecourseData, setAvailableCourseData] = useState([]);
    const [JoinedcourseData, seJoinedCourseData] = useState([]);
    const [documentData, setdocumentData] = useState([]);
    const [flashcardData, setFlashcardData] = useState([]);
    const [status, setstatus] = useState(false);
    const globalsearch = async (value) => {
        if (value.length > 0) {
            try {
                const response = await axiosInstance.get(`${ipaddress}/DocumentSearch/${value}/${user.user_id}/`);
                const ResponseResult = response.data;
                setstatus(true);
                setAvailableCourseData(ResponseResult?.courses || []);
                seJoinedCourseData(ResponseResult?.joined_courses || []);
                setdocumentData(ResponseResult?.documents || []);
                setFlashcardData(ResponseResult?.flashsets || []);
            } catch (error) {
                console.error("Global Search Error:", error);
            }
        } else {
            setstatus(false); // Reset the data states when search value is empty
            setAvailableCourseData([]);
            seJoinedCourseData([]);
            setdocumentData([]);
            setFlashcardData([]);
        }
    };
    const searchClose = () => {
        setSearchdata("");
        globalsearch("");
        setstatus(false); // Reset the data states when search value is empty
        setAvailableCourseData([]);
        seJoinedCourseData([]);
        setdocumentData([]);
        setFlashcardData([]);
    }
    const joinCourse = (course_id, course_name) => {
        axiosInstance.post(`${ipaddress}/join-course/${user.user_id}/${course_id}/`)
            .then((r) => {
                navigate(`/subjects/${course_id}/${course_name}`);
                setAvailableCourseData({});
                seJoinedCourseData({});
                setdocumentData({});
                setFlashcardData({});
                setSearchdata("");
                setCount4((prev) => prev + 1);
                // setCount(count+1)
                // window.location.reload()
                //     const toastLiveExample = document.getElementById('liveToast')
                //               document.getElementById('toastbody').textContent="Successfully Joined in the Course"
                // const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
                //   toastBootstrap.show()
                // setSearchedSubjects([])
                // setSearchvalue("")
            }).catch(() => { console.log("Course Joining error") })
    }


    return (
        <div>
            <div className="offcanvas offcanvas-top Globalsearchtop" data-bs-backdrop="static" tabIndex="-1" id="searchoffcanvas" aria-labelledby="searchoffcanvasLabel" >
                <div className="offcanvas-body">
                    <div className='d-flex justify-content-between border-bottom pb-3 pt-2 px-1 px-lg-5 align-items-center searchBarCenter'>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 border-0" style={{ color: '#AAB0B0' }} id="basic-addon1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                            </span>
                            <input type="text" className="form-control nav-input border-start-0 border-0 p-lg-4 p-md-4 p-2 me-2" value={searchdata} onChange={(e) => { setSearchdata(e.target.value); globalsearch(e.target.value); }}
                                id='globalsearch' placeholder={translate_value.dashboard.global_search} aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                        <svg type="button" onClick={() => searchClose()}
                            data-bs-dismiss="offcanvas" aria-label="Close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF845D" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                    </div>
                    <div className={`container mt-4 ${status ? '' : 'd-none'}`}>
                        {documentData.length ? (
                            documentData.map((x) => {
                                return (
                                    <>
                                        <p>
                                            <span className='p-1 rounded-pill px-2 documentType'>Document</span>
                                            <button data-bs-dismiss="offcanvas" onClick={() => { navigate(`/showpdf/${x.document_id}`) }} className='ms-2 ms-lg-3 bg-transparent border-0 text-decoration-underline documentTextTitle'>{x.title}</button>
                                        </p>
                                        <hr />
                                    </>
                                )
                            })
                        ) : <></>}
                        {AvailablecourseData.length ? (
                            AvailablecourseData.map((x) => {
                                return (
                                    <>
                                        <div className='d-flex mb-2 justify-content-between' style={{ width: '92%' }}>
                                            <p className='m-0'>
                                                <span className='p-1 rounded-pill px-2 subjectType' >Subjects</span>
                                                <Link className='ms-2 ms-lg-3 text-decoration-underline' style={{ color: '#5D5FE3', cursor: 'pointer', fontSize: '15px' }}>{x.course_name}</Link>
                                            </p>
                                            <button data-bs-dismiss="offcanvas" onClick={() => { joinCourse(x.course_id, x.course_name) }} style={{ height: '30px', color: '#8587EA', fontSize: '14px' }}
                                                className='btn btn-sm border border-primary-subtle px-3 py-1 fw-medium text-decoration-none d-flex align-items-center' >{translate_value.common_words.join}</button>
                                        </div>
                                        <hr />
                                    </>
                                )
                            })
                        ) : <></>}
                        {flashcardData.length ? (
                            flashcardData.map((x) => {
                                return (

                                    <>
                                        <p>
                                            <span className='p-1 rounded-pill px-2 flashType'>Flashcard</span>
                                            <Link data-bs-dismiss="offcanvas" onClick={() => { navigate(`/viewflashcard/'search'/""/${x.flashset_id}`) }}
                                                className='ms-2 ms-lg-3 text-decoration-underline' style={{ color: '#5D5FE3', cursor: 'pointer', fontSize: '15px' }}>{x.name}
                                            </Link>
                                        </p>
                                        <hr />
                                    </>
                                )
                            })
                        ) : <></>}
                        {JoinedcourseData.length ? (
                            JoinedcourseData.map((x) => {
                                return (
                                    <>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <p className=''>
                                                    <span className='p-1 rounded-pill px-2 subjectType'>Subjects</span>
                                                    <button data-bs-dismiss="offcanvas" onClick={() => {
                                                        navigate(`/subjects/${x.course_id}/${x.course_name}`)
                                                    }} className='bg-transparent border-0 ms-2 ms-lg-3 text-decoration-underline'
                                                        style={{ color: '#5D5FE3', cursor: 'pointer', fontSize: '15px' }}>{x.course_name}</button></p>
                                            </div>
                                            <button disabled className='btn btn-sm border text-white px-3 py-1 fw-medium text-decoration-none d-flex align-items-center' style={{ backgroundColor: '#5D5FE3', height: '30px', color: '#ffff', fontSize: '14px' }}>Joined</button>
                                        </div>
                                        <hr />
                                    </>
                                )
                            })
                        ) : <></>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GlobalSearch;