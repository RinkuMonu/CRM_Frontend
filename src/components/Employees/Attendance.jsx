import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  markInAttendance,
  markOutAttendance,
  viewEmployeeAttendance,
  regularizeRequest,
} from "../../http";
import Loading from "../Loading";

const Attendance = () => {
  const { user } = useSelector((state) => state.authSlice);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [attendance, setAttendance] = useState([]);
  const [inMarked, setInMarked] = useState(false);
  const [outMarked, setOutMarked] = useState(false);
  const [showRegularizeModal, setShowRegularizeModal] = useState(false);
  const [regularizeReason, setRegularizeReason] = useState("");
  const [loading, setLoading] = useState(false);

const getCurrentMonthRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // current month index (0-based)

  const firstDay = new Date(year, month, 1); // 1st of this month

  return {
    firstDate: firstDay.toISOString().split("T")[0], // yyyy-mm-dd
    todayDate: today.toISOString().split("T")[0],
  };
};

useEffect(() => {
  const { firstDate, todayDate } = getCurrentMonthRange();
  console.log("Setting fromDate:", firstDate, "toDate:", todayDate);

  setFromDate(firstDate);
  setToDate(todayDate);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await viewEmployeeAttendance({
        employeeID: user.user.id,
        fromDate: firstDate,
        toDate: todayDate,
        status: statusFilter,
      });
      if (res.success) setAttendance(res.data);
      else setAttendance([]);
    } catch (error) {
      toast.error("Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  if (user?.user?.id) fetchAttendance();
}, [user?.user?.id, statusFilter]);

  const handleMarkIn = async () => {
    try {
      const res = await markInAttendance({
        employeeID: user.user.id,
        date: new Date(),
      });
      if (res.success) {
        toast.success(res.message);
        setInMarked(true);
      } else {
        toast.error(res.message || "Failed to mark in.");
      }
    } catch (error) {
      toast.error("Error marking in");
    }
  };
  const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
useEffect(() => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const firstDate = formatDateForInput(firstDay); // ✅ Local format
  const todayDate = formatDateForInput(today);

  console.log("Setting fromDate:", firstDate, "toDate:", todayDate);

  setFromDate(firstDate);
  setToDate(todayDate);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await viewEmployeeAttendance({
        employeeID: user.user.id,
        fromDate: firstDate,
        toDate: todayDate,
        status: statusFilter,
      });
      if (res.success) setAttendance(res.data);
      else setAttendance([]);
    } catch (error) {
      toast.error("Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  if (user?.user?.id) fetchAttendance();
}, [user?.user?.id, statusFilter]);


  const handleMarkOut = async () => {
    try {
      const res = await markOutAttendance({
        employeeID: user.user.id,
        date: new Date(),
      });

      if (res.success) {
        toast.success(res.message);
        setOutMarked(true);
      } else if (res.needRegularize) {
        toast.info(res.message || "Please fill reason to regularize early OUT.");
        setShowRegularizeModal(true);
      } else {
        toast.error(res.message || "Failed to mark out.");
      }
    } catch (error) {
      toast.error("Error marking out");
    }
  };

  const submitRegularizeRequest = async () => {
    if (!regularizeReason.trim()) {
      toast.warning("Please enter a reason.");
      return;
    }

    try {
      const res = await regularizeRequest({
        employeeID: user.user.id,
        regularizeReason,
      });

      if (res.success) {
        toast.success("Regularize request sent to HR!");
        setShowRegularizeModal(false);
        setOutMarked(true);
      } else {
        toast.error(res.message || "Failed to submit regularize request.");
      }
    } catch (error) {
      toast.error("Error submitting regularize request");
    }
  };

  const searchAttendance = async () => {
    setLoading(true);
    try {
      const res = await viewEmployeeAttendance({
        employeeID: user.user.id,
        fromDate,
        toDate,
        status: statusFilter,
      });
      if (res.success) setAttendance(res.data);
      else setAttendance([]);
    } catch (error) {
      toast.error("Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoTime) => {
    if (!isoTime) return "Not Marked";
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className="main-content">
        <section className="section">
          <div className="p-2 ps-0">
            <div className="section-header ps-0 d-flex justify-content-between mb-2 mt-0">
              <h1>Attendance</h1>
              <div className="d-flex gap-2">
                <button
                  className="btn bg-label-success"
                  onClick={handleMarkIn}
                  disabled={inMarked}
                >
                  {inMarked ? "In Marked" : "Mark In"}
                </button>
                <button
                  className="btn bg-label-danger"
                  onClick={handleMarkOut}
                  disabled={outMarked}
                >
                  {outMarked ? "Out Marked" : "Mark Out"}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="row my-3">
            <div className="col-md-4">
              <label>From</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label>To</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label>Status</label>
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half-day">Half Day</option>
              </select>
            </div>
            <div className="col-md-3 mt-3 d-flex align-items-end">
              <button
                onClick={searchAttendance}
                className="btn btn-primary w-100"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <Loading />
        ) : (
          <div className="table-responsive mt-3">
            <table className="table border roundedtable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance?.length > 0 ? (
                  attendance.map((att, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{`${att.date}/${att.month}/${att.year}`}</td>
                      <td>{att.day}</td>
                      <td>{formatTime(att.inTime)}</td>
                      <td>{formatTime(att.outTime)}</td>
                      <td>
                        <span
                          className={`badge ${
                            att.present === "Present"
                              ? "badge-success"
                              : att.present === "Half-day"
                              ? "badge-info"
                              : "badge-danger"
                          }`}
                        >
                          {att.present}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Regularize Modal */}
      {showRegularizeModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Regularize OUT</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRegularizeModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Please provide a reason for early OUT:</p>
                <textarea
                  className="form-control"
                  rows="4"
                  value={regularizeReason}
                  onChange={(e) => setRegularizeReason(e.target.value)}
                  placeholder="Enter your reason..."
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowRegularizeModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={submitRegularizeRequest}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Attendance;
