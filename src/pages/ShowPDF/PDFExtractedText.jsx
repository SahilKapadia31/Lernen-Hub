import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ipaddress } from '../../App';
import { Context } from '../../context/Context_provider';
import axiosInstance from '../axiosInstance';
import { getDecryptedData } from '../../utils/helperFunctions';
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFExtractedText = () => {
  let { setgroup_visible, setstudylist_visible, setcourse_visible, setnavbar_dropdown_visible } = useContext(Context);
  //unused useContext=> translate_value, addsubjects_layout,navbar_dropdown_visible,
  const { id } = useParams();
  // const [extracted_text, setExtracted_text] = useState({});
  // const [PdfURL, setPdfURL] = useState();
  // const [error, setError] = useState();
  useEffect(() => {
    const userdata = JSON.parse(getDecryptedData("user"));
    axiosInstance.get(`${ipaddress}/SpecificDocumentDisplay/${userdata.user_id}/${id}/`)
      .then((response) => {
        extractTextFromPDF(response.data.pdf_data[0].documnet_id.document_url);
      }).catch((error) => { console.log("Error fetching document data") });
    // -------------------------OLD Flow ----------------
    // axiosInstance.get(`${ipaddress}/DisplayDocumentText/${id}/`)
    //   .then((r) => {
    //     setExtracted_text(r.data)
    //     document.getElementById('extracted_text_container').innerHTML = r.data.text
    //   })
  }, [])
  const extractTextFromPDF = async (url) => {
    try {
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      let fullText = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        // Initialize variables to keep track of the previous text item's position
        let lastY = null;
        let lineText = '';
        textContent.items.forEach((item) => {
          const currentY = item.transform[5]; // Y position of the text item
          // If we're on the same line (Y position), we append the text
          if (lastY !== null && Math.abs(currentY - lastY) < 5) {
            lineText += ' ' + item.str; // Add a space before the text
          } else {
            // If we moved to a new line, we add the line to fullText and start a new line
            if (lineText) {
              fullText += lineText + '\n'; // Append the accumulated line
            }
            lineText = item.str; // Start a new line with the current text
          }
          lastY = currentY; // Update the lastY position
        });
        // Append the last line after finishing the loop
        if (lineText) {
          fullText += lineText + '\n'; // Add the last accumulated line
        }
      }
      //setExtracted_text(fullText); // Update state with extracted text
      document.getElementById("extracted_text_container").innerHTML = fullText; // Display extracted text
    } catch (error) {
      console.error("Error extracting text from PDF", error);
    }
  };

  return (
    <div className='d-flex'>
      <div onClick={() => {
        setcourse_visible(false)
        setgroup_visible(false)
        setstudylist_visible(false)
      }} className="w-100 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
        <div onClick={() => { setnavbar_dropdown_visible(false) }} className="w-100 row m-0">
          <h5 className='pb-2 d-flex align-items-center' style={{ color: '#5d5fe3' }}>
            <Link to={`/showpdf/${id}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5d5fe3" className="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
              </svg>
            </Link>
            <span className='ms-2'>Extracted Pdf Text</span>
          </h5>
          <div className="col-lg-8" style={{ height: '80vh', overflowY: 'auto' }}>
            <div id='extracted_text_container' className='bg-white p-5 rounded shadow-sm' style={{ whiteSpace: "pre-wrap" }}></div>
          </div>
          <div className="col-lg-4 px-1 px-md-3">
            <div className='bg-white d-flex flex-column align-items-center py-3' style={{ height: '80vh' }}>
              <img src={require('../../img/images_icons/mascot1.png')} style={{ height: '350px', width: '150px' }} alt="pdf-ext" />
              <p className='fw-medium fs-5 m-0 mt-3' style={{ color: '#5d5fe3' }}>Here is your Extracted PDF Text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PDFExtractedText;