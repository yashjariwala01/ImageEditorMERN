import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from './Header'

function Register() {
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/homepage";
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userObj = {
      name,
      username,
      password,
      email,
    };
    console.log(userObj)
    

    axios
    // .post('http://localhost:8001/register',userObj)
    .post(`${process.env.REACT_APP_BACKEND_URL}/register`,userObj)
      .then((res) => {
        console.log(res);
        if (res.data.status === 201) {
          window.location.href = "/login";
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
  <div>
    <Header/>
    <div style={{ padding: "3rem" }}>
        <h1
          style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
            }}
            >
          Register 
        </h1>
        <form style={{padding:'30px'}} onSubmit={handleSubmit}>

            <div className="input">
                <label htmlFor="">Username </label>
                <input style={{padding:'6px'}} type="text" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)}/>
            </div>
       
         <div className="input">
            <label htmlFor="">Name</label>
            <input
                style={{padding:'6px'}}
                type="text"
                placeholder="Enter Name"
                onChange={(e) => setName(e.target.value)}
            />
         </div>
     
          <div className="input">
            <label>Email</label>
            <input
                style={{padding:'6px'}}
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
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
        <button  type="submit" style={{ marginTop: "20px", padding:'5px' }}>
          Register
        </button>
      </form>
    </div>
  </div>
  );
}

export default Register;