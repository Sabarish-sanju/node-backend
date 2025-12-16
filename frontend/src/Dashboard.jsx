import { useEffect, useState } from "react";
import api from "../../api.js";
import "./App.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  const [id, setId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }
    getUser();
  }, [refresh]);

  async function getUser() {
    try {
      const res = await api.get("/all");
      setData(res.data.data);
    } catch (err) {
      alert("Failed to fetch users");
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/delete/${id}`);
      alert("User Deleted");
      setRefresh(!refresh);
    } catch (err) {
      alert("Failed to delete user");
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email)) newErrors.email = "Email is invalid";
    }

    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else {
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(form.phone))
        newErrors.phone = "Phone number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function addUser() {
    if (!validateForm()) return;

    try {
      if (id === "") {
        await api.post("/users", form);
        alert("User Added");
      } else {
        await api.put(`/update/${id}`, form);
        alert("User Updated");
      }
      resetForm();
      setRefresh(!refresh);
    } catch (err) {
      alert("Something went wrong");
    }
  }

  async function editUser(id) {
    try {
      const res = await api.get(`/edit/${id}`);
      setForm({
        name: res.data.data.name,
        email: res.data.data.email,
        password: res.data.data.password,
        phone: res.data.data.phone,
        role: res.data.data.role,
      });
      setId(id);
      setShowForm(true);
    } catch (err) {
      alert("Failed to fetch user data");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  }

  function resetForm() {
    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "user",
    });
    setId("");
    setShowForm(false);
    setErrors({});
  }

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <>
      <button onClick={handleLogout}>Logout</button>
      <div className="container">
        <div className="table-header">
          <h2>User List</h2>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Add User" : "Add User"}
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="close-btn" onClick={resetForm}>
                ×
              </button>

              <h3>{id === "" ? "Add New User" : "Edit User"}</h3>

              <div className="form-content">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className={errors.name ? "input-error" : ""}
                  />
                  {errors.name && (
                    <span className="error-msg">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && (
                    <span className="error-msg">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className={errors.password ? "input-error" : ""}
                  />
                  {errors.password && (
                    <span className="error-msg">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className={errors.phone ? "input-error" : ""}
                  />
                  {errors.phone && (
                    <span className="error-msg">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <select name="role" value={form.role} onChange={handleChange}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>

                <button className="submit-btn" onClick={addUser}>
                  {id === "" ? "Add User" : "Update User"}
                </button>
              </div>
            </div>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6">No Users Found</td>
              </tr>
            ) : (
              data.map((val) => (
                <tr key={val._id}>
                  <td>{val.name}</td>
                  <td>{val.email}</td>
                  <td>{val.phone}</td>
                  <td>{val.role}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => editUser(val._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(val._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
