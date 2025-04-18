import React, { useState, useContext } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Preloader from '../Preloader';
import { ipaddress } from '../../App';
import { Context } from '../../context/Context_provider';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';
import apiClient from '../../pages/Middlewares/axiosConfig';
import { getDecryptedData, removeData,setEncryptedData } from '../../../src/utils/helperFunctions';
import "./Profile.css";
import { useSelector,useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/authSlice';
// SVG Gile initls
import subject_svg from '../../../src/assets/svg/subject.svg';
import report_icon from '../../../src/assets/svg/report_icon.svg';
import upvote_icon from '../../../src/assets/svg/upvote_icon.svg';
import upload_icon from '../../../src/assets/svg/upload_icon.svg';
import supercoin_icon from '../../../src/assets/svg/supercoin_icon.svg';
import close_icon from '../../../src/assets/svg/model_close.svg'
const Profile = () => {
  let { translate_value, addsubjects_layout, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch();
  const { user_id } = useParams();
  const [open, isOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  function open1() {
    isOpen(!open);
    if (open == true) {
      document.getElementById('acc-apan2').textContent = "-"
    } else {
      document.getElementById('acc-apan2').textContent = "+"
    }
  }
  useEffect(() => {
    sessionStorage.removeItem('selectedSubTab');

    AOS.init({ disable: "phone", duration: 700, easing: "ease-out-cubic" });
  }, []);

  const [additionalDetails, setAdditionalDetails] = useState({});
  const [formData, setFormData] = useState({ user_id: "", university: "", program: "", semester: "" });
  const handleChange = (e) => {
    setFormData(prevData => {
      const updatedData = { ...prevData, [e.target.name]: e.target.value };
      return updatedData; // Return the updated state
    });
  };

  const [count, setCount] = useState(0);
  const [joinedUniversity, setJoinedUniversity] = useState([]);
  const [universitydata, setUniversitydata] = useState([]);
  const [semesterdata, setSemesterdata] = useState([]);
  const [favouriteDocs, setFavouriteDocs] = useState([]);
  const [joinedcourses, setjoinedcourses] = useState([]);
  const [userdetails, setUserdetails] = useState({});
  const [isUniversityNamesVisible, setUniversityNamesVisible] = useState(false);
  const [datacount, setDatacount] = useState({});

  useEffect(() => {
    setUserdetails(user);

    axiosInstance.get(`${ipaddress}/docAndLikesCount/${user.user_id}/`)
      .then((r) => {
        setDatacount(r.data);
        setLoading(false);
      }).catch(() => { console.log("Catch Fetching Error") });

    axiosInstance.get(`${ipaddress}/UserStudyInfo/${user_id}/`)
      .then((r) => {
        setJoinedUniversity(r.data);
        setLoading(false);
      }).catch(() => { console.log("User Data Fetching Error") })
    axiosInstance.get(`${ipaddress}/FavouriteDocuments/${user_id}`)
      .then((p) => {
        setFavouriteDocs(p.data);
      }).catch(() => { console.log("Catch Fetching Error") });

    axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user_id}/`)
      .then((r) => {
        setEncryptedData("user", JSON.stringify(r.data), 180);
        dispatch(loginSuccess({user:r.data}));
        setUserdetails(r.data);
        setLoading(false);
      }).catch(() => { console.log("User Details Fetching Error") });

    axiosInstance.get(`${ipaddress}/CoursesView/${user_id}/`)
      .then((r) => {
        setjoinedcourses(r.data.joined_courses);
        setLoading(false);
      }).catch(() => { console.log("Joined courses fetching error in Offcanvas") });
  }, [count, user_id])

  // ---------------------------------------------FETCH ALL UNIVERSITIES AND SEMESTERS FOR FORM-------------------------

  const fetchAllUniversities = () => {
    axiosInstance.get(`${ipaddress}/universities/`)
      .then((r) => {
        setUniversitydata(r.data);
      }).catch(() => { console.log("Catch Fetching Error") });
    axiosInstance.get(`${ipaddress}/Semesters/`)
      .then((p) => {
        setSemesterdata(p.data);
      }).catch(() => { console.log("Catch Fetching Error") });
  }

  const resetForm = () => {
    setFormData({
      // user_id: user.user_id,
      university: "",
      program: "",
      semester: ""
    });
    setSelectedUniversityName("");
  };
  // const[additionalDeatils,setAdditionalDetails]=useState({})
  const handleSubmit = (event) => {
    event.preventDefault()
    axiosInstance.post(`${ipaddress}/UserStudyInfo/${user_id}/`, formData)
      .then((r) => {
        setCount(count + 1);
        resetForm(); // setEncryptedData("additionaldetails",JSON.stringify(r.data))
      }).catch(() => { console.log("Data sent Error") });
  }
  // -----------------------------------------------EDIT DETAILS PART-----------------------------------------------------
  const [detailstoEdit, setDetailstoEdit] = useState({})
  const fetchEditdata = () => {
    axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user_id}/`)
      .then((r) => {
        setEditedNickname(r.data.nickname); // console.log("Edit Details Fetched",r.data)
      }).catch(() => { console.log("Edit Details Fetching Error") });
  }

  const [editedName, setEditedName] = useState("");
  const [editedLname, setEditedLname] = useState("");
  const [editedNickname, setEditedNickname] = useState("");
  const editedNameData = (value) => { setEditedName(value) }
  const editedLnameData = (value) => { setEditedLname(value) }
  const editedNicknameData = (value) => { setEditedNickname(value) }
  const [editImage, setEditImage] = useState(null)
  const updateProfileImage = (value) => { setEditImage(value) }
  const sendEditedDetails = (event) => {
    event.preventDefault();
    const editedDetails = new FormData();
    editedDetails.append('nickname', editedNickname);
    if (editImage) {
      editedDetails.append('profile_pic', editImage);
    }
    apiClient.patch(`${ipaddress}/UserUpdateDetails/${user_id}/`, editedDetails)
      .then((r) => {
        setCount(count + 1); // console.log("Edit Details Sent",r.data)
      }).catch(() => { console.log("Edit Details Sending Error") });
  }

  // ----------------------------------------------------------ADD UNIVERSITY NAMES----------------------------------------
  const [selectedUniversityName, setSelectedUniversityName] = useState("");
  const [selectedUniversityId, setSelectedUniversityId] = useState(0);
  const [programs, setPrograms] = useState([])
  const adduniversityname = (universityName, event, universityId) => {
    event.preventDefault()
    setSelectedUniversityName(universityName);
    setSelectedUniversityId(universityId);
    setFormData((prevData) => ({
      ...prevData,
      user_id: user.user_id,
      university: universityId
    }));

    axiosInstance.get(`${ipaddress}/Programs/${universityId}`)
      .then((r) => {
        setPrograms(r.data);
      }).catch(() => { console.log("Catch Fetching Error") });
    setUniversityNamesVisible(false);
  }
  // -----------------------------------------FETCH PROGRAMS BASED ON UNIVERSITY--------------------------------------------
  // --------------------------------------SEARCH UNIVERSITY NAME-----------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = (value) => {
    setSelectedUniversityName(value);
    const results = universitydata.filter(item => item.university_name.toLowerCase().includes(value.toLowerCase()));
    setSearchResults(results);
  };
  // ------------------------------------------DELETE USER ACCOUNT-----------------------------------------------------------
  let navigate = useNavigate()
  const deleteAccount = () => {
    axiosInstance.delete(`${ipaddress}/DeleteAccount/${user_id}`)
      .then((r) => {
        removeData("user");
        navigate('/');
      }).catch(() => { console.log("Catch Fetching Error") });
  }
  // --------------------------------------------SELECTED TIME---------------------------------------------------------------
  const [selectedTime, setSelectedTime] = useState("");
  const [timecount, setTimecount] = useState(0);
  const handleTimeChange = (e) => { setSelectedTime(e.target.value) }
  const refresh_token = getDecryptedData('refreshToken');
  const handleFormSubmit = (e) => {
    e.preventDefault()
    const formdata = new FormData();
    const currenttime = new Date();
    const currentHours = currenttime.getHours();
    const currentMinutes = currenttime.getMinutes();
    const time = `${currentHours}:${currentMinutes}`
    const difference = calculateTimeDifference(selectedTime, time); // console.log(selectedTime, time)
    setTimeout(() => {
      axiosInstance.post(`${ipaddress}/User_Logout/${user_id}/`, { refresh_token: refresh_token })
        .then((r) => {
          removeData("user");
          navigate('/');
        }).catch(() => { console.log("Catch Fetching Error") });
    }, difference)
  }

  function calculateTimeDifference(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    const date1 = new Date(1970, 0, 1, hours1, minutes1);
    const date2 = new Date(1970, 0, 1, hours2, minutes2);
    const timeDifference = Math.abs(date2 - date1);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    return minutesDifference * 60 * 1000;
  }

  const [report, setreport] = useState("");
  const [image, setimage] = useState(null);
  const changeimage = (value) => { setimage(value) }

  const reportuser = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('attached_image', image);
    axiosInstance.post(`${ipaddress}/ReportUserView/${user.user_id}/${user_id}/${report}/`, formdata)
      .then((r) => {
        setreport("");
        toast.warn('Reported Successfully', { autoClose: 2000 });
      })
      .catch((err) => { console.log("User Reported Error", err) })
  }

  return (
    // -----------------------------------------------------------NEW Code Start ---------------------------------------------
    <div>
      {loading ? (<Preloader />) : (
        <div className=''>
          <div className="d-flex">
            <div onClick={() => {
              setcourse_visible(false);
              setgroup_visible(false);
              setstudylist_visible(false);
            }} className="container-fluid">
              <div onClick={() => { setnavbar_dropdown_visible(false); }} className="container-fluid p-0">
                <div className="profile1 d-flex justify-content-between px-2 py-2 py-lg-5 px-lg-5 align-items-center rounded" style={{ backgroundColor: '#F3F0FF' }}>
                  <div className={`d-flex justify-content-end ${user_id === user.user_id ? 'd-none' : ''}`}>
                    <span data-bs-toggle="modal" data-bs-target="#report_user" style={{ cursor: 'pointer', fontSize: '14px' }} className='d-flex align-items-center'>
                      <img src={report_icon} alt="Report Icon" width="20" height="20" />
                      <span className='ms-1 text-decoration-underline d-none d-lg-block'>Report User</span>
                    </span>
                  </div>
                  {userdetails && (
                    <div className='d-flex justify-content-lg-start justify-content-center mt-1'>
                      <div className=" d-flex align-items-center" style={{ height: '100px' }}>
                        <img src={userdetails.profile_pic} width={50} className={`rounded ${userdetails.profile_pic != null ? '' : 'd-none'}`} alt="profile" />
                        {userdetails.nickname != undefined ? (<span className={`${userdetails.profile_pic != null ? 'd-none' : ''} fs-1 bg-info text-white py-4 px-4 rounded`}>{userdetails.nickname.slice(0, 1)}{userdetails.nickname.slice(-1)}</span>) : (<></>)}
                        <div className="ms-2" style={{ height: '100%' }}>
                          <span className="fw-bold" style={{ fontSize: '18px' }}>{userdetails.nickname}</span><br />
                          {joinedUniversity.map((x, index) => {
                            return (<div key={index}><span style={{ fontSize: '13px' }}>{x.university_id.university_name}</span></div>);
                          })}
                          <span style={{ fontSize: '13px' }}>{user.program_name}</span>
                          <a className={`mt-2 ${user_id === user.user_id ? 'd-block ' : 'd-none'}`} style={{ fontSize: '14px', color: '#5D5FE3', cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#editModal" onClick={fetchEditdata}>Edit Profile</a>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className='profile-details d-flex justify-content-between flex-column flex-lg-row'>
                    <div className="d-flex justify-content-start gap-3 align-items-center justify-content-lg-center my-1" style={{ letterSpacing: '2px' }}>
                      <img src={subject_svg} alt="Subject Icon" />
                      <span className='profiledoctype ms-2 d-none d-lg-block'>{translate_value.dashboard.courses} :</span><span className=''> {joinedcourses.length}</span>
                    </div>
                    <div className="d-flex justify-content-start gap-3 align-items-center justify-content-lg-center my-1" style={{ letterSpacing: '2px' }}>
                      <img src={upvote_icon} alt="Upvote Icon" width="25" height="25" />
                      <span className='profiledoctype m-2 d-none d-lg-block'>{translate_value.dashboard.upvotes} : </span> <span className=''>{datacount.total_documents_likes}</span>
                    </div>
                    <div className="d-flex justify-content-start gap-3 align-items-center justify-content-lg-center my-1" style={{ letterSpacing: '2px' }}>
                      <img src={upload_icon} alt="Upload Icon" width="25" height="25" />
                      <span className="profiledoctype ms-3 d-none d-lg-block">{translate_value.dashboard.uploads} :</span><span className=""> {datacount.documents_count}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-light vh-100 mb-3 mt-3">
                  <div className="d-flex flex-column flex-md-row gap-3">
                    <div className="w-100 bg-white py-3 rounded shadow-sm d-flex flex-column align-items-center">
                      <img src={require('../../img/images_icons/profile-img1.png')} width={64} alt="profile" />
                      <Link to={`/userfiles/${user_id}/${'uploaded_documents'}`} className='mt-3 text-center' style={{ color: '#5D5FE3', fontSize: '18px', letterSpacing: '0.36px', fontWeight: 450, lineHeight: 'normal' }}>{translate_value.profile.uploaded_doc} ({userdetails.documents_count})</Link>
                    </div>
                    <div className={`w-100 profile-divs ${user_id === user.user_id ? 'd-flex flex-column align-items-center' : 'd-none'} bg-white py-3 rounded shadow-sm`}>
                      <img src={require('../../img/images_icons/profile-img2.png')} width={64} alt="profile" />
                      <Link to={`/userfiles/${user_id}/${'followed_documents'}`} className='mt-3 text-center' style={{ color: '#5D5FE3', fontSize: '18px', letterSpacing: '0.36px', fontWeight: 450, lineHeight: 'normal' }}>{translate_value.profile.followed_doc}</Link>
                    </div>
                    <div className="w-100 profile-divs d-flex flex-column align-items-center bg-white py-3 rounded shadow-sm">
                      <img src={require('../../img/images_icons/profile-img3.png')} width={64} alt="profile" />
                      <Link to={`/userfiles/${user_id}/${'uploaded_flashcards'}`} className='mt-3 text-center' style={{ color: '#5D5FE3', fontSize: '18px', letterSpacing: '0.36px', fontWeight: 450, lineHeight: 'normal' }}>{translate_value.profile.upload_flashcard} ({userdetails.flashset_count})</Link>
                    </div>
                    <div className={`w-100 profile-divs ${user_id === user.user_id ? 'd-flex flex-column align-items-center' : 'd-none'} bg-white py-3 rounded shadow-sm`}>
                      <img src={require('../../img/images_icons/profile-img4.png')} width={64} alt="profile" />
                      <Link to={`/userfiles/${user_id}/${'followed_flashcards'}`} className='mt-3 text-center' style={{ color: '#5D5FE3', fontSize: '18px', letterSpacing: '0.36px', fontWeight: 450, lineHeight: 'normal' }}>{translate_value.profile.followed_flashcard}</Link>
                    </div>
                  </div>
                  <div className={`d-flex flex-column flex-md-row gap-3 mt-3 ${user_id === user.user_id ? '' : 'd-none'}`}>
                    <div className="w-100 profile-divs d-flex align-items-center justify-content-center bg-white py-2 rounded shadow-sm">
                      <img src={supercoin_icon} alt="Supercoin Icon" width="35" height="35" />
                      <p className='my-auto ms-3 text-secondary text-center' style={{ fontSize: '15px' }}>0 {translate_value.profile.super_coins}</p>
                    </div>
                    <div className="w-100 profile-divs d-flex align-items-center justify-content-center bg-white py-2 rounded shadow-sm">
                      <img src={supercoin_icon} alt="Supercoin Icon" width="35" height="35" />
                      <p className='my-auto ms-3 text-secondary text-center' style={{ fontSize: '15px' }}>0 {translate_value.profile.super_coins}</p>
                    </div>
                    <div className="w-100 profile-divs d-flex align-items-center justify-content-center bg-white py-2 rounded shadow-sm">
                      <img src={supercoin_icon} alt="Supercoin Icon" width="35" height="35" />
                      <p className='my-auto ms-3 text-secondary text-center' style={{ fontSize: '15px' }}>0 {translate_value.profile.super_coins}</p>
                    </div>
                    <div className="w-100 profile-divs d-flex align-items-center justify-content-center bg-white py-2 rounded shadow-sm">
                      <img src={supercoin_icon} alt="Supercoin Icon" width="35" height="35" />
                      <p className='my-auto ms-3 text-secondary text-center' style={{ fontSize: '15px' }}>0 {translate_value.profile.super_coins}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* UNIVERSITY MODAL FORM */}
          <div className="modal fade" id="add_details" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='d-flex justify-content-between px-4 pt-3'>
                  <h5 className=" fw-bold text-center text-primary" id="staticBackdropLabel">Add Your Details</h5>
                  <button data-bs-dismiss="modal" onClick={() => { setUniversityNamesVisible(false); }} className='bg-transparent border-0'>
                    <i className="fa-solid fa-circle-xmark fs-5"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <form action="" onSubmit={handleSubmit} className="p-2 px-4">
                    <div>
                      <input
                        type="text"
                        className='form-control py-3 mb-0'
                        id='universitynamefield'
                        placeholder='Select the University'
                        onClick={() => setUniversityNamesVisible(true)}
                        onChange={(e) => {
                          handleSearch(e.target.value);
                        }}
                        value={selectedUniversityName}
                      />
                      <div id='universitynames' className={`mt-0 border bg-light ${isUniversityNamesVisible ? 'd-block' : 'd-none'}`} style={{ overflowY: 'scroll' }}>
                        <div className='px-2 m-0 bg-info-subtle' style={{ listStyleType: 'none' }}>
                          {searchResults && (
                            searchResults.map((university, index) => (
                              <li key={index}><a href='' className='text-decoration-none text-dark ' style={{ fontSize: '14px' }} onClick={(event) => {
                                adduniversityname(university.university_name, event, university.university_id);
                              }}>{university.university_name}</a></li>
                            ))
                          )}
                        </div>
                        <ul className='px-2 m-0' style={{ listStyleType: 'none' }}>
                          {universitydata.map((x, index) => {
                            const isMatch = searchResults.some(y => y.university_name === x.university_name);
                            return (
                              !isMatch && (
                                <li key={index}>
                                  <a href='' className='text-decoration-none text-dark ' style={{ fontSize: '14px' }} onClick={(event) => {
                                    adduniversityname(x.university_name, event, x.university_id);
                                  }}>{x.university_name}</a>
                                </li>
                              )
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                    <div className="row mt-3" id='programs'>
                      <div className="col-12">
                        <select name="program" className="form-select form-select-md px-2 py-3 mb-3 shadow-none" aria-label="Large select example" onChange={handleChange} value={formData.program}>
                          <option selected>Select the Program</option>
                          {programs.map((x, index) => {
                            return (
                              <option key={index} value={x.pid}>{x.program_name}</option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-4">
                          <select
                            name="semester"
                            className="form-select form-select-md px-2 py-3 mb-3 shadow-none"
                            aria-label="Large select example"
                            onChange={handleChange}
                            value={formData.semester}
                          >
                            <option selected>Select Semester</option>
                            {semesterdata.map((x, index) => {
                              return (
                                <option key={index} value={x.semester_id}>{x.sem_name}</option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <button className="btn signup-btn btn-md py-2 w-100 text-white fw-medium" type="submit" data-bs-dismiss="modal">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* EDIT USER DETAILS MODAL FORM */}
          <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="d-flex p-2 justify-content-between align-items-center px-1 px-md-3">
                  <h6 className=" fw-bold text-center m-0" style={{ color: '#5d5fe3' }} id="staticBackdropLabel" >
                    Edit Your Details
                  </h6>
                  <button type="button" className="ms-auto btn btn-sm border-0 d-flex align-items-center" data-bs-dismiss="modal" aria-label="Close" >
                    <img src={close_icon} alt="Close Model Icon" width="16" height="16" />
                  </button>
                </div>
                <div className="modal-body">
                  <form action="" encType="multipart/form-data" onSubmit={sendEditedDetails} className="p-2 px-4">
                    <div className="row">
                      <div className="col-12 mt-3">
                        <label htmlFor="">Nickname</label>
                        <input type="text" className='form-control mt-2 shadow-none border-secondary-subtle' maxLength={6} value={editedNickname} onChange={(e) => { setEditedNickname(e.target.value); }} />
                      </div>
                      <div className="col-12 mt-3 text-center">
                        <input type="file" accept="image/*" name='file' id='file' className='form-control' onChange={(e) => {
                          var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
                          if (fileSize > 0.5) {
                            alert("File size must be less than 500 KB.");
                          } else {
                            updateProfileImage(e.target.files[0]);
                          }
                        }} />
                        <label htmlFor="file" className='bg-info text-white py-1 px-4 rounded-pill '><i className="fa-solid fa-cloud-arrow-up me-2"></i>Upload Profile Image</label>
                        <span className='d-block text-success mt-1'>{editImage && editImage.name}</span>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <button className="btn signup-btn btn-md py-2 w-100 text-white fw-medium" type="submit" data-bs-dismiss="modal" >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* SET BED TIME MODAL */}
          <div className="modal fade" id="set_bed_time" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='d-flex justify-content-between px-3 pt-3'>
                  <h5 className=" fw-bold text-center text-primary" id="staticBackdropLabel" >
                    Set Your Bed Time
                  </h5>
                  <button data-bs-dismiss="modal" className='bg-transparent border-0'><i className="fa-solid fa-circle-xmark fs-5"></i></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleFormSubmit} className=''>
                    <input type="time" className='form-control' value={selectedTime} onChange={handleTimeChange} />
                    <div className='text-end mt-3'>
                      <button type="submit" className='btn btn-sm btn-danger'>Set Time</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* REPORT USER MODAL */}
          <div className="modal fade" id="report_user" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='d-flex justify-content-between px-3 pt-3'>
                  <h6 className=" fw-medium text-center text-primary" id="staticBackdropLabel" >
                    Report the User
                  </h6>
                  <button data-bs-dismiss="modal" className='bg-transparent border-0'><i className="fa-solid fa-circle-xmark fs-5"></i></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={reportuser} className=''>
                    <textarea type="text" className='form-control' value={report} onChange={(e) => { setreport(e.target.value); }} />
                    <div className='text-center mt-4'>
                      <label htmlFor="file3" className='text-white rounded-pill py-1 px-3' style={{ backgroundColor: '#5d5fe3' }}>Upload the  Report Screenshot</label>
                      <input type="file" onChange={(e) => {
                        var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
                        if (fileSize > 0.5) {
                          alert("File size must be less than 500 KB.");
                        } else {
                          changeimage(e.target.files[0]);
                        }
                      }} id='file3' accept="image/*" name='file1' />
                      <p className='mt-1'>{image != null && image.name}</p>
                    </div>
                    <div className='text-end mt-3'>
                      <button data-bs-dismiss="modal" type="submit" className='btn btn-sm btn-danger px-3 rounded-pill'>Send</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;