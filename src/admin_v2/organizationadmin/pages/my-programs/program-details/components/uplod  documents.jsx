import React, { useState } from "react";
import { Container } from "reactstrap";

const DocumentUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file.name);
        }
    };
    return (
        <Container>
            <div
                id="uploadimg"
                className="bg-light rounded-circle p-3 border "
                style={{ position: "absolute", top: "100px", }}
            >
                <img
                    src="/learn-hub-demo/static/media/send-img2.53fd0412e4dd0252a84e.png"
                    alt="upload"
                    style={{ width: "60px" }}
                />
            </div>
            <div className="d-flex justify-content-evenly mt-5 py-5">
                <span className="fw-bold">Upload Document</span>
                <span className="text-secondary">
                    <span className="d-md-inline d-none">-----------------------------</span>
                    <span className="d-md-none d-inline">---</span>
                    <span className="fw-bold ms-1 ms-lg-5">Details</span>
                </span>
                <span className="text-secondary">
                    <span className="d-md-inline d-none">-----------------------------</span>
                    <span className="d-md-none d-inline">---</span>
                    <span className="fw-bold ms-1 ms-lg-5">Preview &amp; Submit</span>
                </span>
            </div>
            <div
                className="bg-light py-5 rounded px-4 text-center"
                style={{ border: "1px dashed rgb(93, 95, 227)" }}
            >
                <p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                    >
                        <path
                            d="M29.125 43.5H30.875V31.375L36.5 37L37.75 35.75L30 28L22.25 35.75L23.5 37L29.125 31.375V43.5ZM17 51.75C15.9167 51.75 15.0208 51.3958 14.3125 50.6875C13.6042 49.9792 13.25 49.0833 13.25 48V12C13.25 10.9167 13.6042 10.0208 14.3125 9.3125C15.0208 8.60417 15.9167 8.25 17 8.25H36.625L46.75 18.375V48C46.75 49.0833 46.3958 49.9792 45.6875 50.6875C44.9792 51.3958 44.0833 51.75 43 51.75H17ZM35.75 19.25V10H17C16.5 10 16.0417 10.2083 15.625 10.625C15.2083 11.0417 15 11.5 15 12V48C15 48.5 15.2083 48.9583 15.625 49.375C16.0417 49.7917 16.5 50 17 50H43C43.5 50 43.9583 49.7917 44.375 49.375C44.7917 48.9583 45 48.5 45 48V19.25H35.75Z"
                            fill="#5D5FE3"
                        />
                    </svg>
                </p>
                <p className="mb-3" style={{ color: "rgb(93, 95, 227)", fontSize: "17px" }}>
                    Browse & Upload Your Files Here...
                </p>
                <input
                    id="fileInput"
                    type="file"
                    accept=".pdf"
                    className="d-none"
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="fileInput"
                    className="custom-file-input rounded border-0 text-white px-5 py-2 fw-normal"
                    style={{ backgroundColor: "rgb(93, 95, 227)", cursor: "pointer" }}
                >
                    Browse
                </label>
                {selectedFile && (
                    <p className="mt-2 text-muted">Selected File: {selectedFile}</p>
                )}
            </div>
        </Container>
    );
};

export default DocumentUpload;
