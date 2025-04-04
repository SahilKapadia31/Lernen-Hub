import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const ScrollTriggerModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleScroll = (event) => {
      const component = event.target; // Scroll event specific to this component
      if (component.scrollTop > window.innerHeight) {
        setShowModal(true);
      }
    };

    const componentRef = document.getElementById("scrollableComponent");
    if (componentRef) {
      componentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (componentRef) {
        componentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      id="scrollableComponent"
      style={{
        height: "500px", // Set height to make it scrollable
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Content Above 100vh (No Blur) */}
      <div className="aboveFold" style={{ height: "100vh", background: "#f8f9fa" }}>
        <h1>Welcome to My Page</h1>
        <p>Scroll down inside this box to trigger the login modal...</p>
      </div>

      {/* Content Below 100vh (Blurs when modal appears) */}
      <div className={`belowFold ${showModal ? "blurred" : ""}`} style={{ height: "100vh" }}>
        <h2>Protected Content</h2>
        <p>This content will be blurred until you log in.</p>
      </div>

      {/* Bootstrap Modal */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "10",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Please login to continue.</p>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for blur effect */}
      <style>
        {`
          .blurred {
            filter: blur(5px);
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default ScrollTriggerModal;
