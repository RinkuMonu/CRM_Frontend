import React, { useEffect, useState } from "react";
import { viewLeaveApplications } from "../../http";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const LeaveApplications = () => {
  const { user } = useSelector((state) => state.authSlice);
  const [applications, setApplications] = useState([]);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const history = useHistory();

  // ✅ current month ka range nikalo
  const getMonthRange = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      startDate: firstDay.toISOString().split("T")[0],
      endDate: lastDay.toISOString().split("T")[0],
    };
  };

  // ✅ initial load par current month ka data
  useEffect(() => {
    const fetchData = async () => {
      const { startDate, endDate } = getMonthRange();

      const obj = {
        applicantID: user.id,
        startDate,
        endDate,
      };

      const res = await viewLeaveApplications(obj);
      setApplications(res?.data || []);
    };
    if (user?.id) fetchData();
  }, [user?.id]);

  // ✅ search function
  const searchLeaveApplications = async () => {
    const obj = {
      applicantID: user.id,
    };

    if (type) obj.type = type;
    if (status) obj.adminResponse = status;

    if (appliedDate) {
      obj.appliedDate = appliedDate;
    } else {
      // agar date nahi select hai to pura current month
      const { startDate, endDate } = getMonthRange();
      obj.startDate = startDate;
      obj.endDate = endDate;
    }

    const res = await viewLeaveApplications(obj);
    setApplications(res?.data || []);
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="section-header ps-0">
          <h1>Leave Applications</h1>
        </div>

        <div className="row">
          <div className="form-group col-md-4">
            <label>Type</label>
            <select
              name="type"
              onChange={(e) => setType(e.target.value)}
              className="form-control select2"
              value={type}
            >
              <option value=""> Select</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Emergency Leave</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label>Status</label>
            <select
              name="status"
              onChange={(e) => setStatus(e.target.value)}
              className="form-control select2"
              value={status}
            >
              <option value="">Select</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label>Applied Date</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="fa fa-calendar"></i>
                </div>
              </div>
              <input
                onChange={(e) => setAppliedDate(e.target.value)}
                value={appliedDate}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <button
            onClick={searchLeaveApplications}
            className="btn btn-lg btn-primary col-md-2 mx-2"
          >
            Search
          </button>
        </div>
      </section>

      <div className="card cardborder overflow-hidden rounded-3 mt-3">
        <div className="table-responsive t-3">
          <table className="table border roundedtable table-md center-text">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Title</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="sidebar-wrapper">
              {applications?.length > 0 ? (
                applications.map((application, idx) => (
                  <tr key={application._id} className="hover-effect">
                    <td>{idx + 1}</td>
                    <td>{application.type}</td>
                    <td>{application.title}</td>
                    <td>{application.appliedDate}</td>
                    <td>
                      <span
                        onClick={() =>
                          history.push(
                            `userLeaveApplications/${application._id}`
                          )
                        }
                        className={`btn py-1 rounded-pill ${
                          application.adminResponse === "Rejected"
                            ? "bg-danger-subtle text-dark"
                            : application.adminResponse === "Pending"
                            ? "bg-warning-subtle text-dark"
                            : "bg-success-subtle text-dark"
                        }`}
                      >
                        {application.adminResponse}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplications;
