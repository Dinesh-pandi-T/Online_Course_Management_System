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
  const [inCart, setInCart] = useState(false);
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

        const { data: courseData } = await axios.get(`https://onlinecoursemanagementsystem-production.up.railway.app/api/courses/${id}`, config);
        setCourse(courseData);

        const { data: myCourses } = await axios.get("https://onlinecoursemanagementsystem-production.up.railway.app/api/courses/my-courses", config);
        setEnrolled(myCourses.some((c) => c.id === Number(id) || c._id === id || c.id === id));
        
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setInCart(cart.some((c) => c.id === Number(id) || c._id === id || c.id === id));

      } catch (error) {
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (user?.role !== "student") {
      toast.error("Only students can add courses to cart");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(course);
    localStorage.setItem("cart", JSON.stringify(cart));
    setInCart(true);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
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

        {course.chapters && course.chapters.length > 0 && (
          <div className="courseChapters" style={{ textAlign: "left", marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "10px" }}>Chapters:</h3>
            <ul style={{ paddingLeft: "20px", color: "#444" }}>
              {course.chapters.map((chapter, index) => (
                <li key={index} style={{ marginBottom: "5px" }}>{chapter}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="info">
          <span>
            <strong>Price:</strong> ${course.price || 0}
          </span>
          <span>
            <strong>Instructor:</strong> {course.instructor?.name || "Unknown"}
          </span>
        </div>

        {user?.role === "student" && (
          <>
            {enrolled ? (
              <button className="enrollBtn" disabled>
                Already Enrolled
              </button>
            ) : inCart ? (
              <button className="enrollBtn" onClick={() => navigate("/cart")}>
                Go to Cart
              </button>
            ) : (
              <button className="enrollBtn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            )}
          </>
        )}

        <button className="backBtn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
