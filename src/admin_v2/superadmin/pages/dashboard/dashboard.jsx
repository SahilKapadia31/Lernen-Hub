import React from "react";
import './dashboard.scss';
const SuperAdminDashboard = () => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
          return "Good Morning!";
        } else if (hour < 18) {
          return "Good Afternoon!";
        } else {
          return "Good Evening!";
        }
      };
    return (
        <>
        <div className="superadmin-dashboard">
            <p className="mt-3"><span className="greetings">{getGreeting()}</span> Welcome to Super Admin</p>
        </div>
        </>
    )
}

export default SuperAdminDashboard;