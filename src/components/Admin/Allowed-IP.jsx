import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import HeaderSection from "../HeaderSection.jsx";
import api from "../../http"; // <- tumhare axios instance

// Simple IP/CIDR validator (client-side). Server-side validation already hai.
const isValidIpOrCidr = (value) => {
  if (!value || typeof value !== "string") return false;
  const v = value.trim();
  // IPv4
  const ipv4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)(?:\.|$)){4}$/.test(v);
  if (ipv4) return true;
  // IPv6 (basic)
  const ipv6 = /^(([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}|::1|::)$/.test(v);
  if (ipv6) return true;
  // CIDR v4
  const cidrV4 =
    /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\/(?:[1-9]|[12]\d|3[0-2])$/.test(
      v
    );
  if (cidrV4) return true;
  // CIDR v6 (basic)
  const cidrV6 = /^[0-9a-fA-F:]+\/(?:[1-9]|[1-9]\d|1[01]\d|12[0-8])$/.test(v);
  return cidrV6;
};

const AllowedIP = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");

  // form for create/update
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      value: "",
      label: "",
      active: true,
    },
  });

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/global-ips");

      // Defensive unwrap: works with or without axios interceptors
      const payload = res && res.data !== undefined ? res.data : res;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];

      setRows(list);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load IPs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const onSubmit = async (form) => {
    if (!isValidIpOrCidr(form.value)) {
      toast.error("Invalid IP or CIDR");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        // UPDATE
        const res = await api.put(`/admin/global-ips/${editingId}`, {
          value: form.value.trim(),
          label: (form.label || "").trim(),
          active: !!form.active,
        });
        toast.success("Updated");
      } else {
        // CREATE
        const res = await api.post("/admin/global-ips", {
          value: form.value.trim(),
          label: (form.label || "").trim(),
          active: !!form.active,
        });
        toast.success("Created");
      }
      reset({ value: "", label: "", active: true });
      setEditingId(null);
      await loadList();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (row) => {
    setEditingId(row._id);
    reset({
      value: row.value || "",
      label: row.label || "",
      active: !!row.active,
    });
    // scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onCancelEdit = () => {
    setEditingId(null);
    reset({ value: "", label: "", active: true });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this IP rule?")) return;
    try {
      await api.delete(`/admin/global-ips/${id}`);
      toast.success("Deleted");
      await loadList();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const onToggleActive = async (row) => {
    try {
      await api.put(`/admin/global-ips/${row._id}`, { active: !row.active });
      await loadList();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (r.value || "").toLowerCase().includes(q) ||
        (r.label || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Global IP Allowlist" />
        {/* CREATE / UPDATE form */}
        <div className="card mb-4">
          <div className="card-body pr-5 pl-5 m-1">
            <form className="row" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group col-md-4">
                <label>IP or CIDR *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 49.36.12.101 or 103.88.12.0/24"
                  {...register("value", {
                    required: "IP/CIDR is required",
                    validate: (v) => isValidIpOrCidr(v) || "Invalid IP or CIDR",
                  })}
                />
                {errors.value && (
                  <small className="text-danger">{errors.value.message}</small>
                )}
              </div>

              <div className="form-group col-md-4">
                <label>Label</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Office Range / Home IP"
                  {...register("label")}
                />
              </div>

              <div className="form-group col-md-2 d-flex align-items-end">
                <div className="form-check">
                  <input
                    id="activeSwitch"
                    type="checkbox"
                    className="form-check-input"
                    {...register("active")}
                  />
                  <label className="form-check-label" htmlFor="activeSwitch">
                    Active
                  </label>
                </div>
              </div>

              <div className="form-group col-md-2 d-flex align-items-end">
                <button
                  className="btn btn-primary btn-block"
                  type="submit"
                  disabled={saving}
                >
                  {editingId
                    ? saving
                      ? "Updating..."
                      : "Update"
                    : saving
                    ? "Saving..."
                    : "Add"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-light ml-2"
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* LIST + SEARCH */}
        <div className="card">
          <div className="card-body pr-5 pl-5 m-1">
            <div className="row mb-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by IP or Label..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="col-md-8 text-right">
                <button
                  className="btn btn-outline-secondary"
                  onClick={loadList}
                  disabled={loading}
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ minWidth: 260 }}>IP / CIDR</th>
                    <th>Label</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th style={{ width: 220 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        {loading ? "Loading..." : "No records"}
                      </td>
                    </tr>
                  )}
                  {filteredRows.map((r) => (
                    <tr key={r._id}>
                      <td className="font-weight-bold">{r.value}</td>
                      <td>{r.label || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            r.active ? "badge-success" : "badge-secondary"
                          }`}
                        >
                          {r.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary mr-2"
                          onClick={() => onEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning mr-2"
                          onClick={() => onToggleActive(r)}
                        >
                          {r.active ? "Disable" : "Enable"}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(r._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted mt-2">
              Note: Agar global allowlist khaali hai to login/refresh block ho
              jayega (as per backend).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllowedIP;
