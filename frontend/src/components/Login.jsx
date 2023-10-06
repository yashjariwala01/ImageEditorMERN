import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Navbar from "./Navbar";
import Header from "./Header";

function Login() {
  const [loginId, setLoginId] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/homepage";
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginObj = {
      loginId,
      password,
    };

    axios
      .post(`http://localhost:8001/login`, loginObj)
      .then((res) => {
        console.log(res);
        if (res.data.status === 200) {
          localStorage.setItem("token", res.data.data.token);
          window.location.href = "/homepage";
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      <Header/>
      <div style={{ padding: "3rem" }}>
        <form onSubmit={handleSubmit}>
          <h1
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Login
          </h1>
          <div className="input">
            <label>Login ID</label>
                <input
                  style={{padding:'6px'}}
                  type="text"
                  placeholder="Enter LoginId - i.e. Username"
                  onChange={(e) => setLoginId(e.target.value)}
                />
          </div>

          <div className="input">
          <label>Password</label>
            <input
              style={{padding:'6px'}}
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" style={{ marginTop: "10px", padding:'5px' }}>
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;