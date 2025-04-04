import React, { useState, useContext, useEffect } from "react";
import { useSelector } from 'react-redux';
import SuperAdminHeader from "./superadmin-header/superadmin-header";

const SuperAdminLayout = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (
        <>
            {isAuthenticated ?
                <div>
                    <SuperAdminHeader />
                    <main className="main-org-body" id="main-body">{children}</main>
                </div>
                :
                <div className="w-100 position-relative">
                    <main>{children}</main>
                </div>
            }
        </>
    );
};

export default SuperAdminLayout;
