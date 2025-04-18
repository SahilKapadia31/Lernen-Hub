import React, { useState } from "react";
import './upload-file.scss';
import { Modal, Button } from "react-bootstrap";
import close_icon from '../../../../img/close-icon.svg';
import sample_file from '../../../../assets/sample_file_student_uploads.xlsx'
import * as XLSX from 'xlsx';
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";
import axiosInstance from "../services/axiosInstance";
const toastConfig = {
  position: "top-center",
  autoClose: 3000,
};

const UploadFile = ({ show, handleClose, organization_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const onFileChange = async (e) => {
    try {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        toast.error("No file selected!", toastConfig);
        return;
      }

      const fileType = selectedFile.type;
      const fileSize = (selectedFile.size / 1024 / 1024).toFixed(2);

      // Check if file is Excel (xlsx or xls)
      if (!fileType.includes("spreadsheetml")) {
        toast.error("Only Excel files (.xlsx or .xls) are allowed.", toastConfig);
        return;
      }

      if (fileSize > 2) {
        toast.error("File size must be less than 2 MB.", toastConfig);
        return;
      }

      // Read and validate Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Assuming the first sheet contains the required data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData || jsonData.length === 0) {
          toast.error("The Excel file is empty or invalid.", toastConfig);
          return;
        }

        // Check for required fields (first_name, last_name, email, phone)
        const missingFields = jsonData.some(row => {
          return  !row["Firtst Name"] || !row["Last Name"]  || !row["Gender"] || !row["DOB"];
        });

        if (missingFields) {
          toast.error("Excel file must contain the following fields: First Name, Last Name, Gender, DOB.", toastConfig);
          return;
        }

        // If everything is valid, set the file
        setFile(selectedFile);
        //toast.success("File is valid and ready for upload!", toastConfig);
      };

      reader.readAsBinaryString(selectedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error reading the file.", toastConfig);
    }
  };

  const upload = async () => {
    if (!file) {
      toast.error("No file selected for upload.", toastConfig);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append('organization_id', Number(organization_id))
      
      const response = await axiosInstance.post(`/organization/uploadStudentsData/`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

      if (response) {
        toast.success("File uploaded successfully");
        handleClose();
      } 
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Error in upload", err);
      toast.error("Error!!! Please try again")
    }
  };

  return (
    <>
      <Modal show={show} onHide={() => { handleClose(); setFile(null) }} className="upload_file" size="lg" centered>
        <Modal.Body className="bg-light">
          <div className="header">
            <div className="d-flex justify-content-between align-items-center w-100 mb-3">
              <p className="main-title">Upload Student File</p>
              <a href={sample_file} download="sample_file_student_uploads.xlsx" className="sample-file">Download Sample File</a>
            </div>
            <div className='d-flex flex-column jstify-content-center align-items-center bg-light py-3 rounded px-4' style={{ border: '1px dashed #5D5FE3' }}>
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M29.125 43.5H30.875V31.375L36.5 37L37.75 35.75L30 28L22.25 35.75L23.5 37L29.125 31.375V43.5ZM17 51.75C15.9167 51.75 15.0208 51.3958 14.3125 50.6875C13.6042 49.9792 13.25 49.0833 13.25 48V12C13.25 10.9167 13.6042 10.0208 14.3125 9.3125C15.0208 8.60417 15.9167 8.25 17 8.25H36.625L46.75 18.375V48C46.75 49.0833 46.3958 49.9792 45.6875 50.6875C44.9792 51.3958 44.0833 51.75 43 51.75H17ZM35.75 19.25V10H17C16.5 10 16.0417 10.2083 15.625 10.625C15.2083 11.0417 15 11.5 15 12V48C15 48.5 15.2083 48.9583 15.625 49.375C16.0417 49.7917 16.5 50 17 50H43C43.5 50 43.9583 49.7917 44.375 49.375C44.7917 48.9583 45 48.5 45 48V19.25H35.75Z" fill="#5D5FE3" />
                </svg>
              </p>
              <p className="mb-3 browse-file">
                Browse & Upload Your Files Here...
              </p>
              <input
                id="fileInput"
                type="file"
                accept=".xlsx,.xls"
                onChange={onFileChange}
                className="bg-light text-center p-3 btn"
              />
              <label
                htmlFor="fileInput"
                className="custom-file-input rounded border-0 text-white px-5 py-2 fw-normal" style={{ backgroundColor: '#5D5FE3' }}
              >
                Browse
              </label>
              {file && (
                <p className='mt-3 fw-medium' id='file-msg'>{file.name}</p>
              )}
            </div>
            <div className='mt-3 d-flex gap-2 justify-content-end'>
              <button className='btn btn-primary text-white' disabled={!file} onClick={upload}>Upload</button>
              <button className='btn btn-danger text-white' onClick={() => { handleClose(); setFile(null) }}>Cancel</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {isLoading && <Loading loading={true} loaderColor="#000" />}
    </>
  );
};

export default UploadFile;
