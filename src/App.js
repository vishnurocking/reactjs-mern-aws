import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext, ThemeProvider } from "./ThemeContext";
import DetailsCardComponent from "./components/DetailsCardComponent";

function App() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [recordData, setRecordData] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const base_url = process.env.REACT_APP_SERVER_BASE_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${base_url}/getUsers`);
      setRecordData(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(`Error fetching users: ${err.message}`);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${base_url}/editUser/${editingUser._id}`, formData);
        setEditingUser(null);
      } else {
        await axios.post(`${base_url}/addUser`, formData);
      }
      setFormData({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error("Error handling user:", err);
      setError(`Error handling user: ${err.message}`);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${base_url}/deleteUser/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(`Error deleting user: ${err.message}`);
    }
  };

  return (
    <div className={`App ${theme}`}>
      <nav className={`navbar navbar-${theme} bg-${theme} mb-2`}>
        <a
          className="navbar-brand"
          href="https://www.youtube.com/@IntegrationNinjas"
        >
          <img
            src="./logo_p.png"
            width="50"
            height="50"
            className="d-inline-block"
            alt=""
          />
          Integration Ninja
        </a>
        <button onClick={toggleTheme} className="btn btn-outline-primary">
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </nav>
      <div className="container">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row">
          <div className="col">
            <h3 className="text-center">Users List</h3>
            {recordData.length === 0 ? (
              <p>
                No users found. The list may be empty or there was an error
                fetching the data.
              </p>
            ) : (
              <ul className="list-group">
                {recordData.map((user) => (
                  <li key={user._id} className="list-group-item">
                    <DetailsCardComponent
                      email={user.email}
                      sn={user._id}
                      userN={user.name}
                    />
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn btn-warning mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col">
            <h2>{editingUser ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="exampleInputUser">User Name:</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="exampleInputUser"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail">Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>
              <button type="submit" className="btn btn-primary mt-2">
                {editingUser ? "Update User" : "Add User"}
              </button>
              {editingUser && (
                <button
                  type="button"
                  className="btn btn-secondary mt-2 ml-2"
                  onClick={() => {
                    setEditingUser(null);
                    setFormData({ name: "", email: "" });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
