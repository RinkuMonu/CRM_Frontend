import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUser, updateUserDoc, baseURLApi } from "../../http";

const EditDocumentsPage = () => {
  const { id } = useParams();
  const [documentFiles, setDocumentFiles] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getUser(id);
      if (res?.success) setUser(res.data);
    } catch (error) {
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleDocumentSelect = (e, label) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${label} file size should be less than 5MB`);
        return;
      }
      
      // Validate file type (images and PDFs only)
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, and PDF files are allowed');
        return;
      }
      
      setDocumentFiles((prev) => ({ ...prev, [label]: file }));
    }
  };

  const handleSaveDocuments = async () => {
    const labels = Object.keys(documentFiles);
    if (labels.length === 0) {
      toast.warning("No files selected");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Append all files to the form data
      labels.forEach(label => {
        formData.append(label, documentFiles[label]);
      });

      const res = await updateUserDoc(id, formData);
      if (res.success) {
        toast.success("Documents uploaded successfully");
        fetchUser(); // Refresh user data
        setDocumentFiles({}); // Clear selected files
      } else {
        toast.error("Failed to upload documents");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload documents");
    } finally {
      setLoading(false);
    }
  };

  const getDocumentUrl = (path) => {
    if (!path) return null;
    
    // Handle both absolute and relative URLs
    if (path.startsWith('http')) {
      return path;
    }
    
    // Remove any leading slashes to prevent double slashes
    const cleanPath = path.replace(/^\//, '');
    
    // Use baseURLApi from your http configuration
    return `${baseURLApi}/${cleanPath}`;
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
        
        {loading && <div className="text-center my-3">Loading...</div>}
        
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
                    href={getDocumentUrl(user[name])}
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
                disabled={loading}
                accept=".jpg,.jpeg,.png,.pdf"
              />

              {/* Tick mark if new file selected */}
              {documentFiles[name] && (
                <span className="text-success ms-2">✔ Selected: {documentFiles[name].name}</span>
              )}
            </div>
          ))}
        </div>

        {Object.keys(documentFiles).length > 0 && (
          <div className="d-flex justify-content-end gap-3 mt-5">
            <button
              className="btn btn-secondary px-4"
              onClick={() => setDocumentFiles({})}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-success px-4"
              onClick={handleSaveDocuments}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditDocumentsPage;