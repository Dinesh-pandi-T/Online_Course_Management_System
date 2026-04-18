import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./../Styles/courseDetails.css";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCourseAndEnrollment = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const { data: courseData } = await axios.get(`http://localhost:8080/api/courses/${id}`, config);
        setCourse(courseData);

        const { data: myCourses } = await axios.get("http://localhost:8080/api/courses/my-courses", config);
        setEnrolled(myCourses.some((c) => c.id === Number(id) || c._id === id || c.id === id));

      } catch (error) {
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [id, navigate, user]);

  const handleEnroll = async () => {
    if (user?.role !== "student") {
      toast.error("Only students can enroll in courses");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.post(`https://onlinecoursemanagementsystem-production.up.railway.app/api/courses/${id}/enroll`, {}, config);

      toast.success("Successfully enrolled");
      setEnrolled(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) {
     return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  }

  if (!course) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Course not found
      </h2>
    );
  }

  return (
    <div className="courseDetails">
      <div className="courseCardDetails">
        <h1>{course.title}</h1>

        <p className="desc">{course.description}</p>

        <div className="info">
          <span>
            <strong>Price:</strong> ${course.price || 0}
          </span>
          <span>
            <strong>Instructor:</strong> {course.instructor?.name || "Unknown"}
          </span>
        </div>

        {user?.role === "student" && (
          <button
            className="enrollBtn"
            onClick={handleEnroll}
            disabled={enrolled}
          >
            {enrolled ? "Already Enrolled" : "Enroll Now"}
          </button>
        )}

        <button className="backBtn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
