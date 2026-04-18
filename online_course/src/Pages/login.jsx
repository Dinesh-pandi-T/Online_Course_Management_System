import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./../Styles/login.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(
        "https://onlinecoursemanagementsystem-production.up.railway.app/api/auth/login",
        {
          email,
          password,
        },
      );

      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("userLoggedIn"));
      toast.success("Login successful");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="login">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h2>Login Page</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="loginButton" type="submit">
          Submit
        </button>

        
      </form>
    </div>
  );
};

export default Login;
