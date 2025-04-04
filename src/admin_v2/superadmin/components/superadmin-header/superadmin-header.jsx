import React,{useState,useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { NavLink, Navigate, Link, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUserCircle } from "react-icons/fa";
import logo from '../../../../img/landing_page/Group 385.png';
import { logout } from "../../../../features/authSlice";
import { useDispatch } from "react-redux";
import './superadmin-header.scss'

export const adminRoutes = [
  {
    displayName: "Dashboard",
    iconName: "person",
    route: "superadmin/dashboard",
    icon: 'assets/images/dashboard/dashboard-svg.svg',
  },
  {
    displayName: "Manage Organization",
    iconName: "person",
    route: "superadmin/organization-list",
    icon: 'assets/images/dashboard/chart-user-square.svg',
    color: '#11cdef'
  },
  {
    displayName: "Pending Request",
    iconName: "person",
    route: "superadmin/organization-pending-request",
    icon: 'assets/images/dashboard/chart-user-square.svg',
    color: '#11cdef'
  },
  // {
  //   displayName: "Students",
  //   iconName: "person",
  //   route: "organization/student",
  //   icon: 'assets/images/dashboard/users.svg',
  //   color: '#11cdef'
  // },
  // {
  //   displayName: "Manage Roles",
  //   iconName: "person",
  //   route: "organization/roles",
  //   icon: 'assets/images/dashboard/users.svg',
  //   color: '#11cdef'
  // }
];
const SuperAdminHeader = () => {
  const [selectedNavMenu, setSelectedNavMenu] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();

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
    localStorage.clear()
    window.location.href = "/"
  }

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="py-2 border-bottom superadmin-header"
    >
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold text-primary">
          <img src={logo} alt="Logo" className="img-fluid" width={150} />
        </Navbar.Brand>

        <div className="d-flex justify-content-between align-items-center flex-shrink-0 img-logo">
          <div className="main-navigation">
            <ul className="main-nav">
              {adminRoutes.map((item, index) => (
                <React.Fragment key={index}>
                  {item.route ? (
                    <li className="main-nav-items">
                      <Link to={item.route} className="d-flex align-items-center">
                        <div className="mx-2">
                          <img src={item.icon} alt="" className="my-0" width="17" />
                        </div>
                        <span className="nav-link-text">{item.displayName}</span>
                      </Link>
                    </li>
                  ) : null}

                  {item.children?.length ? (
                    <li
                      className={`dropdown main-nav-items ${openDropdowns[item.displayName] ? "active" : ""}`}
                      onClick={(e) => toggleDropdown(e, item)}
                    >
                      <button className="main-m d-flex align-items-center">
                        <div className="mx-2">
                          <img src={item.icon} alt="" className="my-0" width="17" />
                        </div>
                        <span className="nav-link-text">{item.displayName}</span>
                      </button>
                      {openDropdowns[item.displayName] && (
                        <div className="dropdown-menu" id={item.displayName}>
                          <ul className="parent-drop">
                            {item.children.map((child, cIndex) => (
                              <React.Fragment key={cIndex}>
                                {child.subChildrens?.length ? (
                                  <li className="subdropdown sub-child" onMouseEnter={() => hoverCard(item.displayName, child.displayName)}>
                                    <span className="dropdown-link d-flex py-2 px-2 justify-content-between">
                                      <div>
                                        <i className={`bi mx-2 ${child.icon}`}></i>
                                        <span className="nav-link-text">{child.displayName}</span>
                                      </div>
                                    </span>
                                    <ul className="sub-dropdown-menu" id={child.displayName}>
                                      {child.subChildrens.map((subchild, scIndex) => (
                                        <li key={scIndex} className="subsubdropdown sub-child" onMouseEnter={() => hoverCard(item.displayName, child.displayName, subchild.displayName)}>
                                          {subchild.subSubChilds?.length ? (
                                            <>
                                              <span className="dropdown-link py-2 px-2 d-flex justify-content-between align-items-center">
                                                {subchild.displayName}
                                              </span>
                                              <ul className="sub-sub-dropdown-menu" id={subchild.displayName}>
                                                {subchild.subSubChilds.map((subsubChild, sscIndex) => (
                                                  <li key={sscIndex}>
                                                    <Link className="dropdown-link py-2 px-2" to="#">
                                                      {subsubChild.displayName}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            </>
                                          ) : (
                                            <Link className="dropdown-link py-2 px-2" to="#">
                                              {subchild.displayName}
                                            </Link>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ) : (
                                  <li className="single-child" onClick={(e) => closeDropdownAfterClick(e, item.displayName)}>
                                    <Link className="dropdown-link py-2 px-2" to={child.route}>
                                      <div className="d-flex align-items-center">
                                        <div className="mx-2">
                                          <i className={`bi ${child.icon}`}></i>
                                        </div>
                                        <span className="nav-link-text">{child.displayName}</span>
                                      </div>
                                    </Link>
                                  </li>
                                )}
                              </React.Fragment>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ) : null}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <ul class="navbar-nav align-items-center ms-auto">
            <li class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle no-caret" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="false">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <div class="dropdown-menu dropdown-menu-end p-3">
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
                <li><a class="dropdown-item" onClick={handleLogout}>Sign out</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </Container>
    </Navbar>
  );
};

export default SuperAdminHeader;
