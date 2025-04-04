// Create the New Study lists and Add document to the particular studylist category

import { Toast } from 'bootstrap';
import { formatDate } from 'date-fns';
import React, { useEffect, useState } from 'react'
import ToastComponent from './Toast';
import Mainsidebar from '../components/Mainsidebar';
import { ipaddress } from '../App';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';
import { setEncryptedData, getDecryptedData, removeData } from '../utils/helperFunctions';
const toastConfigRight = { autoClose: 3000, theme: 'colored', position: 'top-right' };
const Create_study_list = ({ setCount, document_id, call_function }) => {
    const [count1, setCount1] = useState(0)
    const [status, setStatus] = useState(false)
    const [toaststatus, settoastStatus] = useState()
    const [checkedItems, setCheckedItems] = useState([]);
    const [studylists, setstudylists] = useState([]);
    useEffect(() => {
        getStudylist()
    }, [])

    const getStudylist = () => {
        axiosInstance.get(`${ipaddress}/GetStudyListCategories/${user.user_id}/`)
            .then((r) => {
                // console.log("Study Lists",r.data)
                setstudylists(r.data)
            })
    }

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setCheckedItems([...checkedItems, value]);
            // console.log(value)
        } else {
            setCheckedItems(checkedItems.filter(item => item !== value)); // To Remove the value from the array
        }
    };

    const user = JSON.parse(getDecryptedData('user'))
    const [studylistname, setStudylistname] = useState("")
    const createStudylist = async () => {
        if (!studylistname) {
            toast.error('Study List Name is required', toastConfigRight);
            return;
        }
        try {
            const formdata = new FormData()
            formdata.append('study_list_name', studylistname)
            const response = await axiosInstance.post(`${ipaddress}/GetStudyListCategories/${user.user_id}/`, formdata) // Make the API call
            if (response.status === 200) {
                toast.success(response.data, toastConfigRight)
                console.log("Studylist Created", response.data)
                getStudylist()
                setStatus(false)
                setStudylistname("")
                settoastStatus(true)
                setCount((prev) => prev + 1)
            } else {
                toast.error(response.data, toastConfigRight)
            }
        } catch (error) {
            console.error('Error occurred:', error);
            const errorMessage = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data
                : 'Something went wrong. Please try again.') : 'An unexpected error occurred. Please try again.';
            toast.error(errorMessage, toastConfigRight);
        }
    }
    // -------------------------------------Add the document to the studylist category---------------------------------------
    const addtoStudylist = () => {
        axiosInstance.post(`${ipaddress}/UserStudyListView/${user.user_id}/${document_id}/`, checkedItems)
            .then((r) => {
                // console.log("Addedd to Study List",r.data)
                setCount((prev) => prev + 1)
                toast.success('Document added successfully', {
                    autoClose: 2000
                })
                call_function()
            })
    }


    return (
        <div>
            <div className="modal fade overflow-hidden" id="studylist_modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg my-4">
                    <div className="modal-content">
                        <div className="modal-body px-4">
                            <h5>Save to Study List</h5>
                            <div>
                                <div className={`d-flex flex-column flex-lg-row mt-3 ${status ? 'd-block' : 'd-none'}`}>
                                    <input type="text" className='form-control' placeholder='Enter Study List Name' value={studylistname} onChange={(e) => { setStudylistname(e.target.value) }} />
                                    <div className='mt-2 mt-lg-0 d-flex justify-content-center justify-content-lg-end'>
                                        <button className='btn text-white fw-medium ms-2 px-3' style={{ backgroundColor: '#5D5FE3' }} onClick={createStudylist}>Create</button>
                                        <button className='btn fw-medium ms-2 px-3' style={{ border: '1px solid #606060', color: '#606060' }} onClick={() => { setStatus(false);setStudylistname('') }}>Cancel</button>
                                    </div>
                                </div>
                                <div className={`${status ? 'd-none' : ''} d-flex justify-content-between gap-2`}>
                                    <button className={`btn mt-3`} style={{ border: '1px solid #8587EA', color: '#8587EA' }} onClick={() => { setStatus(true) }}>Create New Reading List</button>
                                    <button className={`btn mt-3 ${studylists.length > 0 ? '' : 'd-none'}`} style={{ border: '1px solid #8587EA', color: '#8587EA' }} data-bs-dismiss="modal" onClick={addtoStudylist}>Add to Study List</button>
                                </div>
                            </div>
                            <div className="mt-3 overflow-auto" style={{ height: "70vh" }}>
                                {studylists && (
                                    studylists.map((x) => {
                                        return (
                                            <div key={x.id} className='py-2 px-3 rounded mb-2' style={{ backgroundColor: '#F9F9FB' }}>
                                                <input type="checkbox" key={x.id} value={x.id} onChange={handleCheckboxChange} />
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
            <ToastComponent toaststatus={toaststatus} />
        </div>
    )
}

export default Create_study_list