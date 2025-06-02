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
      {applications ? (
        <div className="main-content">
          <section className="section">
              <div className="section-header ps-0">
                <h1>Leave Applications</h1>
            </div>

            <div className="row ">
              <div className="form-group col-md-4">
                <label>Assest Type</label>
                <select
                  name="type"
                  onChange={(e) => setType(e.target.value)}
                  className="form-control select2"
                >
                  <option>Select</option>
                  <option></option>
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
                  <option>Select</option>
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
                {applications?.map((application, idx) => (
                  <tr
                    className="hover-effect"
                    onClick={() =>
                      history.push(`userLeaveApplications/${application._id}`)
                    }
                  >
                    <td>{idx + 1}</td>
                    <td>{application.type}</td>
                    <td>{application.title}</td>
                    <td>{application.appliedDate}</td>
                    <td
                      className={`${
                        application.adminResponse === "Rejected"
                          ? "text-danger"
                          : application.adminResponse === "Pending"
                          ? "text-primary"
                          : "text-success"
                      }`}
                    >
                      {application.adminResponse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default LeaveApplications;
