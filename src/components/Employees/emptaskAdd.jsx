import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../assets/css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../http";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import Task from "../../pages/task/Task";
import { toast } from "react-toastify";
import { use } from "react";

function EmpTaskAdd() {
  const [tasks, setTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState();
  const [employeeMap, setEmployeeMap] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // New state for date
  const [showModal, setShowModal] = useState(false);
  const [showtask, setShowtask] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    assignedTo: "",
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  const [file, setFile] = useState(null);
  const { user } = useSelector((state) => state.authSlice);

  const users = JSON.parse(localStorage.getItem("user"));
  const userId = users ? users?.id : user.user.id;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/task/get-allEmployee?type=leader`);
        setTeamMembers(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only Excel files (.xlsx or .xls) are allowed.");
      e.target.value = ""; // Reset the input
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!file) {
    //   toast.error("Please attach an Excel file before submitting.");
    //   return;
    // }
    const updatedFormData = {
      ...formData,
      createdBy: userId,
      createdFor: formData.assignedTo,
    };

    const data = new FormData();
    data.append("title", updatedFormData.title);
    data.append("description", updatedFormData.description);
    data.append("Status", updatedFormData.status);
    data.append("assignedTo", updatedFormData.assignedTo);
    data.append("createdBy", updatedFormData.createdBy);
    data.append("createdFor", updatedFormData.createdFor);

    if (file) {
      data.append("file", file);
    }

    try {
      const res = await api.post("/task", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTask([...tasks, res.data]);
      toast.success("Task added successfully!");
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        status: "Todo",
        assignedTo: "",
      });
      setFile(null);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const searchEmployeeTask = () => {
    setShowtask(true);
  };
  useEffect(() => {
    searchEmployeeTask();
  }, []);

  const handleConfirmExport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select From & To date");
      return;
    }

    try {
      setExportLoading(true);

      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      console.log("Export Token:", token);

      const res = await axios.get(
        `http://localhost:5050/api/task/export/my?startDate=${fromDate}&endDate=${toDate}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `My_Tasks_${fromDate}_to_${toDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Tasks exported successfully");
      setShowExportModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export tasks");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <>
      <div className="main-content">
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div
                  className="card cardborder overflow-hidden p-0 rounded-3"
                  style={{ boxShadow: "none" }}
                >
                  <div className="card-header d-flex justify-content-between">
                    <h4>Leader Leads</h4>
                    <div className="d-flex gap-2">
                      <Button className="" onClick={() => setShowModal(true)}>
                        <i className="fas fa-plus mr-2"></i> Add Task
                      </Button>
                      <Button onClick={() => setShowExportModal(true)}>
                        <i className="fas fa-file-excel me-2"></i>
                        Export Tasks
                      </Button>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      {/* Employee Select */}
                      <div className="col-md-5">
                        <label htmlFor="selectemployee" className="form-label">
                          Name
                        </label>
                        <div
                          // name="assignedTo"
                          className="form-control select2  py-2"
                          // value={user.user.id}
                          // onChange={(e) => setSelectedEmployee(e.target.value)}
                          // required
                        >
                          {/* <option value="">{user.user.name}</option> */}
                          {/* {teamMembers?.map((member) => ( */}

                          {/* <option key={user.user.id} value={user.user.id}> */}
                          {user?.user?.name}
                          {/* </option> */}
                          {/* ))} */}
                        </div>
                      </div>

                      {/* Date Picker */}
                      <div className="col-md-4">
                        <label htmlFor="selectdate" className="form-label">
                          Select Date
                        </label>
                        <input
                          type="date"
                          style={{ height: "42px" }}
                          className="form-control select2"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>

                      {/* <div className="col-md-2 d-flex align-items-end">
                        <button
                          onClick={searchEmployeeTask}
                          className="bg-primary rounded-sm px-3 py-2 text-white border-0 w-100"
                        >
                          <i className="bi bi-search me-2"></i>Search
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              {showtask && (
                <Task
                  selectedEmployee={user?.user?.id}
                  selectedDate={selectedDate}
                  showModal={showModal}
                />
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Add Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Add New Task</Modal.Title>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          >
            <FaTimes />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assign By</Form.Label>
              <Form.Select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
              >
                <option value="">Select Team Member</option>
                {teamMembers?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Todo">Todo</option>
                <option value="Progress">Progress</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload File (Optional)</Form.Label>
              <Form.Control
                type="file"
                name="file"
                accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">
                {file ? `Selected file: ${file.name}` : "No file selected"}
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        centered
      >
        <Modal.Header>
          <Modal.Title>Export Tasks</Modal.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowExportModal(false)}
          />
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Cancel
          </Button>

          <Button
            variant="success"
            onClick={handleConfirmExport}
            disabled={exportLoading}
          >
            {exportLoading ? "Exporting..." : "Export Excel"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EmpTaskAdd;
