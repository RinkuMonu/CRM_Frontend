import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUser, updateUserDoc } from "../../http";

const EditDocumentsPage = () => {
  const { id } = useParams();
  const [documentFiles, setDocumentFiles] = useState({});
  const [user, setUser] = useState({});

  const fetchUser = async () => {
    const res = await getUser(id);
    if (res?.success) setUser(res.data);
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleDocumentSelect = (e, label) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFiles((prev) => ({ ...prev, [label]: file }));
    }
  };

  const handleSaveDocuments = async () => {
    const labels = Object.keys(documentFiles);
    if (labels.length === 0) {
      toast.warning("No files selected");
      return;
    }

    for (const label of labels) {
      const file = documentFiles[label];
      const docForm = new FormData();
      docForm.append(label, file);

      try {
        const res = await updateUserDoc(id, docForm);
        if (res.success) {
          toast.success(`${label} uploaded successfully`);
          fetchUser(); // upload ke baad refresh
        } else {
          toast.error(`Failed to upload ${label}`);
        }
      } catch (err) {
        toast.error(`Failed to upload ${label}`);
      }
    }

    setDocumentFiles({});
  };

  const fields = [
    ["Aadhaar", "employee_adhar_image"],
    ["PAN", "employee_pan_image"],
    ["10th Marksheet", "tenth_marksheet_img"],
    ["12th Marksheet", "twelth_marksheet_img"],
    ["Mother Aadhaar", "mother_adhar_image"],
    ["Father Aadhaar", "father_adhar_image"],
    ["Police Verification", "Policeverification"],
  ];

  return (
    <div
      className="px-4 pt-4"
      style={{ marginLeft: "260px", minHeight: "100vh" }}
    >
      <div className="card shadow p-4 rounded-4 mt-5">
        <h3 className="mb-4 text-primary">📁 Employee Documents</h3>
        <div className="row g-4">
          {fields.map(([label, name]) => (
            <div className="col-md-6" key={name}>
              <label className="form-label fw-semibold text-dark">
                {label}
              </label>

              {/* Existing uploaded document */}
              {user[name] && (
                <div className="d-flex align-items-center gap-2 mb-2">
                  <a
                    href={`https://admin.sevenunique.com/${user[name]}`}
                    // href={`http://localhost:5050/${user[name]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Uploaded
                  </a>
                  <span className="text-success">✔ Uploaded</span>
                </div>
              )}

              {/* File input always visible */}
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleDocumentSelect(e, name)}
              />

              {/* Tick mark if new file selected */}
              {documentFiles[name] && (
                <span className="text-success ms-2">✔ Selected</span>
              )}
            </div>
          ))}
        </div>

        {Object.keys(documentFiles).length > 0 && (
          <div className="d-flex justify-content-end gap-3 mt-5">
            <button
              className="btn btn-success px-4"
              onClick={handleSaveDocuments}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditDocumentsPage;
