import React, { useState } from "react";
import axios from "axios";

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="heading-container">
          <h2>Login</h2>
        </div>
        <div className="inputs-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
