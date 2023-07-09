import React, { useState } from "react";
import "../resources/layout.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DefaultLayout = ({ children }) => {
  const [collapse, setCollapse] = useState(false);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Buses",
      path: "/admin/buses",
      icon: "ri-bus-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line",
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;

  let activeRoute = window.location.pathname;

  if(window.location.pathname.includes('book-now')){
    activeRoute = '/'
  }

  return (
    <div className="layout-parent">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">PBUS</h1>
          <h1 className="role">
            {" "}
            {user?.name} <br /> Role: {user?.isAdmin ? "Admin" : "User"}
          </h1>
        </div>
        <div className="d-flex flex-column gap-3 justify-content-start menu">
          {menuToBeRendered.map((item, index) => (
            <div
              className={`${
                activeRoute === item.path && "active-menu-item"
              } menu-item`}
              key={index}
            >
              <i
                className={item.icon}
                onClick={() => {
                  if (item.path === "/logout") {
                    localStorage.removeItem("token");
                    navigate("/login");
                  } else {
                    navigate(item.path);
                  }
                }}
              />
              {!collapse && (
                <span
                  onClick={() => {
                    if (item.path === "/logout") {
                      localStorage.removeItem("token");
                      navigate("/login");
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="body">
        <div className="header">
          {collapse ? (
            <i
              className="ri-menu-line"
              onClick={() => setCollapse(!collapse)}
            ></i>
          ) : (
            <i
              className="ri-close-line"
              onClick={() => setCollapse(!collapse)}
            ></i>
          )}
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default DefaultLayout;
