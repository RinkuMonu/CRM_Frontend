import React, { useState } from "react";
import axios from "axios";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import { updateUserDoc } from "../../http";

const DocumentUpload = ({ userId, user }) => {
    console.log("DocumentUpload userId:", user);
    
  const [editMode, setEditMode] = useState(false);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(files).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      const res = await updateUserDoc(userId, formData);
      console.log("Response:", res?.data);
      setMessage("Documents uploaded successfully!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload documents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Documents</h5>
        {!editMode && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setEditMode(true)}
          >
            Edit Documents
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {!editMode ? (
          <p>Uploaded documents will be shown here (Preview or filenames)</p>
        ) : (
          <Form>
            <div className="d-flex justify-content-end gap-2 my-3 ">
              <Button variant="success" onClick={handleSave} disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : "Save"}
              </Button>
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </div>
            <div className="d-flex flex-wrap gap-3">
              <div className="row col-4">
                <Form.Group className="mb-2">
                  <Form.Label>Employee Aadhar</Form.Label>
                  <Form.Control
                    type="file"
                    name="employee_adhar_image"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </div>
              <div className="row col-4">
                <Form.Group className="mb-2">
                  <Form.Label>Employee PAN</Form.Label>
                  <Form.Control
                    type="file"
                    name="employee_pan_image"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </div>
              <div className="row col-4">
                <Form.Group className="mb-2">
                  <Form.Label>Mother's Aadhar</Form.Label>
                  <Form.Control
                    type="file"
                    name="mother_adhar_image"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </div>
              <div className="row col-4">
                <Form.Group className="mb-2">
                  <Form.Label>Father's Aadhar</Form.Label>
                  <Form.Control
                    type="file"
                    name="father_adhar_image"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </div>
              <div className="row col-4">
                <Form.Group className="mb-2">
                  <Form.Label>10th Marksheet</Form.Label>
                  <Form.Control
                    type="file"
                    name="tenth_marksheet_img"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </div>
              <div className="row col-4">
                <Form.Group className="mb-2">
                  <Form.Label>12th Marksheet</Form.Label>
                  <Form.Control
                    type="file"
                    name="twelth_marksheet_img"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </div>
              <div className="row col-4">
                <Form.Group className="mb-2">
                  <Form.Label>Police Verification</Form.Label>
                  <Form.Control
                    type="file"
                    name="Policeverification"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        )}
        {message && <p className="mt-2 text-info">{message}</p>}
      </Card.Body>
    </Card>
  );
};

export default DocumentUpload;
