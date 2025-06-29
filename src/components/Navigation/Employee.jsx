import { NavLink } from "react-router-dom";
import { dLogout } from "../../http";
import { setAuth } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const Employee = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const { user } = useSelector(state => state.authSlice);

  const logout = async () => {
    await dLogout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(setAuth(null))
    return history.push('/login');
  }


  return (

    <aside className="d-flex flex-column justify-content-between bg-light  min-vh-100" style={{ width: '260px', borderRight: "1px dashed #ddd9d9" }}>
      <div className=" pt-4" style={{
        overflowY: "auto",
        padding: "0 24px",
        height: "calc(100vh - 120px)",
        borderRadius: "7px",
      }}>
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
        {/* Search */}
        {/* <div className="mb-4 position-relative">
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search"
            style={{ background: "#ededed" }}
          />
          <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary"></i>
        </div> */}
        <hr style={{ width: '100%', border: "1px dashed #a9a7a7" }} />

        <ul className="sidebar-menu">
          <li><NavLink className="nav-link" to="/home"><i className="fas fa-fire"></i> <span>Dashboard</span></NavLink></li>
          <li><NavLink className="nav-link" to="/userTeams"><i className="fas fa-users"></i> <span>Team</span></NavLink></li>

          {(user?.user?.branch === 'tech' || user?.user?.branch === 'telecaller') && <li><NavLink className="nav-link" to="/task"><i className="fas fa-users"></i> <span>Task</span></NavLink></li>}
          {user?.user?.branch === 'sales' && <li><NavLink className="nav-link" to="/deals"><i className="fas fa-users"></i> <span>Deals</span></NavLink></li>}
          <li><NavLink className="nav-link" to="/userAttendance"><i className="fas fa-user"></i> <span>Attendance</span></NavLink></li>
          <li><NavLink className="nav-link" to="/events"><i className="fas fa-users"></i> <span>Events</span></NavLink></li>
          <li><NavLink className="nav-link" to="/applyforleave"><i className="fas fa-pen"></i> <span>Apply For Leave</span></NavLink></li>
          <li><NavLink className="nav-link" to="/userLeaveApplications"><i className="fas fa-book"></i> <span>Leave Applications</span></NavLink></li>
          <li><NavLink className="nav-link" to="/useassestApplications"><i className="fas fa-book"></i> <span>Assest Request Track</span></NavLink></li>
          <li><NavLink className="nav-link" to="/userSalary"><i class="fas fa-piggy-bank"></i> <span>Salary</span></NavLink></li>
          <li><NavLink className="nav-link" to="/applyforadmin"><i className="fas fa-pen"></i> <span>Apply For Assest</span></NavLink></li>

          <li className="menu-header">Settings</li>
          <li><NavLink className="nav-link" to="/contact_us"><i className="fab fa-teamspeak"></i> <span>Contact me</span></NavLink></li>
          {/* <li><NavLink className="nav-link" to="/home"><i className="fas fa-info-circle"></i> <span>About me</span></NavLink></li> */}
          <li><NavLink onClick={logout} className="nav-link" to="/home"><i className="fas fa-sign-out-alt"></i> <span>Logout</span></NavLink></li>
        </ul>

      </div>
      {/* Bottom Section: Profile */}
      <div className="fixed-profile p-3  bg-white mt-3 Bottom-profile">
        <div className="hstack gap-3">
          <img
            src={user?.user?.image || "https://storage.googleapis.com/a1aa/image/a30f4b0f-bf59-42e4-9877-79dc397bc7ec.jpg"}
            alt="Jenny Stacy"
            className="rounded-circle object-fit-cover"
            width={32}
            height={32}
          />
          <div className="small">
            <strong className="text-dark d-block">{user?.user?.name}</strong>
            <span className="text-secondary">{user?.user?.email}</span>
          </div>
          <NavLink to='/' onClick={logout} className="ms-auto me-2 ">
            <i class="bi bi-power text-danger fw-semibold"></i>
          </NavLink>
        </div>

      </div>
    </aside>



  )
}

export default Employee;