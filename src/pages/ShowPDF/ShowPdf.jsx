import React, { useState, useEffect, useContext, useRef } from "react";
import { Document, Page } from "react-pdf";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Preloader from "../Preloader";
import { Link } from "react-router-dom";
import DocumentCommentsection from "../DocumentCommentsection";
import Create_study_list from "../Create_study_list";
import { domain, ipaddress, ipaddress2 } from "../../App";
import { Context } from "../../context/Context_provider";
import Viewpdf_page from "../Viewpdf_page";
import Backtotop from "../Backtotop";
import ShowPdfPageSearchComments from "./ShowPdfPageSearchComments";
import Navpath from "../Navpath";
import Report_post from "../Report_post";
import { toast } from "react-toastify";
import axiosInstance from "./../axiosInstance";
import { getAccessToken } from "./../authService";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import * as bootstrap from "bootstrap";
import { pdfjs } from "react-pdf";
import moment from "moment/moment";
import {
  ModalFooter,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  FormGroup,
} from "reactstrap";
import { Formik, ErrorMessage, Form } from "formik";
import CryptoJS from "crypto-js";
import { PDFDocument } from "pdf-lib";
import apiClient from "../../pages/Middlewares/axiosConfig";
import { Rnd } from "react-rnd";
import ReactDOM from "react-dom";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import "./ShowPdf.scss"; // Import SCSS file
import {
  setEncryptedData,
  getDecryptedData,
  removeData,
} from "../../utils/helperFunctions";
import showpdfeye from "../../assets/svg/showpdf-eye.svg";
import shareLink from "../../assets/svg/share.svg";
import docReport from "../../assets/svg/report.svg";
import textExtract from "../../assets/svg/text-extract.svg";
import seeComments from "../../assets/svg/see-comments.svg";
import seePages from "../../assets/svg/pages.svg";
import doclike from "../../assets/svg/like.svg";
import docCreated_on from "../../assets/svg/created_on.svg";
import docDesc from "../../assets/svg/desc.svg";
import studylistStatus from "../../assets/svg/studylist-status.svg";
import studylistStatusBlue from "../../assets/svg/studylist-status-blue.svg";
import mark_Ques from "../../assets/svg/mark-que.svg";
import searchFilter from "../../assets/svg/search.svg";
import Tour from "reactour";
import { closeTour } from "../../features/tourSlice";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import pdfShowSample from "../../img/tour-image-sample/pdf-show-sample2.png";
var initialValues = { document_title: "" };
const screenWidth = window.innerWidth
const tourConfig = [
  {
    selector: "#Showpdf__DocumentEngagement",

    content: ({ goTo, inDOM }) => (
      <div>
        Engage with document
        <br />
        <hr />
        <i
          className="fas fa-caret-right card-arrow-tour"
          aria-hidden="true"
        ></i>
      </div>
    ),
  },
  {
    selector: "#Showpdf__DocumentEngagementBottom",
    content: ({ goTo, inDOM }) => (
      <div>
        Engage with document
        <br />
        <hr />
        <i
          className="fas fa-caret-right card-arrow-tour"
          aria-hidden="true"
        ></i>
      </div>
    ),
  },
  {
    selector: "#Leave__Comments",
    content: ({ goTo, inDOM }) => (
      <div>
        Leave comments and discuss document
        <br />
        <hr />
        <i
          className="fas fa-caret-left card-arrow-tour"
          style={{ right: "320px" }}
          aria-hidden="true"
        ></i>
      </div>
    ),
  },
  {
    selector: "#Toggal__PDF__Post",
    content: ({ goTo, inDOM }) => (
      <div>
        Toggle PDF/Post
        <br />
        <hr />
        <i
          className="fas fa-caret-left card-arrow-tour"
          style={{ right: "210px" }}
          aria-hidden="true"
        ></i>
      </div>
    ),
  },
  {
    selector: "#pdf-container",
    content: ({ goTo, inDOM }) => (
      <div className="pdf-tooltip">
        single click to highlight questions
        <br />
        <hr />
        <i
          className="fas fa-caret-right card-arrow-tour"
          aria-hidden="true"
        ></i>
        <img width={100} height={100} src={pdfShowSample}></img>
      </div>
    ),
  },
];

const ShowPDF = ({ settranslated_pdf_url }) => {
  const location = useLocation();
  const renderTooltip3 = (value) => (
    <Tooltip id="button-tooltip">{value}</Tooltip>
  );
  let {
    translate_value,
    addsubjects_layout,
    setgroup_visible,
    setstudylist_visible,
    setcourse_visible,
    navbar_dropdown_visible,
    setnavbar_dropdown_visible,
  } = useContext(Context);
  const [data1, setData1] = useState("");
  let [count, setCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [previewbtnstate, setpreviewbtnstate] = useState(isMobile);
  const [editDocumentMenu, setEditDocumentMenu] = useState(false);
  const menuRef = useRef(null);
  const [isDocOwner, setIsDocOwner] = useState(false);
  const [isDocVisible, setDocVisible] = useState(false);
  const [deleteDocModal, setDeleteDocModal] = useState(false);
  const [deleteMessage, setdeleteMessage] = useState("");
  const [checksumCache, setChecksumCache] = useState([]);
  const [isNotify, setIsNotify] = useState(true);
  const [isSelectDrow, setSelectDrow] = useState(false);
  const user = useSelector((state) => state.auth.user);
  // Function to calculate checksum
  const calculateChecksum = (fileData) => {
    const hash = CryptoJS.SHA256(
      CryptoJS.lib.WordArray.create(fileData)
    ).toString();
    return hash;
  };
  // Function to handle clicks outside of the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setEditDocumentMenu(false);
      }
    };
    // Add event listener when menu is open
    if (editDocumentMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editDocumentMenu]);
  // ------------------------------------------------Create post fixed button-----------------------------------------------
  const [isVisible, setIsVisible] = useState(true);
  const [isEditDocument, setIsEditDocument] = useState(false);
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    if (scrollTop > 300) {
      // Show the button when user scrolls down more than 300 pixels
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Attach scroll event listener when component mounts
  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    const timer = setTimeout(() => {
      setIsNotify(false); // Hide the element after 15 seconds
    }, 15000); // 15 seconds
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const [discussionpagelayout, setdiscussionpagelayout] = useState(false);
  const [documentpagelayout, setdocumentpagelayout] = useState(false);
  const [view_pdf_status, setview_pdf_status] = useState(false);
  const [reply_layout_status, setreply_layout_status] = useState(false);
  const { id } = useParams();
  const [pdfdata, setPdfdata] = useState({});
  const [pdfurldata, setPdfurldata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [folllowersdata, setFollowersdata] = useState([]);
  let [count1, setCount1] = useState(0);
  const [preloading, setPreLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  // const username=JSON.parse(getDecryptedData("user"))
  const [pinnedcomments_status, setpinnedcomments_status] = useState(false);
  const [usercomments_status, setusercomments_status] = useState(false);
  const [userdetails, setUserdetails] = useState({});
  const [isLinkShare, setLinkShare] = useState(false);
  const [nav_paths, setNavPaths] = useState([]);
  useEffect(() => {
    // To fetch user details
    setUserdetails(user);
    axiosInstance
      .get(`${ipaddress}/SpecificDocumentDisplay/${userdata.user_id}/${id}/`)
      .then((response) => {
        setPdfdata(response.data);
        setRating({ rating: response.data.rating });
        console.log("setPdfurldata", response.data.pdf_data[0]);
        setPdfurldata(response.data.pdf_data[0]);
        console.log(location);

        if (location?.state?.backNavPath) {
          var backPathValues = location?.state?.backNavPath
          setNavPaths([...backPathValues, {
            name: response?.data?.pdf_data[0]?.documnet_id?.title || "View Pdf",
            path: "",
          },])
        } else {
          setNavPaths([
            { name: "Dashboard", path: "/dashboard/page" },
            {
              name: location?.state?.course?.course_name || "View Document",
              path: '/dashboard/page',
            }, // Adjust path as needed
            {
              name: response?.data?.pdf_data[0]?.documnet_id?.title || "View Pdf",
              path: "",
            },
          ]);
        }

        //setLoading(false);
        try {
          const docOwner =
            response?.data?.pdf_data?.[0]?.user_id?.user_id ?? "";
          const currentUser = userdata?.user_id ?? "";
          const DocDelete = response?.data?.pdf_data?.[0]?.documnet_id
            ?.is_delete
            ? setDocVisible(true)
            : setDocVisible(false);
          if (docOwner && currentUser && docOwner === currentUser) {
            setIsDocOwner(true);
          } else {
            setIsDocOwner(false);
          }
        } catch (error) {
          console.error("Error checking document ownership:", error);
          setIsDocOwner(false); // Reset state on error
        }
      })
      .catch((error) => {
        setError("Error fetching document data");
        setLoading(false);
        setDocVisible(false);
      });

    axiosInstance
      .get(`${ipaddress}/DocumentFollowResponse/${id}/`)
      .then((r) => {
        setFollowersdata(r.data);
      })
      .catch(() => [console.log("Error in Document Followers Fetching")]);
    // setCoordinates({ x: 53, y: 4262,page:1});
  }, [id, count1, count]);

  // PRE LOADER
  useEffect(() => {
    setTimeout(() => {
      setPreLoading(false);
    }, 3000); // Set the timeout to match the delay in milliseconds
  }, []);

  // ----------------------------------TOOLTIP FOR BUTTONS-------------------------------------------------------------
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
    // Cleanup function to destroy tooltips when the component unmounts
    return () => {
      tooltipList.forEach((tooltip) => {
        tooltip.dispose();
      });
    };
  }, [id]);
  // -----------------------------------------------------Set Path------------------------------------------------------------
  setEncryptedData("path2", JSON.stringify(`/showpdf/${id}`), 180);
  setEncryptedData("name2", JSON.stringify(`View Document`), 180);
  removeData("path3");
  removeData("name3");
  // ------------------------------------------------------TRANSLATED PDF----------------------------------------------------
  const [lang, setLang] = useState("");
  const [loading1, setLoading1] = useState(true);
  const [error1, setError1] = useState(null);
  let navigate = useNavigate();
  const language = (e) => {
    setLang(e.target.value);
  };
  const [translatedpdf, setTranslatedPdf] = useState({});
  const translatePdf = () => {
    axiosInstance
      .get(`${ipaddress}/TranslatePDFAPIView/${lang}/${id}`)
      .then((r) => {
        settranslated_pdf_url(r.data.translated_pdf_url);
        const toastLiveExample = document.getElementById("translateToast");
        document.getElementById("translatetoastbody").textContent =
          "Document Successfully Translated";
        const toastBootstrap =
          bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
      })
      .catch((err) => [
        console.log("Error in Translating", err),
        // setError1("Error fetching document data");
        // setLoading1(false)
      ]);
  };

  const renderTooltip = (value) => (
    <Tooltip id="button-tooltip">{value && value}</Tooltip>
  );
  const [numPages1, setNumPages1] = useState(null);
  const [currentPage1, setCurrentPage1] = useState(1);
  const handlePreviousPage1 = () => {
    setCurrentPage1((prevPage) => Math.max(prevPage - 1, 1));
  };
  const handleNextPage1 = () => {
    setCurrentPage1((prevPage) => Math.min(prevPage + 1, numPages1));
  };
  // -------------------------------------------------------DISCUSSION PART-------------------------------------------------
  const userdata = JSON.parse(getDecryptedData("user"));
  const [documentDetails, setDocumentDetails] = useState([]);
  const [dropdownstate, setdropdownstate] = useState(false);
  const [index1, setindex1] = useState(-1);
  useEffect(() => {
    getdiscussion();
  }, [id, count]);

  let [post, setComment] = useState();
  const [discussionquestion, setdiscussionQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const questionData = (e) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    setdiscussionQuestion(e.target.value);
  };
  // ---------------------------------------------------IMAGE UPLOAD FOR POST-------------------------------------------------------
  const [selectedImage, setSelectedImage] = useState([]);
  const handleImageChange = async (event) => {
    const files = event.target.files;
    // Ensure that 'files' is not null or undefined
    if (files && files.length > 0) {
      setSelectedImage(Array.from(files));
    } else {
      setSelectedImage([]);
    }
  };
  const removemainImage = (index) => {
    setSelectedImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const postQuestion = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of selectedImage) {
      if (file.size <= 1024 * 1024) {
        formData.append("file", file);
      } else {
        console.error("File size exceeds 1 MB:", file.name);
        alert("Image size limit Exceeds");
      }
    }
    setCount(count + 1);
    setdiscussionQuestion("");
    setSelectedImage([]);
    setHighlights((prevHighlights) => [
      ...prevHighlights,
      { ...(selection || null), note, page: selection?.page || null }, // Include the correct page
    ]);
    if (selection != null) {
      formData.append(
        "coordinatevalues",
        JSON.stringify({ ...selection, note, page: selection.page })
      );
    }
    setSelection(null);
    setIsModalOpen(false);
    const encoded_question = encodeURIComponent(discussionquestion);
    try {
      const token = getAccessToken();
      const response = await fetch(
        `${ipaddress}/DocumentsComments/${user.user_id}/${id}/""/?post=${encoded_question}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (response.ok) {
        toast.success("Comment successfully posted", { autoClose: 2000 });
      } else {
        console.error("Failed to Sent Document Posts");
      }
      getdiscussion();
      setdiscussionQuestion("");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  // ---------------------------------------------------Post Replies for the particular comment-------------------------------------------------------
  const [replies, setReplies] = useState("");
  const repliesData = (e) => {
    setReplies(e.target.value);
  };
  const [replyImage, setReplyImage] = useState([]);
  const [load, setload] = useState();
  const handleReplyImage = async (event) => {
    const files = event.target.files;
    // Ensure that 'files' is not null or undefined
    if (files && files.length > 0) {
      setReplyImage(Array.from(files));
    } else {
      setReplyImage([]);
    }
  };
  const removeImage = (index) => {
    setReplyImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const clearInput = (index) => {
    const inputElement = document.getElementsByClassName("originalreply-input");
    if (inputElement) {
      inputElement[index].value = "";
    }
  };
  const [selectedPostForComment, setSelectedPostForComment] = useState(null);
  const postReplies = async (e, dis_id, index) => {
    e.preventDefault();
    setload(true);
    const formData = new FormData();
    // formData.append('user_id',user.pk)
    // formData.append('ddpid',dis_id)
    // formData.append('post',replies)
    for (const file of replyImage) {
      if (file.size <= 1024 * 1024) {
        formData.append("image", file);
      } else {
        console.error("File size exceeds 1 MB:", file.name);
        alert("Image size limit exceeds");
      }
    }
    const encoded_reply = encodeURIComponent(replies);
    if (replies.length > 0) {
      try {
        const token = getAccessToken();
        const response = await fetch(
          `${ipaddress}/DocCommentsRepliesNewView/${user.user_id}/${dis_id}/""/?post=${encoded_reply}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
        if (response.ok) {
          if (usercommentsstate == true) {
            fetchuserComments();
          }
          if (pinnedcommentsstate == true) {
            fetchpinnedComments();
          }
          if (searchcomment_status == true) {
            searchcomments(searchcomment);
          }
          if (
            pinnedcommentsstate == false &&
            usercommentsstate == false &&
            searchcomment_status == false
          ) {
            getdiscussion();
          }
          toast.success("Replied successfully", { autoClose: 2000 });
          clearInput(index);
          setReplyImage([]);
          setReplies("");
          getreplies(dis_id);
          //setreply_layout_status(false);
          setload(false);
          setSelectedPostForComment(null);
        } else {
          setload(false);
          setSelectedPostForComment(null);
          console.error("Failed to Sent Document Replies");
        }
      } catch (error) {
        setload(false);
        setSelectedPostForComment(null);
        console.error("Error uploading files:", error);
      }
    }
  };
  // --------------------Functionality to post replies under a reply---------------------------------------------------------
  const [reply_id, setreply_id] = useState(0);
  const [discuss_id, setdiscuss_id] = useState(0);
  const [reply_index, setreply_index] = useState(0);
  const [replies_for_reply_status, setreplies_for_reply_status] =
    useState(false);
  const [replies_reply_Image, setReplies_reply_image] = useState([]);
  const [reply_for_reply, setReply_for_reply] = useState("");
  const clearInput2 = (index) => {
    const inputElement = document.getElementsByClassName("reply-input2");
    if (inputElement) {
      inputElement[index].value = "";
    }
  };
  const handleReply_reply_Image = (event) => {
    const files = event.target.files;
    // Ensure that 'files' is not null or undefined
    if (files && files.length > 0) {
      setReplies_reply_image(Array.from(files));
    } else {
      setReplies_reply_image([]);
    }
  };
  const removereply_Image = (index) => {
    setReplies_reply_image((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };
  const postreply_for_replies = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of replies_reply_Image) {
      formData.append("images_attached", file);
    }
    const encoded_reply_reply = encodeURIComponent(reply_for_reply);
    try {
      const token = getAccessToken();
      const response = await fetch(
        `${ipaddress}/adocumentpostrepliesreplies/${user.user_id}/${reply_id}/""/?post=${encoded_reply_reply}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (response.ok) {
        setReply_for_reply("");
        getreplies(discuss_id);
        setreplies_for_reply_status(false);
        toast.success("Replied successfully", { autoClose: 2000 });
        setReplies_reply_image([]);
      } else {
        console.error("Document Reply under reply sending error");
      }
    } catch (error) {
      console.error("Error reply uploading files:", error);
    }
  };
  // ---------------------------------Search and get the discussions under document discussion-------------------------------------------------------
  const [searchedComments, setSearchedComments] = useState([]);
  const [searchcomment, setSearchcomment] = useState("");
  const [searchcomment_status, setsearchcomment_status] = useState(false);
  const [original_status, setoriginal_status] = useState(true);
  const searchcomments = (value) => {
    if (value.length > 0) {
      setsearchcomment_status(true);
      setoriginal_status(false);
      axiosInstance
        .get(
          `${ipaddress}/searchdocumentcomment/${id}/${value}/${user.user_id}/`
        )
        .then((response) => {
          setSearchedComments(response.data);
        })
        .catch((error) => {
          console.error("Document Search Error fetching comments:", error);
        });
    } else {
      setsearchcomment_status(false);
      setoriginal_status(true);
      setSearchedComments([]);
    }
  };
  // --------------------------------------------------FETCH DISCUSSION DETAILS---------------------------------------------
  const [discussions, setDiscussions] = useState([]);
  // const[likesCount,setLikesCount]=useState(0)
  const getdiscussion = () => {
    axiosInstance
      .get(`${ipaddress}/DCRV/${user.user_id}/${id}/`)
      .then((r) => {
        setDocumentDetails(r.data.reverse());
        let data = r.data.map(
          (item) => item?.comment?.docmid?.markup_location || []
        );
        setHighlights(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Document Discussion Details Fetching Error", err);
        setLoading(false);
      });
  };
  // -----------------------------------------Filter annd fetch Particular user's comments------------------------------------
  const [usercommentsstate, setusercommentsstate] = useState(false);
  useEffect(() => {
    fetchuserComments();
  }, [usercommentsstate]);
  const fetchuserComments = () => {
    if (usercommentsstate == true) {
      axiosInstance
        .get(`${ipaddress}/DCRV/${user.user_id}/${id}/`)
        .then((r) => {
          const usercomments = r.data.filter(
            (x) => x.user.user_id === user.user_id
          );
          setDocumentDetails(usercomments);
        })
        .catch(() => {
          console.log("Document Discussion Details Fetching Error");
        });
    } else {
      getdiscussion();
    }
  };
  // -----------------------------------------Filter annd fetch Pinned comments------------------------------------
  const [pinnedcommentsstate, setpinnedcommentsstate] = useState(false);
  useEffect(() => {
    fetchpinnedComments();
  }, [pinnedcommentsstate]);
  const fetchpinnedComments = () => {
    if (pinnedcommentsstate == true) {
      axiosInstance
        .get(`${ipaddress}/DCRV/${user.user_id}/${id}/`)
        .then((r) => {
          const pinnedcomments = r.data.filter((x) => x.pinned_status == true);
          setDocumentDetails(pinnedcomments);
        })
        .catch(() => {
          console.log("Document Discussion Details Fetching Error");
        });
    } else {
      getdiscussion();
    }
  };
  // ---------------------------------------------------DISCUSSION LIKES-----------------------------------------------------
  function handleLike1(discussion_id) {
    axiosInstance
      .delete(
        `${ipaddress}/DocumentCommentsLikes/${user.user_id}/${discussion_id}/`
      )
      .then((r) => {
        if (usercommentsstate == true) {
          fetchuserComments();
        }
        if (searchcomment_status == true) {
          searchcomments(searchcomment);
        }
        if (pinnedcommentsstate == true) {
          fetchpinnedComments();
        }
        if (
          pinnedcommentsstate == false &&
          usercommentsstate == false &&
          searchcomment_status == false
        ) {
          getdiscussion();
        }
      })
      .catch(() => {
        console.log("User Unlike error");
      });
  }
  function handleLike(discussion_id) {
    axiosInstance
      .post(
        `${ipaddress}/DocumentCommentsLikes/${user.user_id}/${discussion_id}/`
      )
      .then((r) => {
        if (usercommentsstate == true) {
          fetchuserComments();
        }
        if (searchcomment_status == true) {
          searchcomments(searchcomment);
        }
        if (pinnedcommentsstate == true) {
          fetchpinnedComments();
        }
        if (
          pinnedcommentsstate == false &&
          usercommentsstate == false &&
          searchcomment_status == false
        ) {
          getdiscussion();
        }
      })
      .catch(() => {
        console.log("User like error");
      });
  }
  //  ----------------------------------------Document comment dislike functionality---------------------------------------
  function handledislike(discussion_id) {
    axiosInstance
      .post(
        `${ipaddress}/doc_comments_dis_likes_view/${user.user_id}/${discussion_id}/`
      )
      .then((r) => {
        if (usercommentsstate == true) {
          fetchuserComments();
        }
        if (searchcomment_status == true) {
          searchcomments(searchcomment);
        }
        if (pinnedcommentsstate == true) {
          fetchpinnedComments();
        }
        if (
          pinnedcommentsstate == false &&
          usercommentsstate == false &&
          searchcomment_status == false
        ) {
          getdiscussion();
        }
      })
      .catch(() => {
        console.log("User dislike error");
      });
  }
  // ----------------------------------------------------Reply Likes------------------------------------------------------
  function handleReplyLike1(discussion_reply_id, discid, index) {
    axiosInstance
      .delete(
        `${ipaddress}/CommentRepliesLikes/${userdata.user_id}/${discussion_reply_id}/`
      )
      .then((r) => {
        if (usercommentsstate == true) {
          fetchuserComments();
        }
        if (pinnedcommentsstate == true) {
          fetchpinnedComments();
        }
        if (searchcomment_status == true) {
          searchcomments(searchcomment);
        }
        if (
          pinnedcommentsstate == false &&
          usercommentsstate == false &&
          searchcomment_status == false
        ) {
          getdiscussion();
        }
        getreplies(discid, index);
      })
      .catch(() => {
        console.log("User Reply Unlike error");
      });
  }
  function handleReplyLike(discussion_reply_id, discid, index) {
    axiosInstance
      .post(
        `${ipaddress}/CommentRepliesLikes/${userdata.user_id}/${discussion_reply_id}/`
      )
      .then((r) => {
        // console.log("User liked the Reply",r.data)
        if (usercommentsstate == true) {
          fetchuserComments();
        }
        if (searchcomment_status == true) {
          searchcomments(searchcomment);
        }
        if (pinnedcommentsstate == true) {
          fetchpinnedComments();
        }
        if (
          pinnedcommentsstate == false &&
          usercommentsstate == false &&
          searchcomment_status == false
        ) {
          getdiscussion();
        }
        getreplies(discid, index);
      })
      .catch(() => {
        console.log("User Reply like error");
      });
  }
  //  ----------------------Functionality to like the reply under particular reply in the discussion---------------------------------------------------------
  function handleReplies_reply_like(replies_reply_id, disc_replyid) {
    axiosInstance
      .post(
        `${ipaddress}/adocumentpostrepliesreplieslikesanddislikes/${user.user_id}/${replies_reply_id}/`
      )
      .then((r) => {
        getreplies_for_reply(disc_replyid);
      })
      .catch((err) => {
        console.log("User Replies reply like error", err);
      });
  }
  //  -----------------------------Functionality to dislike the reply under particular reply----------------------------------
  function handlereplies_replydislike(replies_reply_id, disc_replyid) {
    axiosInstance
      .patch(
        `${ipaddress}/adocumentpostrepliesreplieslikesanddislikes/${user.user_id}/${replies_reply_id}/`
      )
      .then((r) => {
        //  console.log("University Replies reply disliked",r.data)
        getreplies_for_reply(disc_replyid);
      })
      .catch(() => {
        console.log("University replies reply dislike error");
      });
  }
  //  ----------------------------------------Document reply dislike functionality---------------------------------------
  function handlereplydislike(reply_id, discussion_id, index) {
    axiosInstance
      .post(
        `${ipaddress}/DocumentReplyDisLikeView/${user.user_id}/${reply_id}/`
      )
      .then((r) => {
        //  console.log("User disliked the reply Successfully",r.data)
        getreplies(discussion_id, index);
        //  setCount(count+1)
      })
      .catch(() => {
        console.log("User reply dislike error");
      });
  }
  // ----------------------------------------------- RATINGS FOR DOCUMENT-------------------------------------------------------
  const [rating, setRating] = useState({});
  const handleStarClick = (clickedRating) => {
    // Send the rating to the backend
    sendRatingToBackend({ rating: clickedRating });
    setRating({ rating: clickedRating });
  };

  const sendRatingToBackend = async (rating) => {
    await axiosInstance
      .post(`${ipaddress}/DocumentRating/${userdata.user_id}/${id}/`, rating)
      .then((r) => {
        setCount1(count1 + 1);
      })
      .catch(() => {
        console.log("Error in sending ratings");
      });
  };
  // -----------------------------------------------FOLLOW DOCUMENT--------------------------------------------------------
  const followDocument = () => {
    axiosInstance
      .post(`${ipaddress}/FavouriteDocs/${userdata.user_id}/${id}/`)
      .then((r) => {
        setCount1(count1 + 1);
        toast.success("Document added to favourites", { autoClose: 2000 });
      })
      .catch(() => {
        console.log("User document follow error");
      });
  };
  // ----------------------------------------------UNFOLLOW DOCUMENT-------------------------------------------------------
  const unfollowDocument = () => {
    axiosInstance
      .delete(`${ipaddress}/FavouriteDocs/${userdata.user_id}/${id}/`)
      .then((r) => {
        setCount1(count1 + 1);
        toast.success("Document removed from favourites", { autoClose: 2000 });
      })
      .catch(() => {
        console.log("User document Unfollow error");
      });
  };
  // ------------------------------------------Dislike the document function-----------------------------------------------
  const dislikeDocument = () => {
    axiosInstance
      .post(`${ipaddress}/DisLikeDocuments/${userdata.user_id}/${id}/`)
      .then((r) => {
        setCount1(count1 + 1);
      })
      .catch(() => {
        console.log("User document dislike error");
      });
  };
  // -----------------------------------------DELETE THE DOCUMENT DISCUSSION POST---------------------------------------------------------------
  const deletePost = (discussion_id) => {
    axiosInstance
      .post(`${ipaddress}/documentcommentdelete/${discussion_id}/`)
      .then((r) => {
        if (usercommentsstate == true) {
          fetchuserComments();
        }
        if (pinnedcommentsstate == true) {
          fetchpinnedComments();
        }
        if (searchcomment_status == true) {
          searchcomments(searchcomment);
        }
        if (
          pinnedcommentsstate == false &&
          usercommentsstate == false &&
          searchcomment_status == false
        ) {
          getdiscussion();
        }
        toast.success("Post successfully deleted", { autoClose: 2000 });
        setdropdownstate(false);
      })
      .catch(() => {
        console.log("Post Delete Error");
      });
  };
  // --------------------------------------To delete the reply under discussion------------------------------------------------
  const deleteReply = (disc_reply_id, discid, index) => {
    axiosInstance
      .delete(`${ipaddress}/documentcommentreplydelete/${disc_reply_id}/`)
      .then((r) => {
        if (usercommentsstate == true) {
          fetchuserComments();
        }
        if (pinnedcommentsstate == true) {
          fetchpinnedComments();
        }
        if (searchcomment_status == true) {
          searchcomments(searchcomment);
        }
        if (
          pinnedcommentsstate == false &&
          usercommentsstate == false &&
          searchcomment_status == false
        ) {
          getdiscussion();
        }
        toast.success("Reply successfully deleted", { autoClose: 2000 });
        getreplies(discid, index);
      })
      .catch(() => {
        console.log("Document Reply Delete Error");
      });
  };
  // -------------------------------To Delete the reply under specific reply in the discussion--------------------------------------------------------
  const deleteReply_for_reply = (reply_reply_id, disc_reply_id, discid) => {
    axiosInstance
      .delete(
        `${ipaddress}/adocumentpostrepliesreplies/${user.user_id}/${reply_reply_id}/`
      )
      .then((r) => {
        toast.success("Reply successfully deleted", { autoClose: 2000 });
        getreplies(discid);
        getreplies_for_reply(disc_reply_id);
      })
      .catch((err) => {
        console.log("Replies reply Delete Error", err);
      });
  };
  // -----------------------------To get the Document Replies based on the discussion post----------------------------------
  const [fetchedreplies, setFetchedreplies] = useState([]);
  const getreplies = (discid, index) => {
    axiosInstance
      .get(`${ipaddress}/adocumentcommentsreplies/${discid}/${user.user_id}/`)
      .then((r) => {
        setFetchedreplies(r.data.reverse());
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };
  // ----------------------------------Function to get the replies for the particular reply----------------------------------------------------------------
  const [fetchedreplies_for_reply, setFetchedreplies_for_reply] = useState([]);
  const getreplies_for_reply = (particular_reply_id) => {
    axiosInstance
      .get(
        `${ipaddress}/adocumentpostrepliesreplies/${user.user_id}/${particular_reply_id}/`
      )
      .then((r) => {
        setFetchedreplies_for_reply(r.data.reverse());
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };
  // ------------------------------------------------CLOSE AND OPEN DISCUSSION PAGE----------------------------------------
  const [disc, setDisc] = useState(true);
  const discussionAction = () => {
    setDisc(!disc);
  };
  // ------------------------------------------------DOCUMENT RELATED FUNCTIONALITIES (MARKUP) PART----------------------------------------------------
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageScale, setPageScale] = useState(1);
  const handleZoomIn = () => {
    if (pageScale < 2) {
      setPageScale((prevScale) => parseFloat((prevScale + 0.2).toFixed(2)));
    }
  };
  const handleZoomOut = () => {
    if (pageScale > 0.2) {
      setPageScale((prevScale) => parseFloat((prevScale - 0.2).toFixed(2)));
    }
  };
  const adjustHighlightPosition = (highlight) => {
    return {
      top: highlight.y * pageScale,
      left: highlight.x * pageScale,
      width: highlight.width * pageScale,
      height: highlight.height * pageScale,
    };
  };
  // ---------------------------------------Document functionalities for mobile screen-----------------------------------------
  const [small_screen_pageScale, setsmall_screen_PageScale] = useState(0.6);
  const handleZoomIn1 = () => {
    if (small_screen_pageScale < 1) {
      setsmall_screen_PageScale((prevScale) => prevScale + 0.2);
    }
  };
  const handleZoomOut1 = () => {
    if (small_screen_pageScale > 0.6) {
      setsmall_screen_PageScale((prevScale) => prevScale - 0.2);
    }
  };
  // ----------------------------------------------------TEXT TO SPEECH INTEGRATION-----------------------------------------
  const [pdfText, setPdfText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  // const [pdfUrl, setPdfUrl] = useState('https://api.printnode.com/static/test/pdf/multipage.pdf');
  // ---------------------------------------------REPORT DATA SENDING------------------------------------------------------
  const [report, setReport] = useState("");
  const reportData = (e) => {
    setReport(e.target.value);
  };
  const sendreport = () => {
    const formdata = new FormData();
    formdata.append("user_id", userdata.user_id);
    formdata.append("report", report);
    axiosInstance
      .post(`${ipaddress}/document_report/${id}/`, formdata)
      .then((r) => {
        setReport("");
        setCount(count + 1);
        toast.warn("Document Reported", { autoClose: 2000 });
      })
      .catch(() => {
        console.log("report sending error");
      });
  };
  // ----------------------------------------------------ADD TO STUDY LIST--------------------------------------------------
  const addtostudylist = () => {
    axiosInstance
      .post(`${ipaddress}/UserStudyListView/${userdata.user_id}/${id}/`)
      .then((r) => {
        // console.log(r.data)
        if (r.data.message === "Document is already in the study list") {
          const toastLiveExample = document.getElementById("liveToast");
          document.getElementById("toastbody").style.color = "red";
          document.getElementById("toastbody").textContent =
            "Document alraedy added to the Studylist";
          const toastBootstrap =
            bootstrap.Toast.getOrCreateInstance(toastLiveExample);
          toastBootstrap.show();
        } else {
          const toastLiveExample = document.getElementById("liveToast");
          toast.success("Document added to studylist", { autoClose: 2000 });
        }
      });
  };
  // -------------------------------------------------TEXT TO SPEECH---------------------------------------------------------
  const textToSpeech = (text) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    window.speechSynthesis.speak(speech);
  };
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
  };
  const extractTextFromPdf = async () => {
    try {
      const response = await axiosInstance.get(
        pdfurldata.documnet_id.document_url,
        { responseType: "arraybuffer" }
      );
      const data = new Uint8Array(response.data);
      const pdf = await pdfjs.getDocument({ data }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item) => item.str).join(" ");
        fullText += text + " ";
      }
      setPdfText(fullText.trim());
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  useEffect(() => {
    if (pdfUrl) {
      extractTextFromPdf();
    }
  }, [pdfUrl]);
  const handleSpeechButtonClick = (e) => {
    e.preventDefault();
    if (speaking) {
      stopSpeech();
    } else {
      extractTextFromPdf(); // Make sure text is extracted before starting speech
      textToSpeech(pdfText);
    }
    setSpeaking(!speaking); // Toggle the speaking state
  };
  // -----------------------------------------------------EDIT POSTS--------------------------------------------------------
  const [editedpost, setEditedpost] = useState("");
  const [discussionId, setdiscussionId] = useState(0);
  const editpostfunctionData = (value) => {
    setEditedpost(value);
  };
  const editPosts = (discid) => {
    setdiscussionId(discid);
    if (searchcomment_status == true) {
      const foundDiscussion = searchedComments.find((x) => discid === x.ddpid);
      if (foundDiscussion) {
        setEditedpost(foundDiscussion.post);
      }
    } else {
      const foundDiscussion = documentDetails.find(
        (x) => discid === x.comment.ddpid
      );
      if (foundDiscussion) {
        setEditedpost(foundDiscussion.comment.post);
      }
    }
  };

  const sendEditedData = () => {
    const formData = new FormData();
    formData.append("post", editedpost);
    axiosInstance
      .put(
        `${ipaddress}/DocumentsComments/${user.user_id}/${id}/${discussionId}/`,
        formData
      )
      .then((r) => {
        if (usercommentsstate == true) {
          fetchuserComments();
        }
        if (pinnedcommentsstate == true) {
          fetchpinnedComments();
        }
        if (searchcomment_status == true) {
          searchcomments(searchcomment);
        }
        if (
          pinnedcommentsstate == false &&
          usercommentsstate == false &&
          searchcomment_status == false
        ) {
          getdiscussion();
        }
        toast.success("Post updated successfully", { autoClose: 2000 });
        setdropdownstate(false);
      })
      .catch(() => {
        console.log("Post Editing Error");
      });
  };
  // -------------------------------------------PINNING COMMENTS------------------------------------------------------------
  const pincomment = (discId) => {
    const formdata = new FormData();
    formdata.append("discid", discId);
    axiosInstance
      .post(
        `${ipaddress}/documentdiscussionpinningview/${user.user_id}/${id}/`,
        formdata
      )
      .then((r) => {
        // console.log("Pinned Successfully",r.data)
        if (r.data.message === "Message already pinned") {
          const toastLiveExample = document.getElementById("liveToast");
          document.getElementById("toastbody").style.color = "red";
          document.getElementById("toastbody").textContent =
            "Comment already followed";
          const toastBootstrap =
            bootstrap.Toast.getOrCreateInstance(toastLiveExample);
          toastBootstrap.show();
          setdropdownstate(false);
        } else {
          if (usercommentsstate == true) {
            fetchuserComments();
          }
          if (searchcomment_status == true) {
            searchcomments(searchcomment);
          }
          if (
            pinnedcommentsstate == false &&
            usercommentsstate == false &&
            searchcomment_status == false
          ) {
            getdiscussion();
          }
          toast.success("Comment followed successfully", { autoClose: 2000 });
          setdropdownstate(false);
        }
      });
  };
  // -------------------------------------------------Document sharing functionality---------------------------------------------
  const [token, settoken] = useState("");
  const sharedocument = () => {
    axiosInstance
      .post(`${ipaddress}/GenerateTokenForDocumentDisplay/${id}/`)
      .then((r) => {
        settoken(r.data);
        setLinkShare(true);
      })
      .catch((err) => {
        console.error("Failed to GenerateTokenForDocumentDisplay", err);
      });
  };
  // -------------------------------------------------Functionality to copy the url link--------------------------------------
  const [copy_status, setcopy_status] = useState(false);
  const copyLinkToClipboard = (token) => {
    const linkText = `${domain}/shareddocument/${token}/`;
    navigator.clipboard
      .writeText(linkText)
      .then(() => {
        setcopy_status(!copy_status); // console.log('Link copied to clipboard:', linkText);
        // setTimeout(() => {changeCopy_status()}, 1000)
      })
      .catch((err) => {
        console.error("Failed to copy link to clipboard", err);
      });
  };
  const handlePDFChecksum = async (url, checksum) => {
    const formint = new FormData();
    formint.append("pdf_keyword", `lernenhub:${checksum}`);
    try {
      const result = await axiosInstance.post(
        `${ipaddress}/GetPDFChecksum/`,
        formint
      );
      const resultData = result?.data;
      if (
        resultData?.status === false &&
        resultData?.message === "Checksum not found"
      ) {
        await createPDFChecksum(url, checksum); // If checksum not found, create new checksum
      } else {
        console.log("Checksum exists.");
      }
    } catch (error) {
      console.error("Error in fetching checksum:", error);
    }
  };
  const createPDFChecksum = async (url, checksum) => {
    const formdata = new FormData();
    formdata.append("pdf_name", url);
    formdata.append("pdf_keyword", `lernenhub:${checksum}`);
    try {
      await axiosInstance.post(`${ipaddress}/CreatePDFChecksum/`, formdata);
      console.log("Checksum created successfully.");
    } catch (error) {
      console.error("Error in creating checksum:", error);
    }
  };
  const downloadPDF = async (url) => {
    try {
      // Step 1: Fetch the PDF file
      const response = await apiClient.get(url, {
        responseType: "arraybuffer", // Fetch binary data
      });
      // Step 2: Calculate the checksum
      const checksum = calculateChecksum(response.data);
      await handlePDFChecksum(url, checksum);
      // Step 3: Load the PDF into pdf-lib
      const pdfDoc = await PDFDocument.load(response.data);
      // Step 4: Add checksum to the metadata (e.g., as keywords)
      const existingKeywords = pdfDoc.getKeywords() || [];
      pdfDoc.setKeywords([...existingKeywords, `lernenhub:${checksum}`]);
      const docName = id || "doc";
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
      pdfDoc.setTitle(`${docName}_${timestamp}`);
      pdfDoc.setSubject("This PDF includes checksum metadata.");
      // Step 5: Serialize the updated PDF
      const updatedPdfBytes = await pdfDoc.save();
      // Step 6: Download the updated PDF
      const blob = new Blob([updatedPdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", `${docName}_${timestamp}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Failed to process the PDF:", error);
    }
  };
  // ----------------------------------------------Functionality to Unsave the document--------------------------------------
  const unsave = () => {
    axiosInstance
      .delete(`${ipaddress}/UserStudyListView/${user.user_id}/${id}/`)
      .then((r) => {
        setCount(count + 1);
      })
      .catch((err) => {
        console.error("Error", err);
      });
  };
  // ----------------------------------------To report the discussion comment----------------------------------------------
  const [report_status, setreport_status] = useState(false);
  const [report_id, setreport_id] = useState();
  // ---------------------------------------------Dummy function------------------------------------------------------
  const increment = () => { };
  // -----------------------------------------Unpin the comments which are pinned----------------------------------------------------
  const unpin = (discid) => {
    const formdata1 = new FormData();
    formdata1.append("discid", discid);
    axiosInstance
      .delete(
        `${ipaddress}/unpindocumentcomments/${user.user_id}/${id}/${discid}/`
      )
      .then((r) => {
        if (usercommentsstate == true) {
          fetchuserComments();
        }
        if (pinnedcommentsstate == true) {
          fetchpinnedComments();
        }
        if (searchcomment_status == true) {
          searchcomments(searchcomment);
        }
        if (
          pinnedcommentsstate == false &&
          usercommentsstate == false &&
          searchcomment_status == false
        ) {
          getdiscussion();
        }
        toast.success("Comment unfollowed successfully", { autoClose: 2000 });
      })
      .catch((err) => {
        console.error("Error", err);
      });
  };
  const [view_mark_id, setview_mark_id] = useState();
  const [view_mark_comment, setview_comment] = useState("");
  const [pinstatus, setpinstatus] = useState(false);
  const [like_status, setlike_status] = useState(false);
  const [dislike_status, setdislike_status] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 360);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePreviewPDF = () => {
    if (isMobile) {
      setpreviewbtnstate((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      if (!mobileView) {
        setpreviewbtnstate(true); // Show both in desktop view
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };
  const handelDeleteConfirm = async (response) => {
    try {
      if (response) {
        const Result = await axiosInstance.get(
          `${ipaddress}/DocumentDelete/${userdata.user_id}/${id}/`
        );
        if (Result.status) {
          setDeleteDocModal(false);
          setEditDocumentMenu(true);
          setEditDocumentMenu(false);
          toast.success(Result.data.message, { autoClose: 2000 });
          setDocVisible(true);
        } else {
          setEditDocumentMenu(false);
          setDeleteDocModal(false);
          toast.error(Result.data.message, { autoClose: 2000 });
        }
      }
      setdeleteMessage("");
    } catch (err) {
      console.log(err.message);
      setDeleteDocModal(false);
      setEditDocumentMenu(true);
      setdeleteMessage("");
    }
  };
  // const [numPages, setNumPages] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [selection, setSelection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPostEditOpen, setIsModalPostEditOpen] = useState(false);
  const [note, setNote] = useState("");
  const rndRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !isModalOpen &&
        rndRef.current &&
        !ReactDOM.findDOMNode(rndRef.current).contains(e.target)
      ) {
        setSelection(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const activateRectangleNew = (e, pageIndex) => {
    console.log(e);
    console.log(documentDetails);

    if (!(e?.target?.id == "askQuestion")) {
      const oldX = selection ? selection.x : null;
      const oldY = selection ? selection.y : null;

      const pageElement = e.currentTarget; // The clicked page container
      const rect = pageElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / pageScale;
      const y = (e.clientY - rect.top) / pageScale;

      console.log("old =>", { oldX, oldY });
      console.log("new =>", { x, y });

      function isFreeSpace(graph, newItem, width, height) {
        return !graph.some((item) => {
          return !(
            (
              newItem.x + width <= item.x || // New item is to the left
              newItem.x >= item.x + item.width || // New item is to the right
              newItem.y + height <= item.y || // New item is above
              newItem.y >= item.y + item.height
            ) // New item is below
          );
        });
      }

      if (!isSelectDrow || (x >= oldX && y >= oldY && oldY && oldX)) {
        console.log("isInside");
        const documentDetailsMarkupLocation = documentDetails
          .filter(
            (item) =>
              item?.comment?.docmid?.markup_location &&
              item?.comment?.docmid?.markup_location?.page == pageIndex
          )
          .map((item) => ({ ...item?.comment?.docmid?.markup_location }));
        if (
          !selection &&
          isFreeSpace(documentDetailsMarkupLocation, { x, y }, 100, 40)
        ) {
          setSelection({
            x,
            y,
            width: 100 / pageScale, // Normalize width
            height: 40 / pageScale, // Normalize height
            page: pageIndex,
          });
        }

        setTimeout(() => {
          const button = document.getElementById("askQuestion");
          if (button) {
            button.addEventListener("touchstart", () => {
              setIsModalOpen(true);
            });
          }
        }, 200);
        setSelectDrow(true);
      } else {
        console.log("isOutside");
        setSelection(null);
        setSelectDrow(false);
      }
    } else {
      console.log("ssadsa");
    }
  };

  const activateRectangle = (e, pageIndex) => {
    const oldX = selection ? selection.x : null;
    const oldY = selection ? selection.y : null;

    const pageElement = e.currentTarget; // The clicked page container
    const rect = pageElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) / pageScale;
    const y = (e.clientY - rect.top) / pageScale;
    console.log("isInside");
    setSelection({
      x,
      y,
      width: 150 / pageScale, // Normalize width
      height: 100 / pageScale, // Normalize height
      page: pageIndex,
    });
  };
  const scrollToQue = (id) => {
    const myHigh = documentDetails.find((x) => id === x.comment.ddpid);
    if (!myHigh) {
      console.error("Note not found for id:", id);
      return;
    }
    const highlight = myHigh;
    const markup_location = highlight.comment.docmid.markup_location;
    const { page, x, y } = markup_location;
    setview_mark_id(markup_location);
    setview_comment("");
    setTimeout(() => {
      const pageContainer = document.querySelector(`.markup-color1`);
      if (pageContainer) {
        pageContainer.scrollIntoView({ behavior: "smooth", block: "center" });
        pageContainer.scrollTo({
          top: y - 50,
          left: x - 50,
          behavior: "smooth",
        });
      } else {
        console.error(`Page container for page ${page} not found.`);
      }
    }, 300);
  };
  const scrollToPOST = (id) => {
    const myHigh = documentDetails.filter(
      (x) => null !== x.comment.docmid && x.comment.docmid.markup_location == id
    );
    setview_comment(myHigh[0]?.comment?.ddpid || "");
    const markup_location = myHigh[0].comment.docmid.markup_location;
    const { page, x, y } = markup_location;
    const commentContainer = document.querySelector(
      `#comment-container-${myHigh[0].comment.ddpid}`
    );
    if (commentContainer) {
      commentContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      commentContainer.scrollTo({
        top: y - 50,
        left: x - 50,
        behavior: "smooth",
      });
    } else {
      console.error(`Page container for page ${page} not found.`);
    }
  };
  const togglePostEditModal = () => {
    setIsModalPostEditOpen(!isModalPostEditOpen);
  };
  const handleDropdownClick = (currentIndex) => {
    setdropdownstate(true); // Explicit camelCase naming
    setindex1((prevIndex) => (prevIndex === currentIndex ? -1 : currentIndex)); // Toggle logic
  };

  const accentColor = "rgb(93, 95, 227)";
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourKey, setTourKey] = useState(0);
  const tourState = useSelector((state) => state.tour);
  useEffect(() => {
    setIsTourOpen(tourState?.isTourOpen);
    setTourKey(tourState?.tourKey);
  }, [tourState]);

  const dispatch = useDispatch();
  const closeTourGuide = () => {
    dispatch(closeTour());
  };

  useEffect(() => {
    closeTourGuide();
  }, []);

  useEffect(() => {
    if (isTourOpen) {
      disableBodyScroll(document.body);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      enableBodyScroll(document.body);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      clearAllBodyScrollLocks();
    }
  }, [isTourOpen]);

  const [selectedReply, setSelectedReply] = useState(null);
  const [selectedReplyOfReply, setSelectedReplyOfReply] = useState(null);
  return (
    <div>
      {loading ? (
        <Preloader />
      ) : (
        <div className="d-flex" style={{ position: "relative" }}>
          <div
            onClick={() => {
              setcourse_visible(false);
              setgroup_visible(false);
              setstudylist_visible(false);
            }}
            className={`container-fluid bg-light ${view_pdf_status ? "d-none" : "d-block"
              }`}
          >
            {isDocVisible && (
              <div
                className="doc-modal-blockshow"
                onClick={(e) => e.stopPropagation()} // Block clicks
                onWheel={(e) => e.preventDefault()} // Block scroll
              />
            )}
            {isDocVisible && (
              <div className="doc-modal-delete-mes">
                <div className="card border-1 border-danger rounded-2 p-4 d-flex flex-column align-items-center">
                  {isDocOwner ? (
                    <p className="mb-3 text-danger fw-bold">
                      {translate_value.show_pdf.owner_user_message}
                    </p>
                  ) : (
                    <p className="mb-3 text-danger fw-bold">
                      {translate_value.show_pdf.normal_user_message}
                    </p>
                  )}
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-primary px-4 py-2 go_back_btn"
                  >
                    {translate_value.common_words.GoBack}
                  </button>
                </div>
              </div>
            )}
            <Navpath type={"group"} navPaths={nav_paths} />
            <div
              onClick={() => {
                setnavbar_dropdown_visible(false);
              }}
              className="row mt-0 m-0 w-100 align-items-center"
            >
              <div
                className="w-100 px-4 py-3 showpdf-div pb-4"
                onClick={() => {
                  setindex1(-1);
                }}
              >
                <div className="d-lg-flex justify-content-between align-items-center">
                  <div>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 250 }}
                      overlay={renderTooltip(
                        !loading && !error && pdfurldata?.documnet_id?.title
                          ? pdfurldata.documnet_id.title
                          : "No title available"
                      )}
                    >
                      <p
                        className="fw-medium d-block text-white mt-3 mt-md-0 pe-auto mb-3"
                        style={{
                          cursor: "pointer",
                          fontSize: "18px",
                          fontWeight: 500,
                          lineHeight: "normal",
                          letterSpacing: "0.4px",
                        }}
                      >
                        {!loading &&
                          !error &&
                          pdfurldata?.documnet_id?.title ? (
                          <>
                            {pdfurldata?.documnet_id?.title?.length > 140
                              ? `${pdfurldata.documnet_id.title.slice(0, 140)}...`
                              : pdfurldata?.documnet_id?.title || 'No Title Available'}
                          </>
                        ) : (
                          "Loading..."
                        )}
                        {/* No Title Available */}
                      </p>
                    </OverlayTrigger>
                    {/* -----------------------------------------------Document Details------------------------------------------------------ */}
                    <div
                      className="mb-3 d-flex align-items-center gap-lg-3"
                      style={{ fontSize: "13px", color: "#f5f5f5cf" }}
                    >
                      <span className="d-flex align-items-center">
                        <img src={seeComments} alt="see-Comments" />
                        <span className="ms-2">
                          {documentDetails?.length || 0}{" "}
                          <span className="d-none d-md-inline">
                            Discussions
                          </span>
                        </span>
                      </span>
                      <span className="ms-3 d-flex align-items-center">
                        <img src={seePages} alt="pages" />
                        <span className="ms-2">
                          {!loading &&
                            !error &&
                            pdfurldata &&
                            (pdfurldata?.documnet_id?.pages || "")}
                          <span className="d-none d-md-inline"> Pages</span>
                        </span>
                      </span>
                      <span className="ms-3 d-flex align-items-center">
                        <img src={doclike} alt="doc-like" />
                        <span className="ms-2">
                          {!loading &&
                            !error &&
                            pdfurldata &&
                            pdfurldata.followers_count}
                          <span className="d-none d-md-inline"> Likes</span>
                        </span>
                      </span>
                      <span className="ms-3 d-flex align-items-center">
                        <img src={docCreated_on} alt="doc-created_on" />
                        <span className="ms-2">
                          {!loading &&
                            !error &&
                            pdfurldata &&
                            (moment(
                              pdfurldata?.documnet_id?.create_date
                            ).format("YYYY-MM-DD") ||
                              "")}
                        </span>
                      </span>
                    </div>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 250 }}
                      overlay={renderTooltip(
                        !loading &&
                          !error &&
                          pdfurldata?.documnet_id?.doc_description
                          ? pdfurldata.documnet_id.doc_description
                          : "No Description available"
                      )}
                    >
                      <p
                        className="mb-3 mt-2"
                        style={{
                          cursor: "pointer",
                          color: "#f5f5f5cf",
                          fontSize: "12px",
                        }}
                      >
                        {!loading &&
                          !error &&
                          pdfurldata?.documnet_id?.doc_description ? (
                          <>
                            <span className="me-2">
                              <img src={docDesc} alt="doc-desc" />
                            </span>
                            {/* No Description Available */}
                            {/* {pdfurldata.documnet_id.doc_description.length > 280 ? `${pdfurldata.documnet_id.doc_description.slice(0, 280)}...` : pdfurldata.documnet_id.doc_description} */}
                            <>
                              {pdfurldata?.documnet_id?.doc_description?.length > 140
                                ? `${pdfurldata.documnet_id.doc_description.slice(0, 140)}...`
                                : pdfurldata?.documnet_id?.doc_description || 'No Description Available'}
                            </>
                          </>
                        ) : (
                          ""
                        )}
                      </p>
                    </OverlayTrigger>
                    <div className="mt-2 mb-2 mb-lg-0 align-items-center gap-3">
                      {pdfurldata &&
                        Object.keys(pdfurldata).length > 0 &&
                        pdfurldata?.user_id && (
                          <Link
                            to={`/profile/${pdfurldata?.user_id?.user_id || ""
                              }`}
                          >
                            <span
                              className="d-flex align-items-center"
                              style={{ fontSize: "12px", color: "#f5f5f5cf" }}
                            >
                              {pdfurldata?.user_id?.profile_pic ? (
                                <img
                                  src={pdfurldata.user_id.profile_pic}
                                  className="me-2 my-auto rounded-circle"
                                  width={20}
                                  height={20}
                                  alt="Profile"
                                />
                              ) : (
                                pdfurldata?.user_id?.nickname && (
                                  <p
                                    className="me-2 my-auto d-flex align-items-center justify-content-center bg-primary rounded-circle"
                                    style={{
                                      height: "25px",
                                      width: "25px",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {pdfurldata.user_id.nickname.charAt(0)}
                                    {pdfurldata.user_id.nickname.charAt(
                                      pdfurldata.user_id.nickname.length - 1
                                    )}
                                  </p>
                                )
                              )}
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 450,
                                  lineHeight: "normal",
                                  letterSpacing: "0.28px",
                                  color: "#f5f5f5cf",
                                  textDecoration: "none",
                                }}
                              >
                                {pdfurldata?.user_id?.nickname || "Unknown"}
                              </span>
                            </span>
                          </Link>
                        )}
                    </div>
                  </div>
                  <div
                    id="Showpdf__DocumentEngagement"
                    className="d-flex align-items-center gap-3 align-self-lg-start"
                  >
                    {/* -----------------------------------------Rating button for document---------------------------------------------- */}
                    <button
                      className="btn btn-sm d-flex align-items-center gap-1 p-0"
                      style={{
                        color: pdfurldata.rating_status ? "#ffd700" : "#fff",
                      }}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="Rating"
                    >
                      <i
                        data-bs-toggle="modal"
                        data-bs-target="#ratingmodal"
                        className={
                          pdfurldata.rating_status
                            ? "fa-solid fa-star fs-5"
                            : "fa-regular fa-star fs-5"
                        }
                      ></i>
                      <span style={{ fontSize: "14px" }}>{pdfdata.rating}</span>
                    </button>
                    {/* ---------------------------------------View Extracted text button-------------------------------------------------- */}
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="View Count"
                      className="text-white d-flex align-items-center border-0"
                    >
                      <img src={showpdfeye} alt="showpdf-eye" />
                      <span className="ms-1">
                        {" "}
                        {!loading &&
                          !error &&
                          pdfurldata &&
                          pdfurldata.document_view_count}
                      </span>
                    </span>
                    {/* ---------------------------------------------Share Document---------------------------------------------------------- */}
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="left"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="Share the Document"
                    >
                      <button
                        className="btn p-0 border-0"
                        onClick={() => {
                          sharedocument();
                        }}
                      >
                        <img src={shareLink} alt="share-link" />
                      </button>
                    </span>
                    {/* ------------------------------------------------Report the Document--------------------------------------------------- */}
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="left"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="Report the Document"
                    >
                      <span
                        className={`${pdfurldata.reported_status ? "d-none" : ""
                          }`}
                        data-bs-toggle="modal"
                        data-bs-target="#reportmodal"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          color: "#fff",
                        }}
                      >
                        <img src={docReport} alt="doc-Report" />
                      </span>
                    </span>

                    <span
                      onClick={() => {
                        toast.warn("You have already reported", {
                          autoClose: 2000,
                        });
                      }}
                      className={`${pdfurldata.reported_status ? "" : "d-none"
                        }`}
                      style={{
                        cursor: "pointer",
                        position: "relative",
                        color: "#fff",
                      }}
                    >
                      <img src={docReport} alt="doc-Report-1" />
                    </span>

                    <Link
                      to={`/extracted_text/${id}`}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="View Extracted Text"
                      className="text-white d-flex align-items-center border-0"
                    >
                      <img src={textExtract} alt="text-Extract" />
                    </Link>
                    {(isDocOwner || isDocVisible) && (
                      <div className="position-relative" ref={menuRef}>
                        <span
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-custom-class="custom-tooltip"
                          data-bs-title="Document Action"
                          style={{ cursor: "pointer" }}
                          className="text-white d-flex align-items-center border-0"
                        >
                          <svg onClick={() => setEditDocumentMenu(!editDocumentMenu)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            viewBox="0 0 35 35"
                            fill="none"
                          >
                            <path
                              d="M17.5 27.0354C17.099 27.0354 16.7557 26.8926 16.4701 26.607C16.1845 26.3214 16.0417 25.9781 16.0417 25.5771C16.0417 25.176 16.1845 24.8327 16.4701 24.5471C16.7557 24.2615 17.099 24.1187 17.5 24.1187C17.9011 24.1187 18.2444 24.2615 18.53 24.5471C18.8156 24.8327 18.9584 25.176 18.9584 25.5771C18.9584 25.9781 18.8156 26.3214 18.53 26.607C18.2444 26.8926 17.9011 27.0354 17.5 27.0354ZM17.5 18.9585C17.099 18.9585 16.7557 18.8157 16.4701 18.5301C16.1845 18.2445 16.0417 17.9012 16.0417 17.5001C16.0417 17.0991 16.1845 16.7558 16.4701 16.4702C16.7557 16.1846 17.099 16.0418 17.5 16.0418C17.9011 16.0418 18.2444 16.1846 18.53 16.4702C18.8156 16.7558 18.9584 17.0991 18.9584 17.5001C18.9584 17.9012 18.8156 18.2445 18.53 18.5301C18.2444 18.8157 17.9011 18.9585 17.5 18.9585ZM17.5 10.8815C17.099 10.8815 16.7557 10.7388 16.4701 10.4532C16.1845 10.1676 16.0417 9.82424 16.0417 9.42318C16.0417 9.02214 16.1845 8.67882 16.4701 8.39323C16.7557 8.10764 17.099 7.96484 17.5 7.96484C17.9011 7.96484 18.2444 8.10764 18.53 8.39323C18.8156 8.67882 18.9584 9.02214 18.9584 9.42318C18.9584 9.82424 18.8156 10.1676 18.53 10.4532C18.2444 10.7388 17.9011 10.8815 17.5 10.8815Z"
                              fill="#FFF"
                            />
                          </svg>
                        </span>
                        {editDocumentMenu && (
                          <ul
                            className={`bg-white shadow-sm border rounded mt-0 p-0 px-3`}
                            style={{
                              position: "absolute",
                              right: "45px",
                              top: "12px"
                            }}
                          >
                            <div className="px-3 py-2 d-flex flex-column gap-2">
                              <p className="m-0" style={{ cursor: "pointer" }}>Edit</p>
                              <p className="m-0" style={{ cursor: "pointer" }}
                                onClick={() => setDeleteDocModal(true)}>
                                Delete
                              </p>
                            </div>
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* -------------------------------------RATING MODAL----------------------------------------------------------------- */}
              <div
                className="modal fade"
                id="ratingmodal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabindex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="d-flex justify-content-between">
                        <h6 className="text-primary">
                          Give Your Rating For the Document
                        </h6>
                        <button
                          data-bs-dismiss="modal"
                          className="bg-transparent border-0 ms-auto"
                        >
                          <i className="fa-solid fa-circle-xmark fs-5"></i>
                        </button>
                      </div>
                      <div className="star-rating d-flex align-items-center justify-content-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={
                              star <= rating.rating ? "star checked" : "star"
                            }
                            onClick={() => handleStarClick(star)}
                          >
                            &#9733;
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* -------------------------Translate pdf section, Pinning comments, Search comments, User comments buttons and dislike button for document------------- */}
              <div
                className="col-12 mt-4"
                onClick={() => {
                  setindex1(-1);
                }}
              >
                <div className="row">
                  <div
                    id="Showpdf__DocumentEngagementBottom"
                    className="col-lg-8 ms-auto mt-4 mt-lg-0 mt-lg-0 d-flex justify-content-center"
                  >
                    {/* ----------------------------------------To save the document to studylist------------------------------------------ */}
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="Add to Study List"
                    >
                      {/* -------------------------------------------------To save----------------------------------------------------------- */}
                      <button
                        className={`btn btn-sm ${pdfurldata.studylist_status
                          ? "d-none"
                          : "d-flex align-items-center py-2 justify-content-center"
                          }`}
                        style={{
                          border: "1px solid #5D5FE3",
                          height: "40px",
                          backgroundColor: "#fff",
                          color: "#5D5FE3",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#studylist_modal"
                      >
                        <img
                          src={studylistStatusBlue}
                          alt="studylistStatus-blue"
                        />
                        <span
                          className="d-none d-md-inline"
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            letterSpacing: "0.28px",
                            lineHeight: "normal",
                          }}
                        >
                          {pdfurldata.studylist_status ? "Saved" : "Save"}
                        </span>
                      </button>
                      {/* -------------------------------------------------------To unsave-------------------------------------------------- */}
                      <button
                        onClick={() => {
                          unsave();
                        }}
                        className={`btn btn-sm ${pdfurldata.studylist_status
                          ? "d-flex align-items-center py-2 justify-content-center"
                          : "d-none"
                          }`}
                        style={{
                          border: "1px solid #5D5FE3",
                          height: "40px",
                          backgroundColor: "#5D5FE3",
                          color: "#fff",
                        }}
                      >
                        <img src={studylistStatus} alt="studylistStatus" />
                        <span
                          className="d-none d-md-inline"
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            letterSpacing: "0.28px",
                            lineHeight: "normal",
                          }}
                        >
                          {pdfurldata.studylist_status ? "Saved" : "Save"}
                        </span>
                      </button>
                    </span>
                    {/* -----------------------------------------------------To like the document------------------------------------------ */}
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="Like the document"
                    >
                      <button
                        className="btn btn-sm px-3 py-2 d-flex align-items-center ms-2"
                        onClick={() => {
                          if (pdfurldata.favourite_status == true) {
                            unfollowDocument();
                          } else {
                            followDocument();
                          }
                        }}
                        style={{
                          border: "1px solid #445259",
                          color: pdfurldata.favourite_status
                            ? "#ff845d"
                            : "#445259",
                          height: "40px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                        >
                          <path
                            d="M18.1889 19.9922H7.73218V8.53383L14.2626 2.08352L14.7234 2.54424C14.8182 2.63907 14.898 2.7606 14.9628 2.90883C15.0275 3.05707 15.0599 3.1933 15.0599 3.3175V3.48174L13.9942 8.53383H21.2338C21.6692 8.53383 22.0584 8.70544 22.4017 9.04867C22.7449 9.39188 22.9165 9.78117 22.9165 10.2165V11.4986C22.9165 11.5934 22.9058 11.6969 22.8844 11.8091C22.8631 11.9213 22.835 12.0248 22.8003 12.1196L19.9557 18.8624C19.8128 19.1829 19.5725 19.4513 19.2346 19.6677C18.8967 19.884 18.5482 19.9922 18.1889 19.9922ZM8.77385 18.9505H18.1889C18.3358 18.9505 18.4861 18.9105 18.6396 18.8303C18.7932 18.7502 18.9101 18.6166 18.9902 18.4297L21.8748 11.6589V10.2165C21.8748 10.0296 21.8147 9.876 21.6945 9.75581C21.5743 9.63562 21.4208 9.57552 21.2338 9.57552H12.7001L13.9061 3.88641L8.77385 8.97854V18.9505ZM7.73218 8.53383V9.57552H4.16648V18.9505H7.73218V19.9922H3.12481V8.53383H7.73218Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="ms-1" style={{ fontSize: "17px" }}>
                          {!loading &&
                            !error &&
                            pdfurldata &&
                            pdfurldata.followers_count}
                        </span>
                      </button>
                    </span>
                    {/* ---------------------------------------------------To dislike the document----------------------------------------- */}
                    {!loading && !error && pdfurldata && (
                      <span
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title="Dislike the document"
                      >
                        <button
                          onClick={dislikeDocument}
                          className="btn btn-sm px-3 py-2 ms-2 d-flex align-items-center"
                          style={{
                            height: "40px",
                            border: "1px solid #445259",
                            color: pdfurldata.dis_like_status
                              ? "red"
                              : "#445259",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M6.81107 5.00781H17.2678V16.4662L10.7374 22.9165L10.2766 22.4558C10.1818 22.3609 10.102 22.2394 10.0372 22.0912C9.97247 21.9429 9.94008 21.8067 9.94008 21.6825V21.5183L11.0058 16.4662H3.7662C3.33084 16.4662 2.94155 16.2946 2.59834 15.9513C2.25511 15.6081 2.0835 15.2188 2.0835 14.7835V13.5014C2.0835 13.4066 2.09419 13.3031 2.11558 13.1909C2.13693 13.0787 2.16497 12.9752 2.19969 12.8804L5.04425 6.13763C5.18715 5.81711 5.42753 5.54868 5.7654 5.33234C6.10328 5.11599 6.45184 5.00781 6.81107 5.00781ZM16.2262 6.04948H6.81107C6.66418 6.04948 6.51395 6.08955 6.36037 6.16969C6.20679 6.24981 6.08994 6.38335 6.0098 6.57031L3.12519 13.3411V14.7835C3.12519 14.9704 3.18528 15.124 3.30548 15.2442C3.42567 15.3644 3.57924 15.4245 3.7662 15.4245H12.2999L11.0939 21.1136L16.2262 16.0215V6.04948ZM17.2678 16.4662V15.4245H20.8335V6.04948H17.2678V5.00781H21.8752V16.4662H17.2678Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </span>
                    )}
                    {/* ---------------------------------------------To view the Pinned comments--------------------------------------------- */}
                    <span
                      className="d-none d-md-inline"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="Followed comments"
                    >
                      <button
                        onClick={() => {
                          fetchpinnedComments();
                          setusercommentsstate(false);
                          setpinnedcommentsstate(!pinnedcommentsstate);
                        }}
                        className="btn btn-sm ms-2 px-3 py-2"
                        style={{
                          border: pinnedcommentsstate
                            ? "1px solid #5d5fe3"
                            : "1px solid #445259",
                          color: pinnedcommentsstate ? "#ffff" : "#445259",
                          height: "40px",
                          backgroundColor: pinnedcommentsstate
                            ? "#5D5FE3"
                            : "#ffff",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pin"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                        </svg>
                      </button>
                    </span>
                    {/* ----------------------------------------------To view particular user comments---------------------------------------- */}
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="See your comments"
                    >
                      <button
                        onClick={() => {
                          setpinnedcommentsstate(false);
                          setusercommentsstate(!usercommentsstate);
                          fetchuserComments();
                        }}
                        className="btn btn-sm ms-2 px-3 py-2"
                        style={{
                          border: usercommentsstate
                            ? "1px solid #5d5fe3"
                            : "1px solid #445259",
                          color: usercommentsstate ? "#ffff" : "#445259",
                          height: "40px",
                          backgroundColor: usercommentsstate
                            ? "#5D5FE3"
                            : "#ffff",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                        >
                          <path
                            d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </span>
                    {/* ----------------------------------------------To toggle pdf preview button---------------------------------------- */}
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title={previewbtnstate ? "View PDF" : "View Post"}
                    >
                      <button
                        onClick={handlePreviewPDF}
                        className="btn btn-sm ms-2 d-block d-md-none d-lg-none px-3 py-2"
                        style={{
                          border: previewbtnstate
                            ? "1px solid #5d5fe3"
                            : "1px solid #445259",
                          color: previewbtnstate ? "#ffff" : "#445259",
                          height: "40px",
                          backgroundColor: previewbtnstate
                            ? "#5D5FE3"
                            : "#ffff",
                        }}
                      >
                        {previewbtnstate ? "PDF" : "POST"}
                      </button>
                    </span>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#markquestionModal"
                      className="btn btn-sm ms-2 d-md-flex d-none align-items-center"
                      style={{
                        border: "1px solid #445259",
                        color: "#445259",
                        height: "40px",
                      }}
                    >
                      <img src={mark_Ques} alt="Mark Question" />
                      <span className="ms-2">Mark Question</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* ---------------------------------------------Discussion and Document Section------------------------------------- */}
              <div className="col-12 mt-4 pdf-show">
                <div className="row bg-light">
                  <div
                    className={`mt-3 mt-lg-0 ${discussionpagelayout ? "col-lg-12 pb-4" : "col-lg-4"
                      } ${documentpagelayout ? "d-none" : ""}`}
                    id="disc-div"
                  >
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          width: discussionpagelayout ? "90%" : "100%",
                        }}
                        id="btn"
                        className="mx-auto"
                      >
                        <div
                          className="bg-white rounded shadow-sm py-3 px-3 d-flex position-relative"
                          onClick={() => {
                            setindex1(-1);
                          }}
                        >
                          {!isSticky && (
                            <span
                              id="Toggal__PDF__Post"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              data-bs-custom-class="custom-tooltip"
                              data-bs-title="Expand the Comment Section"
                              className=" d-none d-lg-flex d-md-flex justify-content-center align-items-center "
                              onClick={() => {
                                setdiscussionpagelayout(!discussionpagelayout);
                              }}
                              style={{
                                height: "30px",
                                width: "30px",
                                position: "absolute",
                                right: `${!discussionpagelayout ? "-22px" : "-28px"
                                  }`,
                                top: "10px",
                                cursor: "pointer",
                              }}
                            >
                              <i
                                className={`${discussionpagelayout
                                  ? "d-none fas fa-caret-right"
                                  : "fas fa-caret-right"
                                  }`}
                                style={{ color: "#5d5fe3", fontSize: "31px" }}
                              ></i>
                              <i
                                className={`${discussionpagelayout
                                  ? "fas fa-caret-left"
                                  : "d-none fas fa-caret-left"
                                  }`}
                                style={{ color: "#5d5fe3", fontSize: "31px" }}
                              ></i>
                            </span>
                          )}

                          <div
                            className="input-group bg-light rounded border"
                            style={{ cursor: "pointer" }}
                          >
                            <span
                              className="input-group-text bg-transparent border-0"
                              id="basic-addon1"
                            >
                              <img src={searchFilter} alt="Filter Search" />
                            </span>
                            <input
                              onChange={(e) => {
                                setSearchcomment(e.target.value);
                                searchcomments(e.target.value);
                              }}
                              type="text"
                              className="form-control bg-transparent border-0 ps-0 sub-search"
                              placeholder={
                                translate_value.common_words.search_discussion
                              }
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              style={{ fontSize: "14px" }}
                            />
                          </div>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 250 }}
                            overlay={renderTooltip("Post your comment")}
                          >
                            <span>
                              <button
                                id="Leave__Comments"
                                onClick={() => setIsModalOpen(true)}
                                className="postcomment btn btn-primary d-flex ms-1 align-items-center justify-content-center rounded-circle"
                              >
                                <i className="fa fa-plus"></i>
                              </button>
                            </span>
                          </OverlayTrigger>
                        </div>
                        {
                          <div
                            className="mt-3 rounded"
                            style={{
                              paddingBottom:
                                documentDetails.length > 0 ? "80px" : "10px",
                              height:
                                documentDetails.length > 0 ? "80vh" : "100px",
                              overflowY:
                                documentDetails.length > 0 ? "scroll" : "none",
                              display:
                                isMobile && previewbtnstate ? "none" : "block",
                            }}
                          >
                            <div>
                              {/* ---------------------------------------------Searched Comments------------------------------------------------------- */}
                              <div
                                className={`${searchcomment_status ? "" : "d-none"
                                  }`}
                              >
                                <h6
                                  className={`${searchedComments.length > 0
                                    ? "d-none"
                                    : "py-2 text-center"
                                    }`}
                                  style={{ fontSize: "15px", color: "#5d5fe3" }}
                                >
                                  Matching comments not available ...💬
                                </h6>
                                <h6
                                  className={`${searchedComments.length > 0
                                    ? "py-2"
                                    : "d-none"
                                    }`}
                                  style={{ fontSize: "15px", color: "#5d5fe3" }}
                                >
                                  💬 Searched Comments
                                </h6>
                                {searchedComments.map((x, index) => {
                                  return (
                                    <div className="mb-3" key={index}>
                                      <div className="bg-white rounded border">
                                        <div className="d-flex ps-2 py-2 border-bottom justify-content-between align-items-center">
                                          <div className="d-flex gap-2 align-items-center">
                                            <div
                                              onClick={() => {
                                                setindex1(-1);
                                              }}
                                            >
                                              <img
                                                src={x.user_id.profile_pic}
                                                className={
                                                  x.user_id.profile_pic == null
                                                    ? "d-none"
                                                    : "rounded-circle"
                                                }
                                                width={30}
                                                height={30}
                                                alt="shw-pdf"
                                              />
                                              {x.user_id.nickname !=
                                                undefined ? (
                                                <p
                                                  className={
                                                    x.user_id.profile_pic ==
                                                      null
                                                      ? "bg-info text-white rounded-circle my-auto d-flex align-items-center justify-content-center"
                                                      : "d-none"
                                                  }
                                                  style={{
                                                    fontSize: "18px",
                                                    height: "30px",
                                                    width: "30px",
                                                  }}
                                                >
                                                  <span>
                                                    {x?.user_id?.nickname ? x.user_id.nickname.slice(0, 1) : "user"}
                                                  </span>
                                                  <span>
                                                    {x?.user_id?.nickname ? x.user_id.nickname.slice(0, 1) : "user"}
                                                  </span>
                                                </p>
                                              ) : (
                                                <></>
                                              )}
                                            </div>
                                            <div
                                              onClick={() => {
                                                setindex1(-1);
                                              }}
                                            >
                                              <Link
                                                to={`/profile/${x.user_id.user_id}`}
                                                className="ms-3 ms-sm-0 my-0 fw-medium text-dark text-decoration-none"
                                                style={{
                                                  fontSize: "15px",
                                                  fontWeight: "700",
                                                }}
                                              >
                                                {x.user_id.nickname}
                                              </Link>
                                              <p
                                                className="ms-3 ms-sm-0 my-0 d-flex align-items-center"
                                                style={{ fontSize: "12px" }}
                                              >
                                                {x.created_on}{" "}
                                                <span
                                                  className={`ms-2 edit ${x.edited ? "" : "d-none"
                                                    }`}
                                                >
                                                  Edited
                                                </span>
                                              </p>
                                            </div>
                                          </div>

                                          <div
                                            className={`d-flex ${discussionpagelayout &&
                                              x.pinned_status
                                              ? "justify-content-between"
                                              : "justify-content-end"
                                              }`}
                                          >
                                            <button
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="top"
                                              data-bs-custom-class="custom-tooltip"
                                              data-bs-title="Unfollow"
                                              onClick={() => {
                                                unpin(x.ddpid);
                                              }}
                                              className={`p-1 btn btn-sm border px-2 ${x.pinned_status &&
                                                discussionpagelayout
                                                ? ""
                                                : "d-none"
                                                }`}
                                              style={{ cursor: "pointer" }}
                                            >
                                              <i className="fa-solid fa-link-slash d-md-none d-inline"></i>
                                              <span className="d-none d-md-inline">
                                                Followed
                                              </span>
                                            </button>
                                            <button
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="top"
                                              data-bs-custom-class="custom-tooltip"
                                              data-bs-title="Unfollow"
                                              onClick={() => {
                                                unpin(x.ddpid);
                                              }}
                                              className={`p-1 btn btn-sm p-0 border-0 ${x.pinned_status &&
                                                discussionpagelayout == false
                                                ? ""
                                                : "d-none"
                                                }`}
                                              style={{ cursor: "pointer" }}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-pin"
                                                viewBox="0 0 16 16"
                                              >
                                                <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                                              </svg>
                                            </button>

                                            <div className="btn-group dropstart">
                                              <span
                                                className="border-0"
                                                type="button"
                                                style={{ position: "relative" }}
                                                onClick={() => {
                                                  setdropdownstate(true);
                                                  if (index1 == index)
                                                    setindex1(-1);
                                                  else setindex1(index);
                                                }}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="26"
                                                  height="26"
                                                  viewBox="0 0 35 35"
                                                  fill="none"
                                                >
                                                  <path
                                                    d="M17.4998 27.0354C17.0988 27.0354 16.7555 26.8926 16.4699 26.607C16.1843 26.3214 16.0415 25.9781 16.0415 25.5771C16.0415 25.176 16.1843 24.8327 16.4699 24.5471C16.7555 24.2615 17.0988 24.1187 17.4998 24.1187C17.9009 24.1187 18.2442 24.2615 18.5298 24.5471C18.8154 24.8327 18.9582 25.176 18.9582 25.5771C18.9582 25.9781 18.8154 26.3214 18.5298 26.607C18.2442 26.8926 17.9009 27.0354 17.4998 27.0354ZM17.4998 18.9585C17.0988 18.9585 16.7555 18.8157 16.4699 18.5301C16.1843 18.2445 16.0415 17.9012 16.0415 17.5001C16.0415 17.0991 16.1843 16.7558 16.4699 16.4702C16.7555 16.1846 17.0988 16.0418 17.4998 16.0418C17.9009 16.0418 18.2442 16.1846 18.5298 16.4702C18.8154 16.7558 18.9582 17.0991 18.9582 17.5001C18.9582 17.9012 18.8154 18.2445 18.5298 18.5301C18.2442 18.8157 17.9009 18.9585 17.4998 18.9585ZM17.4998 10.8815C17.0988 10.8815 16.7555 10.7388 16.4699 10.4532C16.1843 10.1676 16.0415 9.82424 16.0415 9.42318C16.0415 9.02214 16.1843 8.67882 16.4699 8.39323C16.7555 8.10764 17.0988 7.96484 17.4998 7.96484C17.9009 7.96484 18.2442 8.10764 18.5298 8.39323C18.8154 8.67882 18.9582 9.02214 18.9582 9.42318C18.9582 9.82424 18.8154 10.1676 18.5298 10.4532C18.2442 10.7388 17.9009 10.8815 17.4998 10.8815Z"
                                                    fill="#2A3941"
                                                  />
                                                </svg>
                                              </span>
                                              <ul
                                                className={`bg-white border shadow-sm mt-0 p-0 ps-3 rounded ${index1 === index &&
                                                  dropdownstate
                                                  ? ""
                                                  : "d-none"
                                                  }`}
                                                style={{
                                                  top: "0px",
                                                  width: "105px",
                                                  position: "absolute",
                                                  right: "25px",
                                                }}
                                              >
                                                <Button
                                                  className={
                                                    x.user_id.user_id !==
                                                      user.user_id ||
                                                      x.created_on.includes(
                                                        "day"
                                                      ) ||
                                                      x.created_on.includes(
                                                        "week"
                                                      ) ||
                                                      x.created_on.includes(
                                                        "year"
                                                      )
                                                      ? "d-none"
                                                      : "d-flex align-items-center bg-transparent border-0 my-2"
                                                  }
                                                  color="link"
                                                  onClick={() => {
                                                    editPosts(x.ddpid);
                                                    togglePostEditModal();
                                                  }}
                                                  style={{ height: "20px" }}
                                                >
                                                  <span className="dropdownmenu">
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="22"
                                                      height="22"
                                                      viewBox="0 0 30 30"
                                                      fill="none"
                                                    >
                                                      <path
                                                        d="M6.25 23.75H7.62259L20.9952 10.3774L19.6226 9.00481L6.25 22.3774V23.75ZM5 25V21.851L21.476 5.35816C21.604 5.24397 21.7454 5.15573 21.9001 5.09344C22.0549 5.03115 22.2162 5 22.3841 5C22.552 5 22.7146 5.02644 22.8721 5.07931C23.0295 5.13221 23.1747 5.22756 23.3077 5.36538L24.6418 6.70672C24.7797 6.83974 24.8738 6.98566 24.9243 7.14447C24.9748 7.30328 25 7.46209 25 7.62091C25 7.7903 24.9714 7.95236 24.9143 8.10709C24.8573 8.26182 24.7664 8.40321 24.6418 8.53125L8.14903 25H5ZM20.2968 9.70316L19.6226 9.00481L20.9952 10.3774L20.2968 9.70316Z"
                                                        fill="black"
                                                      />
                                                    </svg>
                                                  </span>
                                                  <span
                                                    className="ms-2"
                                                    style={{ fontSize: "14px" }}
                                                  >
                                                    Edit
                                                  </span>
                                                </Button>

                                                <button
                                                  className={`bg-transparent border-0 d-flex align-items-center my-2 ${x.pinned_status
                                                    ? "d-none"
                                                    : ""
                                                    }`}
                                                  onClick={() => {
                                                    pincomment(x.ddpid);
                                                  }}
                                                  style={{ height: "20px" }}
                                                >
                                                  <span className="dropdownmenu">
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="16"
                                                      height="16"
                                                      fill="currentColor"
                                                      className="bi bi-pin"
                                                      viewBox="0 0 16 16"
                                                    >
                                                      <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                                                    </svg>
                                                  </span>{" "}
                                                  <span className="ms-2">
                                                    Follow
                                                  </span>
                                                </button>

                                                {/* ----------------------------------------------------Report button--------------------------------------------------- */}
                                                {user.user_id !==
                                                  x.user_id.user_id && (
                                                    <>
                                                      <button
                                                        className={`bg-transparent border-0 my-2 ${x.report_status
                                                          ? "d-none"
                                                          : "d-flex align-items-center"
                                                          }`}
                                                        onClick={() => {
                                                          setreport_id(x.ddpid);
                                                          setreport_status(true);
                                                        }}
                                                        style={{ height: "20px" }}
                                                      >
                                                        <span className="dropdownmenu">
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="19"
                                                            height="20"
                                                            viewBox="0 0 35 35"
                                                            fill="none"
                                                          >
                                                            <path
                                                              d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z"
                                                              fill="#2A3941"
                                                            />
                                                          </svg>
                                                        </span>{" "}
                                                        <span className="ms-2">
                                                          Report
                                                        </span>
                                                      </button>

                                                      <button
                                                        className={`bg-transparent border-0 my-2 ${x.report_status
                                                          ? "d-flex align-items-center"
                                                          : "d-none"
                                                          }`}
                                                        style={{
                                                          height: "20px",
                                                          color: "#FF845D",
                                                        }}
                                                      >
                                                        <span className="dropdownmenu">
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="19"
                                                            height="20"
                                                            viewBox="0 0 35 35"
                                                            fill="none"
                                                          >
                                                            <path
                                                              d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z"
                                                              fill="#FF845D"
                                                            />
                                                          </svg>
                                                        </span>{" "}
                                                        <span className="ms-2">
                                                          Reported
                                                        </span>
                                                      </button>
                                                    </>
                                                  )}
                                                <button
                                                  className={`bg-transparent border-0 my-2 ${user.user_id ===
                                                    x.user_id.user_id
                                                    ? "d-flex align-items-center"
                                                    : "d-none"
                                                    }`}
                                                  onClick={() => {
                                                    deletePost(x.ddpid);
                                                  }}
                                                  style={{ height: "20px" }}
                                                >
                                                  <span className="dropdownmenu">
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="22"
                                                      height="22"
                                                      viewBox="0 0 30 30"
                                                      fill="none"
                                                    >
                                                      <path
                                                        d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z"
                                                        fill="black"
                                                      />
                                                    </svg>
                                                  </span>
                                                  <span
                                                    className="ms-2"
                                                    style={{ fontSize: "14px" }}
                                                  >
                                                    Delete
                                                  </span>
                                                </button>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          className="py-2 px-2"
                                          onClick={() => {
                                            setindex1(-1);
                                          }}
                                        >
                                          <p className="m-0">{x.post}</p>
                                          {x.images_attached.map((z) => {
                                            return (
                                              <div>
                                                <img
                                                  src={z.image}
                                                  width={300}
                                                  className="mt-2 img-fluid"
                                                  alt="shw-pdf"
                                                />
                                              </div>
                                            );
                                          })}
                                        </div>
                                        {/* -------------------------------Likes, dislikes and View all comments layout---------------------------------------- */}
                                        <div
                                          className="border-bottom px-2 pb-2"
                                          onClick={() => {
                                            setindex1(-1);
                                          }}
                                        >
                                          <div className="d-flex justify-content-between">
                                            <div className="d-flex gap-2 align-items-center">
                                              <button
                                                className="bg-transparent border-0 d-flex align-items-center"
                                                style={{
                                                  height: "20px",
                                                  color: x.liked_status
                                                    ? "#ff845d"
                                                    : "gray",
                                                  fontSize: "17px",
                                                }}
                                                onClick={() => {
                                                  const likeHandler =
                                                    x.liked_status
                                                      ? handleLike1
                                                      : handleLike;
                                                  likeHandler(x.ddpid);
                                                }}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="25"
                                                  height="25"
                                                  viewBox="0 0 30 30"
                                                  fill="none"
                                                >
                                                  <path
                                                    d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z"
                                                    fill="currentColor"
                                                  />
                                                </svg>
                                                <span
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {x.like_count == 0
                                                    ? ""
                                                    : x.like_count}
                                                </span>
                                              </button>
                                              {/* -------------------------------------------------Dislike Button----------------------------------------------- */}
                                              <button
                                                className="bg-transparent border-0 d-flex align-items-center"
                                                style={{
                                                  height: "20px",
                                                  color: x.dis_liked_status
                                                    ? "red"
                                                    : "gray",
                                                }}
                                                onClick={() => {
                                                  handledislike(x.ddpid);
                                                }}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="25"
                                                  height="25"
                                                  viewBox="0 0 30 30"
                                                  fill="none"
                                                >
                                                  <path
                                                    d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z"
                                                    fill="currentColor"
                                                  />
                                                </svg>
                                              </button>
                                            </div>
                                            {/* {x.reply_count > 0
                                                                                        && (
                                                                                            <div className="w-75 d-flex justify-content-end">
                                                                                                <div className="d-flex">
                                                                                                    <button className='ms-4 bg-transparent border-0 fw-bold' style={{ color: '#5D5FE3', fontSize: '13px' }} onClick={(e) => {
                                                                                                        setreply_layout_status(!reply_layout_status)
                                                                                                        getreplies(x.ddpid, index)
                                                                                                    }}>View All {x.reply_count} Comments</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    } */}
                                            {x.reply_count > 0 && (
                                              <div className="d-flex gap-2">
                                                {!reply_layout_status ? (
                                                  <button
                                                    className="bg-transparent border-0 fw-bold"
                                                    style={{
                                                      color: "#5D5FE3",
                                                      fontSize: "14px",
                                                    }}
                                                    onClick={(e) => {
                                                      setreply_layout_status(
                                                        !reply_layout_status
                                                      );
                                                      setSelectedReply(index);
                                                      getreplies(
                                                        x.ddpid,
                                                        index
                                                      );
                                                    }}
                                                  >
                                                    {
                                                      translate_value.dashboard
                                                        .view_all
                                                    }{" "}
                                                    {x.reply_count}{" "}
                                                    {
                                                      translate_value.dashboard
                                                        .replies
                                                    }
                                                  </button>
                                                ) : selectedReply == index ? (
                                                  <button
                                                    className="bg-transparent border-0 fw-bold"
                                                    style={{
                                                      color: "#5D5FE3",
                                                      fontSize: "14px",
                                                    }}
                                                    onClick={(e) => {
                                                      setreply_layout_status(
                                                        !reply_layout_status
                                                      );
                                                      setSelectedReply(null);
                                                    }}
                                                  >
                                                    {`View less`}
                                                  </button>
                                                ) : (
                                                  <button
                                                    className="bg-transparent border-0 fw-bold"
                                                    style={{
                                                      color: "#5D5FE3",
                                                      fontSize: "14px",
                                                    }}
                                                    onClick={(e) => {
                                                      setreply_layout_status(
                                                        !reply_layout_status
                                                      );
                                                      setSelectedReply(index);
                                                      getreplies(
                                                        x.ddpid,
                                                        index
                                                      );
                                                    }}
                                                  >
                                                    {
                                                      translate_value.dashboard
                                                        .view_all
                                                    }{" "}
                                                    {x.reply_count}{" "}
                                                    {
                                                      translate_value.dashboard
                                                        .replies
                                                    }
                                                  </button>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        {/* --------------------------------Replies section for the particular comment-------------------------------------- */}
                                        {fetchedreplies &&
                                          fetchedreplies.length > 0 && (
                                            <div
                                              className={
                                                fetchedreplies[0].ddpid ==
                                                  x.ddpid && reply_layout_status
                                                  ? "d-block"
                                                  : "d-none"
                                              }
                                            >
                                              {fetchedreplies.map(
                                                (y, index2) => {
                                                  return (
                                                    <div
                                                      className="py-2"
                                                      onClick={() => {
                                                        setindex1(-1);
                                                      }}
                                                    >
                                                      <div className="d-flex px-2 justify-content-between align-items-center">
                                                        <div className="d-flex gap-2 align-items-center">
                                                          <div className="d-flex justify-content-end">
                                                            <img
                                                              src={
                                                                y.user_details
                                                                  .profile_pic
                                                              }
                                                              className={
                                                                y.user_details
                                                                  .profile_pic ==
                                                                  null
                                                                  ? "d-none"
                                                                  : "rounded-circle"
                                                              }
                                                              width={30}
                                                              height={30}
                                                              alt="shw-pdf"
                                                            />
                                                            <p
                                                              className={
                                                                y.user_details
                                                                  .profile_pic ==
                                                                  null
                                                                  ? "bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center"
                                                                  : "d-none"
                                                              }
                                                              style={{
                                                                fontSize:
                                                                  "14px",
                                                                height: "30px",
                                                                width: "30px",
                                                              }}
                                                            >
                                                              <span>
                                                                {y?.user_details?.nickname ? y.user_details.nickname.slice(0, 1) : "user"}
                                                              </span>
                                                              <span>
                                                                {y?.user_details?.nickname ? y.user_details.nickname.slice(0, 1) : "user"}
                                                              </span>
                                                            </p>
                                                          </div>
                                                          <div className={``}>
                                                            <h6
                                                              className="ms-3 ms-sm-0 my-0"
                                                              style={{
                                                                fontSize:
                                                                  "14px",
                                                                fontWeight:
                                                                  "700",
                                                              }}
                                                            >
                                                              {
                                                                y.user_details
                                                                  .nickname
                                                              }
                                                            </h6>
                                                            <p
                                                              className="ms-3 ms-sm-0 my-0"
                                                              style={{
                                                                fontSize:
                                                                  "13px",
                                                              }}
                                                            >
                                                              {y.created_on}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <div
                                                          className={`d-flex gap-2 align-items-center`}
                                                        >
                                                          <button
                                                            className="bg-transparent border-0 d-flex align-items-center"
                                                            style={{
                                                              height: "20px",
                                                              color:
                                                                y.liked_status
                                                                  ? "#ff845d"
                                                                  : "gray",
                                                            }}
                                                            onClick={() => {
                                                              if (
                                                                y.liked_status ==
                                                                true
                                                              ) {
                                                                handleReplyLike1(
                                                                  y.dprid,
                                                                  x.ddpid,
                                                                  index
                                                                );
                                                              } else {
                                                                handleReplyLike(
                                                                  y.dprid,
                                                                  x.ddpid,
                                                                  index
                                                                );
                                                              }
                                                            }}
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              width="22"
                                                              height="22"
                                                              viewBox="0 0 30 30"
                                                              fill="none"
                                                            >
                                                              <path
                                                                d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z"
                                                                fill="currentColor"
                                                              />
                                                            </svg>
                                                            {y.like_count}
                                                          </button>
                                                          <button
                                                            className="bg-transparent border-0 d-flex align-items-center"
                                                            style={{
                                                              height: "20px",
                                                              color:
                                                                y.disliked_status
                                                                  ? "#ff845d"
                                                                  : "gray",
                                                            }}
                                                            onClick={() => {
                                                              handlereplydislike(
                                                                y.dprid,
                                                                x.ddpid,
                                                                index
                                                              );
                                                            }}
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              width="22"
                                                              height="22"
                                                              viewBox="0 0 30 30"
                                                              fill="none"
                                                            >
                                                              <path
                                                                d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z"
                                                                fill="currentColor"
                                                              />
                                                            </svg>
                                                          </button>
                                                          <button
                                                            className={
                                                              user.first_name ===
                                                                y.user_details
                                                                  .first_name
                                                                ? "bg-transparent border-0 d-flex align-items-center"
                                                                : "d-none"
                                                            }
                                                            onClick={() => {
                                                              deleteReply(
                                                                y.dprid,
                                                                x.ddpid,
                                                                index
                                                              );
                                                            }}
                                                            style={{
                                                              height: "20px",
                                                            }}
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              width="22"
                                                              height="22"
                                                              viewBox="0 0 30 30"
                                                              fill="none"
                                                            >
                                                              <path
                                                                d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z"
                                                                fill="#808080"
                                                              />
                                                            </svg>
                                                          </button>
                                                        </div>
                                                      </div>
                                                      <div className="ps-5 py-2">
                                                        <p
                                                          className="m-0"
                                                          style={{
                                                            fontSize: "14px",
                                                          }}
                                                        >
                                                          {y.post}
                                                        </p>
                                                        {y.image.map((a) => {
                                                          return (
                                                            <div className="">
                                                              <img
                                                                src={a.image}
                                                                style={{
                                                                  width:
                                                                    "250px",
                                                                }}
                                                                alt="shw-pdf"
                                                                className="mt-3"
                                                              />
                                                            </div>
                                                          );
                                                        })}
                                                      </div>
                                                      {/* -----------------------------------------------Replies for Reply layout----------------------------------------------- */}
                                                      <div className="ps-5">
                                                        <span
                                                          data-bs-toggle="modal"
                                                          data-bs-target="#replyforreply_modal"
                                                          onClick={() => {
                                                            setdiscuss_id(
                                                              x.ddpid
                                                            );
                                                            setreply_id(
                                                              y.dprid
                                                            );
                                                          }}
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          className="reply_for_reply fw-bold d-flex align-items-center"
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                          >
                                                            <path
                                                              d="M19 18.0001V15.0001C19 14.0385 18.6571 13.2148 17.9712 12.5289C17.2853 11.843 16.4615 11.5001 15.5 11.5001H5.92115L10.0212 15.6001L9.3077 16.3078L4 11.0001L9.3077 5.69238L10.0212 6.40008L5.92115 10.5001H15.5C16.7423 10.5001 17.8029 10.9395 18.6817 11.8184C19.5606 12.6972 20 13.7578 20 15.0001V18.0001H19Z"
                                                              fill="#2A3941"
                                                            />
                                                          </svg>{" "}
                                                          <span className="ms-1">
                                                            Reply
                                                          </span>
                                                        </span>

                                                        {/* <p style={{ cursor: 'pointer' }} className={`view_reply_for_reply mt-2 ${y.replies_count > 0 ? '' : 'd-none'}`} onClick={() => {
                                                                                                        setreplies_for_reply_status(!replies_for_reply_status)
                                                                                                        getreplies_for_reply(y.dprid)
                                                                                                    }}>---View {y.replies_count} replies</p> */}
                                                        {!replies_for_reply_status ? (
                                                          <p
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            className={`view_reply_for_reply mt-2 mb-0 ${y.replies_count >
                                                              0
                                                              ? ""
                                                              : "d-none"
                                                              }`}
                                                            onClick={() => {
                                                              setreplies_for_reply_status(
                                                                !replies_for_reply_status
                                                              );
                                                              getreplies_for_reply(
                                                                y.dprid
                                                              );
                                                              setSelectedReplyOfReply(
                                                                index2
                                                              );
                                                            }}
                                                          >
                                                            ---View{" "}
                                                            {y.replies_count}{" "}
                                                            replies
                                                          </p>
                                                        ) : selectedReplyOfReply ==
                                                          index2 ? (
                                                          <p
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            className={`view_reply_for_reply mt-2 mb-0 ${y.replies_count >
                                                              0
                                                              ? ""
                                                              : "d-none"
                                                              }`}
                                                            onClick={() => {
                                                              setreplies_for_reply_status(
                                                                !replies_for_reply_status
                                                              );
                                                              getreplies_for_reply(
                                                                y.dprid
                                                              );
                                                              setSelectedReplyOfReply(
                                                                null
                                                              );
                                                            }}
                                                          >
                                                            {"View less"}
                                                          </p>
                                                        ) : (
                                                          <p
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            className={`view_reply_for_reply mt-2 mb-0 ${y.replies_count >
                                                              0
                                                              ? ""
                                                              : "d-none"
                                                              }`}
                                                            onClick={() => {
                                                              setreplies_for_reply_status(
                                                                !replies_for_reply_status
                                                              );
                                                              getreplies_for_reply(
                                                                y.dprid
                                                              );
                                                              setSelectedReplyOfReply(
                                                                index2
                                                              );
                                                            }}
                                                          >
                                                            ---View{" "}
                                                            {y.replies_count}{" "}
                                                            replies
                                                          </p>
                                                        )}
                                                        {fetchedreplies_for_reply &&
                                                          fetchedreplies_for_reply.length >
                                                          0 && (
                                                            <div
                                                              className={
                                                                fetchedreplies_for_reply[0]
                                                                  .reply ==
                                                                  y.dprid &&
                                                                  replies_for_reply_status
                                                                  ? "d-block"
                                                                  : "d-none"
                                                              }
                                                            >
                                                              {fetchedreplies_for_reply.map(
                                                                (z) => {
                                                                  return (
                                                                    <div
                                                                      className={`px-2 py-2 bg-white`}
                                                                      onClick={() => {
                                                                        setindex1(
                                                                          -1
                                                                        );
                                                                      }}
                                                                    >
                                                                      <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex gap-2 align-items-center">
                                                                          <div className="d-flex justify-content-center">
                                                                            <img
                                                                              src={
                                                                                z
                                                                                  .user_id
                                                                                  .profile_pic
                                                                              }
                                                                              className={
                                                                                z
                                                                                  .user_id
                                                                                  .profile_pic ==
                                                                                  null
                                                                                  ? "d-none"
                                                                                  : "rounded-circle"
                                                                              }
                                                                              width={
                                                                                30
                                                                              }
                                                                              height={
                                                                                30
                                                                              }
                                                                              alt="shw-pdf"
                                                                            />
                                                                            <p
                                                                              className={
                                                                                z
                                                                                  .user_id
                                                                                  .profile_pic ==
                                                                                  null
                                                                                  ? "bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center"
                                                                                  : "d-none"
                                                                              }
                                                                              style={{
                                                                                fontSize:
                                                                                  "14px",
                                                                                height:
                                                                                  "30px",
                                                                                width:
                                                                                  "30px",
                                                                              }}
                                                                            >
                                                                              <span>
                                                                                {z?.user_id?.nickname ? z.user_id.nickname.slice(0, 1) : "user"}
                                                                              </span>
                                                                              <span>
                                                                                {z?.user_id?.nickname ? z.user_id.nickname.slice(0, 1) : "user"}
                                                                              </span>
                                                                            </p>
                                                                          </div>
                                                                          <div>
                                                                            <h6
                                                                              className="ms-sm-0 my-0"
                                                                              style={{
                                                                                fontSize:
                                                                                  "12px",
                                                                              }}
                                                                            >
                                                                              <Link
                                                                                to={`/profile/${z.user_id.user_id}`}
                                                                                className="text-decoration-none text-dark"
                                                                              >
                                                                                {
                                                                                  z
                                                                                    .user_id
                                                                                    .nickname
                                                                                }
                                                                              </Link>
                                                                            </h6>
                                                                            <p
                                                                              className="ms-sm-0 my-0"
                                                                              style={{
                                                                                fontSize:
                                                                                  "13px",
                                                                              }}
                                                                            >
                                                                              {
                                                                                z.created_at
                                                                              }
                                                                            </p>
                                                                          </div>
                                                                        </div>

                                                                        <div
                                                                          className={`d-flex gap-2 align-items-center`}
                                                                        >
                                                                          <button
                                                                            className="bg-transparent border-0 d-flex align-items-center"
                                                                            style={{
                                                                              height:
                                                                                "20px",
                                                                              color:
                                                                                z.liked_status
                                                                                  ? "#ff845d"
                                                                                  : "gray",
                                                                            }}
                                                                            onClick={() => {
                                                                              handleReplies_reply_like(
                                                                                z.id,
                                                                                y.dprid
                                                                              );
                                                                            }}
                                                                          >
                                                                            <svg
                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                              width="22"
                                                                              height="22"
                                                                              viewBox="0 0 30 30"
                                                                              fill="none"
                                                                            >
                                                                              <path
                                                                                d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z"
                                                                                fill="currentColor"
                                                                              />
                                                                            </svg>{" "}
                                                                            <span
                                                                              className="ms-1"
                                                                              style={{
                                                                                fontSize:
                                                                                  "14px",
                                                                              }}
                                                                            >
                                                                              {
                                                                                z.like_count
                                                                              }
                                                                            </span>
                                                                          </button>
                                                                          <button
                                                                            className="bg-transparent border-0 d-flex align-items-center"
                                                                            style={{
                                                                              height:
                                                                                "20px",
                                                                              color:
                                                                                z.dis_liked_status
                                                                                  ? "#ff845d"
                                                                                  : "gray",
                                                                            }}
                                                                            onClick={() => {
                                                                              handlereplies_replydislike(
                                                                                z.id,
                                                                                y.dprid
                                                                              );
                                                                            }}
                                                                          >
                                                                            <svg
                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                              width="22"
                                                                              height="22"
                                                                              viewBox="0 0 30 30"
                                                                              fill="none"
                                                                            >
                                                                              <path
                                                                                d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z"
                                                                                fill="currentColor"
                                                                              />
                                                                            </svg>
                                                                          </button>
                                                                          <button
                                                                            className={
                                                                              user.first_name ===
                                                                                z
                                                                                  .user_id
                                                                                  .first_name
                                                                                ? "bg-transparent border-0 d-flex align-items-center"
                                                                                : "d-none"
                                                                            }
                                                                            onClick={() => {
                                                                              deleteReply_for_reply(
                                                                                z.id,
                                                                                y.dprid,
                                                                                x.ddpid
                                                                              );
                                                                            }}
                                                                            style={{
                                                                              height:
                                                                                "20px",
                                                                            }}
                                                                          >
                                                                            <svg
                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                              width="22"
                                                                              height="22"
                                                                              viewBox="0 0 30 30"
                                                                              fill="none"
                                                                            >
                                                                              {" "}
                                                                              <path
                                                                                d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z"
                                                                                fill="#808080"
                                                                              />{" "}
                                                                            </svg>
                                                                          </button>
                                                                        </div>
                                                                      </div>
                                                                      <div
                                                                        className={`ps-5`}
                                                                      >
                                                                        <p
                                                                          className="m-0"
                                                                          style={{
                                                                            fontSize:
                                                                              "14px",
                                                                          }}
                                                                        >
                                                                          {
                                                                            z.post
                                                                          }
                                                                        </p>
                                                                        {z.images_attached.map(
                                                                          (
                                                                            b
                                                                          ) => {
                                                                            return (
                                                                              <div className="d-flex justify-content-center">
                                                                                <img
                                                                                  src={
                                                                                    b.images
                                                                                  }
                                                                                  width={
                                                                                    260
                                                                                  }
                                                                                  alt="shw-pdf"
                                                                                  className="mt-3"
                                                                                />
                                                                              </div>
                                                                            );
                                                                          }
                                                                        )}
                                                                      </div>
                                                                    </div>
                                                                  );
                                                                }
                                                              )}
                                                            </div>
                                                          )}
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          )}
                                        {/* --------------Reply for the particular post in the discussion--------------------------- */}
                                        <div
                                          className="d-flex px-2 py-2 gap-2 border-secondary-subtle align-items-center"
                                          onClick={() => {
                                            setindex1(-1);
                                          }}
                                        >
                                          <img
                                            src={userdetails.profile_pic}
                                            className={
                                              userdetails.profile_pic == null
                                                ? "d-none"
                                                : "rounded-circle"
                                            }
                                            width={30}
                                            height={30}
                                            alt="shw-pdf"
                                          />
                                          {userdetails.nickname != undefined ? (
                                            <p
                                              className={
                                                userdetails.profile_pic == null
                                                  ? "d-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto"
                                                  : "d-none"
                                              }
                                              style={{
                                                fontSize: "14px",
                                                height: "40px",
                                                width: "40px",
                                              }}
                                            >
                                              <span>
                                                {userdetails?.nickname ? userdetails.nickname.slice(0, 1) : "user"}
                                              </span>
                                              <span>
                                                {userdetails?.nickname ? userdetails.nickname.slice(0, 1) : "user"}
                                              </span>
                                            </p>
                                          ) : (
                                            <></>
                                          )}
                                          <form
                                            className="w-100"
                                            onSubmit={(e) =>
                                              postReplies(e, x.ddpid, index)
                                            }
                                          >
                                            <div className="input-group border rounded bg-light">
                                              <input
                                                key={index}
                                                type="text"
                                                name={post}
                                                onChange={(e) => {
                                                  repliesData(e);
                                                  setSelectedPostForComment(
                                                    x.ddpid
                                                  );
                                                }}
                                                className="form-control py-1 ps-3 shadow-none border-0 bg-light originalreply-input"
                                                placeholder="Post your Reply..."
                                                style={{ position: "relative" }}
                                              />
                                              <div className="d-flex gap-2 align-items-center bg-light">
                                                <input
                                                  id="file3"
                                                  type="file"
                                                  name="file"
                                                  accept="image/*"
                                                  multiple
                                                  onChange={handleReplyImage}
                                                  className="bg-light text-center p-3 btn"
                                                />
                                                <label
                                                  data-bs-toggle="tooltip"
                                                  data-bs-placement="top"
                                                  data-bs-custom-class="custom-tooltip"
                                                  data-bs-title="Attach Image"
                                                  htmlFor="file3"
                                                  className="custom-file-input bg-transparent border-0 py-2"
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="25"
                                                    height="25"
                                                    viewBox="0 0 25 25"
                                                    fill="none"
                                                  >
                                                    <path
                                                      d="M18.0691 16.1859C18.0691 17.7637 17.5255 19.1063 16.4385 20.2138C15.3514 21.3213 14.0219 21.875 12.4501 21.875C10.8782 21.875 9.54541 21.3213 8.45166 20.2138C7.35791 19.1063 6.81104 17.7637 6.81104 16.1859V7.09135C6.81104 5.98958 7.18998 5.05308 7.94786 4.28185C8.70574 3.51062 9.63557 3.125 10.7373 3.125C11.8391 3.125 12.7689 3.51062 13.5268 4.28185C14.2847 5.05308 14.6636 5.98958 14.6636 7.09135V15.7051C14.6636 16.3168 14.4502 16.8436 14.0234 17.2857C13.5966 17.7277 13.0764 17.9487 12.4629 17.9487C11.8494 17.9487 11.3216 17.7312 10.8796 17.296C10.4375 16.8609 10.2165 16.3306 10.2165 15.7051V7.05128H11.2582V15.7051C11.2582 16.0377 11.372 16.3211 11.5997 16.5555C11.8274 16.7899 12.1075 16.9071 12.44 16.9071C12.7726 16.9071 13.0527 16.7899 13.2804 16.5555C13.5081 16.3211 13.6219 16.0377 13.6219 15.7051V7.0713C13.6179 6.26201 13.3397 5.57559 12.7872 5.01203C12.2348 4.44845 11.5515 4.16667 10.7373 4.16667C9.92965 4.16667 9.24695 4.45179 8.68924 5.02203C8.13155 5.59227 7.8527 6.28205 7.8527 7.09135V16.1859C7.84871 17.472 8.29409 18.568 9.18885 19.4742C10.0836 20.3803 11.1731 20.8333 12.4573 20.8333C13.7234 20.8333 14.7996 20.3803 15.6859 19.4742C16.5722 18.568 17.0194 17.472 17.0274 16.1859V7.05128H18.0691V16.1859Z"
                                                      fill="#8E9696"
                                                    />
                                                  </svg>
                                                </label>
                                                <button
                                                  disabled={
                                                    replies.length > 0
                                                      ? false
                                                      : true
                                                  }
                                                  type="submit"
                                                  className="h-100 bg-transparent border-0"
                                                >
                                                  <div
                                                    style={{ width: "25px" }}
                                                    className={`${load &&
                                                      selectedPostForComment ==
                                                      x.ddpid
                                                      ? ""
                                                      : "d-none"
                                                      }`}
                                                  >
                                                    <div
                                                      className={`spinner-border spinner-border-sm`}
                                                      role="status"
                                                    >
                                                      <span className="visually-hidden">
                                                        Loading...
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <svg
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="Post"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`${load &&
                                                      selectedPostForComment ==
                                                      x.ddpid
                                                      ? "d-none"
                                                      : ""
                                                      }`}
                                                    width="25"
                                                    height="25"
                                                    viewBox="0 0 25 25"
                                                    fill="none"
                                                  >
                                                    <path
                                                      d="M4.1665 19.2707V5.729L20.2322 12.4998L4.1665 19.2707ZM5.20817 17.7082L17.5519 12.4998L5.20817 7.2915V11.338L10.2562 12.4998L5.20817 13.6617V17.7082Z"
                                                      fill="#8E9696"
                                                    />
                                                  </svg>
                                                </button>
                                              </div>
                                            </div>
                                          </form>
                                        </div>
                                        {replyImage.length > 0 && (
                                          <div className="d-flex gap-3 mt-2">
                                            {replyImage.map((image, index) => (
                                              <div
                                                key={index}
                                                className="image-preview bg-light p-2"
                                                style={{ position: "relative" }}
                                              >
                                                <img
                                                  src={URL.createObjectURL(
                                                    image
                                                  )}
                                                  width={50}
                                                  alt={`Selected Image ${index + 1
                                                    }`}
                                                />
                                                <button
                                                  style={{
                                                    position: "absolute",
                                                    top: "-10px",
                                                    right: "-16px",
                                                  }}
                                                  className="btn btn-sm"
                                                  onClick={() =>
                                                    removeImage(index)
                                                  }
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-x-circle"
                                                    viewBox="0 0 16 16"
                                                  >
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                                  </svg>
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              {/* -----------------------------------------Pinned comments section layout-------------------------------------------- */}
                              <ShowPdfPageSearchComments
                                pinnedcomments_status={pinnedcomments_status}
                                discussionpagelayout={discussionpagelayout}
                                id={id}
                                count={count}
                                setCount={setCount}
                              />
                              {/* -----------------------------------------User's comments section layout-------------------------------------------- */}
                              {/* <Showpdfpage_user_comments usercomment_status={usercomments_status} id={id} discussionpagelayout={discussionpagelayout} count={count}/> */}
                              {/* ---------------------------------------------Document discussion layout section-------------------------------------- */}
                              <h6
                                className={`py-2 ${pinnedcommentsstate &&
                                  searchcomment.length == 0
                                  ? ""
                                  : "d-none"
                                  }`}
                                style={{ color: "#5d5fe3", fontSize: "15px" }}
                              >
                                💬 Followed Comments
                              </h6>
                              <h6
                                className={`py-2 ${usercommentsstate && searchcomment.length == 0
                                  ? ""
                                  : "d-none"
                                  }`}
                                style={{ color: "#5d5fe3", fontSize: "15px" }}
                              >
                                💬 Your Comments
                              </h6>
                              <div
                                className={`${original_status ? "" : "d-none"}`}
                              >
                                {documentDetails &&
                                  documentDetails.length > 0 ? (
                                  documentDetails.map((x, index) => {
                                    return (
                                      <div
                                        id={`comment-container-${x.comment.ddpid}`}
                                        className={`mb-3 me-2 ${view_mark_comment === x.comment.ddpid
                                          ? "rounded purple-border"
                                          : ""
                                          }`}
                                        key={index}
                                      >
                                        <div className="bg-white rounded border">
                                          <div className="d-flex ps-2 py-2 justify-content-between align-items-center border-bottom">
                                            <div className="d-flex align-items-center gap-2">
                                              <div
                                                onClick={() => {
                                                  setindex1(-1);
                                                }}
                                              >
                                                <img
                                                  src={x.user.profile_pic}
                                                  className={
                                                    x.user.profile_pic == null
                                                      ? "d-none"
                                                      : "rounded-circle"
                                                  }
                                                  width={30}
                                                  height={30}
                                                  alt="shw-pdf"
                                                />
                                                {x.user.nickname !=
                                                  undefined ? (
                                                  <p
                                                    className={
                                                      x.user.profile_pic == null
                                                        ? "bg-info text-white rounded-circle my-auto d-flex align-items-center justify-content-center"
                                                        : "d-none"
                                                    }
                                                    style={{
                                                      fontSize: "18px",
                                                      height: "30px",
                                                      width: "30px",
                                                    }}
                                                  >
                                                    <span>
                                                      {x?.user?.nickname ? x.user.nickname.slice(0, 1) : "user"}
                                                    </span>
                                                    <span>
                                                      {x?.user?.nickname ? x.user.nickname.slice(0, 1) : "user"}
                                                    </span>
                                                  </p>
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                              <div
                                                onClick={() => {
                                                  setindex1(-1);
                                                }}
                                              >
                                                <Link
                                                  to={`/profile/${x.user.user_id}`}
                                                  className="ms-3 ms-sm-0 my-0 fw-medium text-dark text-decoration-none"
                                                  style={{
                                                    fontSize: "15px",
                                                    fontWeight: "700",
                                                  }}
                                                >
                                                  {x.user.nickname}
                                                </Link>
                                                <p
                                                  className="ms-3 ms-sm-0 my-0 d-flex align-items-center"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  {x.comment.created_on}{" "}
                                                  <span
                                                    className={`ms-2 edit ${x.edited ? "" : "d-none"
                                                      }`}
                                                  >
                                                    Edited
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                            <div
                                              className={`d-flex align-items-center ${discussionpagelayout &&
                                                x.pinned_status
                                                ? "justify-content-between"
                                                : "justify-content-end"
                                                } p-0 ${x.pinned_status
                                                  ? "col-2"
                                                  : "col-2"
                                                }`}
                                            >
                                              <button
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="left"
                                                data-bs-custom-class="custom-tooltip"
                                                data-bs-title="Unfollow"
                                                onClick={() => {
                                                  unpin(x.comment.ddpid);
                                                }}
                                                className={`p-1 btn btn-sm border px-2 ${x.pinned_status &&
                                                  discussionpagelayout
                                                  ? ""
                                                  : "d-none"
                                                  }`}
                                                style={{ cursor: "pointer" }}
                                              >
                                                <i className="fa-solid fa-link-slash d-md-none d-inline"></i>
                                                <span className="d-none d-md-inline">
                                                  Followed
                                                </span>
                                              </button>
                                              <button
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="left"
                                                data-bs-custom-class="custom-tooltip"
                                                data-bs-title="Unfollow"
                                                onClick={() => {
                                                  unpin(x.comment.ddpid);
                                                }}
                                                className={`p-1 btn btn-sm p-0 border-0 ${x.pinned_status &&
                                                  discussionpagelayout == false
                                                  ? ""
                                                  : "d-none"
                                                  }`}
                                                style={{ cursor: "pointer" }}
                                              >
                                                {" "}
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  fill="currentColor"
                                                  className="bi bi-pin"
                                                  viewBox="0 0 16 16"
                                                >
                                                  <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                                                </svg>
                                              </button>
                                              <div className="btn-group dropstart">
                                                <span
                                                  className="border-0"
                                                  type="button"
                                                  style={{
                                                    position: "relative",
                                                  }}
                                                  onClick={() =>
                                                    handleDropdownClick(index)
                                                  }
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="26"
                                                    height="26"
                                                    viewBox="0 0 35 35"
                                                    fill="none"
                                                  >
                                                    <path
                                                      d="M17.4998 27.0354C17.0988 27.0354 16.7555 26.8926 16.4699 26.607C16.1843 26.3214 16.0415 25.9781 16.0415 25.5771C16.0415 25.176 16.1843 24.8327 16.4699 24.5471C16.7555 24.2615 17.0988 24.1187 17.4998 24.1187C17.9009 24.1187 18.2442 24.2615 18.5298 24.5471C18.8154 24.8327 18.9582 25.176 18.9582 25.5771C18.9582 25.9781 18.8154 26.3214 18.5298 26.607C18.2442 26.8926 17.9009 27.0354 17.4998 27.0354ZM17.4998 18.9585C17.0988 18.9585 16.7555 18.8157 16.4699 18.5301C16.1843 18.2445 16.0415 17.9012 16.0415 17.5001C16.0415 17.0991 16.1843 16.7558 16.4699 16.4702C16.7555 16.1846 17.0988 16.0418 17.4998 16.0418C17.9009 16.0418 18.2442 16.1846 18.5298 16.4702C18.8154 16.7558 18.9582 17.0991 18.9582 17.5001C18.9582 17.9012 18.8154 18.2445 18.5298 18.5301C18.2442 18.8157 17.9009 18.9585 17.4998 18.9585ZM17.4998 10.8815C17.0988 10.8815 16.7555 10.7388 16.4699 10.4532C16.1843 10.1676 16.0415 9.82424 16.0415 9.42318C16.0415 9.02214 16.1843 8.67882 16.4699 8.39323C16.7555 8.10764 17.0988 7.96484 17.4998 7.96484C17.9009 7.96484 18.2442 8.10764 18.5298 8.39323C18.8154 8.67882 18.9582 9.02214 18.9582 9.42318C18.9582 9.82424 18.8154 10.1676 18.5298 10.4532C18.2442 10.7388 17.9009 10.8815 17.4998 10.8815Z"
                                                      fill="#2A3941"
                                                    />
                                                  </svg>
                                                </span>
                                                <ul
                                                  className={`bg-white border shadow-sm mt-0 p-0 ps-3 rounded ${index1 === index &&
                                                    dropdownstate
                                                    ? ""
                                                    : "d-none"
                                                    }`}
                                                  style={{
                                                    top: "0px",
                                                    width: "105px",
                                                    position: "absolute",
                                                    right: "25px",
                                                  }}
                                                >
                                                  <button
                                                    className={
                                                      x.user.user_id !=
                                                        user.user_id ||
                                                        x.comment.created_on.includes(
                                                          "day"
                                                        ) ||
                                                        x.comment.created_on.includes(
                                                          "week"
                                                        ) ||
                                                        x.comment.created_on.includes(
                                                          "year"
                                                        )
                                                        ? "d-none"
                                                        : "d-flex align-items-center bg-transparent border-0 my-2 d-flex align-items-center"
                                                    }
                                                    onClick={() => {
                                                      editPosts(
                                                        x.comment.ddpid
                                                      );
                                                      togglePostEditModal();
                                                    }}
                                                    style={{ height: "20px" }}
                                                  >
                                                    <span className="dropdownmenu">
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="22"
                                                        height="22"
                                                        viewBox="0 0 30 30"
                                                        fill="none"
                                                      >
                                                        <path
                                                          d="M6.25 23.75H7.62259L20.9952 10.3774L19.6226 9.00481L6.25 22.3774V23.75ZM5 25V21.851L21.476 5.35816C21.604 5.24397 21.7454 5.15573 21.9001 5.09344C22.0549 5.03115 22.2162 5 22.3841 5C22.552 5 22.7146 5.02644 22.8721 5.07931C23.0295 5.13221 23.1747 5.22756 23.3077 5.36538L24.6418 6.70672C24.7797 6.83974 24.8738 6.98566 24.9243 7.14447C24.9748 7.30328 25 7.46209 25 7.62091C25 7.7903 24.9714 7.95236 24.9143 8.10709C24.8573 8.26182 24.7664 8.40321 24.6418 8.53125L8.14903 25H5ZM20.2968 9.70316L19.6226 9.00481L20.9952 10.3774L20.2968 9.70316Z"
                                                          fill="black"
                                                        />
                                                      </svg>
                                                    </span>
                                                    <span
                                                      className="ms-2"
                                                      style={{
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      Edit
                                                    </span>
                                                  </button>
                                                  <button
                                                    className={`bg-transparent border-0 d-flex align-items-center my-2 ${x.pinned_status
                                                      ? "d-none"
                                                      : ""
                                                      }`}
                                                    onClick={() => {
                                                      pincomment(
                                                        x.comment.ddpid
                                                      );
                                                    }}
                                                    style={{ height: "20px" }}
                                                  >
                                                    <span className="dropdownmenu">
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-pin"
                                                        viewBox="0 0 16 16"
                                                      >
                                                        <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                                                      </svg>
                                                    </span>{" "}
                                                    <span
                                                      className="ms-2"
                                                      style={{
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      Follow
                                                    </span>
                                                  </button>
                                                  {/* ----------------------------------------------------Report button--------------------------------------------------- */}
                                                  {user.user_id !==
                                                    x.user.user_id && (
                                                      <>
                                                        <button
                                                          className={`bg-transparent border-0 my-2 ${x.reported_status
                                                            ? "d-none"
                                                            : "d-flex align-items-center"
                                                            }`}
                                                          onClick={() => {
                                                            setreport_id(
                                                              x.comment.ddpid
                                                            );
                                                            setreport_status(
                                                              true
                                                            );
                                                          }}
                                                          style={{
                                                            height: "20px",
                                                          }}
                                                        >
                                                          <span className="dropdownmenu">
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              width="19"
                                                              height="20"
                                                              viewBox="0 0 35 35"
                                                              fill="none"
                                                            >
                                                              <path
                                                                d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z"
                                                                fill="#2A3941"
                                                              />
                                                            </svg>
                                                          </span>{" "}
                                                          <span
                                                            className="ms-2"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            Report
                                                          </span>
                                                        </button>
                                                        <button
                                                          className={`bg-transparent border-0 my-2 ${x.reported_status
                                                            ? "d-flex align-items-center"
                                                            : "d-none"
                                                            }`}
                                                          style={{
                                                            height: "20px",
                                                            color: "#FF845D",
                                                          }}
                                                        >
                                                          <span className="dropdownmenu">
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              width="19"
                                                              height="20"
                                                              viewBox="0 0 35 35"
                                                              fill="none"
                                                            >
                                                              <path
                                                                d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z"
                                                                fill="#FF845D"
                                                              />
                                                            </svg>
                                                          </span>{" "}
                                                          <span
                                                            className="ms-2"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            Reported
                                                          </span>
                                                        </button>
                                                      </>
                                                    )}
                                                  <button
                                                    className={`bg-transparent border-0 my-2 ${user.user_id ===
                                                      x.user.user_id
                                                      ? "d-flex align-items-center"
                                                      : "d-none"
                                                      }`}
                                                    onClick={() => {
                                                      deletePost(
                                                        x.comment.ddpid
                                                      );
                                                    }}
                                                    style={{ height: "20px" }}
                                                  >
                                                    <span className="dropdownmenu">
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="22"
                                                        height="22"
                                                        viewBox="0 0 30 30"
                                                        fill="none"
                                                      >
                                                        <path
                                                          d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z"
                                                          fill="black"
                                                        />
                                                      </svg>
                                                    </span>
                                                    <span
                                                      className="ms-2"
                                                      style={{
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      Delete
                                                    </span>
                                                  </button>
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            className="py-2 px-2"
                                            onClick={() => {
                                              setindex1(-1);
                                            }}
                                          >
                                            <p className="m-0">
                                              {x.comment.post}
                                            </p>
                                            {x.comment.images_attached.map(
                                              (z) => {
                                                return (
                                                  <div>
                                                    <img
                                                      src={z.image}
                                                      width={300}
                                                      className="mt-3 img-fluid"
                                                      alt="shw-pdf"
                                                    />
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                          {/* -------------------------------Likes, dislikes and View all comments layout---------------------------------------- */}
                                          <div
                                            className="border-bottom px-2"
                                            onClick={() => {
                                              setindex1(-1);
                                            }}
                                          >
                                            <div className="d-flex justify-content-between">
                                              <div className="d-flex gap-2 align-items-center">
                                                <button
                                                  className="bg-transparent border-0 d-flex align-items-center"
                                                  style={{
                                                    height: "20px",
                                                    color: x.status
                                                      ? "#ff845d"
                                                      : "gray",
                                                    fontSize: "17px",
                                                  }}
                                                  onClick={() => {
                                                    if (x.status == true) {
                                                      handleLike1(
                                                        x.comment.ddpid
                                                      );
                                                    } else {
                                                      handleLike(
                                                        x.comment.ddpid
                                                      );
                                                    }
                                                  }}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="25"
                                                    height="25"
                                                    viewBox="0 0 30 30"
                                                    fill="none"
                                                  >
                                                    <path
                                                      d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z"
                                                      fill="currentColor"
                                                    />
                                                  </svg>
                                                  <span
                                                    style={{ fontSize: "14px" }}
                                                  >
                                                    {x.likes}
                                                  </span>
                                                </button>
                                                {/* -------------------------------------------------Dislike Button----------------------------------------------- */}
                                                <button
                                                  className="bg-transparent border-0 d-flex align-items-center"
                                                  style={{
                                                    height: "20px",
                                                    color: x.dis_like_status
                                                      ? "red"
                                                      : "gray",
                                                  }}
                                                  onClick={() => {
                                                    handledislike(
                                                      x.comment.ddpid
                                                    );
                                                  }}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="25"
                                                    height="25"
                                                    viewBox="0 0 30 30"
                                                    fill="none"
                                                  >
                                                    <path
                                                      d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z"
                                                      fill="currentColor"
                                                    />
                                                  </svg>
                                                </button>
                                              </div>
                                              {/* {x.replies_count > 0
                                                                                        && (
                                                                                            <div className="w-75 d-flex justify-content-end">
                                                                                                <div className="d-flex">
                                                                                                    <button className='ms-4 bg-transparent border-0 fw-bold' style={{ color: '#5D5FE3', fontSize: '13px' }} onClick={(e) => {
                                                                                                        setreply_layout_status(!reply_layout_status)
                                                                                                        getreplies(x.comment.ddpid, index)
                                                                                                    }}>View All {x.replies_count} Comments</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    } */}
                                              {x.replies_count > 0 && (
                                                <div className="d-flex gap-2">
                                                  {!reply_layout_status ? (
                                                    <button
                                                      className="bg-transparent border-0 fw-bold"
                                                      style={{
                                                        color: "#5D5FE3",
                                                        fontSize: "14px",
                                                      }}
                                                      onClick={(e) => {
                                                        setreply_layout_status(
                                                          !reply_layout_status
                                                        );
                                                        setSelectedReply(index);
                                                        getreplies(
                                                          x.comment.ddpid,
                                                          index
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        translate_value
                                                          .dashboard.view_all
                                                      }{" "}
                                                      {x.replies_count}{" "}
                                                      {
                                                        translate_value
                                                          .dashboard.replies
                                                      }
                                                    </button>
                                                  ) : selectedReply == index ? (
                                                    <button
                                                      className="bg-transparent border-0 fw-bold"
                                                      style={{
                                                        color: "#5D5FE3",
                                                        fontSize: "14px",
                                                      }}
                                                      onClick={(e) => {
                                                        setreply_layout_status(
                                                          !reply_layout_status
                                                        );
                                                        setSelectedReply(null);
                                                      }}
                                                    >
                                                      {`View less`}
                                                    </button>
                                                  ) : (
                                                    <button
                                                      className="bg-transparent border-0 fw-bold"
                                                      style={{
                                                        color: "#5D5FE3",
                                                        fontSize: "14px",
                                                      }}
                                                      onClick={(e) => {
                                                        setreply_layout_status(
                                                          !reply_layout_status
                                                        );
                                                        setSelectedReply(index);
                                                        getreplies(
                                                          x.comment.ddpid,
                                                          index
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        translate_value
                                                          .dashboard.view_all
                                                      }{" "}
                                                      {x.replies_count}{" "}
                                                      {
                                                        translate_value
                                                          .dashboard.replies
                                                      }
                                                    </button>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                            {/* ---------------------------------See mark button------------------------------------- */}
                                            {x.comment.docmid && (
                                              <div className="py-2">
                                                <button
                                                  onClick={() => {
                                                    if (isMobile) {
                                                      setpreviewbtnstate((prev) => !prev);
                                                    }
                                                    if (discussionpagelayout) {
                                                      setdiscussionpagelayout(!discussionpagelayout);
                                                    }

                                                    scrollToQue(x.comment.ddpid);

                                                  }}
                                                  className="btn btn-sm w-100 py-2"
                                                  style={{
                                                    backgroundColor: "#F3F0FF",
                                                    color: "#5D5FE3",
                                                    border: "1px solid #5D5FE3",
                                                    fontWeight: 500,
                                                    fontSize: "12px",
                                                    letterSpacing: "0.32px",
                                                    lineHeight: "15px",
                                                  }}
                                                >
                                                  View Mark
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                          {/* --------------------------------Replies section for the particular comment-------------------------------------- */}
                                          {fetchedreplies &&
                                            fetchedreplies.length > 0 && (
                                              <div
                                                className={
                                                  fetchedreplies[0].ddpid ==
                                                    x.comment.ddpid &&
                                                    reply_layout_status
                                                    ? "d-block"
                                                    : "d-none"
                                                }
                                              >
                                                {fetchedreplies.map(
                                                  (y, index2) => {
                                                    return (
                                                      <div
                                                        className="pt-2"
                                                        onClick={() => {
                                                          setindex1(-1);
                                                        }}
                                                      >
                                                        <div className="d-flex px-2 justify-content-between align-items-center">
                                                          <div className="d-flex w-100">
                                                            <div className="p-0 d-flex justify-content-end">
                                                              <img
                                                                src={
                                                                  y.user_details
                                                                    .profile_pic
                                                                }
                                                                className={
                                                                  y.user_details
                                                                    .profile_pic ==
                                                                    null
                                                                    ? "d-none"
                                                                    : "rounded-circle"
                                                                }
                                                                width={30}
                                                                height={30}
                                                                alt="shw-pdf"
                                                              />
                                                              <p
                                                                className={
                                                                  y.user_details
                                                                    .profile_pic ==
                                                                    null
                                                                    ? "bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center"
                                                                    : "d-none"
                                                                }
                                                                style={{
                                                                  fontSize:
                                                                    "14px",
                                                                  height:
                                                                    "30px",
                                                                  width: "30px",
                                                                }}
                                                              >
                                                                <span>
                                                                  {y?.user_details?.nickname ? y.user_details.nickname.slice(0, 1) : "user"}
                                                                </span>
                                                                <span>
                                                                  {y?.user_details?.nickname ? y.user_details.nickname.slice(0, 1) : "user"}
                                                                </span>
                                                              </p>
                                                            </div>
                                                            <div
                                                              className={`ps-2 p-0 ${discussionpagelayout
                                                                ? "col-lg-9"
                                                                : "col-lg-7"
                                                                }`}
                                                            >
                                                              <h6
                                                                className="ms-3 ms-sm-0 my-0"
                                                                style={{
                                                                  fontSize:
                                                                    "14px",
                                                                  fontWeight:
                                                                    "700",
                                                                }}
                                                              >
                                                                {
                                                                  y.user_details
                                                                    .nickname
                                                                }
                                                              </h6>
                                                              <p
                                                                className="ms-3 ms-sm-0 my-0"
                                                                style={{
                                                                  fontSize:
                                                                    "13px",
                                                                }}
                                                              >
                                                                {y.created_on}
                                                              </p>
                                                            </div>
                                                          </div>
                                                          <div
                                                            className={`d-flex gap-2 align-items-center`}
                                                          >
                                                            <button
                                                              className="bg-transparent border-0 d-flex align-items-center"
                                                              style={{
                                                                height: "20px",
                                                                color:
                                                                  y.liked_status
                                                                    ? "#ff845d"
                                                                    : "gray",
                                                              }}
                                                              onClick={() => {
                                                                if (
                                                                  y.liked_status ==
                                                                  true
                                                                ) {
                                                                  handleReplyLike1(
                                                                    y.dprid,
                                                                    x.comment
                                                                      .ddpid,
                                                                    index
                                                                  );
                                                                } else {
                                                                  handleReplyLike(
                                                                    y.dprid,
                                                                    x.comment
                                                                      .ddpid,
                                                                    index
                                                                  );
                                                                }
                                                              }}
                                                            >
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="22"
                                                                height="22"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                              >
                                                                <path
                                                                  d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z"
                                                                  fill="currentColor"
                                                                />
                                                              </svg>
                                                              {y.like_count == 0
                                                                ? ""
                                                                : y.like_count}
                                                            </button>
                                                            <button
                                                              className="bg-transparent border-0 d-flex align-items-center"
                                                              style={{
                                                                height: "20px",
                                                                color:
                                                                  y.disliked_status
                                                                    ? "#ff845d"
                                                                    : "gray",
                                                              }}
                                                              onClick={() => {
                                                                handlereplydislike(
                                                                  y.dprid,
                                                                  x.comment
                                                                    .ddpid,
                                                                  index
                                                                );
                                                              }}
                                                            >
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="22"
                                                                height="22"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                              >
                                                                <path
                                                                  d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z"
                                                                  fill="currentColor"
                                                                />
                                                              </svg>
                                                            </button>
                                                            <button
                                                              className={
                                                                user.first_name ===
                                                                  y.user_details
                                                                    .first_name
                                                                  ? "bg-transparent border-0 d-flex align-items-center"
                                                                  : "d-none"
                                                              }
                                                              onClick={() => {
                                                                deleteReply(
                                                                  y.dprid,
                                                                  x.comment
                                                                    .ddpid,
                                                                  index
                                                                );
                                                              }}
                                                              style={{
                                                                height: "20px",
                                                              }}
                                                            >
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="22"
                                                                height="22"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                              >
                                                                <path
                                                                  d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z"
                                                                  fill="#808080"
                                                                />
                                                              </svg>
                                                            </button>
                                                          </div>
                                                        </div>
                                                        <div className="ps-5 py-2">
                                                          <p
                                                            className="m-0"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            {y.post}
                                                          </p>
                                                          {y.image.map((a) => {
                                                            return (
                                                              <div className="">
                                                                <img
                                                                  src={a.image}
                                                                  style={{
                                                                    width:
                                                                      "250px",
                                                                  }}
                                                                  alt="shw-pdf"
                                                                  className="mt-3"
                                                                />
                                                              </div>
                                                            );
                                                          })}
                                                        </div>
                                                        {/* -----------------------------------------------Replies for Reply layout----------------------------------------------- */}
                                                        <div className="ps-5">
                                                          <span
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#replyforreply_modal"
                                                            onClick={() => {
                                                              setdiscuss_id(
                                                                x.comment.ddpid
                                                              );
                                                              setreply_id(
                                                                y.dprid
                                                              );
                                                            }}
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            className="px-2 reply_for_reply fw-bold d-flex align-items-center"
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              width="24"
                                                              height="24"
                                                              viewBox="0 0 24 24"
                                                              fill="none"
                                                            >
                                                              <path
                                                                d="M19 18.0001V15.0001C19 14.0385 18.6571 13.2148 17.9712 12.5289C17.2853 11.843 16.4615 11.5001 15.5 11.5001H5.92115L10.0212 15.6001L9.3077 16.3078L4 11.0001L9.3077 5.69238L10.0212 6.40008L5.92115 10.5001H15.5C16.7423 10.5001 17.8029 10.9395 18.6817 11.8184C19.5606 12.6972 20 13.7578 20 15.0001V18.0001H19Z"
                                                                fill="#2A3941"
                                                              />
                                                            </svg>{" "}
                                                            <span className="ms-1">
                                                              Reply
                                                            </span>
                                                          </span>

                                                          {/* <p style={{ cursor: 'pointer' }} className={`view_reply_for_reply mt-2 px-2 mb-0 ${y.replies_count > 0 ? '' : 'd-none'}`} onClick={() => {
                                                                                                        setreplies_for_reply_status(!replies_for_reply_status)
                                                                                                        getreplies_for_reply(y.dprid)
                                                                                                    }}>---View {y.replies_count} replies</p> */}
                                                          {!replies_for_reply_status ? (
                                                            <p
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                              className={`view_reply_for_reply mt-2 mb-0 ${y.replies_count >
                                                                0
                                                                ? ""
                                                                : "d-none"
                                                                }`}
                                                              onClick={() => {
                                                                setreplies_for_reply_status(
                                                                  !replies_for_reply_status
                                                                );
                                                                getreplies_for_reply(
                                                                  y.dprid
                                                                );
                                                                setSelectedReplyOfReply(
                                                                  index2
                                                                );
                                                              }}
                                                            >
                                                              ---View{" "}
                                                              {y.replies_count}{" "}
                                                              replies
                                                            </p>
                                                          ) : selectedReplyOfReply ==
                                                            index2 ? (
                                                            <p
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                              className={`view_reply_for_reply mt-2 mb-0 ${y.replies_count >
                                                                0
                                                                ? ""
                                                                : "d-none"
                                                                }`}
                                                              onClick={() => {
                                                                setreplies_for_reply_status(
                                                                  !replies_for_reply_status
                                                                );
                                                                getreplies_for_reply(
                                                                  y.dprid
                                                                );
                                                                setSelectedReplyOfReply(
                                                                  null
                                                                );
                                                              }}
                                                            >
                                                              {"View less"}
                                                            </p>
                                                          ) : (
                                                            <p
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                              className={`view_reply_for_reply mt-2 mb-0 ${y.replies_count >
                                                                0
                                                                ? ""
                                                                : "d-none"
                                                                }`}
                                                              onClick={() => {
                                                                setreplies_for_reply_status(
                                                                  !replies_for_reply_status
                                                                );
                                                                getreplies_for_reply(
                                                                  y.dprid
                                                                );
                                                                setSelectedReplyOfReply(
                                                                  index2
                                                                );
                                                              }}
                                                            >
                                                              ---View{" "}
                                                              {y.replies_count}{" "}
                                                              replies
                                                            </p>
                                                          )}
                                                          {fetchedreplies_for_reply &&
                                                            fetchedreplies_for_reply.length >
                                                            0 && (
                                                              <div
                                                                className={
                                                                  fetchedreplies_for_reply[0]
                                                                    .reply ==
                                                                    y.dprid &&
                                                                    replies_for_reply_status
                                                                    ? "d-block"
                                                                    : "d-none"
                                                                }
                                                              >
                                                                {fetchedreplies_for_reply.map(
                                                                  (z) => {
                                                                    return (
                                                                      <div
                                                                        className={`py-2 px-2 bg-white`}
                                                                        onClick={() => {
                                                                          setindex1(
                                                                            -1
                                                                          );
                                                                        }}
                                                                      >
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                          <div className="d-flex align-items-center gap-2">
                                                                            <div className="d-flex justify-content-center">
                                                                              <img
                                                                                src={
                                                                                  z
                                                                                    .user_id
                                                                                    .profile_pic
                                                                                }
                                                                                className={
                                                                                  z
                                                                                    .user_id
                                                                                    .profile_pic ==
                                                                                    null
                                                                                    ? "d-none"
                                                                                    : "rounded-circle"
                                                                                }
                                                                                width={
                                                                                  30
                                                                                }
                                                                                height={
                                                                                  30
                                                                                }
                                                                                alt="shw-pdf"
                                                                              />
                                                                              <p
                                                                                className={
                                                                                  z
                                                                                    .user_id
                                                                                    .profile_pic ==
                                                                                    null
                                                                                    ? "bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center"
                                                                                    : "d-none"
                                                                                }
                                                                                style={{
                                                                                  fontSize:
                                                                                    "14px",
                                                                                  height:
                                                                                    "30px",
                                                                                  width:
                                                                                    "30px",
                                                                                }}
                                                                              >
                                                                                <span>
                                                                                  {z?.user_id?.nickname ? z.user_id.nickname.slice(0, 1) : "user"}
                                                                                </span>
                                                                                <span>
                                                                                  {z?.user_id?.nickname ? z.user_id.nickname.slice(0, 1) : "user"}
                                                                                </span>
                                                                              </p>
                                                                            </div>
                                                                            <div
                                                                              className={`ps-2`}
                                                                            >
                                                                              <h6
                                                                                className="ms-sm-0 my-0"
                                                                                style={{
                                                                                  fontSize:
                                                                                    "12px",
                                                                                }}
                                                                              >
                                                                                <Link
                                                                                  to={`/profile/${z.user_id.user_id}`}
                                                                                  className="text-decoration-none text-dark"
                                                                                >
                                                                                  {
                                                                                    z
                                                                                      .user_id
                                                                                      .nickname
                                                                                  }
                                                                                </Link>
                                                                              </h6>
                                                                              <p
                                                                                className="ms-sm-0 my-0"
                                                                                style={{
                                                                                  fontSize:
                                                                                    "13px",
                                                                                }}
                                                                              >
                                                                                {
                                                                                  z.created_at
                                                                                }
                                                                              </p>
                                                                            </div>
                                                                          </div>
                                                                          <div
                                                                            className={`d-flex gap-2 align-items-center`}
                                                                          >
                                                                            <button
                                                                              className="bg-transparent border-0 d-flex align-items-center"
                                                                              style={{
                                                                                height:
                                                                                  "20px",
                                                                                color:
                                                                                  z.liked_status
                                                                                    ? "#ff845d"
                                                                                    : "gray",
                                                                              }}
                                                                              onClick={() => {
                                                                                handleReplies_reply_like(
                                                                                  z.id,
                                                                                  y.dprid
                                                                                );
                                                                              }}
                                                                            >
                                                                              <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="22"
                                                                                height="22"
                                                                                viewBox="0 0 30 30"
                                                                                fill="none"
                                                                              >
                                                                                <path
                                                                                  d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z"
                                                                                  fill="currentColor"
                                                                                />
                                                                              </svg>{" "}
                                                                              <span
                                                                                className="ms-1"
                                                                                style={{
                                                                                  fontSize:
                                                                                    "14px",
                                                                                }}
                                                                              >
                                                                                {
                                                                                  z.like_count
                                                                                }
                                                                              </span>
                                                                            </button>
                                                                            <button
                                                                              className="bg-transparent border-0 d-flex align-items-center"
                                                                              style={{
                                                                                height:
                                                                                  "20px",
                                                                                color:
                                                                                  z.dis_liked_status
                                                                                    ? "#ff845d"
                                                                                    : "gray",
                                                                              }}
                                                                              onClick={() => {
                                                                                handlereplies_replydislike(
                                                                                  z.id,
                                                                                  y.dprid
                                                                                );
                                                                              }}
                                                                            >
                                                                              <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="22"
                                                                                height="22"
                                                                                viewBox="0 0 30 30"
                                                                                fill="none"
                                                                              >
                                                                                <path
                                                                                  d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z"
                                                                                  fill="currentColor"
                                                                                />
                                                                              </svg>
                                                                            </button>
                                                                            <button
                                                                              className={
                                                                                user.first_name ===
                                                                                  z
                                                                                    .user_id
                                                                                    .first_name
                                                                                  ? "bg-transparent border-0 d-flex align-items-center"
                                                                                  : "d-none"
                                                                              }
                                                                              onClick={() => {
                                                                                deleteReply_for_reply(
                                                                                  z.id,
                                                                                  y.dprid,
                                                                                  x
                                                                                    .comment
                                                                                    .ddpid
                                                                                );
                                                                              }}
                                                                              style={{
                                                                                height:
                                                                                  "20px",
                                                                              }}
                                                                            >
                                                                              <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="22"
                                                                                height="22"
                                                                                viewBox="0 0 30 30"
                                                                                fill="none"
                                                                              >
                                                                                {" "}
                                                                                <path
                                                                                  d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z"
                                                                                  fill="#808080"
                                                                                />{" "}
                                                                              </svg>
                                                                            </button>
                                                                          </div>
                                                                        </div>
                                                                        <div
                                                                          className={`ps-5`}
                                                                        >
                                                                          <p
                                                                            className="m-0"
                                                                            style={{
                                                                              fontSize:
                                                                                "14px",
                                                                            }}
                                                                          >
                                                                            {
                                                                              z.post
                                                                            }
                                                                          </p>
                                                                          {z.images_attached.map(
                                                                            (
                                                                              b
                                                                            ) => {
                                                                              return (
                                                                                <div className="d-flex justify-content-center">
                                                                                  <img
                                                                                    src={
                                                                                      b.images
                                                                                    }
                                                                                    width={
                                                                                      260
                                                                                    }
                                                                                    alt="shw-pdf"
                                                                                    className="mt-3"
                                                                                  />
                                                                                </div>
                                                                              );
                                                                            }
                                                                          )}
                                                                        </div>
                                                                      </div>
                                                                    );
                                                                  }
                                                                )}
                                                              </div>
                                                            )}
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            )}
                                          {/* --------------Reply for the particular post in the discussion--------------------------- */}
                                          <div
                                            className="d-flex gap-2 py-2 px-2 border-secondary-subtle align-items-center"
                                            onClick={() => {
                                              setindex1(-1);
                                            }}
                                          >
                                            <img
                                              src={userdetails.profile_pic}
                                              className={
                                                userdetails.profile_pic == null
                                                  ? "d-none"
                                                  : "rounded-circle"
                                              }
                                              width={30}
                                              height={30}
                                              alt="shw-pdf"
                                            />
                                            {userdetails.nickname !=
                                              undefined ? (
                                              <p
                                                className={
                                                  userdetails.profile_pic ==
                                                    null
                                                    ? "d-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto"
                                                    : "d-none"
                                                }
                                                style={{
                                                  fontSize: "14px",
                                                  height: "40px",
                                                  width: "40px",
                                                }}
                                              >
                                                <span>
                                                  {userdetails?.nickname ? userdetails.nickname.slice(0, 1) : "user"}
                                                </span>
                                                <span>
                                                  {userdetails?.nickname ? userdetails.nickname.slice(0, 1) : "user"}
                                                </span>
                                              </p>
                                            ) : (
                                              <></>
                                            )}
                                            <form
                                              className="w-100"
                                              onSubmit={(e) =>
                                                postReplies(
                                                  e,
                                                  x.comment.ddpid,
                                                  index
                                                )
                                              }
                                            >
                                              <div className="input-group border rounded bg-light">
                                                <input
                                                  key={index}
                                                  type="text"
                                                  name={post}
                                                  onChange={(e) => {
                                                    repliesData(e);
                                                    setSelectedPostForComment(
                                                      x.comment.ddpid
                                                    );
                                                  }}
                                                  className="form-control py-1 ps-3 shadow-none border-0 bg-light originalreply-input"
                                                  placeholder="Post your Reply..."
                                                  style={{
                                                    position: "relative",
                                                  }}
                                                />
                                                <div className="d-flex gap-2 align-items-center bg-light">
                                                  <input
                                                    id="file"
                                                    type="file"
                                                    name="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleReplyImage}
                                                    className="bg-light text-center p-3 btn"
                                                  />
                                                  <label
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="Attach Image"
                                                    htmlFor="file"
                                                    className="custom-file-input bg-transparent border-0 py-2"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="25"
                                                      height="25"
                                                      viewBox="0 0 25 25"
                                                      fill="none"
                                                    >
                                                      <path
                                                        d="M18.0691 16.1859C18.0691 17.7637 17.5255 19.1063 16.4385 20.2138C15.3514 21.3213 14.0219 21.875 12.4501 21.875C10.8782 21.875 9.54541 21.3213 8.45166 20.2138C7.35791 19.1063 6.81104 17.7637 6.81104 16.1859V7.09135C6.81104 5.98958 7.18998 5.05308 7.94786 4.28185C8.70574 3.51062 9.63557 3.125 10.7373 3.125C11.8391 3.125 12.7689 3.51062 13.5268 4.28185C14.2847 5.05308 14.6636 5.98958 14.6636 7.09135V15.7051C14.6636 16.3168 14.4502 16.8436 14.0234 17.2857C13.5966 17.7277 13.0764 17.9487 12.4629 17.9487C11.8494 17.9487 11.3216 17.7312 10.8796 17.296C10.4375 16.8609 10.2165 16.3306 10.2165 15.7051V7.05128H11.2582V15.7051C11.2582 16.0377 11.372 16.3211 11.5997 16.5555C11.8274 16.7899 12.1075 16.9071 12.44 16.9071C12.7726 16.9071 13.0527 16.7899 13.2804 16.5555C13.5081 16.3211 13.6219 16.0377 13.6219 15.7051V7.0713C13.6179 6.26201 13.3397 5.57559 12.7872 5.01203C12.2348 4.44845 11.5515 4.16667 10.7373 4.16667C9.92965 4.16667 9.24695 4.45179 8.68924 5.02203C8.13155 5.59227 7.8527 6.28205 7.8527 7.09135V16.1859C7.84871 17.472 8.29409 18.568 9.18885 19.4742C10.0836 20.3803 11.1731 20.8333 12.4573 20.8333C13.7234 20.8333 14.7996 20.3803 15.6859 19.4742C16.5722 18.568 17.0194 17.472 17.0274 16.1859V7.05128H18.0691V16.1859Z"
                                                        fill="#8E9696"
                                                      />
                                                    </svg>
                                                  </label>
                                                  <button
                                                    disabled={
                                                      replies.length > 0
                                                        ? false
                                                        : true
                                                    }
                                                    type="submit"
                                                    className="h-100 bg-transparent border-0"
                                                  >
                                                    <div
                                                      style={{ width: "25px" }}
                                                      className={`${load &&
                                                        selectedPostForComment ==
                                                        x.comment.ddpid
                                                        ? ""
                                                        : "d-none"
                                                        }`}
                                                    >
                                                      <div
                                                        className={`spinner-border spinner-border-sm`}
                                                        role="status"
                                                      >
                                                        <span className="visually-hidden">
                                                          Loading...
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <svg
                                                      data-bs-toggle="tooltip"
                                                      data-bs-placement="top"
                                                      data-bs-custom-class="custom-tooltip"
                                                      data-bs-title="Post"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className={`${load &&
                                                        selectedPostForComment ==
                                                        x.comment.ddpid
                                                        ? "d-none"
                                                        : ""
                                                        }`}
                                                      width="25"
                                                      height="25"
                                                      viewBox="0 0 25 25"
                                                      fill="none"
                                                    >
                                                      <path
                                                        d="M4.1665 19.2707V5.729L20.2322 12.4998L4.1665 19.2707ZM5.20817 17.7082L17.5519 12.4998L5.20817 7.2915V11.338L10.2562 12.4998L5.20817 13.6617V17.7082Z"
                                                        fill="#8E9696"
                                                      />
                                                    </svg>
                                                  </button>
                                                </div>
                                              </div>
                                            </form>
                                          </div>
                                          {replyImage.length > 0 &&
                                            replyImage.map((image, index) => (
                                              <div className="d-flex gap-3 mt-3">
                                                <div
                                                  key={index}
                                                  className="image-preview bg-light p-2"
                                                  style={{
                                                    position: "relative",
                                                  }}
                                                >
                                                  <img
                                                    src={URL.createObjectURL(
                                                      image
                                                    )}
                                                    width={50}
                                                    alt={`Selected Image ${index + 1
                                                      }`}
                                                  />
                                                  <button
                                                    style={{
                                                      position: "absolute",
                                                      top: "-10px",
                                                      right: "-16px",
                                                    }}
                                                    className="btn btn-sm"
                                                    onClick={() =>
                                                      removeImage(index)
                                                    }
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="16"
                                                      height="16"
                                                      fill="currentColor"
                                                      className="bi bi-x-circle"
                                                      viewBox="0 0 16 16"
                                                    >
                                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                                    </svg>
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-muted text-center">
                                    No post found.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        }
                        {/* </div> */}
                      </div>
                    </div>
                  </div>

                  {/* END OF EDIT POST */}
                  {/* ---------------------------------------------Display PDF layout Section----------------------------------------------- */}
                  {
                    <div
                      className={`col-lg-8 mx-auto ${discussionpagelayout ? "d-none" : ""
                        }`}
                      id="btn"
                      style={{
                        position: "relative",
                        display:
                          isMobile && !previewbtnstate ? "none" : "block",
                      }}
                    >
                      <div
                        className="mx-auto"
                        id="pdf-div"
                        style={{ width: documentpagelayout ? "802px" : "100%" }}
                      >
                        {!isSticky && (
                          <>
                            {/* Read the PDF */}
                            <span
                              data-bs-toggle="tooltip"
                              data-bs-placement="left"
                              data-bs-custom-class="custom-tooltip"
                              data-bs-title="Read the Pdf"
                              className="pdf-rounded-arrow-icon"
                              onClick={() =>
                                setdocumentpagelayout(!documentpagelayout)
                              }
                              style={{
                                height: "30px",
                                width: "30px",
                                cursor: "pointer",
                                position: "absolute",
                                marginLeft: "-15px",
                                // right: "0px",
                                top: "10px",
                              }}
                            >
                              <i
                                className={`fas ${documentpagelayout
                                  ? "fa-caret-right"
                                  : "fa-caret-left"
                                  }`}
                                style={{
                                  color: "#5d5fe3",
                                  fontSize: "31px",
                                  marginLeft: `${!documentpagelayout ? "4px" : "-1px"
                                    }`,
                                  marginTop: "14px",
                                }}
                              ></i>
                            </span>
                          </>
                        )}

                        {/* ------------------------------------------------Buttons for document------------------------------------------------ */}
                        <div>
                          <div
                            className={`button-for-document button-container rounded d-flex justify-content-center align-items-center border border-bottom-0 py-1 mb-2  ${isSticky ? "sticky2" : ""
                              }`}
                            style={{ backgroundColor: "#5d5fe3" }}
                          >
                            <button
                              className="btn text-white btn-sm border-0 me-2"
                              onClick={handleZoomIn}
                              disabled={pageScale >= 2}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="35"
                                height="35"
                                viewBox="0 0 35 35"
                                fill="none"
                              >
                                <path
                                  d="M28.415 29.3908L19.2835 20.2594C18.5544 20.8802 17.7158 21.3606 16.7679 21.7009C15.82 22.0412 14.8674 22.2113 13.9101 22.2113C11.5743 22.2113 9.59752 21.4028 7.97962 19.7858C6.3617 18.1688 5.55273 16.193 5.55273 13.8585C5.55273 11.524 6.36125 9.54674 7.97827 7.92668C9.59529 6.30661 11.5711 5.49658 13.9056 5.49658C16.2401 5.49658 18.2174 6.30553 19.8374 7.92343C21.4575 9.54133 22.2675 11.5182 22.2675 13.854C22.2675 14.8673 22.088 15.8479 21.729 16.7959C21.3701 17.7438 20.8989 18.5543 20.3156 19.2274L29.447 28.3588L28.415 29.3908ZM13.9101 20.753C15.8452 20.753 17.4788 20.0869 18.811 18.7548C20.1431 17.4227 20.8092 15.7891 20.8092 13.854C20.8092 11.9189 20.1431 10.2853 18.811 8.95313C17.4788 7.62099 15.8452 6.95492 13.9101 6.95492C11.975 6.95492 10.3414 7.62099 9.00928 8.95313C7.67716 10.2853 7.0111 11.9189 7.0111 13.854C7.0111 15.7891 7.67716 17.4227 9.00928 18.7548C10.3414 20.0869 11.975 20.753 13.9101 20.753ZM13.1809 17.3315V14.5831H10.4326V13.1248H13.1809V10.3764H14.6393V13.1248H17.3877V14.5831H14.6393V17.3315H13.1809Z"
                                  fill="white"
                                />
                              </svg>
                            </button>
                            {/* <span className="border border-white rounded text-white py-2 px-2" style={{ fontSize: '14px', width: '50px' }}><span className={pageScale === 1 ? '' : 'd-none'}>100</span>
                                                        <span className={pageScale <= 2 ? '' : 'd-none'}>200</span>
                                                        <span className={pageScale <= 1.8 ? '' : 'd-none'}>180</span>
                                                        <span className={pageScale <= 1.6 ? '' : 'd-none'}>160</span>
                                                        <span className={pageScale === 1.4 ? '' : 'd-none'}>140</span>
                                                        <span className={pageScale === 1.2 ? '' : 'd-none'}>120</span>
                                                        <span className={pageScale === 0.8 ? '' : 'd-none'}>80</span>
                                                        <span className={pageScale < 0.8 ? '' : 'd-none'}>50</span>
                                                        %</span> */}
                            <span
                              className="border border-white rounded text-white py-2 px-2"
                              style={{
                                fontSize: "14px",
                                width: "50px",
                                textAlign: "center",
                              }}
                            >
                              {Math.round(pageScale * 100)}%
                            </span>
                            <button
                              className="btn text-white btn-sm ms-2 border-0"
                              onClick={handleZoomOut}
                              disabled={pageScale <= 0.2}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="35"
                                height="35"
                                viewBox="0 0 35 35"
                                fill="none"
                              >
                                <path
                                  d="M28.415 29.3908L19.2835 20.2594C18.5544 20.8802 17.7158 21.3606 16.7679 21.7009C15.82 22.0412 14.8674 22.2113 13.9101 22.2113C11.5743 22.2113 9.59752 21.4028 7.97962 19.7858C6.3617 18.1688 5.55273 16.193 5.55273 13.8585C5.55273 11.524 6.36125 9.54674 7.97827 7.92668C9.59529 6.30661 11.5711 5.49658 13.9056 5.49658C16.2401 5.49658 18.2174 6.30553 19.8374 7.92343C21.4575 9.54133 22.2675 11.5182 22.2675 13.854C22.2675 14.8673 22.088 15.8479 21.729 16.7959C21.3701 17.7438 20.8989 18.5543 20.3156 19.2274L29.447 28.3588L28.415 29.3908ZM13.9101 20.753C15.8452 20.753 17.4788 20.0869 18.811 18.7548C20.1431 17.4227 20.8092 15.7891 20.8092 13.854C20.8092 11.9189 20.1431 10.2853 18.811 8.95313C17.4788 7.62099 15.8452 6.95492 13.9101 6.95492C11.975 6.95492 10.3414 7.62099 9.00928 8.95313C7.67716 10.2853 7.0111 11.9189 7.0111 13.854C7.0111 15.7891 7.67716 17.4227 9.00928 18.7548C10.3414 20.0869 11.975 20.753 13.9101 20.753ZM10.6008 14.5831V13.1248H17.2194V14.5831H10.6008Z"
                                  fill="white"
                                />
                              </svg>
                            </button>

                            {pdfurldata &&
                              pdfurldata.documnet_id &&
                              pdfurldata.documnet_id.document_url != undefined ? (
                              <button
                                className="btn text-white btn-sm ms-4 border-0"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                data-bs-custom-class="custom-tooltip"
                                data-bs-title="Download the Pdf"
                                onClick={() => {
                                  downloadPDF(
                                    pdfurldata.documnet_id.document_url
                                  );
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="35"
                                  height="35"
                                  viewBox="0 0 35 35"
                                  fill="none"
                                >
                                  <path
                                    d="M9.479 27.7088C7.65983 27.7088 6.11129 27.074 4.83337 25.8045C3.55546 24.535 2.9165 22.9907 2.9165 21.1715C2.9165 19.5 3.48768 18.0165 4.63005 16.7208C5.77241 15.4251 7.19241 14.7296 8.89006 14.6342C9.13498 12.8282 10.0418 11.1679 11.6104 9.65348C13.1791 8.13905 14.8991 7.38184 16.7707 7.38184C17.1614 7.38184 17.5022 7.52721 17.7929 7.81795C18.0836 8.10869 18.229 8.44944 18.229 8.8402V19.458L21.2354 16.4684L22.2675 17.5004L17.4998 22.2681L12.7322 17.5004L13.7642 16.4684L16.7707 19.458V8.8402C14.9421 8.91871 13.3913 9.71378 12.118 11.2254C10.8448 12.737 10.2082 14.3426 10.2082 16.0421H9.479C8.06928 16.0421 6.86616 16.5404 5.86963 17.5369C4.8731 18.5334 4.37484 19.7366 4.37484 21.1463C4.37484 22.556 4.8731 23.7591 5.86963 24.7557C6.86616 25.7522 8.06928 26.2504 9.479 26.2504H26.979C27.9998 26.2504 28.8627 25.898 29.5675 25.1932C30.2724 24.4883 30.6248 23.6254 30.6248 22.6046C30.6248 21.5838 30.2724 20.7209 29.5675 20.0161C28.8627 19.3112 27.9998 18.9588 26.979 18.9588H24.7915V16.0421C24.7915 14.8381 24.5241 13.7317 23.9894 12.723C23.4547 11.7143 22.7498 10.8763 21.8748 10.2088V8.47278C23.2434 9.22999 24.3147 10.2868 25.0888 11.6433C25.8628 12.9997 26.2498 14.466 26.2498 16.0421V17.5004H27.1473C28.5439 17.5453 29.7157 18.0581 30.6627 19.0387C31.6097 20.0193 32.0832 21.208 32.0832 22.6046C32.0832 24.0349 31.59 25.2432 30.6038 26.2294C29.6176 27.2157 28.4093 27.7088 26.979 27.7088H9.479Z"
                                    fill="white"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <></>
                            )}
                            <span
                              style={{ cursor: "pointer" }}
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              data-bs-custom-class="custom-tooltip"
                              data-bs-title="Read the Pdf"
                              className="text-white ms-4 d-flex justify-content-center align-items-center"
                              onClick={() => {
                                setview_pdf_status(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="35"
                                height="35"
                                viewBox="0 0 35 35"
                                fill="none"
                              >
                                <path
                                  d="M20.2482 13.9886V12.6312C21.0316 12.2348 21.8706 11.9376 22.7653 11.7394C23.6599 11.5412 24.5784 11.4421 25.5207 11.4421C26.0591 11.4421 26.5761 11.4767 27.0716 11.5459C27.567 11.615 28.0784 11.7132 28.6056 11.8403V13.1641C28.097 13.0014 27.6011 12.8888 27.1178 12.8261C26.6345 12.7635 26.1021 12.7322 25.5207 12.7322C24.5784 12.7322 23.6585 12.8383 22.7611 13.0505C21.8636 13.2627 21.026 13.5754 20.2482 13.9886ZM20.2482 21.9533V20.5399C20.9942 20.1435 21.8286 19.8462 22.7512 19.648C23.6739 19.4498 24.5971 19.3507 25.5207 19.3507C26.0591 19.3507 26.5761 19.3853 27.0716 19.4545C27.567 19.5237 28.0784 19.6218 28.6056 19.749V21.0727C28.097 20.9101 27.6011 20.7974 27.1178 20.7348C26.6345 20.6721 26.1021 20.6408 25.5207 20.6408C24.5784 20.6408 23.6585 20.7549 22.7611 20.983C21.8636 21.2111 21.026 21.5345 20.2482 21.9533ZM20.2482 17.999V16.5855C21.0316 16.1892 21.8706 15.8919 22.7653 15.6937C23.6599 15.4955 24.5784 15.3964 25.5207 15.3964C26.0591 15.3964 26.5761 15.431 27.0716 15.5002C27.567 15.5694 28.0784 15.6675 28.6056 15.7947V17.1184C28.097 16.9557 27.6011 16.8431 27.1178 16.7804C26.6345 16.7178 26.1021 16.6865 25.5207 16.6865C24.5784 16.6865 23.6585 16.8019 22.7611 17.0328C21.8636 17.2637 21.026 17.5858 20.2482 17.999ZM9.479 23.3892C10.7523 23.3892 11.9904 23.5355 13.1936 23.8281C14.3967 24.1207 15.5891 24.597 16.7707 25.257V10.9485C15.718 10.1969 14.5579 9.63322 13.2903 9.2574C12.0227 8.88161 10.7523 8.69372 9.479 8.69372C8.604 8.69372 7.8379 8.74606 7.18071 8.85075C6.52353 8.95546 5.79391 9.1499 4.99182 9.43408C4.76746 9.50887 4.60854 9.61637 4.51506 9.75659C4.42158 9.89683 4.37484 10.0511 4.37484 10.2194V23.3668C4.37484 23.6285 4.46832 23.8202 4.65527 23.9417C4.84226 24.0632 5.04792 24.0772 5.27226 23.9838C5.80511 23.8043 6.4207 23.6603 7.11902 23.5519C7.81734 23.4434 8.604 23.3892 9.479 23.3892ZM18.229 25.257C19.4106 24.597 20.603 24.1207 21.8061 23.8281C23.0092 23.5355 24.2474 23.3892 25.5207 23.3892C26.3957 23.3892 27.1823 23.4434 27.8807 23.5519C28.579 23.6603 29.1946 23.8043 29.7274 23.9838C29.9518 24.0772 30.1574 24.0632 30.3444 23.9417C30.5314 23.8202 30.6248 23.6285 30.6248 23.3668V10.2194C30.6248 10.0511 30.5781 9.90151 30.4846 9.77063C30.3911 9.63974 30.2322 9.52756 30.0079 9.43408C29.2058 9.1499 28.4761 8.95546 27.819 8.85075C27.1618 8.74606 26.3957 8.69372 25.5207 8.69372C24.2474 8.69372 22.977 8.88161 21.7094 9.2574C20.4418 9.63322 19.2816 10.1969 18.229 10.9485V25.257ZM17.4998 27.3716C16.3145 26.5602 15.0412 25.9366 13.6801 25.501C12.319 25.0654 10.9186 24.8476 9.479 24.8476C8.71992 24.8476 7.97439 24.9111 7.24243 25.0383C6.51045 25.1654 5.79764 25.3692 5.104 25.6497C4.5749 25.8609 4.07803 25.7973 3.6134 25.4589C3.1488 25.1205 2.9165 24.6531 2.9165 24.0567V9.96134C2.9165 9.60048 3.01138 9.2658 3.20113 8.95732C3.39091 8.64883 3.65688 8.43382 3.99902 8.31229C4.85533 7.93461 5.74623 7.6607 6.67171 7.49056C7.59719 7.32042 8.53296 7.23535 9.479 7.23535C10.9074 7.23535 12.3008 7.44101 13.6591 7.85233C15.0174 8.26366 16.2976 8.86195 17.4998 9.64722C18.702 8.86195 19.9823 8.26366 21.3406 7.85233C22.6989 7.44101 24.0923 7.23535 25.5207 7.23535C26.4667 7.23535 27.4025 7.32042 28.328 7.49056C29.2534 7.6607 30.1443 7.93461 31.0006 8.31229C31.3428 8.43382 31.6088 8.64883 31.7985 8.95732C31.9883 9.2658 32.0832 9.60048 32.0832 9.96134V24.0567C32.0832 24.6531 31.8322 25.1112 31.3302 25.4309C30.8282 25.7506 30.2939 25.8048 29.7274 25.5935C29.0525 25.3318 28.363 25.142 27.6591 25.0242C26.9552 24.9065 26.2423 24.8476 25.5207 24.8476C24.081 24.8476 22.6807 25.0654 21.3195 25.501C19.9584 25.9366 18.6852 26.5602 17.4998 27.3716Z"
                                  fill="#fff"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                        {loading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        {isNotify && (
                          <div className="waviy" style={{ width: "100%" }}>
                            <center>
                              <span style={{ "--i": 1 }}>
                                click to set a markup on the desired location.”
                              </span>
                            </center>
                          </div>
                        )}
                        {!loading && !error && (
                          <div
                            id="pdf-container"
                            className="border pdf-layout d-flex justify-content-center pdf"
                            style={{
                              position: "relative",
                              marginBottom: "20px",
                              zIndex: "1px",
                              width: "100%",
                            }}
                          >
                            {pdfurldata &&
                              Object.keys(pdfurldata).length > 0 &&
                              pdfurldata?.documnet_id && (
                                <div
                                  className="pdf-container"
                                  style={{
                                    height: isTourOpen ? "40vh" : "",
                                    overflowY: "scroll",
                                    position: "relative",
                                    background: "#f5f5f5",
                                    userSelect: "none",
                                  }}
                                >
                                  <Document
                                    file={pdfurldata.documnet_id.document_url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                  >
                                    {Array.from(
                                      new Array(numPages),
                                      (_, index) => (
                                        <div
                                          id={`page-container-${index + 1}`}
                                          key={`page_${index + 1}`}
                                          className="pdf-page-container"
                                          style={{
                                            position: "relative",
                                            marginBottom: "20px",
                                          }}
                                          onClick={(e) => {
                                            activateRectangleNew(e, index + 1); // Pass the page index
                                          }}
                                        >
                                          <Page
                                            pageNumber={index + 1}
                                            width={800}
                                            scale={pageScale}
                                            style={{
                                              display:
                                                index + 1 === currentPage
                                                  ? "block"
                                                  : "none",
                                              pointerEvents: "none",
                                              userSelect: "none",
                                            }}
                                          />

                                          {/* Highlights */}
                                          {highlights
                                            .filter(
                                              (highlight) =>
                                                highlight.page === index + 1
                                            )
                                            .map((highlight, idx) => {
                                              const adjustedStyle =
                                                adjustHighlightPosition(
                                                  highlight
                                                );
                                              return (
                                                <div
                                                  key={idx}
                                                  className={`highlight-box ${view_mark_id === highlight
                                                    ? "markup-color1"
                                                    : "markup-color2"
                                                    }`}
                                                  style={{
                                                    position: "absolute",
                                                    top: adjustedStyle.top,
                                                    left: adjustedStyle.left,
                                                    width: adjustedStyle.width,
                                                    height:
                                                      adjustedStyle.height,
                                                  }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isMobile) {
                                                      setpreviewbtnstate((prev) => !prev);
                                                      setTimeout(() => {
                                                        scrollToPOST(highlight);
                                                        setview_mark_id(highlight);
                                                      }, 300)
                                                    } else if (!discussionpagelayout) {
                                                      setdocumentpagelayout(false)
                                                      setTimeout(() => {
                                                        scrollToPOST(highlight);
                                                        setview_mark_id(highlight);
                                                      }, 300)
                                                    } else {
                                                      scrollToPOST(highlight);
                                                      setview_mark_id(highlight);
                                                    }
                                                  }}
                                                />
                                              );
                                            })}

                                          {/* Render RND selection */}
                                          {selection &&
                                            selection.page === index + 1 && (
                                              <Rnd
                                                bounds="parent"
                                                ref={rndRef}
                                                size={{
                                                  width:
                                                    selection.width * pageScale,
                                                  height:
                                                    selection.height *
                                                    pageScale,
                                                }}
                                                position={{
                                                  x: selection.x * pageScale,
                                                  y: selection.y * pageScale,
                                                }}
                                                onDragStop={(e, d) =>
                                                  setSelection({
                                                    ...selection,
                                                    x: d.x / pageScale, // Normalize to original scale
                                                    y: d.y / pageScale, // Normalize to original scale
                                                  })
                                                }
                                                onResizeStop={(
                                                  e,
                                                  direction,
                                                  ref,
                                                  delta,
                                                  position
                                                ) => {
                                                  setSelection({
                                                    x: position.x / pageScale,
                                                    y: position.y / pageScale,
                                                    width:
                                                      parseInt(
                                                        ref.style.width,
                                                        10
                                                      ) / pageScale,
                                                    height:
                                                      parseInt(
                                                        ref.style.height,
                                                        10
                                                      ) / pageScale,
                                                    page: selection.page,
                                                  });
                                                }}
                                                className="selection-box"
                                              >
                                                <button
                                                  id="askQuestion"
                                                  onClick={() => {
                                                    setIsModalOpen(true);
                                                  }}
                                                  className="btn btn-primary btn-sm"
                                                >
                                                  Ask Question
                                                </button>
                                              </Rnd>
                                            )}
                                        </div>
                                      )
                                    )}
                                  </Document>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  }

                  {/* ---------------------------------------Display PDF layout Section for mobile screen----------------------------------------------- */}
                </div>
              </div>

              {/* -------------------------------------POST MODAL----------------------------------------------------------------- */}
              <Modal
                isOpen={isModalOpen}
                toggle={() => setIsModalOpen(!isModalOpen)}
                centered
                size="lg"
              >
                <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>
                  Post Your Comments
                </ModalHeader>
                <ModalBody>
                  <div className="col-12 bg-white px-lg-3 pt-2">
                    <div className="d-flex gap-1 gap-lg-3 align-items-center">
                      <img
                        src={userdetails.profile_pic}
                        className={
                          userdetails.profile_pic ? "rounded-circle" : "d-none"
                        }
                        width={40}
                        height={40}
                        alt="shw-pdf"
                      />
                      {userdetails.nickname && !userdetails.profile_pic ? (
                        <p
                          className="d-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto"
                          style={{
                            fontSize: "14px",
                            height: "40px",
                            width: "40px",
                          }}
                        >
                          <span>{userdetails?.nickname ? userdetails.nickname.slice(0, 1) : "user"}</span>
                          <span>{userdetails?.nickname ? userdetails.nickname.slice(-1) : "user"}</span>
                        </p>
                      ) : null}
                      <form className="w-100" onSubmit={(e) => postQuestion(e)}>
                        <div className="input-group bg-light rounded border py-1">
                          <Input
                            type="text"
                            name="question"
                            className="form-control border-0 bg-light py-1 ps-3"
                            value={discussionquestion}
                            onChange={questionData}
                            placeholder="Post your comment..."
                          />
                          <div className="bg-light">
                            <Input
                              id="fileInput"
                              type="file"
                              name="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="d-none"
                            />
                            <Label
                              htmlFor="fileInput"
                              className="custom-file-input bg-transparent border-0 px-lg-1 py-1 mb-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                              >
                                <path
                                  d="M21.6825 19.4231C21.6825 21.3164 21.0302 22.9276 19.7258 24.2565C18.4213 25.5855 16.8259 26.25 14.9397 26.25C13.0535 26.25 11.4541 25.5855 10.1416 24.2565C8.8291 22.9276 8.17285 21.3164 8.17285 19.4231V8.50962C8.17285 7.1875 8.62758 6.0637 9.53704 5.13822C10.4465 4.21274 11.5623 3.75 12.8844 3.75C14.2065 3.75 15.3223 4.21274 16.2318 5.13822C17.1412 6.0637 17.5959 7.1875 17.5959 8.50962V18.8462C17.5959 19.5801 17.3399 20.2123 16.8277 20.7428C16.3155 21.2732 15.6913 21.5385 14.9551 21.5385C14.2189 21.5385 13.5855 21.2774 13.0551 20.7552C12.5246 20.2331 12.2594 19.5967 12.2594 18.8462V8.46153H13.5094V18.8462C13.5094 19.2452 13.646 19.5853 13.9193 19.8666C14.1925 20.1478 14.5286 20.2885 14.9277 20.2885C15.3267 20.2885 15.6628 20.1478 15.9361 19.8666C16.2093 19.5853 16.3459 19.2452 16.3459 18.8462V8.48556C16.3411 7.51442 16.0072 6.69071 15.3443 6.01444C14.6814 5.33815 13.8614 5 12.8844 5C11.9152 5 11.0959 5.34215 10.4267 6.02644C9.75747 6.71073 9.42285 7.53846 9.42285 8.50962V19.4231C9.41806 20.9663 9.95252 22.2816 11.0262 23.369C12.1 24.4563 13.4073 25 14.9484 25C16.4677 25 17.7592 24.4563 18.8227 23.369C19.8863 22.2816 20.4229 20.9663 20.4325 19.4231V8.46153H21.6825V19.4231Z"
                                  fill="#8E9696"
                                />
                              </svg>
                            </Label>
                            <Button
                              type="submit"
                              className="cursor-pointer mb-0"
                              color="link"
                              size="sm"
                              disabled={discussionquestion.length === 0}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                              >
                                <path
                                  d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z"
                                  fill="#8E9696"
                                ></path>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <p
                      className="mt-1 ms-5"
                      style={{
                        color: "#ff845d",
                        fontSize: "13px",
                        fontStyle: "italic",
                      }}
                    >
                      *You can edit your post within 24 hours after posting
                    </p>
                    <div className="d-flex gap-3 mt-3">
                      {selectedImage.length > 0 &&
                        selectedImage.map((image, index) => (
                          <div
                            key={index}
                            className="image-preview bg-light p-2"
                            style={{ position: "relative" }}
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              width={50}
                              alt={`Selected Image ${index + 1}`}
                            />
                            <Button
                              color="link"
                              size="sm"
                              style={{
                                position: "absolute",
                                top: "-10px",
                                right: "-16px",
                              }}
                              onClick={() => removemainImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </ModalBody>
              </Modal>
              {/* -----------------------EDIT THE POST--------------------------------------------------------- */}
              <Modal
                isOpen={isModalPostEditOpen}
                toggle={togglePostEditModal}
                centered
                size="lg"
              >
                <ModalHeader toggle={togglePostEditModal}>
                  Create a Post
                </ModalHeader>
                <ModalBody>
                  <div className="bg-white px-3 pt-2 pb-3 rounded">
                    <h6 className="pb-2 ps-1">Create a Post</h6>
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        src={userdetails.profile_pic}
                        width={40}
                        height={40}
                        alt="shw-pdf"
                        className={
                          userdetails.profile_pic == null
                            ? "d-none"
                            : "rounded-circle"
                        }
                      />
                      {userdetails.nickname !== undefined && (
                        <p
                          className={
                            userdetails.profile_pic == null
                              ? "d-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto"
                              : "d-none"
                          }
                          style={{
                            fontSize: "14px",
                            height: "40px",
                            width: "40px",
                          }}
                        >
                          <span>{userdetails?.nickname ? userdetails.nickname.slice(0, 1) : "user"}</span>
                          <span>{userdetails?.nickname ? userdetails.nickname.slice(-1) : "user"}</span>
                        </p>
                      )}
                      <div className="input-group bg-light rounded border pe-3">
                        <Input
                          type="text"
                          name="question"
                          onChange={(e) => editpostfunctionData(e.target.value)}
                          value={editedpost}
                          className="form-control py-3 ps-3 shadow-none border-0 bg-transparent"
                          placeholder="Ask a question....."
                          style={{ position: "relative" }}
                        />
                        <Button
                          color="link"
                          disabled={editedpost.length === 0}
                          onClick={() => {
                            sendEditedData();
                            togglePostEditModal();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <path
                              d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z"
                              fill="#8E9696"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={togglePostEditModal}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </div>
          <Modal isOpen={isEditDocument} size="lg">
            <Formik initialValues={initialValues}>
              {({
                values,
                isSubmitting,
                handleChange,
                handleBlur,
                setFieldValue,
              }) => (
                <Form>
                  <div className="py-3" id="details">
                    <div className="row py-3 py-md-4 mx-auto d-flex bg-white align-items-center px-3">
                      <div className={`mb-4 col-md-12`}>
                        <label
                          htmlFor=""
                          className="mb-2"
                          style={{ color: "#8E9696" }}
                        >
                          Document Title <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="document_title"
                          className="form-control py-3"
                          value={values.document_title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          className="validation-error"
                          name="document_title"
                          component="div"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <button
                          type="submit"
                          className="btn text-white fw-medium"
                          style={{ backgroundColor: "#5D5FE3" }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
          {/* -----------------------------------------------Toast Message Section--------------------------------------------- */}
          <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div
              id="liveToast"
              className="toast"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="toast-body d-flex justify-content-between align-items-center">
                <span id="toastbody" className="fw-medium p-1"></span>
                <Link
                  className="text-decoration-none text-white fw-bold bg-primary p-2"
                  to="/translatedpdf"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
          {/* -------------------------------------------TRANSLATE DOCUMENT TOAST MESSAGE---------------------------------------- */}
          <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div
              id="translateToast"
              className="toast"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="toast-body d-flex justify-content-between align-items-center">
                <span id="translatetoastbody" className="fw-medium p-1"></span>
                <Link
                  className="text-decoration-none text-white fw-bold bg-primary p-2"
                  to="/translatedpdf"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
          {/* --------------------------------------------------------REPORT MODAL FORM------------------------------------------ */}
          <div
            className="modal fade"
            id="reportmodal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="px-3 pt-2 ">
                    <h6 className="" style={{ color: "#5d5fe3" }}>
                      ⚠ Report the Document
                    </h6>
                    <textarea
                      placeholder="Reason must be more than20 characters..."
                      className="w-100 mt-2 p-2 form-control"
                      style={{ fontSize: "14px", outline: "none" }}
                      id=""
                      cols="30"
                      rows="2"
                      value={report}
                      onChange={reportData}
                    ></textarea>
                    <div className="text-end mt-2">
                      <button
                        disabled={report.length > 20 ? false : true}
                        className="text-white btn btn-sm px-3"
                        style={{ backgroundColor: "#5d5fe3" }}
                        data-bs-dismiss="modal"
                        onClick={sendreport}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* -------------------------------------TRANSLATE PDF  MODAL----------------------------------------------------------------- */}
          <div
            className="modal fade"
            id="translatemodal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-md">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="bg-white px-3 pt-2 pb-3">
                    <h6 className="pb-2 ps-1 text-primary text-center">
                      Select the language and Translate the document
                    </h6>
                    <div className="col-12 d-flex align-items-center mt-3 mt-sm-0">
                      <label
                        htmlFor=""
                        className="fw-medium d-flex align-items-center"
                      >
                        <img
                          src={require("../../img/translate.gif")}
                          width={40}
                          alt="shw-pdf"
                          className="me-0"
                        />
                      </label>
                      <select
                        name="language"
                        onChange={language}
                        id=""
                        className="ms-1 px-3 py-1 border form-select"
                      >
                        <option value="" className="bg-light fw-medium ">
                          Select the Language...
                        </option>
                        <option value="en" className="bg-light fw-medium ">
                          English
                        </option>
                        <option value="de" className="bg-light fw-medium ">
                          German
                        </option>
                        <option value="fr" className="bg-light fw-medium ">
                          French
                        </option>
                      </select>
                      <button
                        className="btn text-white btn-sm ms-3"
                        data-bs-dismiss="modal"
                        style={{ backgroundColor: "#5D5FE3" }}
                        onClick={translatePdf}
                      >
                        Translate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* --------------------------------------------------Share document link modal----------------------------------------- */}
          <Modal
            className="modal-lg"
            isOpen={isLinkShare}
            toggle={() => setLinkShare(!isLinkShare)}
            centered
          >
            <ModalBody>
              <div className="text-center px-3 pt-2 ">
                <h6 className="mb-3">Copy and share the Link</h6>
                <div className="text-end mt-2 d-flex justify-content-center align-items-center">
                  <a
                    target="_blank"
                    href={`${domain}/shareddocument/${token}/`}
                  >{`${domain}/shareddocument/${token}/`}</a>
                  <button
                    className="btn btn-sm d-flex align-items-center ms-4 border-0"
                    style={{
                      display: "inline-block",
                      backgroundColor: copy_status ? "#d4edda" : "#f8f9fa",
                      borderRadius: "8px",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      copyLinkToClipboard(token);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill={copy_status ? "green" : "currentColor"}
                      className="bi bi-copy"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </ModalBody>
          </Modal>
          {/* -----------------------------------------------To post the reply for reply modal------------------------------------------ */}
          <div
            className="modal fade"
            id="replyforreply_modal"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog  modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="col-12 bg-white px-3 pt-2 pb-3">
                    <h6 className="pb-2 ps-1">Post a Reply for Reply</h6>
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        src={userdetails.profile_pic}
                        className={
                          userdetails.profile_pic == null
                            ? "d-none"
                            : "rounded-circle"
                        }
                        width={40}
                        height={40}
                        alt="shw-pdf"
                      />
                      {userdetails.nickname != undefined ? (
                        <p
                          className={
                            userdetails.profile_pic == null
                              ? "d-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto"
                              : "d-none"
                          }
                          style={{ height: "40px", width: "40px" }}
                        >
                          <span>{userdetails?.nickname ? userdetails.nickname.slice(0, 1) : "user"}</span>
                          <span>{userdetails?.nickname ? userdetails.nickname.slice(-1) : "user"}</span>
                        </p>
                      ) : (
                        <></>
                      )}
                      <form
                        className="w-100"
                        onSubmit={(e) => {
                          postreply_for_replies(e);
                        }}
                      >
                        <div className="input-group bg-light border rounded pe-3">
                          <input
                            type="text"
                            name="question"
                            value={reply_for_reply}
                            onChange={(e) => {
                              setReply_for_reply(e.target.value);
                            }}
                            className="form-control py-1 ps-3 bg-light border-0 shadow-none post-input"
                            placeholder="Post your reply....."
                            style={{ position: "relative" }}
                          />
                          <div
                            className="d-flex align-items-center bg-light"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            data-bs-custom-class="custom-tooltip"
                            data-bs-title="Attach Image"
                          >
                            <input
                              id="fileInput2"
                              type="file"
                              name="file"
                              accept="image/*"
                              multiple
                              onChange={handleReply_reply_Image}
                              className="bg-light text-center p-3 btn"
                            />
                            <label
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              data-bs-custom-class="custom-tooltip"
                              data-bs-title="Attach Image"
                              htmlFor="fileInput2"
                              className="custom-file-input bg-transparent border-0 px-4 py-2"
                            >
                              <img
                                src={require("../../img/attachment.png")}
                                width={22}
                                height={22}
                                alt="shw-pdf"
                              />
                            </label>

                            <button
                              data-bs-toggle="tooltip"
                              data-bs-placement="left"
                              data-bs-custom-class="custom-tooltip"
                              type="submit"
                              data-bs-title="Post"
                              disabled={
                                reply_for_reply.length > 0 ? false : true
                              }
                              data-bs-dismiss="modal"
                              className="text-secondary h-100 bg-transparent border-0 ms-2 outline-0"
                            >
                              <svg
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                data-bs-custom-class="custom-tooltip"
                                data-bs-title="Post"
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                              >
                                <path
                                  d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z"
                                  fill="#8E9696"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="d-flex gap-3 mt-3">
                      {replies_reply_Image.length > 0 &&
                        replies_reply_Image.map((image, index) => (
                          <div
                            key={index}
                            className="image-preview bg-light p-2"
                            style={{ position: "relative" }}
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              width={50}
                              alt={`Selected Image ${index + 1}`}
                            />
                            <button
                              style={{
                                position: "absolute",
                                top: "-10px",
                                right: "-16px",
                              }}
                              className="btn btn-sm"
                              onClick={() => removereply_Image(index)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-x-circle"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                              </svg>
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* --------------------------------------------------Mark question modal-------------------------------------------------- */}
          <div
            className="modal fade"
            id="markquestionModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <p
                    className="m-0 d-flex align-items-center justify-content-center"
                    style={{ color: "#5d5fe3" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="60"
                      height="60"
                      fill="green"
                      className="bi bi-check2-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                      <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                    </svg>
                    <span className="ms-2">
                      click to set a markup on the desired location. Please note
                      that this action requires two consecutive clicks to
                      activate the markup feature.”{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* --------------------------------------------------Delete Document Model ----------------------------------------------- */}
          {deleteDocModal && (
            <Modal
              isOpen={deleteDocModal}
              toggle={() => setDeleteDocModal(false)}
              centered
            >
              <ModalHeader toggle={() => setDeleteDocModal(false)}>
                Delete the document
              </ModalHeader>
              <ModalBody>
                {" "}
                Type "delete" and click "Confirm" to confirm deleting the
                selected document
                <Input
                  label="delete"
                  placeholder="delete"
                  type="text"
                  value={deleteMessage}
                  maxLength="256"
                  onChange={(event) => setdeleteMessage(event.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onClick={() => {
                    setDeleteDocModal(false);
                    setdeleteMessage("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  disabled={deleteMessage == "delete" ? false : true}
                  onClick={(response) => handelDeleteConfirm(response)}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </Modal>
          )}
          <Create_study_list
            document_id={id}
            setCount={setCount}
            call_function={increment}
          />
          {/* -------------------------------------------Gemini AI-------------------------------------------------------- */}
          <DocumentCommentsection />
          {/* Report the Comment */}
          <Report_post
            disc_type={"document"}
            setCount={setCount}
            setindex1={setindex1}
            report_status={report_status}
            setreport_status={setreport_status}
            discussion_id={report_id}
          />
          {/* ----------------------------------------------View Complete Pdf page---------------------------------------------- */}
          <Viewpdf_page
            view_pdf_status={view_pdf_status}
            setview_pdf_status={setview_pdf_status}
            url={pdfurldata?.documnet_id?.document_url || ""}
            doc_name={pdfurldata?.documnet_id?.doc_name || "Unknown"}
          />
          <Backtotop />
          {view_pdf_status !== true &&
            <Tour
              onRequestClose={closeTourGuide}
              key={tourKey}
              steps={tourConfig}
              //isOpen={view_pdf_status === true ? false : isTourOpen}
              isOpen={isTourOpen}
              className="helper"
              rounded={5}
              accentColor={accentColor}
              showArrow={true}
              disableInteraction={true} // Prevent interaction with the background
              closeWithMask={false} // Prevent closing when clicking outside
              styles={{
                maskArea: (base) => ({
                  ...base,
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }),
                maskWrapper: (base) => ({
                  ...base,
                  backgroundColor: "transparent",
                }),
              }}
              highlightDelay={300}
            />}
        </div>
      )}
    </div>
  );
};
export default ShowPDF;
