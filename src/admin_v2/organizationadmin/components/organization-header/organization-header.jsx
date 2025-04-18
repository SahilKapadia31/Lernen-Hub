import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaTachometerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import logo from "../../../../img/landing_page/Group 385.png";
import UploadFile from "../upload-file/upload-file";
import "./organization-header.scss";
const menuItems = [
  {
    name: "Dashboard",
    path: "/organization/dashboard",
    icon: <FaTachometerAlt />,
  },
];


export const adminRoutes = [
  {
    displayName: "Dashboard",
    iconName: "person",
    route: "/organization/dashboard",
    icon: 'assets/images/dashboard/dashboard-svg.svg',
  },
  {
    displayName: "My Programs",
    iconName: "person",
    route: "/organization/my-programs",
    icon: 'assets/images/dashboard/chart-user-square.svg',
    color: '#11cdef'
  },
  {
    displayName: "Manage Staff",
    iconName: "person",
    route: "/organization/staff",
    icon: 'assets/images/dashboard/chart-user-square.svg',
    color: '#11cdef'
  },
  {
    displayName: "Students",
    iconName: "person",
    route: "/organization/student",
    icon: 'assets/images/dashboard/users.svg',
    color: '#11cdef'
  },
  {
    displayName: "Manage Roles",
    iconName: "person",
    route: "/organization/roles",
    icon: 'assets/images/dashboard/users.svg',
    color: '#11cdef'
  },
  {
    displayName: "Manage PromoCode",
    iconName: "person",
    route: "/organization/promoCode",
    icon: 'assets/images/dashboard/users.svg',
    color: '#11cdef'
  },
  {
    displayName: "Programs",
    iconName: "person",
    route: "/organization/program-types",
    icon: 'assets/images/dashboard/users.svg',
    color: '#11cdef'
  },
  {
    displayName: "Pending Request",
    iconName: "person",
    route: "/organization/pending-requests",
    icon: 'assets/images/dashboard/chart-user-square.svg',
    color: '#11cdef'
  },
];

const permissionMap = {
  "Manage Staff": "Manage Staff",
  "Student": "Manage Student",
  "Manage Roles": "Manage Role",
  "Programs": "Manage Programs",
  "Pending Request": "Assign Staff Programs",
  "My Programs": "Assign Student Progrrams",
  "Manage PromoCode": "Manage Join Code",
  "My Student": "Assign Student Progrrams",
  "View Students": "View Students",
};

const OrganizationHeader = () => {
  const location = useLocation();
  const [selectedNavMenu, setSelectedNavMenu] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();
  const orgData = useSelector((state) => state.auth);
  const role = orgData?.role || {}

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setOpenDropdowns({});
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (event, item) => {
    event.stopPropagation();
    setOpenDropdowns((prev) => {
      const newDropdowns = {};
      Object.keys(prev).forEach((key) => {
        newDropdowns[key] = key === item.displayName ? !prev[key] : false;
      });
      return newDropdowns;
    });
  };

  const closeDropdownAfterClick = (event, id) => {
    event.stopPropagation();
    setOpenDropdowns((prev) => ({ ...prev, [id]: false }));
  };


  const hoverCard = (value, childName, subchild) => {
    setTimeout(() => {
      const valueEl = document.querySelector(`ul #${value}`);
      const childEl = document.querySelector(`.sub-dropdown-menu#${childName}`);
      const subchildEl = subchild ? document.querySelector(`.sub-sub-dropdown-menu#${subchild}`) : null;

      if (!valueEl || !childEl) return;

      const heights = [valueEl.clientHeight, childEl.clientHeight, subchildEl?.clientHeight || 0];
      const highestValue = Math.max(...heights);

      [valueEl, childEl, subchildEl].forEach((el) => {
        if (el) el.style.height = `${highestValue}px`;
      });
    }, 100);
  };

  const handleLogout = () => {

  }

  const onLogout = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  const getPermittedRoutes = (routes, role) => {
    if (role.option_id === 2) {
      return routes;
    }

    const activePermissions = role.permissions
      .filter(p => p.is_active)
      .map(p => p.permission_name);

    return routes.filter(route => {
      const requiredPermission = permissionMap[route.displayName];
      return !requiredPermission || activePermissions.includes(requiredPermission);
    });
  };

  const permittedRoutes = getPermittedRoutes(adminRoutes, role);

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="py-2 border-bottom organization-header"
    >
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold text-primary">
          <img src={logo} alt="Logo" className="img-fluid" width={150} />
        </Navbar.Brand>

        <div className="d-flex justify-content-between align-items-center flex-shrink-0 img-logo">
          <div className="main-navigation">
            <ul className="main-nav">
              {permittedRoutes.map((item, index) => (
                <React.Fragment key={index}>
                  {item.route ? (
                    <li className={`main-nav-items ${location.pathname === item.route ? 'active' : ''}`}>
                      <Link to={item.route} className="d-flex align-items-center">
                        <div className="mx-2">
                          <img src={item.icon} alt="" className="my-0" width="17" />
                        </div>
                        <span className="nav-link-text ">{item.displayName}</span>
                      </Link>
                    </li>
                  ) : null}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <ul class="navbar-nav align-items-center ms-auto">
            {/* <li class="nav-item dropdown  position-relative">
              <a href="#" class="nav-link dropdown-toggle no-caret" role="button" >
                <div className="user-login"><span>Anup Maurya</span> <span>(Admin)</span></div>
              </a>

            </li> */}
            <li class="nav-item dropdown d-none">
              <a href="#" class="nav-link dropdown-toggle no-caret" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="false">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <div class="dropdown-menu dropdown-menu-end p-3 d-none">
                <form><input type="text" class="form-control border-0 shadow-none px-3" placeholder="Search..." autofocus="" /></form>
                <div class="dropdown-divider"></div>
                <h6 class="dropdown-header d-flex justify-content-between">
                  Recently searched:
                  <a href="javascript:void(0)" class="text-muted ms-5">Clear</a>
                </h6>
                <div class="max-h-[300px] overflow-auto">
                  <a class="dropdown-item" href="javascript:void(0)">Calendar</a>
                  <a class="dropdown-item" href="javascript:void(0)">Chat</a>
                  <a class="dropdown-item" href="javascript:void(0)">Email</a>
                  <a class="dropdown-item" href="javascript:void(0)">File manager</a>
                  <a class="dropdown-item" href="javascript:void(0)">Forum</a>
                  <a class="dropdown-item" href="javascript:void(0)">Invoice</a>
                  <a class="dropdown-item" href="javascript:void(0)">Photos</a>
                  <a class="dropdown-item" href="javascript:void(0)">Pricing</a>
                  <a class="dropdown-item" href="javascript:void(0)">Todo</a>
                  <a class="dropdown-item" href="javascript:void(0)">Blog</a>
                  <a class="dropdown-item" href="javascript:void(0)">Settings</a>
                  <a class="dropdown-item" href="javascript:void(0)">Profile</a>
                </div>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle no-caret" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                <div class="position-relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                  </svg>
                  <span class="badge bg-danger position-absolute top-0 start-100 translate-middle p-1">
                    <span class="visually-hidden">unread notifications</span>
                  </span>
                </div>
              </a>
              <div class="dropdown-menu dropdown-menu-end">
                <h6 class="dropdown-header d-flex justify-content-between">
                  5 New notifications
                  <a href="javascript:void(0)" class="text-muted ms-5">Clear</a>
                </h6>
                <div class="dropdown-divider"></div>
                <div class="max-h-[300px] overflow-auto">
                  <a class="dropdown-item d-flex align-items-center gap-3 py-2" href="javascript:void(0)">
                    <svg class="text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <div class="vstack">
                      <p class="mb-0">New customer registered</p>
                      <small class="text-muted">5 min ago</small>
                    </div>
                  </a>
                  <a class="dropdown-item d-flex align-items-center gap-3 py-2" href="javascript:void(0)">
                    <svg class="text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <div class="vstack">
                      <p class="mb-0">New order received</p>
                      <small class="text-muted">11 min ago</small>
                    </div>
                  </a>
                  <a class="dropdown-item d-flex align-items-center gap-3 py-2" href="javascript:void(0)">
                    <svg class="text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
                    </svg>
                    <div class="vstack">
                      <p class="mb-0">Plugin updates available <span class="badge rounded-pill ms-1 bg-secondary align-bottom">3</span></p>
                      <small class="text-muted">30 min ago</small>
                    </div>
                  </a>
                  <a class="dropdown-item d-flex align-items-center gap-3 py-2" href="javascript:void(0)">
                    <svg class="text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    <div class="vstack">
                      <p class="mb-0">Download completed</p>
                      <small class="text-muted">35 min ago</small>
                    </div>
                  </a>
                  <a class="dropdown-item d-flex align-items-center gap-3 py-2" href="javascript:void(0)">
                    <svg class="text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <div class="vstack">
                      <p class="mb-0">Weekly usage report</p>
                      <small class="text-muted">40 min ago</small>
                    </div>
                  </a>
                </div>
              </div>
            </li>
            <li class="nav-item vr mx-3"></li>
            <li class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle no-caret py-0 pe-0 " role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://mimity-admin904.netlify.app/assets/img/user/user1.svg" width="32" alt="User" class="rounded-circle" loading="lazy" />
              </a>
              <ul class="dropdown-menu dropdown-menu-end" data-bs-popper="none">
                <li><a class="dropdown-item" href="javascript:void(0)">Profile</a></li>
                <li><a class="dropdown-item" href="/user-settings">Settings</a></li>
                <li>
                  <div class="dropdown-divider"></div>
                </li>
                <li><span class="dropdown-item" onClick={onLogout}>Sign out</span></li>
              </ul>
            </li>
          </ul>
        </div>
      </Container>
    </Navbar>
  );
};

export default OrganizationHeader;
