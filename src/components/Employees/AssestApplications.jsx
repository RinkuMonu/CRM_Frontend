import React, { useEffect, useState } from "react";
import { viewAssestApplications } from "../../http";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../Loading";

const AssestApplications = () => {
  const { user } = useSelector((state) => state.authSlice);
  const [type, setType] = useState();
  const [status, setStatus] = useState();
  const [appliedDate, setAppliedDate] = useState();
  const [applications, setApplications] = useState();
  const history = useHistory();
  console.log(type);

  useEffect(() => {
    const obj = {
      applicantID: user.id,
    };

    const fetchData = async () => {
      const res = await viewAssestApplications(obj);
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

    const res = await viewAssestApplications(obj);
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
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4>Assest Applications</h4>
              </div>
            </div>

            <div className="d-flex  align-items-center w-100">
              <div className="col-10 d-flex  flex-end">
                <div className="form-group col-md-2">
                  <label>Assest type</label>
                  <select
                    name="type"
                    onChange={(e) => setType(e.target.value)}
                    className="form-control select2"
                  >
                    <option value=''>Select</option>
                    <option>Upgrade</option>
                    <option>new Assest</option>
                    <option>Repair</option>
                    <option>other</option>
                  </select>
                </div>
                <div className="form-group col-md-2">
                  <label>Status</label>
                  <select
                    name="type"
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-control select2"
                  >
                    <option value=''>Select</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>

              {/* <div className="form-group col-md-4">
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
              </div> */}

              <button
                onClick={searchLeaveApplications}
                className="btn btn-lg btn-primary "
              >
                Search
              </button>
            </div>
          </section>
          <div className="table-responsive">
            <table className="table table-striped table-md center-text">
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
                  >
                    <td>{idx + 1}</td>
                    <td>{application.type}</td>
                    <td>{application.title}</td>
                    <td>{application.appliedDate}</td>
                    <td>
                      <span
                        onClick={() =>
                          history.push(`userAssestApplications/${application._id}`)
                        }
                        className={`badge btn rounded-pill px-3 py-1 fw-semibold ${application.adminResponse === "Rejected"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default AssestApplications;
