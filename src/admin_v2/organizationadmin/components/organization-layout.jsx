import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import OrganizationHeader from "./organization-header/organization-header";
import { matchPath } from 'react-router-dom';

// Map routes to their required permissions
const routePermissionMap = {
    "/organization/dashboard": "",
    "/organization/staff": "Manage Staff",
    "/organization/student": "Manage Student",
    "/organization/roles": "Manage Role",
    "/organization/promoCode": "Manage Join Code",
    "/organization/program-types": "Manage Programs",
    "/organization/programs": "Manage Programs",
    "/organization/subjects": "Manage Subjects",
    "/organization/my-programs": "Assign Staff Progrrams",
    "/organization/program-details": "Manage Programs",
    "/organization/upload-documents": "Manage Programs",
    "/organization/show-documents": "View Documents",
    "/organization/show-subjects": "View Subjects",
};

// Helper: Check if the user has permission for the current route
const hasPermissionForRoute = (pathname, permissions, role) => {
    if (role?.option_id === 2) return true;

    for (const route in routePermissionMap) {
        const requiredPermission = routePermissionMap[route];
        if (matchPath({ path: route, end: false }, pathname)) {
            if (!requiredPermission) return true; // public or always-allowed route
            return permissions.includes(requiredPermission);
        }
    }

    return false;
};


const OrganizationLayout = ({ children }) => {
    const [permissions, setPermissions] = useState([]);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const data = useSelector((state) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const role = data?.role;
        console.log("---------", role)
        setPermissions(role?.permissions?.map(p => p.permission_name) || []);
    }, [data]);

    const allowed = hasPermissionForRoute(location.pathname, permissions, data?.role);

    return (
        <>
            {isAuthenticated ? (
                <div>
                    <OrganizationHeader />
                    <main className="main-org-body bg-light position-relative pt-3" id="main-body">
                        <p className="text-capitalize d-flex align-items-end justify-content-end fw-bold">
                            {`${data.user.first_name} ${data.user.last_name} (${data.role.role_name})`}
                        </p>
                        {allowed ? (
                            children
                        ) : (
                            <div className="alert alert-danger m-4">
                                <h5>🚫 Access Denied</h5>
                                <p>You do not have permission to view this page.</p>
                            </div>
                        )}
                    </main>
                </div>
            ) : (
                <div className="w-100 position-relative">
                    <main>{children}</main>
                </div>
            )}
        </>
    );
};

export default OrganizationLayout;
