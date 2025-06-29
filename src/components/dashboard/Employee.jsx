import { useEffect, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import api, { getCounts } from "../../http";
import { setCount } from "../../store/main-slice";
import CountsCard from "./CountsCard";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const Admin = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const res = await getCounts();
      if (res?.success) dispatch(setCount(res?.data));
    })();
  }, []);

  const { counts } = useSelector((state) => state.mainSlice);
  const { user } = useSelector((state) => state.authSlice.user || {});
  const { admin, employee, leader, team } = counts;

  const [state, setState] = React.useState({
    series: [
      {
        name: "Present",
        data: [25, 28, 22, 30, 27, 26, 29],
      },
      {
        name: "Absent",
        data: [5, 2, 8, 0, 3, 4, 1],
      },
    ],
    options: {
      chart: {
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      title: {
        text: "Weekly Attendance Report",
        align: "left",
      },
      yaxis: {
        title: {
          text: "Number of Employees",
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} employees`,
        },
      },
    },
  });

  const developerTasks = [
    {
      time: "09:00 am",
      color: "primary",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Commit pushed
          </p>
        </>
      ),
    },
    {
      time: "10:30 am",
      color: "success",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Deployed to staging
          </p>
        </>
      ),
    },
    {
      time: "12:15 pm",
      color: "warning",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Bug fixed
          </p>
        </>
      ),
    },
    {
      time: "02:00 pm",
      color: "info",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Code reviewed
          </p>
        </>
      ),
    },
    {
      time: "03:45 pm",
      color: "danger",
      description: (
        <>
          <p style={{ fontSize: "12px", fontWeight: "600" }} className="mb-0">
            Rollback performed
          </p>
        </>
      ),
    },
  ];
  // 1. Declare employees FIRST

  const [birthdaysToday, setBirthdaysToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [holiday, setHoliday] = useState(3);
  const [preview, setPreview] = useState(0);
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

  // console.log("testing", birthdaysToday?.data);

  const holidays = [
    {
      title: "New Year's Day",
      date: "01-01-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-calendar2-week" />,
    },
    {
      title: "Guru Gobind Singh Jayanti",
      date: "06-01-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-person-bounding-box" />,
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
      title: "Vasant Panchami",
      date: "10-02-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-flower3" />,
    },
    {
      title: "Women's Day",
      date: "08-03-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-gender-female" />,
    },
    {
      title: "Holi",
      date: "17-03-2025",
      duration: "2 Days only",
      icon: <i className="bi bi-bucket-fill" />,
    },
    {
      title: "Good Friday",
      date: "29-03-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-cross" />,
    },
    {
      title: "Eid-ul-Fitr",
      date: "10-04-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-moon-stars-fill" />,
    },
    {
      title: "Ambedkar Jayanti",
      date: "14-04-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-book" />,
    },
    {
      title: "Ram Navami",
      date: "18-04-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-person-standing" />,
    },
    {
      title: "Labour Day",
      date: "01-05-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-tools" />,
    },
    {
      title: "Buddha Purnima",
      date: "23-05-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-fire" />,
    },
    {
      title: "Bakrid",
      date: "17-06-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-moon-fill" />,
    },
    {
      title: "Muharram",
      date: "17-07-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-droplet-fill" />,
    },
    {
      title: "Independence Day",
      date: "15-08-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-flag" />,
    },
    {
      title: "Raksha Bandhan",
      date: "19-08-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-heart-fill" />,
    },
    {
      title: "Teachers' Day",
      date: "05-09-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-journal-bookmark-fill" />,
    },
    {
      title: "Milad-un-Nabi",
      date: "16-09-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-star-fill" />,
    },
    {
      title: "Mahalaya Amavasya",
      date: "30-09-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-circle-half" />,
    },
    {
      title: "Gandhi Jayanti",
      date: "02-10-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-person-check" />,
    },
    {
      title: "Dussehra",
      date: "12-10-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-crosshair" />,
    },
    {
      title: "Halloween",
      date: "31-10-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-emoji-dizzy-fill" />,
    },
    {
      title: "Kannada Rajyotsava",
      date: "01-11-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-bookmark-star-fill" />,
    },
    {
      title: "Diwali",
      date: "03-11-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-brightness-high-fill" />,
    },
    {
      title: "Bhai Dooj",
      date: "06-11-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-people-fill" />,
    },
    {
      title: "Chhath Puja",
      date: "07-11-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-water" />,
    },
    {
      title: "Govardhan Puja",
      date: "15-11-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-cloud-fog2-fill" />,
    },
    {
      title: "Constitution Day",
      date: "26-11-2025",
      duration: "1 Day only",
      icon: <i className="bi bi-journal-code" />,
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
      <div className="container-fluid">
        {/* Welcome Banner */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card cardborder overflow-hidden rounded-3">
              <div className="bg-primary-subtle p-3">
                <div className="row align-items-center">
                  <div className="col-md-7">
                    <h5 className="text-secondary mb-1">Welcome Back!</h5>
                    <h4 className="text-dark">{user?.name}</h4>
                  </div>
                  <div className="col-md-5 text-end">
                    <img
                      src="./assets/icons/undraw_hello_ccwj.svg"
                      alt="Banner"
                      className="img-fluid"
                      style={{ maxHeight: "120px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-sm-5 mb-3 mb-sm-0">
                    <div className="d-flex align-items-center">
                      <img
                        src={user?.image || "./assets/icons/user-1.jpg"}
                        alt="User Avatar"
                        className="img-thumbnail rounded-circle me-3"
                        width="80"
                        height="80"
                      />
                      <div>
                        <h5 className="mb-0">{user?.name}</h5>
                        <p className="text-muted mb-0">{user?.desgination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-7">
                    <div className="ps-sm-3">
                      <h6 className="mb-1">Contact</h6>
                      <p className="text-muted mb-1">{user?.email}</p>
                      <p className="text-muted mb-0">{user?.mobile}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Holidays and Birthdays Row */}
        <div className="row">
          {/* Holidays Card */}
          <div className="col-lg-6 mb-4">
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

          {/* Birthdays Card */}
          <div className="col-md-6">
            <div>
              {showAnimation &&  birthdaysToday?.length > 0 && (
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
                ) :  birthdaysToday?.length > 0 ? (
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
                          }
                          alt={employee.name}
                          className="rounded-circle"
                          width="48"
                          height="48"
                          style={{ objectFit: "cover" }}
                        />
                        <div>
                          <p className="mb-0 employee-name">{employee.name}</p>
                          <p className="mb-0 employee-desc">
                            Has {employee?.type} today.
                          </p>
                          <p className="mb-0 employee-desc">{employee.quote}</p>
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
    </>
  );
};

export default Admin;
