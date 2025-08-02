import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { dLogout } from "../http";
import { setAuth } from "../store/auth-slice";
import { useState } from "react";
import SideBar from "./sidebar";

const Navigation = () => {
  const { user } = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logout = async () => {
    await dLogout();
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(setAuth(null));
    return history.push("/login");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-right flex justify-content-end"
        style={{
          position: "fixed",
          padding: "24px",
          background: "#fff",
          margin: "11px 20px",
          borderRadius: "20px",
          // width: "calc(100% - 40px)",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{
            background: "transparent",
            color: "#000",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "25px",
            position: "absolute",
            left: "22px",
          }}
        >
          <i class="bi bi-layout-sidebar-inset-reverse"></i>
        </button>

        {/* <ul className="navbar-nav navbar-right ">
          <li className="dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle nav-link-lg nav-link-user d-flex"
            >
              <img
                alt="image"
                src={user?.user?.image || "/assets/icons/user-1.jpg"}
                className="rounded-circle "
                style={{ width: "40px", height: "40px" }}
              />
              <div className="ms-2 mt-0">
                <p
                  className="m-0 text-muted text-sm"
                  style={{ fontSize: "12px" }}
                >
                  Welcome Back
                </p>
                <h6
                  className="d-sm-none d-lg-inline-block mb-0"
                  style={{ fontSize: "14px" }}
                >
                  {user?.user?.name}
                </h6>
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <NavLink
                to={`/employee/${user?.user?.id}`}
                className="dropdown-item has-icon"
              >
                <i className="far fa-user"></i> Profile
              </NavLink>
              <div className="dropdown-divider"></div>
              <NavLink
                to="/"
                onClick={logout}
                className="dropdown-item has-icon text-danger"
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </NavLink>
            </div>
          </li>
        </ul> */}

<ul className="navbar-nav navbar-right ">
          <li>
            <hr
              className="border border-1 opacity-5"
              style={{
                height: "38px",
                position: "absolute",
                bottom: "0px",
                borderColor: "#e9e9e9",
              }}
            />
          </li>
          {/* <li className="dropdown dropdown-list-toggle">
            <a
              href="#"
              data-toggle="dropdown"
              className="nav-link notification-toggle nav-link-lg beep"
            >
              <i className="far fa-bell mt-1"></i>
            </a>
            <div className="dropdown-menu dropdown-list dropdown-menu-right">
              <div className="dropdown-header">
                Notifications
                <div className="float-right">
                  <NavLink to="/">Mark All As Read</NavLink>
                </div>
              </div>
              <div className="dropdown-list-content dropdown-list-icons">
                <NavLink to="/" className="dropdown-item dropdown-item-unread">
                  <div className="dropdown-item-icon bg-primary text-white">
                    <i className="fas fa-code"></i>
                  </div>
                  <div className="dropdown-item-desc">
                    Template update is available now!
                    <div className="time text-primary">2 Min Ago</div>
                  </div>
                </NavLink>
                <NavLink to="/" className="dropdown-item">
                  <div className="dropdown-item-icon bg-info text-white">
                    <i className="far fa-user"></i>
                  </div>
                  <div className="dropdown-item-desc">
                    <b>You</b> and <b>Dedik Sugiharto</b> are now friends
                    <div className="time">10 Hours Ago</div>
                  </div>
                </NavLink>
                <NavLink to="/" className="dropdown-item">
                  <div className="dropdown-item-icon bg-success text-white">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="dropdown-item-desc">
                    <b>Kusnaedi</b> has moved task <b>Fix bug header</b> to{" "}
                    <b>Done</b>
                    <div className="time">12 Hours Ago</div>
                  </div>
                </NavLink>
                <NavLink to="/" className="dropdown-item">
                  <div className="dropdown-item-icon bg-danger text-white">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="dropdown-item-desc">
                    Low disk space. Let's clean it!
                    <div className="time">17 Hours Ago</div>
                  </div>
                </NavLink>
                <NavLink to="/" className="dropdown-item">
                  <div className="dropdown-item-icon bg-info text-white">
                    <i className="fas fa-bell"></i>
                  </div>
                  <div className="dropdown-item-desc">
                    Welcome to Stisla template!
                    <div className="time">Yesterday</div>
                  </div>
                </NavLink>
              </div>
              <div className="dropdown-footer text-center">
                <NavLink to="/">
                  View All <i className="fas fa-chevron-right"></i>
                </NavLink>
              </div>
            </div>
          </li> */}
          <li>
            <hr
              className="border border-1 opacity-5"
              style={{
                height: "38px",
                position: "absolute",
                bottom: "0px",
                marginLeft: "3px",
                borderColor: "#e9e9e9",
              }}
            />
          </li>
          <li className="dropdown">
            <a
              href="#"
              data-toggle="dropdown"
              className="nav-link dropdown-toggle nav-link-lg nav-link-user d-flex"
            >
              <img
                alt="image"
                src={user?.user?.image || "/assets/icons/user-1.jpg"}
                className="rounded-circle "
                style={{ width: "40px", height: "40px" }}
              />
              <div className="ms-2 mt-0" style={{ lineHeight: "0px" }}>
                <p
                  className="m-0 text-muted text-sm"
                  style={{ fontSize: "12px" }}
                >
                  Welcome Back
                </p>
                <h6
                  className="d-sm-none d-lg-inline-block mb-0"
                  style={{ fontSize: "14px" }}
                >
                  {user?.user?.name}
                </h6>
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              {/* <div className="dropdown-title">Logged in 5 min ago</div> */}
              <NavLink
                to={`/employee/${user?.user?.id}`}
                className="dropdown-item has-icon"
              >
                <i className="far fa-user"></i> Profile
              </NavLink>
              <NavLink
                to="features-activities.html"
                className="dropdown-item has-icon"
              >
                <i className="fas fa-bolt"></i> Activities
              </NavLink>
              <NavLink
                to="features-settings.html"
                className="dropdown-item has-icon"
              >
                <i className="fas fa-cog"></i> Settings
              </NavLink>
              <div className="dropdown-divider"></div>
              <NavLink
                to="/"
                onClick={logout}
                className="dropdown-item has-icon text-danger"
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </NavLink>
            </div>
          </li>
        </ul>      </nav>

      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navigation;
