import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, ModalBody } from 'reactstrap'
import { Formik, ErrorMessage, Form } from 'formik';
import { ipaddress } from '../../App';
import axiosInstance from '../axiosInstance';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import "./NeedHelp.css";
import { setEncryptedData, getDecryptedData, removeData } from '../../../src/utils/helperFunctions';

const toastConfigRight = { autoClose: 3000, theme: 'colored', position: 'top-right' };
const validationSchema = Yup.object().shape({
    Company_Name: Yup.string().required("Company Name is a required field."),
    Contact_Person: Yup.string().required("Contact Person is a required field."),
    Email_Id: Yup.string().email().required("Email is a required field."),
    Phone_No: Yup.string().required("Phone No is a required field."),
    Industry: Yup.string().required("Industry is a required field."),
    Inquiry_Type: Yup.string().required("Inquiry Type is a required field."),
    Message: Yup.string().required("Message is a required field.")
});
const validationSchemaSupportForm = Yup.object().shape({
    full_name: Yup.string().required("Full Name is a required."),
    email: Yup.string().email().required("Email is a required."),
    phone: Yup.string().required("Phone is a required."),
    reason: Yup.string().required("Contact reason is a required."),
    message: Yup.string().required("Message is a required.")
});
const NeedHelp = () => {
    const [value, setvalue] = useState('select');
    const [value2, setvalue2] = useState('select');
    const [isOpenSalesForm, setIsOpenSalesForm] = useState(false)
    // const [isOpenContactForm, setIsOpenContactForm] = useState(false)
    const [isOpenSupportForm, setIsOpenSupportForm] = useState(false)
    const [isSalesTermsChecked, setIsSalesTermsChecked] = useState(false)
    const [isSupportTermsChecked, setIsSupportTermsChecked] = useState(false)
    const [userData, setUserData] = useState({});

    useEffect(() => { // Load data from localStorage on component mount
        const storedData = getDecryptedData("user");
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
    }, []);
    const handleSubmit = async (values) => {
        try {
            //console.log("Form values", values);
            const formdata = new FormData();
            formdata.append("message", values.Message);
            const user = JSON.parse(getDecryptedData("user")); // Fetch user details
            if (!user?.user_id) { throw new Error("User information not found."); }
            const response = await axiosInstance.post(`${ipaddress}/CreateHelpView/${user.user_id}/`, formdata); // Make API call
            const result = response.data; // Handle API Response
            return { status: result?.status || false, message: result?.message || "Unknown response from server." };
        } catch (error) {
            console.log("Error occurred:", error);
            const errorMessage = error?.response?.data && typeof error.response.data === "string" ? error.response.data : "Something went wrong. Please try again.";
            return { status: false, message: errorMessage };
        }
    };

    const handleSubmitSupportForm = async (values) => {
        try {
            //console.log("Form values", values);
            const formdata1 = new FormData();
            formdata1.append("message", values.message);
            const user = JSON.parse(getDecryptedData("user")); // Fetch user details
            if (!user?.user_id) { throw new Error("User information not found."); }
            const response = await axiosInstance.post(`${ipaddress}/CreateHelpView/${user.user_id}/`, formdata1); // Make API call
            const result = response.data; // Handle API Response
            return { status: result?.status || false, message: result?.message || "Unknown response from server." };
        } catch (error) {
            console.log("Error occurred:", error);
            const errorMessage = error?.response?.data && typeof error.response.data === "string" ? error.response.data : "Something went wrong. Please try again.";
            return { status: false, message: errorMessage };
        }
    };

    const navigate = useNavigate();
    return (
        <div className='help'>
            <div className="d-flex dashboard position-relative reset_password">
                <div className='w-100'>
                    <div>
                        <div className='container pb-4'>
                            <p className='contact-head mt-3'>Need Help</p>
                            <div className="row m-0 mt-5">
                                <div className='col-lg-4 col-md-6 '>
                                    <div className="d-flex flex-column align-items-center p-4" style={{ backgroundColor: '#F3F0FF' }}>
                                        <p className='contact-subhead m-0'>Talk to a member of</p>
                                        <p className='contact-subhead m-0'>our Sales team</p>
                                        <p className='contact-para mt-3'>We will help you find the right products and pricing for your organization.</p>
                                        <button className='contact-btn btn text-white fw-medium mt-2'
                                            style={{ borderRadius: '5px', backgroundColor: '#5d5fe3' }} onClick={() => { setIsOpenSalesForm(!isOpenSalesForm) }}>Contact Sales</button>
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-6 mt-4 mt-md-0'>
                                    <div className="d-flex flex-column align-items-center p-4" style={{ backgroundColor: '#F9F9FB' }}>
                                        <p className='contact-subhead m-0'>Student & Learning</p>
                                        <p className='contact-subhead m-0'>Support</p>
                                        <p className='contact-para mt-3'>Couldn’t not find the answer you are looking for, we are here to lend a hand.</p>
                                        <button className='contact-btn btn text-white fw-medium mt-2' style={{ borderRadius: '5px', backgroundColor: '#2A3941' }} >Contact Our Team</button>
                                        {/* onClick={() => { setIsOpenContactForm(!isOpenContactForm) }} */}
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-6  mt-4 mt-lg-0'>
                                    <div className="d-flex flex-column align-items-center p-4" style={{ backgroundColor: '#FFEDE7' }}>
                                        <p className='contact-subhead m-0'>Product & account</p>
                                        <p className='contact-subhead m-0'>support</p>
                                        <p className='contact-para mt-3'>Couldn’t not find the answer you are looking for, we are here to lend a hand.</p>
                                        <button className='contact-btn btn text-white fw-medium mt-2'
                                            style={{ borderRadius: '5px', backgroundColor: '#FF845D' }} onClick={() => { setIsOpenSupportForm(!isOpenSupportForm) }}>Go to Help Center</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='' style={{ backgroundColor: '#F9F9FB', paddingBottom: '80px' }}>
                            <div className="row container mx-auto m-0 mt-5 pt-4">
                                <p className='contact-head mb-5'>Help Center</p>

                                <div className='col-lg-4 col-md-6'>
                                    <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                                        <img src={require('../../img/landing_page/bookkeeping 1.png')} alt="help" />
                                        <p className='contact-help-head m-0 mt-4'>our Sales team</p>
                                        <p className='contact-para mt-3'>Set yourself up for success with onboarding guides</p>
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-6 mt-4 mt-md-0'>
                                    <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                                        <img src={require('../../img/landing_page/lighthouse 1.png')} alt="help" />
                                        <p className='contact-help-head m-0 mt-4'>Product guides</p>
                                        <p className='contact-para mt-3'>Make the most of your setup with our comprehensive documentation</p>
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-6 mt-4 mt-lg-0'>
                                    <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                                        <img src={require('../../img/landing_page/headphone 1.png')} alt="help" />
                                        <p className='contact-help-head m-0 mt-4'>Help and FAQs</p>
                                        <p className='contact-para mt-3'>Find solutions for common issues</p>
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-6 mt-4'>
                                    <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                                        <img src={require('../../img/landing_page/first-prize 1.png')} alt="help" />
                                        <p className='contact-help-head m-0 mt-4'>Best practices</p>
                                        <p className='contact-para mt-3'>Find tips and step-by-step tutorials for common use cases</p>
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-6 mt-4'>
                                    <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                                        <img src={require('../../img/landing_page/video-conference 1.png')} alt="help" />
                                        <p className='contact-help-head m-0 mt-4'>Videos</p>
                                        <p className='contact-para mt-3'>Watch & Larn how to use Lernen Hub</p>
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-6 mt-4'>
                                    <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                                        <img src={require('../../img/landing_page/social-network (1) 1.png')} alt="help" />
                                        <p className='contact-help-head m-0 mt-4'>Community</p>
                                        <p className='contact-para mt-3'>Connect, learn, and share with other Zendesk users</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Form Modal */}
            <Modal isOpen={isOpenSalesForm} centered size='lg'>
                <Formik
                    initialValues={{
                        Company_Name: "",
                        Contact_Person: "",
                        Email_Id: userData?.email || "",
                        Phone_No: "",
                        Industry: "",
                        Inquiry_Type: "",
                        Message: "",
                        file: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
                        try {
                            const response = await handleSubmit(values);
                            if (response.status) {
                                toast.success(response.message, toastConfigRight);
                                resetForm();
                                setIsOpenSalesForm(false);
                            } else {
                                toast.error(response.message, toastConfigRight);
                            }
                        } catch (error) {
                            console.error("Submission Error:", error);
                            setErrors({ apiError: "An unexpected error occurred. Please try again." });
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
                        <Form className='p-3 px-4 sales_form' style={{ backgroundColor: '#F9F9FB' }}>
                            <div className='col-lg-12'>
                                <h3 className='title text-center' style={{ fontSize: '35px', color: '#5D5FE3' }}>Talk to a member of our Sales team</h3>
                                <div className='row mb-2'>
                                    <div className='col-lg-6 mb-2'>
                                        <label className='support-text2 mb-2' htmlFor="">Company Name <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" id="Company_Name" name="Company_Name" className="form-control" value={values.Company_Name} onChange={handleChange} onBlur={handleBlur} />
                                        <ErrorMessage className="validation-error" name='Company_Name' component='div' />
                                    </div>
                                    <div className='col-lg-6'>
                                        <label className='support-text2 mb-2' htmlFor="">Contact Person <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" id="Contact_Person" name="Contact_Person" className="form-control" value={values.Contact_Person} onChange={handleChange} onBlur={handleBlur} />
                                        <ErrorMessage className="validation-error" name='Contact_Person' component='div' />
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-lg-6 mb-2'>
                                        <label className='support-text2 mb-2' htmlFor="">Email Id <span style={{ color: 'red' }}>*</span></label>
                                        <input type="email" id="Email_Id" name="Email_Id" disabled={!!userData?.email} value={userData?.email || values.Email_Id} className="form-control" onChange={handleChange} onBlur={handleBlur} />
                                        <ErrorMessage className="validation-error" name='Email_Id' component='div' />
                                    </div>
                                    <div className='col-lg-6'>
                                        <label className='support-text2 mb-2' htmlFor="">Phone No <span style={{ color: 'red' }}>*</span></label>
                                        <input type="tel" maxLength={10} id="Phone_No" name="Phone_No" className="form-control" value={values.Phone_No} onChange={handleChange} onBlur={handleBlur} />
                                        <ErrorMessage className="validation-error" name='Phone_No' component='div' />
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-lg-6 mb-2'>
                                        <label className='support-text2 mb-2' htmlFor="">Industry <span style={{ color: 'red' }}>*</span></label>
                                        <select name="Industry" id="" className='form-select' value={values.Industry} onChange={handleChange} onBlur={handleBlur}>
                                            <option value="Select">Select Industry</option>
                                            <option value="education_technology">Education Technology</option>
                                            <option value="publishing">Publishing</option>
                                            <option value="software_development">Software Development</option>
                                            <option value="others">Others</option>
                                        </select>
                                        <textarea type="text" className={`form-control mt-4 ${value === 'others' ? '' : 'd-none'}`} placeholder='Enter the Industry type' />
                                        <ErrorMessage className="validation-error" name='Industry' component='div' />
                                    </div>
                                    <div className='col-lg-6'>
                                        <label className='support-text2 mb-2' htmlFor="">Inquiry Type<span style={{ color: 'red' }}>*</span></label>
                                        <select name="Inquiry_Type" id="Inquiry_Type" className='form-select' value={values.Inquiry_Type} onChange={handleChange} onBlur={handleBlur}>
                                            <option value="Select">Select Inquiry</option>
                                            <option value="technical_support">Technical Support</option>
                                            <option value="payment_issue">Payment Issue</option>
                                            <option value="profile_issue">Profile Issue</option>
                                            <option value="others">Others</option>
                                        </select>

                                        <ErrorMessage className="validation-error" name='Inquiry_Type' component='div' />
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className={`form-control mt-4 ${value2 === 'others' ? '' : 'd-none'} col-lg-6`}>
                                        <textarea type="text" placeholder='Specify Your Issue' />
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-lg-12'>
                                        <label className='support-text2 mb-2' htmlFor="">Message <span style={{ color: 'red' }}>*</span></label>
                                        <textarea id="Message" name="Message" className='form-control' rows={2} value={values.Message} onChange={handleChange} onBlur={handleBlur}></textarea>
                                        <ErrorMessage className="validation-error" name='Message' component='div' />
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-lg-12'>
                                        <div className='mt-4 d-flex align-items-center justify-content-center pt-2 rounded bg-secondary-subtle' style={{ border: '0.6px dashed #5d5fe3' }}>
                                            <label className='support-text2 mb-2' htmlFor="file" style={{ color: '#5d5fe3', cursor: 'pointer' }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                                <path d="M21.6816 19.4231C21.6816 21.3165 21.0293 22.9276 19.7247 24.2566C18.4203 25.5855 16.825 26.25 14.9388 26.25C13.0525 26.25 11.4531 25.5855 10.1406 24.2566C8.82813 22.9276 8.17188 21.3165 8.17188 19.4231V8.50969C8.17188 7.1876 8.62656 6.06375 9.53594 5.13812C10.4455 4.21271 11.5614 3.75 12.8834 3.75C14.2055 3.75 15.3212 4.21271 16.2306 5.13812C17.1402 6.06375 17.595 7.1876 17.595 8.50969V18.8462C17.595 19.5802 17.3389 20.2124 16.8266 20.7428C16.3145 21.2732 15.6903 21.5384 14.9541 21.5384C14.2178 21.5384 13.5845 21.2774 13.0541 20.7553C12.5236 20.2332 12.2584 19.5969 12.2584 18.8462V8.46156H13.5084V18.8462C13.5084 19.2452 13.645 19.5853 13.9181 19.8666C14.1915 20.1478 14.5276 20.2884 14.9266 20.2884C15.3257 20.2884 15.6619 20.1478 15.935 19.8666C16.2083 19.5853 16.345 19.2452 16.345 18.8462V8.48562C16.3402 7.51437 16.0063 6.69063 15.3431 6.01438C14.6802 5.33813 13.8603 5 12.8834 5C11.9141 5 11.0948 5.34219 10.4256 6.02656C9.75646 6.71073 9.42188 7.53844 9.42188 8.50969V19.4231C9.41708 20.9665 9.95156 22.2818 11.0253 23.3691C12.0989 24.4564 13.4062 25 14.9475 25C16.4667 25 17.758 24.4564 18.8216 23.3691C19.8851 22.2818 20.4218 20.9665 20.4316 19.4231V8.46156H21.6816V19.4231Z" fill="#5D5FE3" />
                                            </svg> Attach if there is any document</label>
                                            <input type="file" id='file' name="file" value={values.file} onChange={handleChange} onBlur={handleBlur} />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div className='d-flex mt-3'>
                                            <input type="checkbox" id='check' checked={isSalesTermsChecked} onChange={() => setIsSalesTermsChecked(!isSalesTermsChecked)} />
                                            <label htmlFor="check" className='ms-2'> Consent message goes here</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4 gap-2 d-flex align-items-center justify-content-center'>
                                    <button type="submit" disabled={isSalesTermsChecked ? false : true} className='btn py-2 px-4 text-white' style={{ backgroundColor: '#5d5fe3' }}>Submit</button>
                                    <button type="button" className='btn py-2 px-4 text-white btn-danger' onClick={() => { setIsOpenSalesForm(!isOpenSalesForm); setIsSalesTermsChecked(false) }}>Cancel</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Sales Form Modal */}
            {/* <Modal isOpen={isOpenContactForm} centered size='xl'>
                <ModalBody>
                    <div className='contact_form'>
                        <div className='d-flex justify-content-end'>
                            <svg className='close-icon' onClick={() => setIsOpenContactForm(!isOpenContactForm)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z" /></svg>
                        </div>
                        <div className='container mt-5 pt-4 pb-5'>
                            <p className='m-0 our-team-head'>Meet the Team</p>
                            <p className='m-0 our-team-head'>Powering <img src={require('../../img/landing_page/Group 392.png')} alt="help" /></p>
                            <p className='m-0 our-team-head'>Our Product</p>

                            <div className='mt-5'>
                                <p className='our-team-text1 m-0'>Hello and Welcome!</p>
                                <p className='our-team-text2 m-0 mt-4'>We’re thrilled to have you here at LERNEN HUB.COM, where we're reshaping the academic experience for organization students everywhere. Born in the heart of RWTH Aachen amidst its historic charm and innovative spirit, our platform is here to revolutionize the way students learn and connect</p>
                            </div>
                            <div className='mt-5'>
                                <p className='our-team-text3 m-0'>Our Story</p>
                                <p className='our-team-text2 m-0 mt-4'>It all started right here in Aachen, where we saw the need for a platform that allows easy access to shared learning materials. We've all been there—what used to be free suddenly costs a pretty penny. That's why we created LERNEN HUB.COM—to keep vital resources accessible without the hefty price tag, and make sure every student can focus on what really matters: learning and growing together</p>
                            </div>
                        </div>

                        <div className='mt-5 pt-4 pb-5' style={{ backgroundColor: '#F9F9FB' }}>
                            <p className='our-team-text6 text-center'>Cool Features You'll Love</p>
                            <div className="row m-0 mt-5 container mx-auto">
                                <div className="col-md-6 d-flex flex-column align-items-center p-4 border-end border-bottom py-5">
                                    <img src={require('../../img/landing_page/team-work 1.png')} alt="help" />
                                    <p className='our-team-text4 mt-4 m-0'>City-Based Groups</p>
                                    <p className='our-team-text5 mt-3'>Whether you’re looking for study help or just want to connect, find or create groups in your city and on campus.</p>
                                </div>
                                <div className="col-md-6 d-flex flex-column align-items-center p-4 border-bottom py-5">
                                    <img src={require('../../img/landing_page/document (2) 1.png')} alt="help" />
                                    <p className='our-team-text4 mt-4 m-0'>City-Based Groups</p>
                                    <p className='our-team-text5 mt-3'>Whether you’re looking for study help or just want to connect, find or create groups in your city and on campus.</p>
                                </div>
                                <div className="col-md-6 d-flex flex-column align-items-center p-4 border-end py-5">
                                    <img src={require('../../img/landing_page/shield 1.png')} alt="help" />
                                    <p className='our-team-text4 mt-4 m-0'>City-Based Groups</p>
                                    <p className='our-team-text5 mt-3'>Whether you’re looking for study help or just want to connect, find or create groups in your city and on campus.</p>
                                </div>
                                <div className="col-md-6 d-flex flex-column align-items-center p-4 py-5">
                                    <img src={require('../../img/landing_page/wallet 1.png')} alt="help" />
                                    <p className='our-team-text4 mt-4 m-0'>City-Based Groups</p>
                                    <p className='our-team-text5 mt-3'>Whether you’re looking for study help or just want to connect, find or create groups in your city and on campus.</p>
                                </div>
                            </div>
                            <div className='text-center mt-5'><button className='btn text-white py-3 px-4' style={{ backgroundColor: '#5d5fe3' }}>Get Started With Us</button></div>
                        </div>

                        <div className="container py-5 px-4">
                            <p className='our-team-text6 text-center'>From Vision to Reality</p>
                            <div className='' style={{ borderLeft: '1px dotted gray', position: 'relative' }}>
                                <div className='d-flex row m-0'>
                                    <div className='col-4 pb-4'>
                                        <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                                            <img className='responsive-img' src={require('../../img/landing_page/Group 464.png')} alt="help" />
                                            <p className='our-team-text7 m-0 ms-3'>Where We Started</p>
                                        </div>
                                    </div>
                                    <div className='col-8 border-bottom py-4'>
                                        <p className='our-team-text8 m-0'>Foundation Laid</p>
                                        <p className='our-team-text9 m-0 mt-3'>We launched with core features designed to support basic student needs—study groups, resource sharing, and foundational community engagement.</p>
                                    </div>
                                </div>

                                <div className='row m-0'>
                                    <div className='col-4 py-4'>
                                        <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                                            <img className='responsive-img' src={require('../../img/landing_page/Group 465.png')} alt="help" />
                                            <p className='our-team-text7 m-0 ms-3'>Where We Are</p>
                                        </div>
                                    </div>
                                    <div className='col-8 py-4 border-bottom'>
                                        <p className='our-team-text8 m-0'>Building Community</p>
                                        <p className='our-team-text9 m-0 mt-3'>Currently, we are enhancing our platform by expanding course offerings and forging partnerships witheducational institutions to provide rich, verified content.</p>
                                        <p className='our-team-text8 m-0 mt-4'>Enhancing User Experience</p>
                                        <p className='our-team-text9 m-0 mt-3'>We're actively collecting and implementing user feedback to refine and improve the functionality and user interface.</p>
                                    </div>
                                </div>

                                <div className='d-flex row m-0'>
                                    <div className='col-4 py-4'>
                                        <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                                            <img className='responsive-img' src={require('../../img/landing_page/Group 467.png')} alt="help" />
                                            <p className='our-team-text7 m-0 ms-3'>Where We're Heading</p>
                                        </div>
                                    </div>
                                    <div className='col-8 py-4 border-bottom'>
                                        <p className='our-team-text8 m-0'>Innovative Learning</p>
                                        <p className='our-team-text9 m-0 mt-3'>Soon, we will introduce AI-driven tools tailored to personalize learning and support. These innovations will include smart tutors and customizable learning paths.</p>
                                        <p className='our-team-text8 m-0 mt-4'>Global Accessibility</p>
                                        <p className='our-team-text9 m-0 mt-3'>Plans are in place to expand language options and customize features to cater to international educational standards and cultural preferences.</p>
                                        <p className='our-team-text8 m-0 mt-4'>Blockchain Integration</p>
                                        <p className='our-team-text9 m-0 mt-3'>Looking forward, we aim to enhance security and transparency through blockchain technology, which will safeguard credentials and enable fair, transparent community governance.</p>
                                    </div>
                                </div>

                                <div className='d-flex row m-0'>
                                    <div className='col-4 py-4'>
                                        <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                                            <img className='responsive-img' src={require('../../img/landing_page/Group 468.png')} alt="help" />
                                            <p className='our-team-text7 m-0 ms-3'>Our Vision for the Future</p>
                                        </div>
                                    </div>
                                    <div className='col-8 border-bottom py-4'>
                                        <p className='our-team-text8 m-0'>Sustainable Growth</p>
                                        <p className='our-team-text9 m-0 mt-3'>We commit to continuous innovation, integrating green practices into our educational tools and community engagements.</p>
                                        <p className='our-team-text8 m-0 mt-4'>Empowering Students Globally</p>
                                        <p className='our-team-text9 m-0 mt-3'>Ultimately, our vision is to make Lernen-Hub a globally recognized platform where every student, regardless of location or background, can access the tools they need to succeed.</p>
                                    </div>
                                </div>

                                <div className='d-flex row m-0'>
                                    <div className='col-4 py-4'>
                                        <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                                            <img className='responsive-img' src={require('../../img/landing_page/Group 469.png')} alt="help" />
                                            <p className='our-team-text7 m-0 ms-3'>Join Our Journey</p>
                                        </div>
                                    </div>
                                    <div className='col-8 pt-4'>
                                        <p className='our-team-text9 m-0'>Ultimately, our vision is to make Lernen-Hub a globally recognized platform where every student, regardless of location or background, can access the tools they need to succeed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#F3F0FF' }} className='py-5'>
                            <div className='pb-4 container'>
                                <p className='our-team-text6 text-center'>What’s Next for Us</p>
                                <p className='our-team-text2 m-0 mt-4'>Our commitment doesn’t stop at great study tools. We’re looking to integrate blockchain for transparent community decisions and even help you find the best student housing. At LERNEN HUB.COM, we want to enhance every aspect of your student life</p>
                                <div className='mt-5 pt-2'>
                                    <p className='our-team-text3 m-0'>Join Our Community</p>
                                    <p className='our-team-text2 m-0 mt-4'>Are you ready to leave behind those pricey, restrictive platforms? Join us at LERNEN HUB.COM. Together, let’s make your uni years not just easier, but truly memorable and fun. We’re in this together—</p>
                                    <p className='out-team-text2 fw-bold text-center' style={{ color: '#2A3941' }}>let’s make it legendary!</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal> */}

            {/* Support Form Modal */}
            <Modal isOpen={isOpenSupportForm} centered size='lg'>
                <Formik
                    initialValues={{
                        full_name: userData?.first_name && userData?.last_name ? `${userData.first_name} ${userData.last_name}` : '',
                        email: userData?.email || "",
                        phone: "",
                        reason: "",
                        message: "",
                        file: ""
                    }}
                    validationSchema={validationSchemaSupportForm}
                    onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
                        try {
                            const response = await handleSubmitSupportForm(values);
                            if (response.status) {
                                toast.success(response.message, toastConfigRight);
                                resetForm();
                                setIsOpenSupportForm(false);
                            } else {
                                toast.error(response.message, toastConfigRight);
                            }
                        } catch (error) {
                            console.error("Submission Error:", error);
                            setErrors({ apiError: "An unexpected error occurred. Please try again." });
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
                        <Form className='p-3 px-4' style={{ backgroundColor: '#F9F9FB' }}>
                            <div className='col-lg-12'>
                                <h3 className='title text-center' style={{ fontSize: '35px', color: '#5D5FE3' }}>Student & Learning Support</h3>
                                <div className=''>
                                    <div className='col-lg-12'>
                                        <div className='row mb-2'>
                                            <div className='col-lg-6 mb-2'>
                                                <label className='support-text2 mb-2' htmlFor="">Registered Email <span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" className='form-control' name='email' disabled={!!userData?.email} value={userData?.email || values.email} onChange={handleChange} onBlur={handleBlur} />
                                                <ErrorMessage className="validation-error" name='email' component='div' />
                                            </div>
                                            <div className='col-lg-6'>
                                                <label className='support-text2 mb-2' htmlFor="">Full Name <span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" className='form-control' name='full_name' disabled={!!(userData?.first_name && userData?.last_name)}
                                                    value={userData?.first_name && userData?.last_name ? `${userData.first_name} ${userData.last_name}` : values.full_name}
                                                    onChange={handleChange} onBlur={handleBlur} />
                                                <ErrorMessage className="validation-error" name='full_name' component='div' />
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-lg-6 mb-2'>
                                                <label className='support-text2 mb-2' htmlFor="">Phone No <span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" className='form-control' name='phone' value={values.phone} onChange={handleChange} onBlur={handleBlur} />
                                                <ErrorMessage className="validation-error" name='phone' component='div' />
                                            </div>
                                            <div className='col-lg-6'>
                                                <label className='support-text2 mb-2' htmlFor="">Reason For Contact <span style={{ color: 'red' }}>*</span></label>
                                                <select className='form-select' name='reason' value={values.reason} onChange={handleChange} onBlur={handleBlur}>
                                                    <option value="Select">Select Reason for Contact</option>
                                                    <option value="technical_support">Technical Support</option>
                                                    <option value="payment_issue">Payment Issue</option>
                                                    <option value="profile_issue">Profile Issue</option>
                                                    <option value="help_me_out">Help Me Out</option>
                                                    <option value="others">Others</option>
                                                </select>
                                                <ErrorMessage className="validation-error" name='reason' component='div' />
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-lg-12'>
                                                <textarea type="text" className={`form-control mt-4 ${value === 'others' ? '' : 'd-none'}`} placeholder='Specify Your Issue' />
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-lg-12'>
                                                <label className='support-text2 mb-2' htmlFor="">Message <span style={{ color: 'red' }}>*</span></label>
                                                <textarea className='form-control' rows={4} name='message' value={values.message} onChange={handleChange} onBlur={handleBlur}></textarea>
                                                <ErrorMessage className="validation-error" name='message' component='div' />
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-lg-12'>
                                                <div className='mt-4 d-flex align-items-center justify-content-center pt-2 rounded bg-secondary-subtle' style={{ border: '0.6px dashed #5d5fe3' }}>
                                                    <label className='support-text2 mb-2' htmlFor="file" style={{ color: '#5d5fe3', cursor: 'pointer' }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                                        <path d="M21.6816 19.4231C21.6816 21.3165 21.0293 22.9276 19.7247 24.2566C18.4203 25.5855 16.825 26.25 14.9388 26.25C13.0525 26.25 11.4531 25.5855 10.1406 24.2566C8.82813 22.9276 8.17188 21.3165 8.17188 19.4231V8.50969C8.17188 7.1876 8.62656 6.06375 9.53594 5.13812C10.4455 4.21271 11.5614 3.75 12.8834 3.75C14.2055 3.75 15.3212 4.21271 16.2306 5.13812C17.1402 6.06375 17.595 7.1876 17.595 8.50969V18.8462C17.595 19.5802 17.3389 20.2124 16.8266 20.7428C16.3145 21.2732 15.6903 21.5384 14.9541 21.5384C14.2178 21.5384 13.5845 21.2774 13.0541 20.7553C12.5236 20.2332 12.2584 19.5969 12.2584 18.8462V8.46156H13.5084V18.8462C13.5084 19.2452 13.645 19.5853 13.9181 19.8666C14.1915 20.1478 14.5276 20.2884 14.9266 20.2884C15.3257 20.2884 15.6619 20.1478 15.935 19.8666C16.2083 19.5853 16.345 19.2452 16.345 18.8462V8.48562C16.3402 7.51437 16.0063 6.69063 15.3431 6.01438C14.6802 5.33813 13.8603 5 12.8834 5C11.9141 5 11.0948 5.34219 10.4256 6.02656C9.75646 6.71073 9.42188 7.53844 9.42188 8.50969V19.4231C9.41708 20.9665 9.95156 22.2818 11.0253 23.3691C12.0989 24.4564 13.4062 25 14.9475 25C16.4667 25 17.758 24.4564 18.8216 23.3691C19.8851 22.2818 20.4218 20.9665 20.4316 19.4231V8.46156H21.6816V19.4231Z" fill="#5D5FE3" />
                                                    </svg> Attach if there is any document</label>
                                                    <input type="file" id='file' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-lg-12'>
                                                <div className='d-flex mt-3'>
                                                    <input type="checkbox" id='check' checked={isSupportTermsChecked} onChange={() => setIsSupportTermsChecked(!isSupportTermsChecked)} />
                                                    <label htmlFor="check" className='ms-2'> Consent message goes here</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mt-4 d-flex align-items-center justify-content-center gap-3'>
                                            <button disabled={isSupportTermsChecked ? false : true} type='submit' className='btn py-2 px-4 text-white' style={{ backgroundColor: '#5d5fe3' }}>Submit</button>
                                            <button type="button" className='btn py-2 px-4 text-white btn-danger' onClick={() => { setIsOpenSupportForm(!isOpenSupportForm); setIsSupportTermsChecked(false) }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div >

    )
}

export default NeedHelp