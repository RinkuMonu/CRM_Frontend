import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  getEmployee,
  getLeader,
  updateSalary,
  viewAllSalaries,
} from "../../http";
import { toast } from "react-toastify";
import Loading from "../Loading";
import HeaderSection from "../../components/HeaderSection";

const SalaryView = () => {
  const { id } = useParams();
  const [salary, setSalary] = useState();
  const [employee, setEmployee] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    salary: "",
    bonus: "",
    reasonForBonus: "",
    inc: "",
  };
  const [formData, setFormData] = useState(initialState);

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const obj = { _id: id };
      const res = await viewAllSalaries(obj);
      const empRes = await getEmployee(res.data[0].employeeID);
      const leaderRes = await getLeader(res.data[0].employeeID);

      if (empRes.success) setEmployee(empRes.data);
      if (leaderRes.success) setEmployee(leaderRes.data);

      setSalary(res.data[0]);
    };
    fetchData();
  }, [id]);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const incrementStr = formData.inc?.trim();
    if (!incrementStr) {
      return toast.error("Please enter increment % before submitting");
    }

    const increment = Number(incrementStr);
    const bonus =
      formData.bonus !== ""
        ? Number(formData.bonus)
        : Number(salary?.bonus || 0);

    if (isNaN(increment) || isNaN(bonus)) {
      return toast.error("Increment and Bonus must be valid numbers");
    }

    const baseSalary = Number(salary?.salary || 0);
    const newSalary = Math.round(baseSalary + (baseSalary * increment) / 100);

    const payload = {
      employeeID: employee?.id,
      salary: newSalary,
      bonus,
      reasonForBonus: formData.reasonForBonus || "",
    };

    try {
      setIsLoading(true);
      const res = await updateSalary(payload);
      if (res.success) {
        toast.success("Salary Updated!");
        setTimeout(() => window.history.back(), 1500);
        setFormData(initialState);
      }
    } catch (error) {
      toast.error("Failed to update salary");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNewSalary = () => {
    const base = Number(salary?.salary || 0);
    const inc = Number(formData.inc || 0);
    if (isNaN(inc)) return base;
    return Math.round(base + (base * inc) / 100);
  };

  return (
    <>
      {employee ? (
        <div className="main-content">
          <section className="section">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4>Updated Salary from {salary?.assignedDate}</h4>
              </div>
            </div>

            <div className="col-md-9">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{employee?.name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{employee?.email}</td>
                  </tr>
                  <tr>
                    <th>Username</th>
                    <td>{employee?.username}</td>
                  </tr>
                  <tr>
                    <th>Mobile Number</th>
                    <td>{employee?.mobile}</td>
                  </tr>
                  <tr>
                    <th>Salary</th>
                    <td>{salary?.salary}</td>
                  </tr>
                  <tr>
                    <th>Bonus</th>
                    <td>{salary?.bonus}</td>
                  </tr>
                  <tr>
                    <th>Reason</th>
                    <td>{salary?.reasonForBonus}</td>
                  </tr>
                  <tr>
                    <th>Last Updated</th>
                    <td>{salary?.assignedDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="section">
            <HeaderSection title="Update Salary" />
            <div className="card">
              <div className="card-body pr-5 pl-5 m-1">
                <form className="row" onSubmit={onSubmit} id="addUserForm">
                  <div className="form-group col-md-6">
                    <label className="">
                      <span> Current Salary</span> <span>(read only)</span>
                    </label>
                    <div className="input-group">
                      <input
                        value={salary?.salary || ""}
                        type="text"
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-6">
                    <label>Enter Bonus</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fas fa-pen"></i>
                        </div>
                      </div>
                      <input
                        onChange={inputEvent}
                        onKeyPress={(e) =>
                          !/[0-9]/.test(e.key) && e.preventDefault()
                        }
                        value={formData.bonus || ""}
                        type="text"
                        name="bonus"
                        className="form-control"
                        placeholder={salary?.bonus || "0"}
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-6">
                    <label>Increment (%)</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fas fa-pen"></i>
                        </div>
                      </div>
                      <input
                        onChange={inputEvent}
                        onKeyPress={(e) =>
                          !/[0-9]/.test(e.key) && e.preventDefault()
                        }
                        value={formData.inc || ""}
                        type="text"
                        name="inc"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-6">
                    <label>
                      New Salary
                      <span> (read only)</span>
                    </label>
                    <div className="input-group ">
                      {/* <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fas fa-pen"></i>
                        </div>
                      </div> */}
                      <input
                        value={
                          formData.inc && salary?.salary
                            ? Math.round(
                                (Number(formData.inc) / 100) *
                                  Number(salary.salary) +
                                  Number(salary.salary)
                              )
                            : ""
                        }
                        type="text"
                        disabled
                        className="form-control bg-info-subtle"
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-12">
                    <label>Enter Reason</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fas fa-book"></i>
                        </div>
                      </div>
                      <input
                        onChange={inputEvent}
                        value={formData.reasonForBonus || ""}
                        type="text"
                        name="reasonForBonus"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group text-center col-md-12">
                    <button
                      className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2"
                      type="submit"
                      disabled={isLoading}
                      style={{ width: "30vh" }}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          &nbsp; Updating...
                        </>
                      ) : (
                        "Update Salary"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default SalaryView;
