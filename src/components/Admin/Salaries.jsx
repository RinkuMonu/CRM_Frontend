import React, { useEffect, useState } from "react";
import { getEmployees, getLeaders, viewAllSalaries } from "../../http";
import { useHistory } from "react-router-dom";
import Loading from "../Loading";

const Salaries = () => {
  const history = useHistory();
  const [employees, setEmployees] = useState();
  const [employeeMap, setEmployeeMap] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [salaries, setSalaries] = useState();

  useEffect(() => {
    let empObj = {};
    const fetchData = async () => {
      const res = await viewAllSalaries({});
      const { data } = res;
      setSalaries(data);
      // console.log(data);
    };

    const fetchEmployees = async () => {
      const emps = await getEmployees();
      // console.log(emps);

      const leaders = await getLeaders();
      emps.data.forEach(
        (employee) => (empObj[employee.id] = [employee.name, employee.email])
      );
      leaders.data.forEach(
        (leader) => (empObj[leader.id] = [leader.name, leader.email])
      );
      setEmployeeMap(empObj);
      setEmployees([...emps.data, ...leaders.data]);
    };

    fetchData();
    fetchEmployees();
  }, []);

  const searchSalary = async () => {
    const obj = {};

    if (selectedEmployee) {
      obj["employeeID"] = selectedEmployee;
    }
    const res = await viewAllSalaries(obj);
    const { data } = res;
    setSalaries(data);
  };

  return (
    <>
      {salaries ? (
        <div className="main-content">
          <section className="section">
            <div className="section-header d-flex justify-content-between">
              <h1>Salaries</h1>
            </div>

            <div className="d-flex justify-content-center align-items-center w-100">
              <div className="form-group col-md-10">
                <label>Employee</label>
                <select
                  className="form-control select2"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Employees</option>
                  {employees?.map((employee) => (
                    <option key={employee._id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={searchSalary}
                className="btn btn-lg btn-primary col-2 px-3 py-2 rounded-2"
              >
                Search
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-border roundedtable table-md center-text">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Salary</th>
                    <th>Bonus</th>
                    <th>Click to edit</th>
                  </tr>
                </thead>

                <tbody className="sidebar-wrapper">
                  {salaries?.map((salary, idx) => (
                    <tr className="hover-effect">
                      <td>{idx + 1}</td>
                      <td>{employeeMap?.[salary?.employeeID]?.[0] || "N/A"}</td>
                      <td>{employeeMap?.[salary?.employeeID]?.[1] || "N/A"}</td>
                      <td>{salary?.salary}</td>
                      <td>{salary?.bonus}</td>
                      <td>
                        <button
                          onClick={() => history.push(`salary/${salary?._id}`)}
                          className="bg-success px-4  border rounded py-1 fw-bold "
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Salaries;
