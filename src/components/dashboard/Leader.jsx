import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import api, { getMembers_Leader } from "../../http";

const Leader = () => {
  const authState = useSelector((state) => state.authSlice);
  const user = authState?.user?.user || {};
  const [meetingsToday, setMeetingsToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [users, setUsers] = useState();
  const [holiday, setHoliday] = useState(3);
  const [preview, setPreview] = useState(0);

  const [filters, setFilters] = useState({
    status: "won",
    assigned_employee: "",
    startDate: "",
    endDate: "",
  });
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [birthdaysToday, setBirthdaysToday] = useState([]);

  useEffect(() => {
    api
      .get("task/todayevents?type=birthday") // <-- API endpoint
      .then((res) => {
        setBirthdaysToday(res.data); // 👈 make sure 'users' match backend response
      })
      .catch((err) => {
        console.error("Error fetching birthday data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const [showAnimation, setShowAnimation] = useState(true); // start with animation visible

  useEffect(() => {
    if (showAnimation && birthdaysToday?.length > 0) {
      const timer = setTimeout(() => {
        setShowAnimation(false); // close after 5 seconds
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation, birthdaysToday]);

  useEffect(() => {
    (async () => {
      const res = await getMembers_Leader();
      if (res.success) {
        setUsers(res.data);
        console.log(res.data);
      }
    })();
  }, []);

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  useEffect(() => {
    if (birthdaysToday?.length > 0) {
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowAnimation(false);
    }
  }, [birthdaysToday]);

  // Fetch Today's Meetings
  useEffect(() => {
    const fetchMeetingsForToday = async () => {
      try {
        const response = await api.get(
          `/task/meetings/today/${user.id}`
        );
        setMeetingsToday(response.data);
      } catch (error) {
        console.error("Error fetching today's meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user || user.id) {
      fetchMeetingsForToday();
      fetchFilteredDeals();
    }
  }, [user]);

  // Fetch filtered deals
  const fetchFilteredDeals = async () => {
    setLoadingDeals(true);
    try {
      const params = {
        assigned_leader: user.id,
        status: filters.status,
        ...(filters.assigned_employee && {
          assigned_employee: filters.assigned_employee,
        }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      const response = await api.get("/task/filterDeals", { params });
      setDeals(response.data);
    } catch (error) {
      console.error("Error fetching filtered deals:", error);
    } finally {
      setLoadingDeals(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchFilteredDeals();
  };

  
const holidays = [
  {
    title: "New Year",
    date: "01-01-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-calendar2-week" />,
  },
  {
    title: "Swami Vivekananda Jayanti",
    date: "12-01-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-award" />,
  },
  {
    title: "Makar Sankranti",
    date: "14-01-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-sunrise-fill" />,
  },
  {
    title: "Republic Day",
    date: "26-01-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-flag-fill" />,
  },
  {
    title: "Holi",
    date: "14-03-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-bucket-fill" />,
  },
  {
    title: "Hariyali Teej",
    date: "30-07-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-flower3" />,
  },
  {
    title: "Raksha Bandhan",
    date: "09-08-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-heart-fill" />,
  },
  {
    title: "Independence Day",
    date: "15-08-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-flag" />,
  },
  {
    title: "Janmashtami",
    date: "16-08-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-star-fill" />,
  },
  {
    title: "Ganesh Chaturthi",
    date: "28-08-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-circle-half" />,
  },
  {
    title: "Vijay Dashami",
    date: "02-10-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-crosshair" />,
  },
  {
    title: "Diwali",
    date: "20-10-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-brightness-high-fill" />,
  },
  {
    title: "Goverdhan Pooja",
    date: "21-10-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-cloud-fog2-fill" />,
  },
  {
    title: "Bhai Dooj",
    date: "22-10-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-people-fill" />,
  },
  {
    title: "Guru Nanak Jayanti",
    date: "05-11-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-person-check" />,
  },
  {
    title: "Christmas Day",
    date: "25-12-2025",
    duration: "1 Day only",
    icon: <i className="bi bi-gift-fill" />,
  },
];
  return (
    <>
      <div className="row">
        <div className="col-xl-4">
          <div className="card cardborder overflow-hidden p-0 rounded-3 ">
            <div className="bg-primary-subtle">
              <div className="row">
                <div className="col-7">
                  <div className="text-primary p-3">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p>{user?.name}</p>
                  </div>
                </div>
                <div className="col-5 align-self-end">
                  <img
                    src="./assets/icons/undraw_hello_ccwj.svg"
                    alt="Profile"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>

            <div className="card-body pt-0" style={{ paddingBottom: "185px" }}>
              <div className="row">
                <div className="col-sm-5">
                  <div className="avatar-md profile-user-wid mb-4 position-relative">
                    <img
                      src={user?.image || "./assets/icons/user-1.jpg"}
                      alt="User Avatar"
                      className="img-thumbnail rounded-circle"
                    />
                    <span
                      className="activedot"
                      style={{
                        backgroundColor: "#65d500",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        display: "inline-block",
                        position: "absolute",
                        bottom: "3px",
                        right: "12px",
                      }}
                    ></span>
                  </div>
                  <h5
                    className="font-size-15 text-truncate mb-0"
                    style={{ fontSize: "16px" }}
                  >
                    {user.name}
                  </h5>
                  <p
                    className="text-muted mb-0 text-truncate"
                    style={{ fontSize: "14px" }}
                  >
                    {user.type}
                  </p>
                  <p
                    className="text-muted mb-0 text-truncate"
                    style={{ fontSize: "14px" }}
                  >
                    {user?.desgination}
                  </p>
                </div>

                <div className="col-sm-7 mt-5">
                  <div className="pt-4">
                    <div className="row">
                      <div className="col-12">
                        <h5
                          className="font-size-15 mb-0"
                          style={{ fontSize: "14px" }}
                        >
                          Contact
                        </h5>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          {user.email}
                        </p>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          {user.mobile}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Holidays Section */}
        <div className="col-md-8">
          <div className="col-lg- mb-4">
            <div className="card cardborder rounded-4 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="icon-wrapper bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                    <img
                      src="./assets/icons/sunbed.png"
                      alt="holiday"
                      width="28"
                      height="28"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h2 className="mb-0 fw-bold">Company Holidays</h2>
                </div>

                <div className="holiday-list mb-3">
                  {holidays.slice(preview, holiday).map((holiday, index) => (
                    <div
                      key={index}
                      className={`d-flex justify-content-between align-items-center py-3 ${index !== holidays.length - 1 ? "border-bottom" : ""
                        }`}
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-3">{holiday.icon}</div>
                        <div>
                          <p className="mb-0 fw-semibold">{holiday.title}</p>
                          <p className="mb-0 text-muted small">
                            <i className="far fa-calendar-alt me-1"></i>
                            {holiday.date}
                          </p>
                        </div>
                      </div>
                      <span className="badge bg-danger bg-opacity-10 text-danger">
                        {holiday.duration}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    onClick={() => {
                      setHoliday(holiday - 3);
                      setPreview(preview - 3);
                    }}
                    disabled={holiday <= 3}
                    className="btn btn-orange"
                  >
                    <i className="fas fa-eye me-1"></i> View Less
                  </button>
                  <button
                    onClick={() => {
                      setHoliday(holiday + 3);
                      setPreview(preview + 3);
                    }}
                    disabled={holiday >= holidays.length}
                    className="btn btn-orange"
                  >
                    <i className="fas fa-eye me-1"></i> View More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meetings Section */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card cardborder rounded-4">
            <h5 className="card-header">Today's Meetings</h5>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Venue</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : meetingsToday?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No meetings scheduled for today.
                        </td>
                      </tr>
                    ) : (
                      meetingsToday?.map((meeting, index) => (
                        <tr key={index} className="text-danger">
                          <td className="text-danger">{meeting.title}</td>
                          <td className="text-danger">
                            {new Date(meeting.startDate).toLocaleString()}
                          </td>
                          <td className="text-danger">
                            {new Date(meeting.endDate).toLocaleString()}
                          </td>
                          <td className="text-danger">{meeting.venue}</td>
                          <td className="text-danger">{meeting.location}</td>
                          <td className="text-danger">
                            {meeting.dealId?.status}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Section with Filters */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card cardborder rounded-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Deals</h5>
              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="won">Won</option>
                  <option value="untouched">Untouched</option>
                  <option value="next_meeting">Next Meeting</option>
                  <option value="quotation">Quotation</option>
                  <option value="Loss">Loss</option>
                </select>

                <select
                  className="form-select form-select-sm"
                  name="assigned_employee"
                  value={filters.assigned_employee}
                  onChange={handleFilterChange}
                >
                  <option value="">All Employees</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={applyFilters}
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Assigned Employee</th>
                      <th>Assigned leader</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingDeals ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          Loading deals...
                        </td>
                      </tr>
                    ) : deals.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No deals found
                        </td>
                      </tr>
                    ) : (
                      deals.map((deal) => (
                        <tr key={deal._id}>
                          <td>{deal.lead?.name || "N/A"}</td>
                          <td>{deal.assigned_employee?.name || "N/A"}</td>
                          <td>{deal.assigned_leader?.name || "N/A"}</td>

                          <td>
                            <span
                              className={`badge bg-${deal.status === "won"
                                ? "success"
                                : deal.status === "Loss"
                                  ? "danger"
                                  : "warning"
                                }`}
                            >
                              {deal.status}
                            </span>
                          </td>
                          <td>
                            {new Date(deal.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <div>
                {showAnimation && birthdaysToday?.length > 0 && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      zIndex: 9999,
                    }}
                  >
                    <iframe
                      src="https://lottie.host/embed/2d8d036d-43ea-4820-9f17-b6631846aed5/uqTlmKSbkU.lottie"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                      title="Birthday Animation"
                      allowFullScreen
                    ></iframe>
                    <audio src="./assets/icons/cl.mp3" autoPlay />
                  </div>
                )}

                <div className="cardborder p-3 mb-3 rounded-4">
                  {loading ? (
                    <p>Loading...</p>
                  ) : birthdaysToday?.length > 0 ? (
                    birthdaysToday?.map((employee, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center birthday-card mb-4 "
                        style={{
                          backgroundImage:
                            "url(./assets/icons/freepik__adjust__63979.png)",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={
                              `https://api.sevenunique.com/storage/${employee?.image}` ||
                              "./assets/icons/user-1.jpg"
                            } // 👈 Adjust this path if needed
                            alt={employee.name}
                            className="rounded-circle"
                            width="48"
                            height="48"
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <p className="mb-0 employee-name">
                              {employee.name}
                            </p>
                            <p className="mb-0 employee-desc">
                              Has {employee?.type} today.
                            </p>
                            <p className="mb-0 employee-desc">
                              {employee.quote}
                            </p>
                            {/* <p className="mb-0 employee-desc">{employee.dob}</p> */}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center mb-4 cardborder rounded-4 p-4 h-100 d-flex flex-column align-items-center justify-content-center  bg-white">
                      <img
                        src="/bithday.jpg"
                        alt="No birthdays"
                        className="rounded-circle mb-3 shadow"
                        width="200"
                        height="200"
                        style={{
                          objectFit: "cover",
                          opacity: 0.7,
                          border: "4px solid #f0f0f0",
                        }}
                      />
                      <h5 className="fw-semibold text-secondary">
                        No Birthdays Today 🎉
                      </h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leader;
