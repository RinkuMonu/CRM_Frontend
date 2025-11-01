import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HeaderSection from "../../components/HeaderSection";
import { getEmployees, getLeaders, sendLetter } from "../../http";
import "react-datepicker/dist/react-datepicker.css";

// ========= TEMPLATE FUNCTIONS =========

const templates = {
  offer: ({
    name,
    address,
    position,
    salary,
    ctc,
    startDate,
    reportingDate,
    manager,
  }) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #000;">
      <p>Date: ${startDate}</p>
      <p>${name},<br/>${address}</p>
      <p>Subject: Employment Offer for the Position of <b>${position}</b> </p>
      <p>Dear ${name},</p>
      <p>Congratulations!</p>
      <p>We are delighted to offer you a position as a <b>${position}</b> with <b>Sevenunique Tech Solutions Private Limited</b> (the “Company”) at our Jaipur Office. This letter describes the basic terms of the offer, subject to a mutual agreement on the conditions stated below.</p>

      <p>This offer stands contingent on a background check and validation of the information provided by you during the interview or any other process related to your employment with the Company.</p>

      <b>Employment Start Date & Probation</b>

      <p>You are required to commence employment with the Company on Monday, <b>${reportingDate}</b> (the “Joining Date”). You will be on probation for 3 (Three) months from the date of your joining. Wherein the probation period may be either extended at the discretion of the management or may be reduced either earlier or on completion, or thereafter till confirmation. .</p>

      <p>Your services are liable to be terminated with notice of not more than 15 (Fifteen) days during the initial or extended period of probation. In case you decide to leave the company during this period, you will have to give prior notice of 15 (Fifteen) days to the company.</p>

      <br>Employment Benefits and Compensation:</br>

      <p> Your Fixed Annual CTC will be Rs. ${ctc} per annum, or Rs. ${salary} per month. The Salary Break-up is outlined in “Annexure- I” for your reference.</p>
    <br/>
    <p>Sincerely,<br/><b>HR Department</b><br/>Sevenunique Tech Solution Pvt. Ltd.</p>
    </div>
  `,

  warning: ({ name, id, designation, reason, date }) => `
  <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000;">
    <h2 style="text-align: center; text-decoration: underline; font-weight: bold; margin-bottom: 20px;">
      Warning Letter
    </h2>

    <p><b>Sevenunique Tech Solution Pvt. Ltd.</b></p>
    <p>Plot No 97, Dakshinpuri - I, Shrikishan, Sanganer,<br/>Jagatpura, Jaipur, Rajasthan, India – 302017</p>
    <p>Email: <a href="mailto:Info@7unique.in">Info@7unique.in</a></p>
    <p>Phone: 0141-4511098</p>

    <p><b>Date:</b> ${date}</p>

    <p><b>Employee Name:</b> ${name}<br/>
    <b>ID No.:</b> ${id}<br/>
    <b>Designation:</b> ${designation}</p>

    <p><b>Subject:</b> Warning Letter for <b>${reason}</b></p>

    <p>Dear ${name},</p>

    <p>
      This letter serves as a formal warning regarding your <b>${reason}</b> that was observed on <b>${date}</b>. 
      As per our company's policies and procedures, it is expected that all employees adhere to the standards of behaviour and performance.
    </p>

    <p>
      You are expected to correct your behaviour and adhere to the company's rules and regulations. 
      Failure to do so may result in further disciplinary action, up to and including termination of employment.
    </p>

    <p>
      You are required to sign and return a copy of this letter to acknowledge receipt and understanding of the warning.
    </p>

    <p>
      Thanks & Regards,<br/>
      <b>Munesh Kumari</b><br/>
      HR Manager<br/>
      Sevenunique Tech Solution Pvt. Ltd.
    </p>

    <hr style="margin: 40px 0; border: 1px solid #000;" />

    <h3 style="text-align: center; font-weight: bold;">Acknowledgement</h3>
    <p>
      I, <b>${name}</b>, acknowledge receipt of this warning letter and understand the expectations outlined above.
    </p>

    <p>
      Signature: _______________________<br/>
      Date: ___________________________
    </p>
  </div>
`,

  promotion: ({ name, newPosition, effectiveDate }) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #000;">
      <p>Date: ${effectiveDate}</p>
      <p>To,<br/>${name}</p>
      <p>Subject: Promotion Letter</p>
      <p>Dear ${name},</p>
      <p>We are pleased to inform you that you have been promoted to the position of <b>${newPosition}</b> effective from ${effectiveDate}.</p>
      <p>This promotion is a recognition of your performance and contribution to the organization. We wish you continued success in your new role.</p>
      <p>Sincerely,<br/>HR Department<br/>Seven Unique Tech Solution Private Limited</p>
    </div>
  `,

  termination: ({ name, terminationDate, reason, id, department }) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #000;">
      <p>Date: ${terminationDate}</p>
      <p>To,<br/>${name}<br/>Employee ID: ${id}<br/>Department: ${department}</p>
      <p>Subject: Termination of Employment</p>
      <p>Dear ${name},</p>
      <p>This letter is to formally inform you that your employment with Seven Unique Tech Solution Private Limited is terminated effective from <b>${terminationDate}</b> due to <b>${reason}</b>.</p>
      <p>Despite previous discussions and written warnings, no significant improvement has been observed. As a result, the management has decided to terminate your services in accordance with company policy.</p>
      <p>You are required to return all company assets including your ID card, laptop, official documents, and any other materials issued to you, on or before your final working day.</p>
      <p>We thank you for your time with the organization and wish you the best in your future endeavors.</p>
      <p>Sincerely,<br/>Munesh kumari<br/>HR Department<br/>Seven Unique Tech Solution Private Limited</p>
    </div>
  `,

  notice: ({ name, noticeDate, reason }) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #000;">
      <p>Date: ${noticeDate}</p>
      <p>To, <b>${name}</b></p>
      <p>Subject: Notice Issuance</p>
      <p>Dear ${name},</p>
      <p>This letter is to inform you that a notice has been issued regarding: <b>${reason}</b>.</p>
      <p>Please consider this as official notice from management.</p>
      <p>Sincerely,<br/>HR Department<br/>Seven Unique Tech Solution Private Limited</p>
    </div>
  `,
  internship: ({ name, genderTitle, startDate, endDate, duration, role }) => `
  <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000;">
    <h2 style="text-align: center; text-decoration: underline; font-weight: bold; margin-bottom: 20px;">
      INTERNSHIP COMPLETION CERTIFICATE
    </h2>

    <p><b>Sevenunique Tech Solution Pvt. Ltd.</b></p>
    <p>Plot No 97, Dakshinpuri - I, Shrikishan, Sanganer, Jagatpura, Jaipur,<br/>Rajasthan, India – 302017</p>
    <p>Email: <a href="mailto:Info@7unique.in">Info@7unique.in</a></p>
    <p>Phone: 0141-4511098</p>

    <p><b>Date:</b> ${new Date().toLocaleDateString("en-GB")}</p>

    <h3 style="text-align: center; font-weight: bold; margin-top: 20px;">
      TO WHOMSOEVER IT MAY CONCERN
    </h3>

    <p>
      This is to certify that <b>${genderTitle} ${name}</b> has completed ${
    genderTitle === "Mr." ? "his" : "her"
  } internship at <b>Sevenunique Tech Solution Pvt. Ltd.</b> 
      from <b>${startDate}</b> to <b>${endDate}</b> 
      <span style="color: red;">(Duration ${duration})</span>.
    </p>

    <p>
      During the internship period, ${genderTitle} ${name} worked as a <b>${role}</b>.
      ${
        genderTitle === "Mr." ? "He" : "She"
      } was involved in various tasks including client relationship building, 
      communication, feedback collection, strategic planning, and solution providing.
    </p>

    <p>
      We found ${name} to be hardworking, dedicated, and keen to learn. 
      ${
        genderTitle === "Mr." ? "He" : "She"
      } carried out all responsibilities with sincerity and professionalism.
    </p>

    <p>
      We wish ${name} all the best in ${
    genderTitle === "Mr." ? "his" : "her"
  } future endeavors.
    </p>

    <br/>
    <p>Sincerely,<br/><b>HR Department</b><br/>Sevenunique Tech Solution Pvt. Ltd.</p>
  </div>
`,

  experience: ({
    name,
    genderTitle,
    joiningDate,
    relievingDate,
    duration,
    position,
  }) => `
  <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000;">
    <h2 style="text-align: center; text-decoration: underline; font-weight: bold; margin-bottom: 20px;">
      EXPERIENCE LETTER
    </h2>

    <p><b>Sevenunique Tech Solution Pvt. Ltd.</b></p>
    <p>Plot No 97, Dakshinpuri - I, Shrikishan, Sanganer,<br/>Jagatpura, Jaipur, Rajasthan, India – 302017</p>
    <p>Email: <a href="mailto:Info@7unique.in">Info@7unique.in</a></p>
    <p>Phone: 0141-4511098</p>

    <p><b>Date:</b> ${new Date().toLocaleDateString("en-GB")}</p>

    <h3 style="text-align: center; font-weight: bold; margin-top: 20px;">
      To Whomsoever It May Concern
    </h3>

    <p>
      This is to certify that <b>${genderTitle} ${name}</b> was employed with 
      <b>Sevenunique Tech Solution Pvt. Ltd.</b> as a <b>${position}</b> 
      from <b>${joiningDate}</b> to <b>${relievingDate}</b> 
      <span style="color: red;">(Duration ${duration})</span>.
    </p>

    <p>
      During ${
        genderTitle === "Mr." ? "his" : "her"
      } tenure with our organization, 
      ${genderTitle} ${name} demonstrated exceptional skills, excellent communication, 
      and a strong work ethic.
    </p>

    <p>
    During your employment with our organization, you have consistently demonstrated a high level of professionalism, integrity, and dedication to your work. Your contributions to our organization have been valuable, and we appreciate your hard work and commitment.
    </p>

    <p>
      We wish ${name} the best in ${genderTitle === "Mr." ? "his" : "her"} 
      future endeavors and appreciate the experience gained during ${
        genderTitle === "Mr." ? "his" : "her"
      } tenure with us.
    </p>

    <br/><br/>
    <p>
      Best Regards,<br/>
      <b>Muneesh Kumari</b><br/>
      HR Manager<br/>
      Sevenunique Tech Solution Pvt. Ltd.
    </p>
  </div>
`,
};

// ========= MAIN COMPONENT ==========

const AssignLetter = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [letterType, setLetterType] = useState("offer");
  const [formData, setFormData] = useState({});
  const [downloadUrl, setDownloadUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const emps = await getEmployees();
        const leaders = await getLeaders();
        setEmployees([...emps.data, ...leaders.data]);
      } catch (error) {
        toast.error("Error fetching employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getRequiredFields = () => {
    switch (letterType) {
      case "offer":
        return [
          "name",
          "address",
          "position",
          "salary",
          "ctc",
          "startDate",
          "reportingDate",
          "manager",
        ];
      case "warning":
        return ["name", "id", "designation", "reason", "date"];
      case "promotion":
        return ["name", "newPosition", "effectiveDate"];
      case "termination":
        return ["name", "terminationDate", "reason", "id", "department"];
      case "notice":
        return ["name", "noticeDate", "reason"];
      case "experience":
        return [
          "name",
          "genderTitle",
          "joiningDate",
          "relievingDate",
          "duration",
          "position",
        ];
      case "internship":
        return [
          "name",
          "genderTitle",
          "startDate",
          "endDate",
          "duration",
          "role",
        ];
      default:
        return [];
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = getRequiredFields();
    let hasError = false;
    const newErrors = {};

    // Check required
    for (const field of requiredFields) {
      if (!formData[field]) {
        newErrors[field] = `Please fill ${field}`;
        hasError = true;
      }
    }

    // Custom validation
    if ("name" in formData && /[^a-zA-Z\s]/.test(formData.name)) {
      newErrors.name = "Name should contain only letters";
      hasError = true;
    }

    if ("salary" in formData && /[^0-9]/.test(formData.salary)) {
      newErrors.salary = "Salary should contain only numbers";
      hasError = true;
    }

    if ("ctc" in formData && /[^0-9]/.test(formData.ctc)) {
      newErrors.ctc = "CTC should contain only numbers";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      setIsLoading(true);

      const letterHTML = templates[letterType](formData);

      const res = await sendLetter({
        employeeID: selectedEmployee,
        letterHTML,
        letterType,
      });

      if (res.success) {
        toast.success("Letter sent successfully!");
        setFormData({});
        setSelectedEmployee("");
        setDownloadUrl(res.filePath);
      } else {
        toast.error("Failed to send letter.");
      }
    } catch (err) {
      toast.error("Failed to send letter.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFields = () => {
    const fields = getRequiredFields();

    return fields.map((field) => (
      <div key={field} className="form-group col-md-4">
        <label>
          {field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </label>
        <input
          className={`form-control ${errors[field] ? "is-invalid" : ""}`}
          type={field.toLowerCase().includes("date") ? "date" : "text"}
          value={formData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={
            field === "genderTitle"
              ? "eg. Mr./Miss."
              : field === "duration"
              ? "eg. 50 days/3 Month"
              : ""
          }
          onKeyPress={(e) => {
            if (field === "name" && /[^a-zA-Z\s]/.test(e.key))
              e.preventDefault();
            if ((field === "salary" || field === "ctc") && /[^0-9]/.test(e.key))
              e.preventDefault();
          }}
        />
        {errors[field] && (
          <small className="text-danger">{errors[field]}</small>
        )}
      </div>
    ));
  };

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Send Letter" />
        <div className="">
          <div className="card-body p-0">
            <form className="row" onSubmit={onSubmit}>
              {/* Employee Selection */}
              <div className="form-group col-md-4">
                <label>Select Employee</label>
                <select
                  className="form-control"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  required
                >
                  <option value="">Choose Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Letter Type Selection */}
              <div className="form-group col-md-4">
                <label>Select Letter Type</label>
                <select
                  className="form-control"
                  value={letterType}
                  onChange={(e) => setLetterType(e.target.value)}
                >
                  <option value="offer">Offer</option>
                  <option value="promotion">Promotion</option>
                  <option value="warning">Warning</option>
                  <option value="termination">Termination</option>
                  <option value="notice">Notice</option>
                  <option value="experience">Experience</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Dynamic Fields */}
              {renderFields()}

              {/* Submit */}
              <div className="form-group col-md-4">
                <button
                  className="btn btn-primary btn-lg px-3 py-2 rounded-sm d-flex align-items-center justify-content-center gap-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    "Send Letter"
                  )}
                </button>

                {downloadUrl && (
                  <div className="mt-4">
                    <a
                      href={downloadUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success"
                    >
                      📥 Download Letter
                    </a>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssignLetter;
