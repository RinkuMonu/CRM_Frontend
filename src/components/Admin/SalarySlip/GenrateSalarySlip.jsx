import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import HeaderSection from "../../HeaderSection";
import api, { getEmployees, getLeaders } from "../../../http";

const GenrateSalarySlip = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
    watch,
  } = useForm();

  const selectedEmployee = watch("selectedEmployee");

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const emps = await getEmployees();
        const leaders = await getLeaders();
        setEmployees([...emps.data, ...leaders.data]);
      } catch {
        toast.error("Failed to fetch employees");
      }
    };
    fetchAllEmployees();
  }, []);

  const fetchAttendance = async (empId, fullMonth) => {
    try {
      const res = await api.post("/task/attendance-report", {
        employeeId: empId,
        month: fullMonth,
      });
      setAttendance(res);
    } catch {
      toast.error("Failed to fetch attendance");
      setAttendance(null);
    }
  };

  const onSubmit = async (data) => {
    if (!attendance) {
      toast.error("Attendance data missing.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/admin/genrate-salary-slip", {
        employeeID: data.selectedEmployee,
        month,
        year,
        grossSalary: attendance?.grossSalary || 0,
        presentDays: attendance?.presentDays || 0,
        halfDays: attendance?.halfDays || 0,
        absentDays: attendance?.absentCount || 0,
        earnedSalary: data.earnedSalary,
        leaveDeduction: data.leaveDeduction,

        pf: data.pf,
        esi: data.esi,
        companyPf: data.companyPf,
        companyEsi: data.companyEsi,
        totalDeduction: data.totalDeduction,
        netPay: data.netPay,
        BasicSalary: data.BasicSalary,
        Other: data.Other,
        HRA: data.HRA,
        Conveyance: data.Conveyance,
      });

      console.log("Salary slip response:", res);

      // Check if res.data and res.data.file exist
      if (res?.file) {
        const url = res?.file;
        setFileUrl(url);
        // window.open(`http://localhost:5500${url}`, "_blank");
        toast.success("Salary slip generated successfully!");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Generate Salary Slip" />
        <div className="card">
          <div className="card-body pr-5 pl-5 m-1">
            <form className="row" onSubmit={handleSubmit(onSubmit)}>
              {/* Employee Dropdown */}
              <div className="form-group col-md-4">
                <label>Employees</label>
                <select
                  className="form-control"
                  {...register("selectedEmployee", {
                    required: "Employee is required",
                  })}
                  onChange={(e) => {
                    const empId = e.target.value;
                    setValue("selectedEmployee", empId);
                    setFileUrl(""); // <-- hide download button on employee change
                    trigger("selectedEmployee");
                    if (month && year)
                      fetchAttendance(empId, `${year}-${month}`);
                  }}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
                {errors.selectedEmployee && (
                  <p className="text-danger">
                    {errors.selectedEmployee.message}
                  </p>
                )}
              </div>

              {/* Month Picker */}
              <div className="form-group col-md-4">
                <label>Month & Year</label>
                <input
                  type="month"
                  className="form-control"
                  onChange={(e) => {
                    const [y, m] = e.target.value.split("-");
                    setMonth(m);
                    setYear(y);
                    if (selectedEmployee)
                      fetchAttendance(selectedEmployee, `${y}-${m}`);
                  }}
                  required
                />
              </div>

              {attendance && (
                <>
                  {/* Read-Only Attendance Info */}
                  {[
                    "presentDays",
                    "halfDays",
                    "absentCount",
                    "grossSalary",
                  ].map((field, i) => (
                    <div className="form-group col-md-4 mb-3" key={i}>
                      <div className="card p-3">
                        <label>{field.replace(/([A-Z])/g, " $1")}</label>
                        <input
                          className="form-control"
                          value={attendance[field] || 0}
                          readOnly
                        />
                      </div>
                    </div>
                  ))}
                  {/* //////////////////readOnly///////////////////// */}
                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Leave Balance</label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={attendance.leaveBalance || 0}
                        {...register("leaveBalance", {
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                    </div>
                  </div>
                  {/* //////////////////readOnly///////////////////// */}
                  {/* //////////////////readOnly///////////////////// */}
                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Paid Leave Taken</label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={attendance.paidLeavesTaken || 0}
                        {...register("paidLeavesTaken", {
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                    </div>
                  </div>
                  {/* //////////////////readOnly///////////////////// */}
                  {/* //////////////////readOnly///////////////////// */}
                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>UnPaid Leave Taken</label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={attendance.unpaidLeavesTaken || 0}
                        {...register("unpaidLeavesTaken", {
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Earned Salary</label>
                      <input
                        type="text"
                        className="form-control"
                        value={attendance.earnedSalary || ""}
                        {...register("earnedSalary", {
                          required: "earnedSalary is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.earnedSalary && (
                        <p className="text-danger">
                          {errors.earnedSalary.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Leave Deduction</label>
                      <input
                        type="text"
                        className="form-control"
                        value={attendance.leaveDeduction || ""}
                        {...register("leaveDeduction", {
                          required: "leaveDeduction is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.leaveDeduction && (
                        <p className="text-danger">
                          {errors.leaveDeduction.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>PF</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("pf", {
                          required: "pf is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.pf && (
                        <p className="text-danger">{errors.pf.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>ESI</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("esi", {
                          required: "esi is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.esi && (
                        <p className="text-danger">{errors.esi.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Company PF</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("companyPf", {
                          required: "companyPf is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.companyPf && (
                        <p className="text-danger">
                          {errors.companyPf.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Company ESI</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("companyEsi", {
                          required: "companyEsi is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.companyEsi && (
                        <p className="text-danger">
                          {errors.companyEsi.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Total Deduction</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("totalDeduction", {
                          required: "totalDeduction is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.totalDeduction && (
                        <p className="text-danger">
                          {errors.totalDeduction.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Net Pay</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("netPay", {
                          required: "netPay is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.netPay && (
                        <p className="text-danger">{errors.netPay.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>HRA</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("HRA", {
                          required: "HRA is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.HRA && (
                        <p className="text-danger">{errors.HRA.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Conveyance</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("Conveyance", {
                          required: "Conveyance is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.Conveyance && (
                        <p className="text-danger">
                          {errors.Conveyance.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Other</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("Other", {
                          required: "Other is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.Other && (
                        <p className="text-danger">{errors.Other.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <div className="card p-3">
                      <label>Basic Salary</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("BasicSalary", {
                          required: "BasicSalary is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                        })}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      />
                      {errors.BasicSalary && (
                        <p className="text-danger">
                          {errors.BasicSalary.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="form-group col-md-12 text-center mt-4">
                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Slip"}
                </button>
              </div>
            </form>

            {/* Download Section */}
            {fileUrl && (
              <div className="mt-4 text-center">
                <h5>Download Salary Slip:</h5>
                <a
                  className="btn btn-success"
                  href={`${fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GenrateSalarySlip;
