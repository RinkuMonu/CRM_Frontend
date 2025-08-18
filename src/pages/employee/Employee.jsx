import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getUser, updateUser } from "../../http";
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaLock,
  FaPiggyBank,
  FaHome,
  FaIdCard,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserEdit,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import DocumentUpload from "./document";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Employee = () => {
  const [user, setUser] = useState({});
  const loginUser = useSelector((state) => state.authSlice.user);

  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    const res = await getUser(id);
    if (res.success) setUser(res.data);
  };

  const handleEdit = (section) => {
    setEditSection(section);
    setFormData({ ...user });
    setErrors({});
  };

  const validateField = (name, value) => {
    const today = new Date().toISOString().split("T")[0];
    const maxDOB = "2010-12-31"; // Minimum age 15 years (as of 2025)
    const isExperienced = formData.experience === "Experiance";

    const patterns = {
      name: {
        required: true,
        pattern: /^[a-zA-Z\s]*$/,
        message: "Only letters allowed",
      },
      email: {
        required: true,
        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
      mobile: {
        required: true,
        pattern: /^[6-9]\d{9}$/,
        message: "Must be 10 digits starting with 6-9",
      },
      alternate_number: {
        required: false,
        pattern: /^[6-9]\d{9}$/,
        message: "Must be 10 digits starting with 6-9",
      },
      password: {
        required: name === "password",
        minLength: 6,
        message: "Password must be at least 6 characters",
      },
      desgination: {
        required: true,
        pattern: /^[a-zA-Z\s]*$/,
        message: "Only letters allowed",
      },
      account_number: {
        required: "Account number is required",
        validate: (value) => /^\d{9,18}$/.test(value) || "Must be 9-18 digits",
      },
      ifsc: {
        required: true,
        pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
        message: "Invalid IFSC format",
      },
      bank_name: {
        required: true,
        pattern: /^[a-zA-Z\s]*$/,
        message: "Only letters allowed",
      },
      father_name: {
        required: true,
        pattern: /^[a-zA-Z\s]*$/,
        message: "Only letters allowed",
      },
      mother_name: {
        required: true,
        pattern: /^[a-zA-Z\s]*$/,
        message: "Only letters allowed",
      },
      current_address: {
        required: true,
        message: "Current address is required",
      },
      permanent_address: {
        required: true,
        message: "Permanent address is required",
      },
      DOB: {
        required: true,
        max: maxDOB,
        message: "Must be at least 15 years old",
      },
      DOJ: {
        required: true,
        max: today,
        message: "Joining date cannot be in future",
      },
      nominee_name: {
        required: true,
        pattern: /^[a-zA-Z\s]*$/,
        message: "Only letters allowed",
      },
      nominee_relation: {
        required: true,
        pattern: /^[a-zA-Z\s]*$/,
        message: "Only letters allowed",
      },
      nominee_mobile: {
        required: true,
        pattern: /^[6-9]\d{9}$/,
        message: "Must be 10 digits starting with 6-9",
      },
      nominee_age: {
        required: true,
        validate: (val) => parseInt(val) >= 15 || "Age must be at least 15",
      },
      Un_no: {
        required: isExperienced,
        pattern: /^\d{12}$/,
        message: "Must be 12 digits",
      },
      Esi_no: {
        required: isExperienced,
        pattern: /^\d+$/,
        message: "Must be numbers only",
      },
      company_name: {
        required: isExperienced,
        message: "Company name is required",
      },
      total_experience: {
        required: isExperienced,
        message: "Total experience is required",
      },
      reason_of_leaving: {
        required: isExperienced,
        message: "Reason for leaving is required",
      },
      gender: {
        required: true,
        message: "Gender is required",
      },
      branch: {
        required: true,
        message: "Department is required",
      },
    };

    if (patterns[name]?.required && !value) {
      return "This field is required";
    }

    if (
      value &&
      patterns[name]?.pattern &&
      !patterns[name].pattern.test(value)
    ) {
      return patterns[name].message;
    }

    if (
      value &&
      patterns[name]?.minLength &&
      value.length < patterns[name].minLength
    ) {
      return patterns[name].message;
    }

    if (value && patterns[name]?.validate && !patterns[name].validate(value)) {
      return patterns[name].message;
    }

    return null;
  };

  const handleNameInput = (e, fieldName) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    handleChange({ target: { name: fieldName, value } });
  };

  const handleMobileInput = (e, fieldName) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length === 1 && !/^[6-9]$/.test(value)) return;
    if (value.length > 10) value = value.slice(0, 10);
    handleChange({ target: { name: fieldName, value } });
  };

  const handleNumberInput = (e, fieldName, maxLength = 10) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, maxLength);
    handleChange({ target: { name: fieldName, value } });
  };

  const handleIFSCInput = (e) => {
    const value = e.target.value.toUpperCase();
    handleChange({ target: { name: "ifsc", value } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validate all fields in the current section
    const sectionFields = Object.keys(formData).filter(
      (field) => getSectionKey(field) === editSection
    );

    const newErrors = {};
    sectionFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before saving");
      return;
    }

    const updatedFields = {};
    sectionFields.forEach((field) => {
      if (formData[field] !== user[field]) {
        updatedFields[field] = formData[field];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setEditSection(null);
      return;
    }

    try {
      const res = await updateUser(id, updatedFields);
      if (res.success) {
        setUser((prev) => ({ ...prev, ...updatedFields }));
        setEditSection(null);
        setErrors({});
        toast.success("Profile updated successfully");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditSection(null);
    setFormData({});
    setErrors({});
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await updateUser(id, formData);
      if (res.success) {
        setUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
        toast.success("Profile image updated successfully");
      } else {
        toast.error(res.message || "Failed to update profile image");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile image"
      );
    }
  };

  const renderField = (label, name, type = "text", options = null) => {
    const isEditing = editSection === getSectionKey(name);
    const value = user[name] || "";
    const isExperienced = formData.experience === "Experiance";
    const isFresherOrIntern =
      formData.experience === "Fresher" || formData.experience === "Intern";

    // Hide certain fields for Intern/Fresher
    const shouldHideField =
      isFresherOrIntern &&
      (name === "company_name" ||
        name === "total_experience" ||
        name === "reason_of_leaving" ||
        name === "Un_no" ||
        name === "Esi_no");

    if (shouldHideField && isEditing) return null;
    if (shouldHideField && !isEditing && !value) return null;

    if (isEditing) {
      const inputProps = {
        className: `form-control ${errors[name] ? "is-invalid" : ""}`,
        name,
        value: formData[name] ?? "",
        onChange: handleChange,
        onKeyDown: (e) => e.key === "Enter" && e.preventDefault(),
      };

      // Special handling for different field types
      if (
        name === "name" ||
        name === "nominee_name" ||
        name === "nominee_relation" ||
        name === "father_name" ||
        name === "mother_name" ||
        name === "bank_name" ||
        name === "desgination"
      ) {
        inputProps.onChange = (e) => handleNameInput(e, name);
      } else if (
        name === "mobile" ||
        name === "alternate_number" ||
        name === "nominee_mobile"
      ) {
        inputProps.onChange = (e) => handleMobileInput(e, name);
        inputProps.maxLength = 10;
      } else if (
        name === "account_number" ||
        name === "U_nno" ||
        name === "Esi_no" ||
        name === "nominee_age"
      ) {
        inputProps.onChange = (e) =>
          handleNumberInput(
            e,
            name,
            name === "U_nno"
              ? 12
              : name === "Esi_no"
              ? 17
              : name === "account_number"
              ? 18
              : 2
          );
      } else if (name === "ifsc") {
        inputProps.onChange = handleIFSCInput;
      }

      // Date fields max constraints
      if (name === "DOB") {
        inputProps.max = "2010-12-31";
      } else if (name === "DOJ") {
        inputProps.max = new Date().toISOString().split("T")[0];
      }

      return (
        <div className="form-group col-md-4 mb-3">
          <label>{label}</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">
                {name.includes("mobile") ? (
                  <FaPhone />
                ) : name === "name" ? (
                  <FaUser />
                ) : name.includes("DO") ? (
                  <FaCalendarAlt />
                ) : name === "password" ? (
                  <FaLock />
                ) : name.includes("account") ? (
                  <FaPiggyBank />
                ) : name.includes("address") ? (
                  <FaMapMarkerAlt />
                ) : name.includes("ifsc") ? (
                  <FaIdCard />
                ) : name === "email" ? (
                  <FaEnvelope />
                ) : null}
              </div>
            </div>

            {options ? (
              <select {...inputProps}>
                <option value="">Select {label}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : type === "date" ? (
              <input type="date" {...inputProps} />
            ) : (
              <input type={type} {...inputProps} />
            )}
          </div>
          {errors[name] && (
            <div className="invalid-feedback d-block">{errors[name]}</div>
          )}
        </div>
      );
    }

    // Display mode
    return (
      <div className="col-md-4 mb-3">
        <div className="text-muted fw-semibold small mb-1">{label}</div>
        <div className="text-dark">{value || "—"}</div>
      </div>
    );
  };

  const getSectionKey = (fieldName) => {
    const sectionMap = {
      name: "personal",
      email: "contact",
      mobile: "contact",
      password: "sensitive",
      type: "personal",
      profile: "personal",
      desgination: "personal",
      account_number: "bank",
      ifsc: "bank",
      bank_name: "bank",
      father_name: "family",
      mother_name: "family",
      current_address: "contact",
      permanent_address: "contact",
      status: "personal",
      branch: "personal",
      gender: "personal",
      DOB: "personal",
      Un_no: "personal",
      Esi_no: "personal",
      alternate_number: "contact",
      DOJ: "personal",
      experience: "personal",
      company_name: "personal",
      total_experience: "personal",
      reason_of_leaving: "personal",
      nominee_name: "nominee",
      nominee_relation: "nominee",
      nominee_address: "nominee",
      nominee_mobile: "nominee",
      nominee_age: "nominee",
    };

    return sectionMap[fieldName] || "personal";
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="card shadow rounded p-4 mb-4">
          <div className="text-center mb-4 position-relative">
            <img
              src={user?.image || "/assets/icons/user.png"}
              alt="Profile"
              className="rounded-circle border border-3 shadow"
              width="130"
              height="130"
            />
            <div className="d-flex  gap-3 position-absolute end-0 top-0 mt-2 me-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => fileInputRef.current.click()}
              >
                <FaUserEdit className="me-1" /> Edit Image
              </button>
              <Link to={`/editdocument/${id}`}>
                <button className="btn btn-sm btn-outline-primary">
                  <FaUserEdit className="me-1" /> Edit Documents
                </button>
              </Link>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <h3 className="mt-3 mb-1">{user.name}</h3>
            <div className="d-flex justify-content-center gap-2">
              <span className="badge bg-info">{user.desgination}</span>
              <span className="badge bg-secondary">{user.branch}</span>
              <span className="badge bg-success">{user.type}</span>
            </div>
          </div>

          {/* Personal Information */}
          <Section
            title="Personal Information"
            sectionKey="personal"
            isEditing={editSection === "personal"}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            user={loginUser?.user?.type}
          >
            {renderField("Name", "name")}
            {renderField("Gender", "gender", "text", ["Male", "Female"])}
            {renderField("DOB", "DOB", "date")}
            {renderField("DOJ", "DOJ", "date")}
            {renderField("Status", "status", "text", [
              "active",
              "banned",
              "notice",
              "provison",
            ])}
            {renderField("Type", "type", "text", [
              "Employee",
              "Leader",
              "Admin",
            ])}
            {renderField("Department", "branch", "text", [
              "tech",
              "sales",
              "telecaller",
              "hr",
            ])}
            {renderField("Designation", "desgination")}
            {renderField("Experience", "experience", "text", [
              "Fresher",
              "Experiance",
              "Intern",
            ])}
            {renderField("Company Name", "company_name")}
            {renderField("Total Experience", "total_experience")}
            {renderField("Reason of Leaving", "reason_of_leaving")}
            {renderField("PF UN Number", "Un_no")}
            {renderField("ESI Number", "Esi_no")}
          </Section>

          {/* Contact Information */}
          <Section
            title="Contact Information"
            sectionKey="contact"
            // isEditing={user.type === 'Admin' ? editSection === "contact" : false}
            isEditing={editSection === "contact"}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            user={loginUser?.user?.type}
          >
            {renderField("Email", "email", "email")}
            {renderField("Mobile", "mobile", "tel")}
            {renderField("Alternate Number", "alternate_number", "tel")}
            {renderField("Current Address", "current_address")}
            {renderField("Permanent Address", "permanent_address")}
          </Section>

          {/* Bank Details */}
          <Section
            title="Bank Details"
            sectionKey="bank"
            isEditing={editSection === "bank"}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            user={loginUser?.user?.type}
          >
            {renderField("Bank Name", "bank_name")}
            {renderField("Account Number", "account_number")}
            {renderField("IFSC Code", "ifsc")}
          </Section>

          {/* Family Information */}
          <Section
            title="Family Information"
            sectionKey="family"
            isEditing={editSection === "family"}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            user={loginUser?.user?.type}
          >
            {renderField("Father's Name", "father_name")}
            {renderField("Mother's Name", "mother_name")}
          </Section>

          {/* Nominee Information */}
          <Section
            title="Nominee Information"
            sectionKey="nominee"
            isEditing={editSection === "nominee"}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            user={loginUser?.user?.type}
          >
            {renderField("Nominee Name", "nominee_name")}
            {renderField("Relation", "nominee_relation")}
            {renderField("Age", "nominee_age", "text")}
            {renderField("Mobile", "nominee_mobile", "tel")}
            {renderField("Address", "nominee_address")}
          </Section>
          {/* <DocumentUpload userId={id} user={user} /> */}
          {/* Sensitive Information */}
          <Section
            title="Sensitive Information"
            sectionKey="sensitive"
            isEditing={editSection === "sensitive"}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            user={"Admin"}
          >
            {renderField("Password", "password", "password")}
          </Section>
        </div>
      </section>
    </div>
  );
};

const Section = ({
  title,
  sectionKey,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  children,
  user,
}) => (
  <div className="border-top pt-3 mt-3">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="text-dark fw-bold mb-0">{title}</h5>
      {isEditing ? (
        <div>
          <button className="btn btn-success btn-sm me-2" onClick={onSave}>
            Save Changes
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => onEdit(sectionKey)}
        >
          Edit {title}
        </button>
      )}
      {/* {user == "Admin" && // 🔑 only Admins can see edit buttons
        (isEditing ? (
          <div>
            <button className="btn btn-success btn-sm me-2" onClick={onSave}>
              Save Changes
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(sectionKey)}
          >
            Edit {title}
          </button>
        ))} */}
    </div>
    <div className="row">{children}</div>
  </div>
);

export default Employee;
