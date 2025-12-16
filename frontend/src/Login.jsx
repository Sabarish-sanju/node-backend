import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    password: "",
  });

  function handleData(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(data);

    try {
      const res = await api.post("/login", data);

      const { token } = res.data;
      console.log(token);
      localStorage.setItem("jwtToken", token);

      navigate("/app");
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>

        <input
          type="text"
          name="name"
          placeholder="Username"
          value={data.name}
          onChange={handleData}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleData}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    width: "320px",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "12px",
    marginBottom: "15px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Login;
