import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getUser, updateUser } from "../../http";
import { FaUser, FaPhone, FaCalendarAlt, FaLock, FaPiggyBank, FaHome, FaIdCard, FaEnvelope, FaMapMarkerAlt, FaUserEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Employee = () => {
  const admin = useSelector(state => state.authSlice)
  const [user, setUser] = useState({});
  const [editSection, setEditSection] = useState(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const role = admin?.user?.user?.type === "Admin" ? 'admin' : 'task'

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger
  } = useForm({
    defaultValues: {}
  });

  const experience = watch("experience");

  useEffect(() => {
    fetchUser();
  }, [id, role]);

  const fetchUser = async () => {
    const res = await getUser(role, id);
    if (res?.success) {
      setUser(res.data);
      reset(res.data);
    }
  };

  const handleEdit = (section) => {
    setEditSection(section);
  };

  const handleSave = async (data) => {
    // Get only the changed fields in this section
    const updatedFields = {};
    Object.keys(data).forEach(key => {
      if (getSectionKey(key) === editSection && data[key] !== user[key]) {
        updatedFields[key] = data[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setEditSection(null);
      return;
    }

    try {
      const res = await updateUser(id, updatedFields);
      if (res.success) {
        setUser(prev => ({ ...prev, ...updatedFields }));
        setEditSection(null);
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
    reset(user);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await updateUser(id, formData);
      if (res.success) {
        setUser(prev => ({ ...prev, image: URL.createObjectURL(file) }));
        toast.success("Profile image updated successfully");
      } else {
        toast.error(res.message || "Failed to update profile image");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile image");
    }
  };

  const renderField = (label, name, type = "text", options = null) => {
    const isEditing = editSection === getSectionKey(name);
    const value = user[name] || "";
    const isExperienced = experience === "Experiance";
    const isFresherOrIntern = experience === "Fresher" || experience === "Intern";

    // Hide certain fields for Intern/Fresher
    const shouldHideField = isFresherOrIntern &&
      (name === "company_name" ||
        name === "total_experience" ||
        name === "reason_of_leaving" ||
        name === "Un_no" ||
        name === "Esi_no");
    if (shouldHideField && isEditing) return null;
    if (shouldHideField && !isEditing && !value) return null;

    if (isEditing) {
      const validationRules = {
        name: {
          required: "Name is required",
          pattern: {
            value: /^[a-zA-Z\s]*$/,
            message: "Only letters allowed"
          }
        },
        email: {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        },
        mobile: {
          required: "Mobile number is required",
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Must be 10 digits starting with 6-9"
          }
        },
        alternate_number: {
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Must be 10 digits starting with 6-9"
          }
        },
        password: {
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters"
          }
        },
        desgination: {
          required: "Designation is required",
          pattern: {
            value: /^[a-zA-Z\s]*$/,
            message: "Only letters allowed"
          }
        },
        account_number: {
          required: "Account number is required",
          pattern: {
            value: /^\d{9,18}$/,
            message: "Must be 9-18 digits"
          }
        },
        ifsc: {
          required: "IFSC code is required",
          pattern: {
            value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
            message: "Invalid IFSC format"
          }
        },
        bank_name: {
          required: "Bank name is required",
          pattern: {
            value: /^[a-zA-Z\s]*$/,
            message: "Only letters allowed"
          }
        },
        father_name: {
          required: "Father's name is required",
          pattern: {
            value: /^[a-zA-Z\s]*$/,
            message: "Only letters allowed"
          }
        },
        mother_name: {
          required: "Mother's name is required",
          pattern: {
            value: /^[a-zA-Z\s]*$/,
            message: "Only letters allowed"
          }
        },
        current_address: {
          required: "Current address is required"
        },
        permanent_address: {
          required: "Permanent address is required"
        },
        DOB: {
          required: "Date of birth is required",
          max: {
            value: "2010-12-31",
            message: "Must be at least 15 years old"
          }
        },
        DOJ: {
          required: "Joining date is required",
          max: {
            value: new Date().toISOString().split('T')[0],
            message: "Joining date cannot be in future"
          }
        },
        nominee_name: {
          required: "Nominee name is required",
          pattern: {
            value: /^[a-zA-Z\s]*$/,
            message: "Only letters allowed"
          }
        },
        nominee_relation: {
          required: "Nominee relation is required",
          pattern: {
            value: /^[a-zA-Z\s]*$/,
            message: "Only letters allowed"
          }
        },
        nominee_mobile: {
          required: "Nominee mobile is required",
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Must be 10 digits starting with 6-9"
          }
        },
        nominee_age: {
          required: "Nominee age is required",
          min: {
            value: 15,
            message: "Age must be at least 15"
          }
        },
        Un_no: {
          required: isExperienced && "PF UN number is required",
          pattern: {
            value: /^\d{12}$/,
            message: "Must be 12 digits"
          }
        },
        Esi_no: {
          required: isExperienced && "ESI number is required",
          pattern: {
            value: /^\d+$/,
            message: "Must be numbers only"
          }
        },
        company_name: {
          required: isExperienced && "Company name is required"
        },
        total_experience: {
          required: isExperienced && "Total experience is required"
        },
        reason_of_leaving: {
          required: isExperienced && "Reason for leaving is required"
        },
        gender: {
          required: "Gender is required"
        },
        branch: {
          required: "Department is required"
        },
        type: {
          required: "User type is required"
        },
        status: {
          required: "Status is required"
        },
        experience: {
          required: "Experience is required"
        }
      };

      const inputProps = register(name, validationRules[name] || {});

      // Special handling for different field types
      const handleNameInput = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setValue(name, value);
        trigger(name);
      };

      const handleMobileInput = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length === 1 && !/^[6-9]$/.test(value)) return;
        if (value.length > 10) value = value.slice(0, 10);
        setValue(name, value);
        trigger(name);
      };

      const handleNumberInput = (e, maxLength = 10) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
        setValue(name, value);
        trigger(name);
      };

      const handleIFSCInput = (e) => {
        const value = e.target.value.toUpperCase();
        setValue(name, value);
        trigger(name);
      };

      const onChangeHandlers = {
        name: handleNameInput,
        nominee_name: handleNameInput,
        nominee_relation: handleNameInput,
        father_name: handleNameInput,
        mother_name: handleNameInput,
        bank_name: handleNameInput,
        desgination: handleNameInput,
        mobile: handleMobileInput,
        alternate_number: handleMobileInput,
        nominee_mobile: handleMobileInput,
        account_number: (e) => handleNumberInput(e, 18),
        Un_no: (e) => handleNumberInput(e, 12),
        Esi_no: (e) => handleNumberInput(e, 17),
        nominee_age: (e) => handleNumberInput(e, 2),
        ifsc: handleIFSCInput
      };

      const customOnChange = onChangeHandlers[name] || inputProps.onChange;

      return (
        <div className="form-group col-md-4 mb-3">
          <label>
            {label}
            {validationRules[name]?.required && <span className="text-danger"> *</span>}
          </label>
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">
                {name.includes("mobile") ? <FaPhone /> :
                  name === "name" ? <FaUser /> :
                    name.includes("DO") ? <FaCalendarAlt /> :
                      name === "password" ? <FaLock /> :
                        name.includes("account") ? <FaPiggyBank /> :
                          name.includes("address") ? <FaMapMarkerAlt /> :
                            name.includes("ifsc") ? <FaIdCard /> :
                              name === "email" ? <FaEnvelope /> : null}
              </div>
            </div>

            {options ? (
              <select
                className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                {...inputProps}
                onChange={customOnChange}
              >
                <option value="" disabled>
                  Select {label}
                </option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                {...inputProps}
                onChange={customOnChange}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              />
            )}
          </div>
          {errors[name] && (
            <div className="invalid-feedback d-block">
              {errors[name].message}
            </div>
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
      nominee_age: "nominee"
    };

    return sectionMap[fieldName] || "personal";
  };

  const fields = [
    "employee_adhar_image",
    "employee_pan_image",
    "tenth_marksheet_img",
    "twelth_marksheet_img",
    "mother_adhar_image",
    "father_adhar_image",
    "Policeverification",
  ];
  const isAnyDocMissing = fields.some((field) => !user[field]);

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
            {
              admin?.user?.user?.type === "Admin" && (
                <div className="position-absolute end-0 top-0 mt-2 me-2 d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaUserEdit className="me-1" /> Edit Image
                  </button>

                  {isAnyDocMissing && (
                    <NavLink to={`/editdocument/${id}`}>
                      <button className="btn btn-sm btn-outline-dark">
                        📁 Upload Documents
                      </button>
                    </NavLink>
                  )}
                </div>
              )
            }
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
            onSave={handleSubmit(handleSave)}
            onCancel={handleCancel}
            user={admin?.user?.user?.type}
          >
            {renderField("Name", "name")}
            {renderField("Gender", "gender", "text", ["Male", "Female"])}
            {renderField("DOB", "DOB", "date")}
            {renderField("DOJ", "DOJ", "date")}
            {renderField("Status", "status", "text", ["active", "banned", "notice", "provison"])}
            {renderField("Type", "type", "text", ["Employee", "Leader", "Admin"])}
            {renderField("Department", "branch", "text", ["tech", "sales", "telecaller", "hr"])}
            {renderField("Designation", "desgination")}
            {renderField("Experience", "experience", "text", ["Fresher", "Experiance", "Intern"])}
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
            isEditing={editSection === "contact"}
            onEdit={handleEdit}
            onSave={handleSubmit(handleSave)}
            onCancel={handleCancel}
            user={admin?.user?.user?.type}
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
            onSave={handleSubmit(handleSave)}
            onCancel={handleCancel}
            user={admin?.user?.user?.type}
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
            onSave={handleSubmit(handleSave)}
            onCancel={handleCancel}
            user={admin?.user?.user?.type}
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
            onSave={handleSubmit(handleSave)}
            onCancel={handleCancel}
            user={admin?.user?.user?.type}
          >
            {renderField("Nominee Name", "nominee_name")}
            {renderField("Relation", "nominee_relation")}
            {renderField("Age", "nominee_age", "text")}
            {renderField("Mobile", "nominee_mobile", "tel")}
            {renderField("Address", "nominee_address")}
          </Section>

          {/* Sensitive Information */}
          <Section
            title="Sensitive Information"
            sectionKey="sensitive"
            isEditing={editSection === "sensitive"}
            onEdit={handleEdit}
            onSave={handleSubmit(handleSave)}
            onCancel={handleCancel}
            user={admin?.user?.user?.type}
          >
            {renderField("Password", "password", "password")}
          </Section>
        </div>
      </section>
    </div>
  );
};

const Section = ({ title, sectionKey, isEditing, onEdit, onSave, onCancel, user, children }) => (
  <div className="border-top pt-3 mt-3">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="text-dark fw-bold mb-0">{title}</h5>
      {isEditing ? (
        <div>
          <button className="btn btn-success btn-sm me-2" onClick={onSave}>
            Save Changes
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={onCancel}>
            Cancel
          </button>
        </div>
      ) : (
        user == "Admin" && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(sectionKey)}
          >
            Edit {title}
          </button>
        )
      )}
    </div>
    <div className="row">{children}</div>
  </div>
);

export default Employee;