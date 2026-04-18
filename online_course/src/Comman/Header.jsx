import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../Styles/header.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener("userLoggedIn", handleStorageChange);
    window.addEventListener("userLoggedOut", handleStorageChange);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleStorageChange);
      window.removeEventListener("userLoggedOut", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userLoggedOut"));
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <header className="header">
        <div className="logo">CoursePortal</div>
        <nav className="navLinks">
          <NavLink to="/" className="navItem">
            Home
          </NavLink>
          <NavLink to="/about" className="navItem">
            About
          </NavLink>
          <NavLink to="/login" className="navItem">
            Login
          </NavLink>
          <NavLink to="/register" className="navItem">
            Register
          </NavLink>
        </nav>
      </header>
    );
  }

  // Admin logged in - show Home, About, Manage Courses
  if (user.role === "admin") {
    return (
      <header className="header">
        <div className="logo">CoursePortal</div>
        <nav className="navLinks">
          <NavLink to="/" className="navItem">
            Home
          </NavLink>
          <NavLink to="/about" className="navItem">
            About
          </NavLink>
          <NavLink to="/manage-courses" className="navItem">
            Manage Courses
          </NavLink>
          <button onClick={handleLogout} className="navItem logoutBtn">
            Logout
          </button>
        </nav>
      </header>
    );
  }

  // Student logged in - show Home, About, Courses, My Courses
  return (
    <header className="header">
      <div className="logo">CoursePortal</div>
      <nav className="navLinks">
        <NavLink to="/" className="navItem">
          Home
        </NavLink>
        <NavLink to="/about" className="navItem">
          About
        </NavLink>
        <NavLink to="/" className="navItem">
          Courses
        </NavLink>
        <NavLink to="/mycourses" className="navItem">
          My Courses
        </NavLink>
        <button onClick={handleLogout} className="navItem logoutBtn">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
