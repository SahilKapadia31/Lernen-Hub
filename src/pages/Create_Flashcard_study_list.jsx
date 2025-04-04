// Create the New Study lists and Add document to the particular studylist category
import { Toast } from 'bootstrap';
import { formatDate } from 'date-fns';
import React, { useEffect, useState, useContext } from 'react'
import ToastComponent from './Toast';
import Mainsidebar from '../components/Mainsidebar';
import { ipaddress2 } from '../App';
import { ipaddress22 } from '../App';
import data from './translate';
import { Context } from '../context/Context_provider';
import axiosInstance from './axiosInstance';
import * as bootstrap from 'bootstrap';
import { toast } from 'react-toastify';
import { setEncryptedData, getDecryptedData, removeData } from '../utils/helperFunctions';

const toastConfig = { autoClose: 3000, theme: 'colored', position: 'top-right' };// Centralized toast configuration

const Create_flashcard_study_list = ({ setCount, flashset_id, call_function }) => {
    let { translate_value, addsubjects_layout, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)
    const [value, setValue] = useState(data.en);
    const [lang, setLang] = useState("en");
    const translate = (x) => {
        if (x === "ge") {
            setValue(data.ge);
            setLang("ge");
        } else {
            setValue(data.en);
            setLang("en");
        }
    };
    const [count1, setCount1] = useState(0)
    const [status, setStatus] = useState(false)
    const [toaststatus, settoastStatus] = useState()
    const [checkedItems, setCheckedItems] = useState([]);
    const [studylists, setstudylists] = useState([]);
    const user = JSON.parse(getDecryptedData('user'))
    useEffect(() => {
        getStudylist()
    }, [])

    const getStudylist = () => {
        axiosInstance.get(`${ipaddress2}/FlashcardStudylistSection/${user.user_id}/`)
            .then((r) => {
                setstudylists(r.data.data)
            }).catch(() => { console.log("Getting flashcard studylist error") })
    }

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
        if (isChecked) {
            setCheckedItems([...checkedItems, value]);
        } else {
            setCheckedItems(checkedItems.filter(item => item !== value)); // To Remove the value from the array
        }
    };

    const [studylistname, setStudylistname] = useState("")
    const createStudylist = async () => {
        if (!studylistname) {
            toast.error('Study List Name is required', toastConfig);
            return;
        }
        try {
            const formdata = new FormData()
            formdata.append('user_id', user.user_id)
            formdata.append('studylist_name', studylistname)
            const response = await axiosInstance.post(`${ipaddress2}/FlashsetStudyList_create/`, formdata);
            if (response.status === 200) {
                if (response.data === "Flascard Study list already exist") {
                    toast.error('Study List Already Created !!!', toastConfig);
                } else {
                    getStudylist();
                    setStatus(false);
                    setStudylistname("");
                    settoastStatus(true);
                    setCount((prev) => prev + 1);
                    toast.success(response.data, { autoClose: 3000, theme: 'colored', position: 'top-right' });
                }
            } else {
                toast.error(response.data, toastConfig);
            }
        } catch (error) {
            const errorMessage = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data
                : 'Something went wrong. Please try again.') : 'An unexpected error occurred. Please try again.';
            toast.error(errorMessage, toastConfig);
        }
    }

    // -------------------------------------Add the document to the studylist category---------------------------------------
    const addtoStudylist = () => {
        const formdata = new FormData()
        formdata.append('study_id', checkedItems)
        axiosInstance.post(`${ipaddress2}/Add_flashcard_to_studylist/${user.user_id}/${flashset_id}/`, formdata)
            .then((r) => {
                // console.log("Flashset Addedd to Study List",r.data)
                setCount((prev) => prev + 1)
                call_function()
            }).catch(() => { console.log("Add_flashcard_to_studylist error") })
    }


    return (
        <div>

            <div className="modal fade" id="flashcard_studylist_modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg my-4">
                    <div className="modal-content">
                        <div className="modal-body px-4">
                            <h5>Save to Study List</h5>
                            <div>
                                <div className={`${status ? 'd-none' : ''} d-flex gap-2 justify-content-between align-items-center`}>
                                    <button className={`btn mt-3`} style={{ border: '1px solid #8587EA', color: '#8587EA' }} onClick={() => {
                                        setStatus(true)
                                    }}>Create New Reading List</button>
                                    <button className={`btn mt-3`} style={{ border: '1px solid #8587EA', color: '#8587EA' }} onClick={addtoStudylist} data-bs-dismiss="modal">Add to Study List</button>
                                </div>
                                <div className={`d-flex flex-column flex-lg-row mt-3 ${status ? 'd-block' : 'd-none'}`}>
                                    <input type="text" className='form-control' placeholder='Enter Study List Name' value={studylistname} onChange={(e) => { setStudylistname(e.target.value) }} />
                                    <div className='mt-2 mt-lg-0 d-flex justify-content-center justify-content-lg-end'>
                                        <button className='btn text-white fw-medium ms-2 px-3' style={{ backgroundColor: '#5D5FE3' }} onClick={createStudylist}>Create</button>
                                        <button className='btn fw-medium ms-2 px-3' style={{ border: '1px solid #606060', color: '#606060' }} onClick={() => { setStatus(false);setStudylistname('') }}>Cancel</button>
                                    </div>
                                </div>
                                <div className='mt-3 overflow-auto' style={{ height: "65vh" }}>

                                    {studylists && (
                                        studylists.map((x) => {
                                            return (
                                                <div className='py-2 px-3 rounded mb-2' style={{ backgroundColor: '#F9F9FB' }}>
                                                    <input type="checkbox" value={x.id} onChange={handleCheckboxChange} />
                                                    <span className='ms-2'>{x.study_list_name}</span>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastComponent toaststatus={toaststatus} />
        </div>
    )
}

export default Create_flashcard_study_list