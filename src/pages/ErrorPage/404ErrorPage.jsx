import React from "react";
import "./ErrorPage.css";
import bgImage from '../../img/404Error.jpg'
import { useNavigate } from "react-router-dom";
const ErrorPage = () => {
  const navigate = useNavigate();
  return (

    <div className="error_page">
      <div className="container px-5 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center justify-content-center flex-column">
          <div className="background">
            <img src={bgImage}/>
          </div>
          <div className="d-flex justify-content-center flex-column align-items-center">
            <h1 className="error_message">Sorry, Page Not Found</h1>
            <div onClick={()=> navigate('/')} className="go_back border rounded px-5 py-3 d-flex align-items-center justify-content-center mt-5 text-white">Back to Home Page</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
