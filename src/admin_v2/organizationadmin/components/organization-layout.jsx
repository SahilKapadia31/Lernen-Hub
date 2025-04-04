import React, { useState, useContext, useEffect } from "react";
import { useSelector } from 'react-redux';
import OrganizationHeader from "./organization-header/organization-header";
const OrganizationLayout = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (
        <>
            {isAuthenticated ?
                <div>
                    <OrganizationHeader />
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

export default OrganizationLayout;
