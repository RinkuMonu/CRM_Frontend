import React, { useEffect, useState } from "react";
import {
  getEmployees,
  getLeaders,
  getAssignedAssets,
  assignAsset,
  deleteAssignedAsset,
  updateAssignedAsset,
} from "../../http";
import { useHistory } from "react-router-dom";
import Loading from "../Loading";
import { FaEdit, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";

const AssignAssest = () => {
  const [applications, setApplications] = useState();
  const [employees, setEmployees] = useState();
  const [employeeMap, setEmployeeMap] = useState();
  const { user } = useSelector((state) => state.authSlice);
  console.log("Current User:", user);
  // ---------- modal states ----------
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assignEmp, setAssignEmp] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]); // multiple assets
  const [brands, setBrands] = useState({});
  const [assignDate, setAssignDate] = useState("");

  // ---------- edit modal states ----------
  const [editingAsset, setEditingAsset] = useState(null);
  const [editAssignEmp, setEditAssignEmp] = useState("");
  const [editSelectedAssets, setEditSelectedAssets] = useState([]);
  const [editBrands, setEditBrands] = useState({});
  const [editAssignDate, setEditAssignDate] = useState("");
  // ---------- Fetch Data ----------
  useEffect(() => {
    let empObj = {};
    const fetchData = async () => {
      try {
        const res = await getAssignedAssets();
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching assigned assets:", err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const emps = await getEmployees();
        const leaders = await getLeaders();

        emps.data.forEach(
          (employee) => (empObj[employee.id] = [employee.name, employee.email])
        );
        leaders.data.forEach(
          (leader) => (empObj[leader.id] = [leader.name, leader.email])
        );

        setEmployeeMap(empObj);
        setEmployees([...emps.data, ...leaders.data]);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchData();
    fetchEmployees();
  }, [showModal, showEditModal]);

  // ---------- handle checkbox select/deselect ----------
  const handleAssetSelect = (e) => {
    const { value, checked } = e.target;
    let updatedAssets = [...selectedAssets];
    if (checked) {
      updatedAssets.push(value);
    } else {
      updatedAssets = updatedAssets.filter((item) => item !== value);
    }
    setSelectedAssets(updatedAssets);
  };

  // ---------- handle edit checkbox select/deselect ----------
  const handleEditAssetSelect = (e) => {
    const { value, checked } = e.target;
    let updatedAssets = [...editSelectedAssets];
    if (checked) {
      updatedAssets.push(value);
    } else {
      updatedAssets = updatedAssets.filter((item) => item !== value);
    }
    setEditSelectedAssets(updatedAssets);
  };

  // ---------- handle brand input ----------
  const handleBrandChange = (asset, value) => {
    setBrands({ ...brands, [asset]: value });
  };

  // ---------- handle edit brand input ----------
  const handleEditBrandChange = (asset, value) => {
    setEditBrands({ ...editBrands, [asset]: value });
  };

  // ---------- handle assign ----------
  const handleAssign = async () => {
    if (!assignEmp || selectedAssets.length === 0 || !assignDate) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      employeeId: assignEmp,
      assets: selectedAssets.map((a) => ({
        type: a,
        brand: brands[a] || "",
      })),
      assignedDate: assignDate,
    };

    try {
      const res = await assignAsset(payload);
      if (res.success) {
        toast.success("Asset assigned successfully!");

        // list refresh karo
        await getAssignedAssets();

        // reset
        setShowModal(false);
        setAssignEmp("");
        setSelectedAssets([]);
        setBrands({});
        setAssignDate("");
      }
    } catch (err) {
      console.error("Error assigning asset:", err);
    }
  };

  // ---------- handle edit ----------
  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setEditAssignEmp(asset.employeeId._id || asset.employeeId);

    // Pre-populate assets and brands
    const assets = asset.assets.map((a) => a.type);
    const brandObj = {};
    asset.assets.forEach((a) => {
      brandObj[a.type] = a.brand;
    });

    setEditSelectedAssets(assets);
    setEditBrands(brandObj);
    setEditAssignDate(asset.assignedDate.split("T")[0]); // Format date for input

    setShowEditModal(true);
  };

  // ---------- handle update ----------
  const handleUpdate = async () => {
    if (!editAssignEmp || editSelectedAssets.length === 0 || !editAssignDate) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      employeeId: editAssignEmp,
      assets: editSelectedAssets.map((a) => ({
        type: a,
        brand: editBrands[a] || "",
      })),
      assignedDate: editAssignDate,
    };

    try {
      const res = await updateAssignedAsset(editingAsset._id, payload);
      if (res.success) {
        toast.success("Asset updated successfully!");

        // Refresh the list
        const updatedAssets = await getAssignedAssets();
        setApplications(updatedAssets.data);

        // Reset and close modal
        setShowEditModal(false);
        setEditingAsset(null);
        setEditAssignEmp("");
        setEditSelectedAssets([]);
        setEditBrands({});
        setEditAssignDate("");
      }
    } catch (err) {
      console.error("Error updating asset:", err);
      toast.error("Failed to update asset");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAssignedAsset(id);
      if (res.success) {
        toast.success("Asset deleted successfully!");
        const updatedAssets = applications.filter((asset) => asset._id !== id);
        setApplications(updatedAssets);
      }
    } catch (err) {
      console.error("Error deleting asset:", err);
      toast.error("Failed to delete asset");
    }
  };
  const visibleApplications =
    user?.user?.type === "Admin"
      ? applications
      : applications?.filter((app) => app?.employeeId?._id === user?.user?.id);
  console.log(visibleApplications, "Applications Data");

  return (
    <>
      <Toaster />
      {applications ? (
        <div className="main-content">
          <section className="section">
            <div className="section-header d-flex justify-content-between">
              <div>
                <h1>Assign Assets</h1>
              </div>
              {user?.user?.type === "Admin" && (
                <div className="section-header d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    Assign Asset <FaPlus size={10} />
                  </button>
                </div>
              )}
            </div>

            {/* ---------- ASSIGN MODAL ---------- */}
            {showModal && (
              <div
                className="modal fade show"
                style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Assign Asset</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label>Employee</label>
                        <select
                          className="form-control"
                          value={assignEmp}
                          onChange={(e) => setAssignEmp(e.target.value)}
                        >
                          <option value="">Select Employee</option>
                          {employees?.map((emp) => (
                            <option key={emp._id} value={emp.id}>
                              {emp.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Asset checkboxes + brand inputs */}
                      <div className="mb-3">
                        <label>Asset Type</label>
                        <div className="d-flex flex-column gap-2 mt-2">
                          {[
                            "Laptop",
                            "PC",
                            "Pendrive",
                            "Mouse",
                            "Keyboard",
                            "Other",
                            "Headset",
                          ].map((asset) => (
                            <div key={asset}>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={asset}
                                  value={asset}
                                  checked={selectedAssets.includes(asset)}
                                  onChange={handleAssetSelect}
                                />
                                <label
                                  htmlFor={asset}
                                  className="form-check-label"
                                >
                                  {asset}
                                </label>
                              </div>
                              {selectedAssets.includes(asset) && (
                                <input
                                  type="text"
                                  className="form-control mt-1"
                                  placeholder={`${asset} Brand`}
                                  value={brands[asset] || ""}
                                  onChange={(e) =>
                                    handleBrandChange(asset, e.target.value)
                                  }
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label>Assign Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={assignDate}
                          onChange={(e) => setAssignDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleAssign}
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------- EDIT MODAL ---------- */}
            {showEditModal && (
              <div
                className="modal fade show"
                style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Assigned Asset</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowEditModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label>Employee</label>
                        <select
                          className="form-control"
                          value={editAssignEmp}
                          onChange={(e) => setEditAssignEmp(e.target.value)}
                        >
                          <option value="">Select Employee</option>
                          {employees?.map((emp) => (
                            <option key={emp._id} value={emp.id}>
                              {emp.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Asset checkboxes + brand inputs */}
                      <div className="mb-3">
                        <label>Asset Type</label>
                        <div className="d-flex flex-column gap-2 mt-2">
                          {[
                            "Laptop",
                            "PC",
                            "Pendrive",
                            "Mouse",
                            "Keyboard",
                            "Other",
                            "Headset",
                          ].map((asset) => (
                            <div key={asset}>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`edit-${asset}`}
                                  value={asset}
                                  checked={editSelectedAssets.includes(asset)}
                                  onChange={handleEditAssetSelect}
                                />
                                <label
                                  htmlFor={`edit-${asset}`}
                                  className="form-check-label"
                                >
                                  {asset}
                                </label>
                              </div>
                              {editSelectedAssets.includes(asset) && (
                                <input
                                  type="text"
                                  className="form-control mt-1"
                                  placeholder={`${asset} Brand`}
                                  value={editBrands[asset] || ""}
                                  onChange={(e) =>
                                    handleEditBrandChange(asset, e.target.value)
                                  }
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label>Assign Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={editAssignDate}
                          onChange={(e) => setEditAssignDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------- Table ---------- */}
            <div className="table-responsive">
              <table className="table border roundedtable table-md center-text">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Assets</th>
                    <th>Assigned Date</th>
                    {user?.user?.type === "Admin" && <th>Action</th>}
                  </tr>
                </thead>

                <tbody className="sidebar-wrapper">
                  {visibleApplications?.map((application, idx) => (
                    <tr
                      key={application._id}
                      className="table-row align-middle"
                    >
                      <td>{idx + 1}</td>
                      <td>{application?.employeeId.name || "N/A"}</td>
                      <td>{application?.employeeId.email || "N/A"}</td>
                      <td>
                        {application.assets
                          .map((a) => `${a.type} (${a.brand})`)
                          .join(", ")}
                      </td>
                      <td>
                        {new Date(
                          application.assignedDate
                        ).toLocaleDateString()}
                      </td>
                      {user?.user?.type === "Admin" && (
                        <td>
                          <div className="section-header d-flex justify-content-between gap-3">
                            <button
                              className="btn d-flex justify-content-between p-1 align-items-center"
                              onClick={() => handleEdit(application)}
                            >
                              <FaEdit size={18} color="green" />
                            </button>
                            <button
                              className="btn d-flex justify-content-between p-1 align-items-center"
                              onClick={() => handleDelete(application._id)}
                            >
                              <MdDeleteForever size={20} color="red" />
                            </button>
                          </div>
                        </td>
                      )}
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

export default AssignAssest;
