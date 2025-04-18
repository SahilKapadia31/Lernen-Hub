import React, { useState, useContext, useEffect } from "react";
import Mainsidebar from "./Mainsidebar";
import Footer from "./Footer";
import { useSelector } from 'react-redux';
import Navbar from "./Navbar";
const Layout = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const pathname = location.hash.split("#")[1] || ""
    console.log(location.hash);
    const newPathName = pathname.split("/").slice(1);

    const allowPublic = ["", "universities_info"];
    const isPublicRoute = newPathName.some(path => allowPublic.includes(path)) || false;
    console.log("isPublicRoute", isPublicRoute)
    return (
        <>
            {(isAuthenticated && !isPublicRoute) ?
                <div className="d-flex">
                    <Mainsidebar count={0} />
                    <div className="w-100 position-relative bg-light">
                        <div className="nav-box bg-light border-bottom">
                            <Navbar />
                        </div>
                        <main className="layout-main-content">{props?.children}</main>
                        <Footer />
                    </div>
                </div>
                :
                <div className="w-100 position-relative">
                    <main>{props?.children}</main>
                </div>
            }
        </>
    );
};

export default Layout;
