import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import RowEmployee from "../../components/rows/row-employee";
import { getEmployees } from "../../http";

const Employees = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    const res = await getEmployees({ status, search });
    if (res?.success) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(t);
  }, [status, search]);
  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Employees" />

        {/* Filters */}
        <div className="row mb-3">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Search by name, email or mobile"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="active">Active</option>
              <option value="provison">Provison</option>
              <option value="notice">Notice</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table border roundedtable table-md center-text">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Team</th>
                <th>Document Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && users.length > 0 ? (
                users.map((data, index) => (
                  <RowEmployee key={index} index={index + 1} data={data} />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    {loading ? "Loading..." : "No Employees Found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Employees;
