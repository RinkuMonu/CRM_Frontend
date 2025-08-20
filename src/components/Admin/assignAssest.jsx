import React, { useEffect, useState } from "react";
import {
  getEmployees,
  getLeaders,
  getAssignedAssets,
  assignAsset,
  deleteAssignedAsset,
  updateAssignedAsset,
} from "../../http";
import Loading from "../Loading";
import { FaEdit, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";

const AssignAssest = () => {
  const [applications, setApplications] = useState();
  const [employees, setEmployees] = useState([]);
  const { user } = useSelector((state) => state.authSlice);
  console.log("Current User:", user);

  // ---------- modal states ----------
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Assign modal states
  const [assignEmp, setAssignEmp] = useState("");
  const [assignDate, setAssignDate] = useState("");
  const [assetsList, setAssetsList] = useState([]); // [{type, brand, serialNumber}]

  // Edit modal states
  const [editingAsset, setEditingAsset] = useState(null);
  const [editAssignEmp, setEditAssignEmp] = useState("");
  const [editAssignDate, setEditAssignDate] = useState("");
  const [editAssetsList, setEditAssetsList] = useState([]); // [{type, brand, serialNumber}]

  const assetOptions = [
    { type: "Laptop", hasSerial: true },
    { type: "PC", hasSerial: true },
    { type: "Pendrive", hasSerial: true },
    { type: "Mouse", hasSerial: true },
    { type: "Keyboard", hasSerial: true },
    { type: "Headset", hasSerial: true },
    { type: "Sim Card", hasSerial: true },
    { type: "Mobile", hasSerial: true },
    { type: "Mouse Pad", hasSerial: false },
    { type: "Charger", hasSerial: false },
    { type: "Hard Disk", hasSerial: true },
    { type: "Wiereless Cable", hasSerial: false },
    { type: "Other", hasSerial: true },
  ];

  // ---------- Fetch Data ----------
  useEffect(() => {
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
        setEmployees([...(emps?.data || []), ...(leaders?.data || [])]);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchData();
    fetchEmployees();
  }, [showModal, showEditModal]);

  // ---------- ASSIGN modal helpers ----------
  const addAssetRow = () => {
    setAssetsList((prev) => [
      ...prev,
      { type: "", brand: "", serialNumber: "" },
    ]);
  };

  const removeAssetRow = (idx) => {
    setAssetsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAssetRowChange = (idx, field, value) => {
    setAssetsList((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  // ---------- EDIT modal helpers ----------
  const addEditAssetRow = () => {
    setEditAssetsList((prev) => [
      ...prev,
      { type: "", brand: "", serialNumber: "" },
    ]);
  };

  const removeEditAssetRow = (idx) => {
    setEditAssetsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEditAssetRowChange = (idx, field, value) => {
    setEditAssetsList((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  // ---------- handle assign ----------
  const handleAssign = async () => {
    const cleaned = assetsList.filter((a) => a.type);
    if (!assignEmp || cleaned.length === 0 || !assignDate) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      employeeId: assignEmp,
      assets: cleaned.map((a) => ({
        type: a.type,
        brand: a.brand || "",
        serialNumber: a.serialNumber || "",
      })),
      assignedDate: assignDate,
    };

    try {
      const res = await assignAsset(payload);
      if (res.success) {
        toast.success("Asset assigned successfully!");
        const refreshed = await getAssignedAssets();
        setApplications(refreshed.data);

        // reset
        setShowModal(false);
        setAssignEmp("");
        setAssetsList([]);
        setAssignDate("");
      }
    } catch (err) {
      console.error("Error assigning asset:", err);
    }
  };

  // ---------- handle edit (open modal with prefill) ----------
  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setEditAssignEmp(asset.employeeId?._id || asset.employeeId);
    const rows = (asset.assets || []).map((a) => ({
      type: a.type || "",
      brand: a.brand || "",
      serialNumber: a.serialNumber || "",
    }));
    setEditAssetsList(rows);
    setEditAssignDate(asset.assignedDate?.split("T")[0] || "");
    setShowEditModal(true);
  };

  // ---------- handle update ----------
  const handleUpdate = async () => {
    const cleaned = editAssetsList.filter((a) => a.type);
    if (!editAssignEmp || cleaned.length === 0 || !editAssignDate) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      employeeId: editAssignEmp,
      assets: cleaned.map((a) => ({
        type: a.type,
        brand: a.brand || "",
        serialNumber: a.serialNumber || "",
      })),
      assignedDate: editAssignDate,
    };

    try {
      const res = await updateAssignedAsset(editingAsset._id, payload);
      if (res.success) {
        toast.success("Asset updated successfully!");
        const updatedAssets = await getAssignedAssets();
        setApplications(updatedAssets.data);

        // Reset and close modal
        setShowEditModal(false);
        setEditingAsset(null);
        setEditAssignEmp("");
        setEditAssetsList([]);
        setEditAssignDate("");
      }
    } catch (err) {
      console.error("Error updating asset:", err);
      toast.error("Failed to update asset");
    }
  };

  // ---------- delete ----------
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

  // ---------- visible list for non-admin ----------
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

                      {/* Asset rows */}
                      <div className="mb-3">
                        <label>Assets</label>

                        {assetsList.length === 0 && (
                          <div className="text-muted small mt-1">
                            No assets added yet.
                          </div>
                        )}

                        {assetsList.map((row, idx) => (
                          <div key={idx} className="border rounded p-2 mt-2">
                            <div className="row g-2">
                              <div className="col-md-4">
                                <select
                                  className="form-control"
                                  value={row.type}
                                  onChange={(e) =>
                                    handleAssetRowChange(
                                      idx,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select Type</option>
                                  {assetOptions.map((opt) => (
                                    <option key={opt.type} value={opt.type}>
                                      {opt.type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Brand"
                                  value={row.brand}
                                  onChange={(e) =>
                                    handleAssetRowChange(
                                      idx,
                                      "brand",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="col-md-3">
                                {assetOptions.find((o) => o.type === row.type)
                                  ?.hasSerial && (
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Serial Number"
                                    value={row.serialNumber}
                                    onChange={(e) =>
                                      handleAssetRowChange(
                                        idx,
                                        "serialNumber",
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                              </div>
                              <div className="col-md-1 d-flex align-items-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() => removeAssetRow(idx)}
                                  title="Remove"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn btn-outline-primary mt-2"
                          onClick={addAssetRow}
                        >
                          Add Asset
                        </button>
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

                      {/* Asset rows (Edit) */}
                      <div className="mb-3">
                        <label>Assets</label>

                        {editAssetsList.length === 0 && (
                          <div className="text-muted small mt-1">
                            No assets added yet.
                          </div>
                        )}

                        {editAssetsList.map((row, idx) => (
                          <div key={idx} className="border rounded p-2 mt-2">
                            <div className="row g-2">
                              <div className="col-md-4">
                                <select
                                  className="form-control"
                                  value={row.type}
                                  onChange={(e) =>
                                    handleEditAssetRowChange(
                                      idx,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select Type</option>
                                  {assetOptions.map((opt) => (
                                    <option key={opt.type} value={opt.type}>
                                      {opt.type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Brand"
                                  value={row.brand}
                                  onChange={(e) =>
                                    handleEditAssetRowChange(
                                      idx,
                                      "brand",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="col-md-3">
                                {assetOptions.find((o) => o.type === row.type)
                                  ?.hasSerial && (
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Serial Number"
                                    value={row.serialNumber}
                                    onChange={(e) =>
                                      handleEditAssetRowChange(
                                        idx,
                                        "serialNumber",
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                              </div>
                              <div className="col-md-1 d-flex align-items-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() => removeEditAssetRow(idx)}
                                  title="Remove"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn btn-outline-primary mt-2"
                          onClick={addEditAssetRow}
                        >
                          Add Asset
                        </button>
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
                    <th>Assets With Serial Number</th>
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
                      <td>{application?.employeeId?.name || "N/A"}</td>
                      <td>{application?.employeeId?.email || "N/A"}</td>
                      <td>
                        {application.assets.map((a, i) => (
                          <div key={i}>
                            {a.type} ({a.brand}){" "}
                            {a.serialNumber ? `- ${a.serialNumber}` : ""}
                          </div>
                        ))}
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
