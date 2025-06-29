import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getUser, updateUser } from "../../http";

const Employee = () => {
  const [user, setUser] = useState({});
  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const res = await getUser(id);
      if (res.success) setUser(res.data);
    })();
  }, [id]);

  const handleEdit = (section) => {
    setEditSection(section);
    setFormData({ ...user });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const updatedFields = {};
    for (let key in formData) {
      if (formData[key] !== user[key]) {
        updatedFields[key] = formData[key];
      }
    }

    const res = await updateUser(id, updatedFields);
    if (res.success) {
      setUser((prev) => ({ ...prev, ...updatedFields }));
      setEditSection(null);
    }
  };

  const handleCancel = () => {
    setEditSection(null);
    setFormData({});
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    const res = await updateUser(id, formData);
    if (res.success) {
      setUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const Info = ({ label, name, isEditing }) => (
    <div className="col-md-4 mb-3">
      <div className="text-muted fw-semibold small mb-1">{label}</div>
      {isEditing ? (
        <input
          className="form-control"
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
        />
      ) : (
        <div className="text-dark">{user[name] || "—"}</div>
      )}
    </div>
  );

  const SelectInfo = ({ label, name, isEditing, options }) => (
    <div className="col-md-4 mb-3">
      <div className="text-muted fw-semibold small mb-1">{label}</div>
      {isEditing ? (
        <select
          className="form-select"
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <div className="text-dark">{user[name] || "—"}</div>
      )}
    </div>
  );

  return (
    <div className="main-content">
      <section className="section">
        <div className="card shadow rounded p-4 mb-4">
          <div className="text-center mb-4 position-relative">
            <img
              src={user?.image || "/assets/icons/user-1.jpg"}
              alt="Profile"
              className="rounded-circle border border-3 shadow"
              width="130"
              height="130"
            />
            <button
              className="btn btn-sm btn-outline-primary position-absolute end-0 top-0 mt-2 me-2"
              onClick={() => fileInputRef.current.click()}
            >
              Edit Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <h3 className="mt-3 mb-1">{user.name}</h3>
            <span className="badge bg-info me-2">{user.desgination}</span>
            <span className="badge bg-secondary">{user.branch}</span>
          </div>

          <Section title="Personal Information" sectionKey="personal" isEditing={editSection === "personal"} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel}>
            <Info label="Name" name="name" isEditing={editSection === "personal"} />
            <Info label="DOB" name="DOB" isEditing={editSection === "personal"} />
            <Info label="DOJ" name="DOJ" isEditing={editSection === "personal"} />
            <Info label="Status" name="status" isEditing={editSection === "personal"} />
            <Info label="Type" name="type" isEditing={editSection === "personal"} />
            <Info label="Experience" name="experience" isEditing={editSection === "personal"} />
            <Info label="Company Name" name="company_name" isEditing={editSection === "personal"} />
            <Info label="Total Experience" name="total_experience" isEditing={editSection === "personal"} />
            <Info label="Reason of Leaving" name="reason_of_leaving" isEditing={editSection === "personal"} />
          </Section>

          <Section title="Contact Information" sectionKey="contact" isEditing={editSection === "contact"} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel}>
            <Info label="Email" name="email" isEditing={editSection === "contact"} />
            <Info label="Mobile" name="mobile" isEditing={editSection === "contact"} />
            <Info label="Alternate Number" name="alternate_number" isEditing={editSection === "contact"} />
            <Info label="Current Address" name="current_address" isEditing={editSection === "contact"} />
            <Info label="Permanent Address" name="permanent_address" isEditing={editSection === "contact"} />
          </Section>

          <Section title="Bank Details" sectionKey="bank" isEditing={editSection === "bank"} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel}>
            <Info label="Bank Name" name="bank_name" isEditing={editSection === "bank"} />
            <Info label="Account Number" name="account_number" isEditing={editSection === "bank"} />
            <Info label="IFSC Code" name="ifsc" isEditing={editSection === "bank"} />
          </Section>

          <Section title="Family Information" sectionKey="family" isEditing={editSection === "family"} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel}>
            <Info label="Father's Name" name="father_name" isEditing={editSection === "family"} />
            <Info label="Mother's Name" name="mother_name" isEditing={editSection === "family"} />
          </Section>

          <Section title="Nominee Information" sectionKey="nominee" isEditing={editSection === "nominee"} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel}>
            <Info label="Nominee Name" name="nominee_name" isEditing={editSection === "nominee"} />
            <Info label="Relation" name="nominee_relation" isEditing={editSection === "nominee"} />
            <Info label="Age" name="nominee_age" isEditing={editSection === "nominee"} />
            <Info label="Mobile" name="nominee_mobile" isEditing={editSection === "nominee"} />
            <Info label="Address" name="nominee_address" isEditing={editSection === "nominee"} />
          </Section>

          <Section title="Sensitive Information" sectionKey="sensitive" isEditing={editSection === "sensitive"} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel}>
            <Info label="Password" name="password" isEditing={editSection === "sensitive"} />
            <SelectInfo label="Status" name="status" isEditing={editSection === "sensitive"} options={["Active", "Banned"]} />
          </Section>
        </div>
      </section>
    </div>
  );
};

const Section = ({ title, sectionKey, isEditing, onEdit, onSave, onCancel, children }) => (
  <div className="border-top pt-3 mt-3">
    <div className="d-flex justify-content-between">
      <h5 className="text-dark fw-bold mb-3">{title}</h5>
      {isEditing ? (
        <div>
          <button className="btn btn-success me-2" onClick={onSave}>Save</button>
          <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        </div>
      ) : (
        <button className="btn border" onClick={() => onEdit(sectionKey)}>Edit Personal Details</button>
      )}
    </div>
    <div className="row">{children}</div>
  </div>
);

export default Employee;
