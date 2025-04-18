import React, { useState } from "react";
import Slider from "react-slick";
import { Document, Page } from 'react-pdf';
import { Link } from "react-router-dom";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Card, Row, Col, Container, InputGroup, FormControl, Button } from "react-bootstrap";
import Slick2_button_left from "./components/Slick2_left_btn";
import Slick2_button_right from "./components/Slick2_right_btn";
import Slick_button_left from "./components/Slick_button_left";
import Slick_button_right from "./components/Slick_button_right";
import deleteDoc_icon from '../../../../../../src/assets/svg/delete-trash-svgrepo-com.svg'
import './show-documents.scss'
const ShowDocuments = () => {
    const [visiblity, setVisibility] = useState(0);
    const renderTooltip = (value) => (<Tooltip id="button-tooltip">{value}</Tooltip>);
    var settings = {
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <Slick2_button_right />,
        prevArrow: <Slick2_button_left />,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    //infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    //infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,

                    // infinite: true,
                }
            }
        ]
    };

    var settings1 = {
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <Slick_button_right />,
        prevArrow: <Slick_button_left />,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    //infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    //infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const [joinedcourses, setjoinedcourses] = useState([
        {
            "rated_people": 0,
            "average_rating": null,
            "rating_status": false,
            "user_rating": null,
            "notification_count": 0,
            "course_id": 28,
            "course_name": "Subject II",
            "students_count": 7,
            "documents_count": 10,
            "discussion_ids": [
                12,
                19,
                20,
                21
            ],
            "flashsets_count": 16,
            "public_flashsets_count": 6
        },
        {
            "rated_people": 0,
            "average_rating": null,
            "rating_status": false,
            "user_rating": null,
            "notification_count": 0,
            "course_id": 34,
            "course_name": "MATRICES AND DETERMINANTS",
            "students_count": 3,
            "documents_count": 1,
            "discussion_ids": [],
            "flashsets_count": 3,
            "public_flashsets_count": 1
        },
        {
            "rated_people": 0,
            "average_rating": null,
            "rating_status": false,
            "user_rating": null,
            "notification_count": 0,
            "course_id": 33,
            "course_name": "ACCNT DETERMINANTS",
            "students_count": 2,
            "documents_count": 5,
            "discussion_ids": [],
            "flashsets_count": 5,
            "public_flashsets_count": 4
        },
        {
            "rated_people": 0,
            "average_rating": null,
            "rating_status": false,
            "user_rating": null,
            "notification_count": 0,
            "course_id": 32,
            "course_name": "DETERMINANTS Fund",
            "students_count": 3,
            "documents_count": 1,
            "discussion_ids": [
                25
            ],
            "flashsets_count": 2,
            "public_flashsets_count": 2
        },
        {
            "rated_people": 0,
            "average_rating": null,
            "rating_status": false,
            "user_rating": null,
            "notification_count": 0,
            "course_id": 31,
            "course_name": "MATHEMATICS-2 - (Abstract Algebra)",
            "students_count": 6,
            "documents_count": 1,
            "discussion_ids": [
                14,
                15
            ],
            "flashsets_count": 2,
            "public_flashsets_count": 2
        },
        {
            "rated_people": 0,
            "average_rating": null,
            "rating_status": false,
            "user_rating": null,
            "notification_count": 0,
            "course_id": 30,
            "course_name": " MATRICES AND DETERMINANTS",
            "students_count": 3,
            "documents_count": 1,
            "discussion_ids": [],
            "flashsets_count": 2,
            "public_flashsets_count": 2
        },
        {
            "rated_people": 0,
            "average_rating": null,
            "rating_status": false,
            "user_rating": null,
            "notification_count": 0,
            "course_id": 29,
            "course_name": "MATHEMATICS - (Abstract Algebra)",
            "students_count": 5,
            "documents_count": 2,
            "discussion_ids": [
                18
            ],
            "flashsets_count": 2,
            "public_flashsets_count": 2
        },
        {
            "rated_people": 0,
            "average_rating": null,
            "rating_status": false,
            "user_rating": null,
            "notification_count": 0,
            "course_id": 27,
            "course_name": "Subject I",
            "students_count": 7,
            "documents_count": 6,
            "discussion_ids": [
                11,
                13,
                16,
                17
            ],
            "flashsets_count": 9,
            "public_flashsets_count": 7
        }
    ]);
    const [recentDocs, setRecentDocs] = useState([
        {
            "document_id": 71,
            "doc_name": "document-I.pdf",
            "file": {
                "document_id": 71,
                "doc_name": "document-I.pdf",
                "title": "Test Document I",
                "doc_description": "",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/document-I.pdf",
                "professor": null,
                "sub_cat": "chapter",
                "chapter_number": "1",
                "chapter_name": "Randomness",
                "sub_sub_cat": "theory",
                "sub_sub_sub_cat": "",
                "is_delete": false,
                "year": "0",
                "created_on": "2024-11-27T15:19:14.346996+01:00",
                "pages": 8,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": null
            },
            "doc_description": "",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "4 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 4,
            "followers_count": 1,
            "pages": 8,
            "discussion_post_count": 28,
            "views_count": 5,
            "study_list_status": false,
            "download_count": 0
        },
        {
            "document_id": 79,
            "doc_name": "architecting-on-aws-jam.pdf",
            "file": {
                "document_id": 79,
                "doc_name": "architecting-on-aws-jam.pdf",
                "title": "Architecting on AWS-AWS Classroom Training (Account Security, Networking, Compute, Storage, Database Services, Monitoring and Scaling, Hands-on Lab: Configure High Availability in Your Amazon VPC)",
                "doc_description": "Architecting on AWS is for solutions architects, solution-design engineers, and developers seeking an understanding of AWS architecting. In this course, you will learn to identify services and features to build resilient, secure and highly available IT solutions on the AWS Cloud. Architectural solutions differ depending on industry, types of applications, and business size. AWS Authorized Instructors emphasize best practices using the AWS Well-Architected Framework, and guide you through the process of designing optimal IT solutions, based on real-life scenarios. The modules focus on account security, networking, compute, storage, databases, monitoring, automation, containers, serverless architecture, edge services, and backup and recovery. At the end of the course, you will practice building a solution and apply what you have learned with confidence.",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/architecting-on-aws-jam.pdf",
                "professor": null,
                "sub_cat": "notes",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "",
                "is_delete": false,
                "year": "0",
                "created_on": "2024-12-17T14:30:04.865652+01:00",
                "pages": 5,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": null
            },
            "doc_description": "Architecting on AWS is for solutions architects, solution-design engineers, and developers seeking an understanding of AWS architecting. In this course, you will learn to identify services and features to build resilient, secure and highly available IT solutions on the AWS Cloud. Architectural solutions differ depending on industry, types of applications, and business size. AWS Authorized Instructors emphasize best practices using the AWS Well-Architected Framework, and guide you through the process of designing optimal IT solutions, based on real-life scenarios. The modules focus on account security, networking, compute, storage, databases, monitoring, automation, containers, serverless architecture, edge services, and backup and recovery. At the end of the course, you will practice building a solution and apply what you have learned with confidence.",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "3 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 5,
            "discussion_post_count": 10,
            "views_count": 1,
            "study_list_status": true,
            "download_count": 0
        },
        {
            "document_id": 80,
            "doc_name": "dummy.pdf",
            "file": {
                "document_id": 80,
                "doc_name": "dummy.pdf",
                "title": "p1 and p2 are two odd prime numbers",
                "doc_description": "A bag contains 63 cards (numbered 1, 2, 3, ….., 63). Two cards are picked at random from the bag (one after another and without replacement). What is the probability that the sum of the numbers of both the cards drawn is even.",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/dummy.pdf",
                "professor": null,
                "sub_cat": "exam_paper",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "question & answers",
                "is_delete": true,
                "year": "2008",
                "created_on": "2024-12-17T14:50:35.059058+01:00",
                "pages": 1,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": 1
            },
            "doc_description": "A bag contains 63 cards (numbered 1, 2, 3, ….., 63). Two cards are picked at random from the bag (one after another and without replacement). What is the probability that the sum of the numbers of both the cards drawn is even.",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": true,
            "created_on": "3 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 1,
            "discussion_post_count": 2,
            "views_count": 2,
            "study_list_status": false,
            "download_count": 0
        },
        {
            "document_id": 88,
            "doc_name": "1.pdf",
            "file": {
                "document_id": 88,
                "doc_name": "1.pdf",
                "title": "safsfg",
                "doc_description": "sdzfsd",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/1.pdf",
                "professor": null,
                "sub_cat": "notes",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "",
                "is_delete": false,
                "year": "0",
                "created_on": "2025-01-17T18:59:34.212052+01:00",
                "pages": 1,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": null
            },
            "doc_description": "sdzfsd",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "2 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 1,
            "discussion_post_count": 3,
            "views_count": 3,
            "study_list_status": false,
            "download_count": 0
        },
        {
            "document_id": 95,
            "doc_name": "SAMPLEDOCUMENTS.pdf",
            "file": {
                "document_id": 95,
                "doc_name": "SAMPLEDOCUMENTS.pdf",
                "title": "Sample Document",
                "doc_description": "Document to work out and start doing things.",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/SAMPLE_DOCUMENTS.pdf",
                "professor": null,
                "sub_cat": "notes",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "",
                "is_delete": false,
                "year": "0",
                "created_on": "2025-02-01T02:22:41.858822+01:00",
                "pages": 4,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": null
            },
            "doc_description": "Document to work out and start doing things.",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "2 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 4,
            "discussion_post_count": 4,
            "views_count": 2,
            "study_list_status": false,
            "download_count": 0
        },
        {
            "document_id": 99,
            "doc_name": "QP-SO-LDCE-24-PAPER-I-130125.pdf",
            "file": {
                "document_id": 99,
                "doc_name": "QP-SO-LDCE-24-PAPER-I-130125.pdf",
                "title": "upse exam paper",
                "doc_description": "description",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/QP-SO-LDCE-24-PAPER-I-130125.pdf",
                "professor": null,
                "sub_cat": "exam_paper",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "questions",
                "is_delete": false,
                "year": "2024",
                "created_on": "2025-03-13T06:20:04.185542+01:00",
                "pages": 3,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": 1
            },
            "doc_description": "description",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "20 days ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 3,
            "discussion_post_count": 1,
            "views_count": 2,
            "study_list_status": false,
            "download_count": 0
        }
    ]);
    const [selectedCourse, setCourse] = useState([
        {
            "document_id": 71,
            "doc_name": "document-I.pdf",
            "file": {
                "document_id": 71,
                "doc_name": "document-I.pdf",
                "title": "Test Document I",
                "doc_description": "",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/document-I.pdf",
                "professor": null,
                "sub_cat": "chapter",
                "chapter_number": "1",
                "chapter_name": "Randomness",
                "sub_sub_cat": "theory",
                "sub_sub_sub_cat": "",
                "is_delete": false,
                "year": "0",
                "created_on": "2024-11-27T15:19:14.346996+01:00",
                "pages": 8,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": null
            },
            "doc_description": "",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "4 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 4,
            "followers_count": 1,
            "pages": 8,
            "discussion_post_count": 28,
            "views_count": 5,
            "study_list_status": false,
            "download_count": 0
        },
        {
            "document_id": 79,
            "doc_name": "architecting-on-aws-jam.pdf",
            "file": {
                "document_id": 79,
                "doc_name": "architecting-on-aws-jam.pdf",
                "title": "Architecting on AWS-AWS Classroom Training (Account Security, Networking, Compute, Storage, Database Services, Monitoring and Scaling, Hands-on Lab: Configure High Availability in Your Amazon VPC)",
                "doc_description": "Architecting on AWS is for solutions architects, solution-design engineers, and developers seeking an understanding of AWS architecting. In this course, you will learn to identify services and features to build resilient, secure and highly available IT solutions on the AWS Cloud. Architectural solutions differ depending on industry, types of applications, and business size. AWS Authorized Instructors emphasize best practices using the AWS Well-Architected Framework, and guide you through the process of designing optimal IT solutions, based on real-life scenarios. The modules focus on account security, networking, compute, storage, databases, monitoring, automation, containers, serverless architecture, edge services, and backup and recovery. At the end of the course, you will practice building a solution and apply what you have learned with confidence.",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/architecting-on-aws-jam.pdf",
                "professor": null,
                "sub_cat": "notes",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "",
                "is_delete": false,
                "year": "0",
                "created_on": "2024-12-17T14:30:04.865652+01:00",
                "pages": 5,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": null
            },
            "doc_description": "Architecting on AWS is for solutions architects, solution-design engineers, and developers seeking an understanding of AWS architecting. In this course, you will learn to identify services and features to build resilient, secure and highly available IT solutions on the AWS Cloud. Architectural solutions differ depending on industry, types of applications, and business size. AWS Authorized Instructors emphasize best practices using the AWS Well-Architected Framework, and guide you through the process of designing optimal IT solutions, based on real-life scenarios. The modules focus on account security, networking, compute, storage, databases, monitoring, automation, containers, serverless architecture, edge services, and backup and recovery. At the end of the course, you will practice building a solution and apply what you have learned with confidence.",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "3 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 5,
            "discussion_post_count": 10,
            "views_count": 1,
            "study_list_status": true,
            "download_count": 0
        },
        {
            "document_id": 80,
            "doc_name": "dummy.pdf",
            "file": {
                "document_id": 80,
                "doc_name": "dummy.pdf",
                "title": "p1 and p2 are two odd prime numbers",
                "doc_description": "A bag contains 63 cards (numbered 1, 2, 3, ….., 63). Two cards are picked at random from the bag (one after another and without replacement). What is the probability that the sum of the numbers of both the cards drawn is even.",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/dummy.pdf",
                "professor": null,
                "sub_cat": "exam_paper",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "question & answers",
                "is_delete": true,
                "year": "2008",
                "created_on": "2024-12-17T14:50:35.059058+01:00",
                "pages": 1,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": 1
            },
            "doc_description": "A bag contains 63 cards (numbered 1, 2, 3, ….., 63). Two cards are picked at random from the bag (one after another and without replacement). What is the probability that the sum of the numbers of both the cards drawn is even.",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": true,
            "created_on": "3 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 1,
            "discussion_post_count": 2,
            "views_count": 2,
            "study_list_status": false,
            "download_count": 0
        },
        {
            "document_id": 88,
            "doc_name": "1.pdf",
            "file": {
                "document_id": 88,
                "doc_name": "1.pdf",
                "title": "safsfg",
                "doc_description": "sdzfsd",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/1.pdf",
                "professor": null,
                "sub_cat": "notes",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "",
                "is_delete": false,
                "year": "0",
                "created_on": "2025-01-17T18:59:34.212052+01:00",
                "pages": 1,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": null
            },
            "doc_description": "sdzfsd",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "2 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 1,
            "discussion_post_count": 3,
            "views_count": 3,
            "study_list_status": false,
            "download_count": 0
        },
        {
            "document_id": 95,
            "doc_name": "SAMPLEDOCUMENTS.pdf",
            "file": {
                "document_id": 95,
                "doc_name": "SAMPLEDOCUMENTS.pdf",
                "title": "Sample Document",
                "doc_description": "Document to work out and start doing things.",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/SAMPLE_DOCUMENTS.pdf",
                "professor": null,
                "sub_cat": "notes",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "",
                "is_delete": false,
                "year": "0",
                "created_on": "2025-02-01T02:22:41.858822+01:00",
                "pages": 4,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": null
            },
            "doc_description": "Document to work out and start doing things.",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "2 months ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 4,
            "discussion_post_count": 4,
            "views_count": 2,
            "study_list_status": false,
            "download_count": 0
        },
        {
            "document_id": 99,
            "doc_name": "QP-SO-LDCE-24-PAPER-I-130125.pdf",
            "file": {
                "document_id": 99,
                "doc_name": "QP-SO-LDCE-24-PAPER-I-130125.pdf",
                "title": "upse exam paper",
                "doc_description": "description",
                "doc_type": ".pdf",
                "document": "http://52.66.114.136/media/QP-SO-LDCE-24-PAPER-I-130125.pdf",
                "professor": null,
                "sub_cat": "exam_paper",
                "chapter_number": "undefined",
                "chapter_name": "",
                "sub_sub_cat": "",
                "sub_sub_sub_cat": "questions",
                "is_delete": false,
                "year": "2024",
                "created_on": "2025-03-13T06:20:04.185542+01:00",
                "pages": 3,
                "doc_cat_id": null,
                "course_id": 27,
                "group_id": null,
                "semester_id": 1
            },
            "doc_description": "description",
            "doc_type": ".pdf",
            "professor": null,
            "is_delete": false,
            "created_on": "20 days ago",
            "user_info": {
                "user_id": "1721618254",
                "first_name": "We're",
                "last_name": "Here",
                "nickname": "info",
                "profile_pic": "http://52.66.114.136/media/user_profile_pics/pngtree-user-vector-avatar-png-image_1541962_6GrTLcy.jpg"
            },
            "average_rating": 0,
            "followers_count": 0,
            "pages": 3,
            "discussion_post_count": 1,
            "views_count": 2,
            "study_list_status": false,
            "download_count": 0
        }
    ]);

    function formatString(str) {
        if (!str) {
            return '';
        }
        return str
            .split('_') // Split the string into words using underscores
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(' '); // Join the words back with spaces
    }
    const userdetails = null;
    return (<>
        <div className="show-documents">
            <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="input-group navbar-input w-25" style={{ cursor: 'pointer', height: '45px' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#searchoffcanvas" aria-controls="searchoffcanvas">
                    <span className="input-group-text bg-white border-end-0" style={{ color: '#AAB0B0' }} id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M20.2965 20.9936L13.774 14.4712C13.2532 14.9145 12.6542 15.2577 11.9772 15.5008C11.3001 15.7439 10.6197 15.8654 9.93589 15.8654C8.26749 15.8654 6.85546 15.2879 5.69982 14.1329C4.54416 12.9778 3.96633 11.5666 3.96633 9.89908C3.96633 8.23158 4.54384 6.81924 5.69886 5.66205C6.85387 4.50486 8.26513 3.92627 9.93263 3.92627C11.6001 3.92627 13.0125 4.50409 14.1697 5.65973C15.3268 6.81538 15.9054 8.22741 15.9054 9.89583C15.9054 10.6196 15.7772 11.3201 15.5208 11.9972C15.2644 12.6743 14.9279 13.2532 14.5112 13.734L21.0337 20.2564L20.2965 20.9936ZM9.93589 14.8237C11.3181 14.8237 12.485 14.348 13.4365 13.3964C14.388 12.4449 14.8638 11.278 14.8638 9.89583C14.8638 8.51362 14.388 7.34676 13.4365 6.39523C12.485 5.4437 11.3181 4.96794 9.93589 4.96794C8.55368 4.96794 7.38682 5.4437 6.43529 6.39523C5.48378 7.34676 5.00802 8.51362 5.00802 9.89583C5.00802 11.278 5.48378 12.4449 6.43529 13.3964C7.38682 14.348 8.55368 14.8237 9.93589 14.8237Z" fill="#8E9696" />
                    </svg></span>
                    <input type="text" style={{ cursor: 'pointer' }} className="form-control nav-input ps-0 border-start-0" placeholder={'search'} aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                <button className="btn ms-3 text-white navbar-btn" style={{ backgroundColor: '#5D5FE3', width: 'fit-content', whiteSpace: 'nowrap', height: '45px' }}><i className="fa-solid fa-plus me-2"></i>{'Upload'}</button>
            </div>
            <div className="d-flex justify-content-between mb-4 px-2 px-lg-5 align-items-center bg-white shadow rounded mx-0 p-4 px-1">
                <div className="d-flex">
                    <img src={userdetails?.profile_pic} width={50} className={userdetails?.profile_pic == null ? 'd-none' : 'd-inline rounded'} style={{ objectFit: 'cover' }} alt="dashboard" />
                    {
                        (userdetails?.nickname && userdetails?.profile_pic == null) &&
                        <p className={userdetails?.profile_pic == null ? 'bg-success text-white p-2 rounded-circle m-auto' : 'd-none'} style={{ lineHeight: "1.25" }}><span>{'test'.slice(0, 1)}</span><span>{'test'.slice(-1)}</span></p>
                    }
                    <div className="ms-2">
                        <span className="fw-bold" style={{ fontSize: '18px', cursor: 'pointer' }}>{'Test'}</span><br />
                        <span style={{ fontSize: '14px' }}>{'Others'}</span>
                    </div>
                </div>

                <div className="profile-details d-flex justify-content-between flex-column flex-lg-row">
                    <div className="subject justify-content-lg-center" style={{ cursor: 'pointer' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 35 35" fill="none">
                            <path d="M20.2482 13.9886V12.6312C21.0316 12.2348 21.8706 11.9376 22.7653 11.7394C23.6599 11.5412 24.5784 11.4421 25.5207 11.4421C26.0591 11.4421 26.5761 11.4767 27.0716 11.5459C27.567 11.615 28.0784 11.7132 28.6056 11.8403V13.1641C28.097 13.0014 27.6011 12.8888 27.1178 12.8261C26.6345 12.7635 26.1021 12.7322 25.5207 12.7322C24.5784 12.7322 23.6585 12.8383 22.7611 13.0505C21.8636 13.2627 21.026 13.5754 20.2482 13.9886ZM20.2482 21.9533V20.5399C20.9942 20.1435 21.8286 19.8462 22.7512 19.648C23.6739 19.4498 24.5971 19.3507 25.5207 19.3507C26.0591 19.3507 26.5761 19.3853 27.0716 19.4545C27.567 19.5237 28.0784 19.6218 28.6056 19.749V21.0727C28.097 20.9101 27.6011 20.7974 27.1178 20.7348C26.6345 20.6721 26.1021 20.6408 25.5207 20.6408C24.5784 20.6408 23.6585 20.7549 22.7611 20.983C21.8636 21.2111 21.026 21.5345 20.2482 21.9533ZM20.2482 17.999V16.5855C21.0316 16.1892 21.8706 15.8919 22.7653 15.6937C23.6599 15.4955 24.5784 15.3964 25.5207 15.3964C26.0591 15.3964 26.5761 15.431 27.0716 15.5002C27.567 15.5694 28.0784 15.6675 28.6056 15.7947V17.1184C28.097 16.9557 27.6011 16.8431 27.1178 16.7804C26.6345 16.7178 26.1021 16.6865 25.5207 16.6865C24.5784 16.6865 23.6585 16.8019 22.7611 17.0328C21.8636 17.2637 21.026 17.5858 20.2482 17.999ZM9.479 23.3892C10.7523 23.3892 11.9904 23.5355 13.1936 23.8281C14.3967 24.1207 15.5891 24.597 16.7707 25.257V10.9485C15.718 10.1969 14.5579 9.63322 13.2903 9.2574C12.0227 8.88161 10.7523 8.69372 9.479 8.69372C8.604 8.69372 7.8379 8.74606 7.18071 8.85075C6.52353 8.95546 5.79391 9.1499 4.99182 9.43408C4.76746 9.50887 4.60854 9.61637 4.51506 9.75659C4.42158 9.89683 4.37484 10.0511 4.37484 10.2194V23.3668C4.37484 23.6285 4.46832 23.8202 4.65527 23.9417C4.84226 24.0632 5.04792 24.0772 5.27226 23.9838C5.80511 23.8043 6.4207 23.6603 7.11902 23.5519C7.81734 23.4434 8.604 23.3892 9.479 23.3892ZM18.229 25.257C19.4106 24.597 20.603 24.1207 21.8061 23.8281C23.0092 23.5355 24.2474 23.3892 25.5207 23.3892C26.3957 23.3892 27.1823 23.4434 27.8807 23.5519C28.579 23.6603 29.1946 23.8043 29.7274 23.9838C29.9518 24.0772 30.1574 24.0632 30.3444 23.9417C30.5314 23.8202 30.6248 23.6285 30.6248 23.3668V10.2194C30.6248 10.0511 30.5781 9.90151 30.4846 9.77063C30.3911 9.63974 30.2322 9.52756 30.0079 9.43408C29.2058 9.1499 28.4761 8.95546 27.819 8.85075C27.1618 8.74606 26.3957 8.69372 25.5207 8.69372C24.2474 8.69372 22.977 8.88161 21.7094 9.2574C20.4418 9.63322 19.2816 10.1969 18.229 10.9485V25.257ZM17.4998 27.3716C16.3145 26.5602 15.0412 25.9366 13.6801 25.501C12.319 25.0654 10.9186 24.8476 9.479 24.8476C8.71992 24.8476 7.97439 24.9111 7.24243 25.0383C6.51045 25.1654 5.79764 25.3692 5.104 25.6497C4.5749 25.8609 4.07803 25.7973 3.6134 25.4589C3.1488 25.1205 2.9165 24.6531 2.9165 24.0567V9.96134C2.9165 9.60048 3.01138 9.2658 3.20113 8.95732C3.39091 8.64883 3.65688 8.43382 3.99902 8.31229C4.85533 7.93461 5.74623 7.6607 6.67171 7.49056C7.59719 7.32042 8.53296 7.23535 9.479 7.23535C10.9074 7.23535 12.3008 7.44101 13.6591 7.85233C15.0174 8.26366 16.2976 8.86195 17.4998 9.64722C18.702 8.86195 19.9823 8.26366 21.3406 7.85233C22.6989 7.44101 24.0923 7.23535 25.5207 7.23535C26.4667 7.23535 27.4025 7.32042 28.328 7.49056C29.2534 7.6607 30.1443 7.93461 31.0006 8.31229C31.3428 8.43382 31.6088 8.64883 31.7985 8.95732C31.9883 9.2658 32.0832 9.60048 32.0832 9.96134V24.0567C32.0832 24.6531 31.8322 25.1112 31.3302 25.4309C30.8282 25.7506 30.2939 25.8048 29.7274 25.5935C29.0525 25.3318 28.363 25.142 27.6591 25.0242C26.9552 24.9065 26.2423 24.8476 25.5207 24.8476C24.081 24.8476 22.6807 25.0654 21.3195 25.501C19.9584 25.9366 18.6852 26.5602 17.4998 27.3716Z" fill="#FF845D" />
                        </svg>

                        <span className="ms-2" style={{ fontSize: '14px', letterSpacing: '3.5px', cursor: 'pointer' }}>
                            <span className="d-none d-lg-block">
                                {'subjects'} : </span></span>
                        <span>{'0'}</span>

                    </div>

                    <div className="subject" style={{ cursor: 'pointer' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 35 35" fill="none">
                            <path d="M16.7709 25.9135H18.2292V19.0677L21.2917 22.1302L22.3237 21.0898L17.5 16.266L12.6763 21.0898L13.7168 22.1218L16.7709 19.0677V25.9135ZM9.64744 30.625C8.97624 30.625 8.41582 30.4002 7.96617 29.9505C7.51651 29.5009 7.29169 28.9404 7.29169 28.2692V6.73075C7.29169 6.05956 7.51651 5.49913 7.96617 5.04948C8.41582 4.59983 8.97624 4.375 9.64744 4.375H21.1459L27.7084 10.9375V28.2692C27.7084 28.9404 27.4835 29.5009 27.0339 29.9505C26.5842 30.4002 26.0238 30.625 25.3526 30.625H9.64744ZM20.4167 11.6667V5.83333H9.64744C9.4231 5.83333 9.21744 5.92681 9.03046 6.11377C8.8435 6.30075 8.75002 6.50641 8.75002 6.73075V28.2692C8.75002 28.4936 8.8435 28.6992 9.03046 28.8862C9.21744 29.0732 9.4231 29.1667 9.64744 29.1667H25.3526C25.5769 29.1667 25.7826 29.0732 25.9696 28.8862C26.1565 28.6992 26.25 28.4936 26.25 28.2692V11.6667H20.4167Z" fill="#FF845D" />
                        </svg>

                        <span className="ms-2" style={{ fontSize: '14px', letterSpacing: '3.5px' }}>
                            <span className="d-none d-lg-block">{'uploads'} : </span>
                        </span>
                        <span className="">{'0'}</span>
                    </div>

                    <div className="subject" style={{ cursor: 'pointer' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 35 35" fill="none">
                            <path d="M25.4648 29.1666H10.8253V13.125L19.9679 4.09448L20.613 4.73954C20.7457 4.87227 20.8574 5.04241 20.9481 5.24996C21.0388 5.45748 21.0841 5.64818 21.0841 5.82206V6.05204L19.5922 13.125H29.7276C30.3371 13.125 30.8821 13.3652 31.3626 13.8457C31.8431 14.3262 32.0833 14.8712 32.0833 15.4807V17.2756C32.0833 17.4083 32.0684 17.5532 32.0385 17.7103C32.0086 17.8673 31.9693 18.0122 31.9207 18.145L27.9383 27.5849C27.7383 28.0336 27.4017 28.4094 26.9287 28.7123C26.4557 29.0152 25.9677 29.1666 25.4648 29.1666ZM12.2837 27.7083H25.4648C25.6704 27.7083 25.8807 27.6522 26.0957 27.54C26.3108 27.4278 26.4744 27.2409 26.5865 26.9791L30.625 17.5V15.4807C30.625 15.219 30.5409 15.004 30.3726 14.8357C30.2043 14.6674 29.9893 14.5833 29.7276 14.5833H17.7804L19.4688 6.61853L12.2837 13.7476V27.7083ZM10.8253 13.125V14.5833H5.83333V27.7083H10.8253V29.1666H4.375V13.125H10.8253Z" fill="#FF845D" />
                        </svg>
                        <span className="ms-2" style={{ fontSize: '14px', letterSpacing: '3.5px' }}>
                            <span className="d-none d-lg-block">{'upvotes'} : </span></span><span className="">{'0'}
                        </span>
                    </div>
                </div>

            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="bg-white shadow rounded py-1">
                        {joinedcourses.length > 0 &&
                            <Slider {...settings1} className={`d-block w-100 px-4`}>
                                {joinedcourses.map((x, i) => {
                                    return (
                                        <div key={i}>
                                            <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={renderTooltip(x.course_name)}>
                                                <button
                                                    className={`course-button text-overflow ${visiblity === x.course_id ? 'selected' : ''}`}
                                                    style={{ backgroundColor: visiblity === x.course_id ? '#6200EE' : '#EDE7F6', color: visiblity === x.course_id ? 'white' : '#6200EE', fontSize: '12px' }}
                                                    onClick={() => { getDocs(x); setVisibility(x.course_id); }}>
                                                    {x.course_name}

                                                </button>
                                            </OverlayTrigger>
                                        </div>
                                    )
                                })}
                            </Slider>
                        }
                        <div className={`slider-container w-100 m-0 pb-4`}>
                            <h6 className={`${recentDocs.length > 0 ? 'd-none' : ''} text-center`}>No Documents Available !!!</h6>
                            {recentDocs.length > 0 &&
                                <Slider {...settings} className={`${recentDocs.length > 0 ? 'd-block w-100 px-4' : 'd-none'}`}>
                                    {recentDocs.map((x, i) => (
                                        <div key={i}>
                                            <Link to={`/showpdf/${x.document_id}`} state={{ course: selectedCourse }} className="text-decoration-none">
                                                <div className="card p-1 border view_pdf" style={{ height: '300px' }}>
                                                    <div className="card-body p-0" key={i}>
                                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '250px', overflow: 'hidden', width: '100%', position: 'relative' }}>
                                                            <Document file={x.file.document}>
                                                                <Page pageNumber={1} scale={0.5} width={350} renderAnnotationLayer={false} />
                                                            </Document>
                                                        </div>
                                                        <div className="dashboard-cards" style={{ height: '250px', width: '100%', position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}>
                                                            <div className="h-100 d-flex justify-content-between align-items-end pe-none" style={{ pointerEvents: 'none' }}>
                                                                <div>
                                                                    {x.is_delete && <p><img style={{ position: "absolute", top: "5px", minWidth: "fit-content", padding: "0px 5px" }}
                                                                        className='text-start' src={deleteDoc_icon} alt="Delete Icon" width="20" height="20" /></p>}
                                                                    <p className={x.file.sub_cat} style={{ fontWeight: 'bold', fontSize: '12px' }}>{formatString(x.file.sub_cat)} </p>
                                                                </div>
                                                                <div className="d-flex justify-content-between w-100">
                                                                    <span className="text-white d-flex align-items-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                                            <path d="M18.1891 20.8334H7.73237V9.37502L14.2628 2.92468L14.7236 3.38544C14.8184 3.48025 14.8982 3.60177 14.9629 3.75002C15.0277 3.89825 15.0601 4.03447 15.0601 4.15867V4.32294L13.9944 9.37502H21.234C21.6693 9.37502 22.0586 9.54663 22.4018 9.88984C22.7451 10.2331 22.9167 10.6223 22.9167 11.0577V12.3398C22.9167 12.4346 22.906 12.5381 22.8846 12.6503C22.8633 12.7624 22.8352 12.8659 22.8005 12.9608L19.9559 19.7036C19.813 20.0241 19.5727 20.2925 19.2348 20.5089C18.8969 20.7252 18.5483 20.8334 18.1891 20.8334ZM8.77404 19.7917H18.1891C18.336 19.7917 18.4862 19.7516 18.6398 19.6715C18.7934 19.5914 18.9103 19.4578 18.9904 19.2709L21.875 12.5V11.0577C21.875 10.8707 21.8149 10.7172 21.6947 10.597C21.5745 10.4768 21.4209 10.4167 21.234 10.4167H12.7003L13.9062 4.72757L8.77404 9.81974V19.7917ZM7.73237 9.37502V10.4167H4.16667V19.7917H7.73237V20.8334H3.125V9.37502H7.73237Z" fill="white" />
                                                                        </svg>
                                                                        <span className="fw-medium ms-1">{x.followers_count}</span>
                                                                    </span>
                                                                    <span className="text-white d-flex align-items-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                                            <path d="M10.4167 14.0625H14.0425V13.0208H10.4167V14.0625ZM10.4167 10.9375H17.6683V9.89583H10.4167V10.9375ZM10.4167 7.8125H17.6683V6.77083H10.4167V7.8125ZM8.45351 17.7083C7.97408 17.7083 7.57378 17.5477 7.2526 17.2266C6.93142 16.9054 6.77083 16.5051 6.77083 16.0257V4.80768C6.77083 4.32826 6.93142 3.92795 7.2526 3.60677C7.57378 3.28559 7.97408 3.125 8.45351 3.125H19.6715C20.1509 3.125 20.5512 3.28559 20.8724 3.60677C21.1936 3.92795 21.3542 4.32826 21.3542 4.80768V16.0257C21.3542 16.5051 21.1936 16.9054 20.8724 17.2266C20.5512 17.5477 20.1509 17.7083 19.6715 17.7083H8.45351ZM8.45351 16.6667H19.6715C19.8317 16.6667 19.9786 16.5999 20.1122 16.4664C20.2457 16.3328 20.3125 16.1859 20.3125 16.0257V4.80768C20.3125 4.64744 20.2457 4.50054 20.1122 4.36698C19.9786 4.23344 19.8317 4.16667 19.6715 4.16667H8.45351C8.29327 4.16667 8.14637 4.23344 8.01281 4.36698C7.87927 4.50054 7.8125 4.64744 7.8125 4.80768V16.0257C7.8125 16.1859 7.87927 16.3328 8.01281 16.4664C8.14637 16.5999 8.29327 16.6667 8.45351 16.6667ZM5.32851 20.8333C4.84908 20.8333 4.44878 20.6727 4.1276 20.3516C3.80642 20.0304 3.64583 19.6301 3.64583 19.1507V6.89102H4.68749V19.1507C4.68749 19.3109 4.75427 19.4578 4.88781 19.5914C5.02135 19.7249 5.16825 19.7917 5.32851 19.7917H17.5881V20.8333H5.32851Z" fill="white" />
                                                                        </svg>
                                                                        <span className="fw-medium ms-1">{x.file.pages}</span>
                                                                    </span>
                                                                </div>

                                                            </div>
                                                            <div className="overlay" style={{ cursor: 'pointer' }}><span className="view_btn">View</span></div>
                                                        </div>
                                                        <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={renderTooltip(x.file.title)}>
                                                            <div className="text-center py-2 text-overflow">
                                                                <p className="card-text fw-medium text-decoration-none text-dark" style={{ fontSize: '14px', lineHeight: '22px', letterSpacing: '0.32px' }}>{x.file.title}</p>
                                                            </div>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </Slider>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default ShowDocuments