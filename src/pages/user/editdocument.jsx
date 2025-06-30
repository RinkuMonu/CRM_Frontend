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
                    window.history.back();
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
        <div className="px-4 pt-4" style={{ marginLeft: "260px", minHeight: "100vh" }}>
            <div className="card shadow p-4 rounded-4 mt-5">
                <h3 className="mb-4 text-primary">📁 Upload Employee Documents</h3>
                <div className="row g-4">
                    {fields.map(([label, name]) =>
                        !user[name] ? ( //   Only show field if user has not uploaded it yet
                            <div className="col-md-6" key={name}>
                                <label className="form-label fw-semibold text-dark">
                                    {label}
                                    {documentFiles[name] && (
                                        <span className="text-success ms-2">✔</span>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => handleDocumentSelect(e, name)}
                                />
                            </div>
                        ) : null
                    )}
                </div>
                {Object.keys(documentFiles).length > 0 && (
                    <div className="d-flex justify-content-end gap-3 mt-5">
                        <button className="btn btn-success px-4" onClick={handleSaveDocuments}>
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditDocumentsPage;
