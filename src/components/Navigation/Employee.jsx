import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dLogout } from "../../http";
import { setAuth } from "../../store/auth-slice";

const Employee = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state) => state.authSlice);

  const [isOpen, setIsOpen] = useState(false);

  const logout = async () => {
    await dLogout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(setAuth(null));
    return history.push("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="btn btn-primary d-md-none m-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-light d-flex flex-column justify-content-between
          ${isOpen ? "show-sidebar" : "hide-sidebar"}`}
      >
        <div
          className="pt-4"
          style={{
            overflowY: "auto",
            padding: "0 24px",
            height: "calc(100vh - 120px)",
            borderRadius: "7px",
          }}
        >
          {/* Logo */}
          <div className="d-flex align-items-center mb-4">
            <img
              src="/assets/icons/logo.png"
              alt="Finunique logo"
              width={50}
              height={50}
              className="me-2"
            />
          </div>
          <hr style={{ width: "100%", border: "1px dashed #a9a7a7" }} />

          <ul className="sidebar-menu list-unstyled">
            <li>
              <NavLink className="nav-link" to="/home">
                <i className="fas fa-fire"></i> <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/userTeams">
                <i className="fas fa-users"></i> <span>Team</span>
              </NavLink>
            </li>

            {(user?.user?.branch === "tech" ||
              user?.user?.branch === "telecaller") && (
              <li>
                <NavLink className="nav-link" to="/task">
                  <i className="fas fa-tasks"></i> <span>Task</span>
                </NavLink>
              </li>
            )}
            {user?.user?.branch === "sales" && (
              <li>
                <NavLink className="nav-link" to="/deals">
                  <i className="fas fa-handshake"></i> <span>Deals</span>
                </NavLink>
              </li>
            )}
            <li>
              <NavLink className="nav-link" to="/userAttendance">
                <i className="fas fa-user"></i> <span>Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/events">
                <i className="fas fa-calendar"></i> <span>Events</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/applyforleave">
                <i className="fas fa-pen"></i> <span>Apply For Leave</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/userLeaveApplications">
                <i className="fas fa-book"></i> <span>Leave Applications</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/useassestApplications">
                <i className="fas fa-laptop"></i> <span>Assest Request</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/userSalary">
                <i className="fas fa-piggy-bank"></i> <span>Salary</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/applyforadmin">
                <i className="fas fa-pen"></i> <span>Apply For Assest</span>
              </NavLink>
            </li>

            <li className="menu-header mt-2">Settings</li>
            <li>
              <NavLink className="nav-link" to="/contact_us">
                <i className="fab fa-teamspeak"></i> <span>Contact</span>
              </NavLink>
            </li>
            <li>
              <NavLink onClick={logout} className="nav-link" to="/home">
                <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Bottom Profile */}
        <div className="p-3 bg-white mt-3 Bottom-profile">
          <div className="d-flex align-items-center gap-2">
            <img
              src={
                user?.user?.image ||
                "https://storage.googleapis.com/a1aa/image/a30f4b0f-bf59-42e4-9877-79dc397bc7ec.jpg"
              }
              alt="Profile"
              className="rounded-circle object-fit-cover"
              width={32}
              height={32}
            />
            <div className="small">
              <strong>{user?.user?.name}</strong>
              <span className="text-secondary d-block">{user?.user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="btn btn-sm btn-light ms-auto text-danger"
            >
              <i className="bi bi-power"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar CSS */}
      <style>{`
        aside {
          width: 260px;
          border-right: 1px dashed #ddd9d9;
          min-height: 100vh;
          transition: transform 0.3s ease-in-out;
        }
        .hide-sidebar {
          transform: translateX(-100%);
        }
        .show-sidebar {
          transform: translateX(0);
          position: fixed;
          z-index: 1050;
          top: 0;
          left: 0;
          height: 100%;
          background: white;
        }
        @media (min-width: 768px) {
          aside {
            transform: translateX(0);
            position: static;
          }
          .btn.btn-primary.d-md-none {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Employee;
