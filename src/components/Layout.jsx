import React, { useState, useContext, useEffect } from "react";
import Mainsidebar from "./Mainsidebar";
import Footer from "./Footer";
import { useSelector } from 'react-redux';
import Navbar from "./Navbar";
const Layout = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (
        <>
            {isAuthenticated ?
                <div className="d-flex">
                    <Mainsidebar count={0} />
                    <div className="w-100 position-relative bg-light">
                        <div className="nav-box bg-light border-bottom">
                            <Navbar />
                        </div>
                        <main className="layout-main-content">{children}</main>
                        <Footer />
                    </div>
                </div>
                :
                <div className="w-100 position-relative">
                    <main>{children}</main>
                </div>
            }
        </>
    );
};

export default Layout;
