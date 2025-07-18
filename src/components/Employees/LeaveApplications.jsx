import React, { useEffect, useState } from "react";
import { viewLeaveApplications } from "../../http";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../Loading";

const LeaveApplications = () => {
  const { user } = useSelector((state) => state.authSlice);
  const [type, setType] = useState();
  const [status, setStatus] = useState();
  const [appliedDate, setAppliedDate] = useState();
  const [applications, setApplications] = useState();
  const history = useHistory();

  useEffect(() => {
    const obj = {
      applicantID: user.id,
    };

    const fetchData = async () => {
      const res = await viewLeaveApplications(obj);
      const { data } = res;
      setApplications(data);
    };
    fetchData();
  }, []);

  const searchLeaveApplications = async () => {
    console.log(appliedDate);

    const obj = {
      applicantID: user.id,
    };

    if (type) {
      obj["type"] = type;
    }
    if (status) {
      obj["adminResponse"] = status;
    }
    if (appliedDate) {
      obj["appliedDate"] = appliedDate;
    }

    const res = await viewLeaveApplications(obj);
    const { data } = res;
    setApplications(data);

    setAppliedDate("");
    setType("");
    setStatus("");
  };

  return (
    <>
      <div className="main-content">
        <section className="section">
          <div className="section-header ps-0">
            <h1>Leave Applications</h1>
          </div>

          <div className="row ">
            <div className="form-group col-md-4">
              <label>Type</label>
              <select
                name="type"
                onChange={(e) => setType(e.target.value)}
                className="form-control select2"
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
                name="type"
                onChange={(e) => setStatus(e.target.value)}
                className="form-control select2"
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
                    <i class="fa fa-calendar"></i>
                  </div>
                </div>
                <input
                  onChange={(e) => setAppliedDate(e.target.value)}
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-control"
                ></input>
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
        <div className="card cardborder overflow-hidden  rounded-3 mt-3">
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
                  applications?.map((application, idx) => (
                    <tr
                      key={application._id}
                      className="hover-effect"
                    >
                      <td>{idx + 1}</td>
                      <td>{application.type}</td>
                      <td>{application.title}</td>
                      <td>{application.appliedDate}</td>
                      <td >
                        <span
                          onClick={() =>
                            history.push(`userLeaveApplications/${application._id}`)
                          }
                          className={`btn py-1 rounded-pill ${application.adminResponse === "Rejected"
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
    </>
  );
};

export default LeaveApplications;
