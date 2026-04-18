import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../Styles/Home.css";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Refresh user state from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Trigger header update by dispatching event
    if (user) {
      window.dispatchEvent(new Event("userLoggedIn"));
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://onlinecoursemanagementsystem-production.up.railway.app/api/courses",
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="homePage">
      {/* Hero Section */}
      <div className="hero">
        <div className="heroText">
          <h1>Register for the Perfect Course</h1>
          <p className="h">
            Explore available courses, learn new skills, and build your future.
            Simple and easy course registration system.
          </p>
          <button className="heroBtn" onClick={() => window.scrollTo(0, 400)}>
            Explore Courses
          </button>
        </div>

        <div className="heroImage"></div>
      </div>

      {/* Section below */}
      <div className="section">
        <h2>Available Courses</h2>
        {courses.length === 0 ? (
          <p>No courses available</p>
        ) : (
          <div className="courseGrid">
            {courses.map((course) => (
              <div className="courseCard" key={course.id}>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="courseInfo">
                  <span>Duration: {course.duration}</span>
                  <span>Seats: {course.seats}</span>
                </div>
                <button
                  className="viewCourseBtn"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
