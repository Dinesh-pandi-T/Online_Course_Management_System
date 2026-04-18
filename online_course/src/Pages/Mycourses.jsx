import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../Styles/myCourses.css";
import axios from "axios";
import { toast } from "react-toastify";

const MyCourses = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      navigate("/");
      return;
    }

    const fetchMyCourses = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get("https://onlinecoursemanagementsystem-production.up.railway.app/api/courses/my-courses", config);
        setMyCourses(data);
      } catch (error) {
        toast.error("Failed to fetch my courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [navigate,user]);

  const handleRemove = async (id) => {
    // backend does not have an unenrolled endpoint currently, just local mock up for now or alert
    toast.info("Unenrollment not currently supported by backend yet.");
  };

  if (loading) {
     return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  }

  return (
    <div className="myCourses">
      <h2>My Courses</h2>

      {myCourses.length === 0 ? (
        <p className="emptyText">You have not enrolled in any courses.</p>
      ) : (
        <div className="myCourseGrid">
          {myCourses.map((course) => (
            <div className="myCourseCard" key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <div className="courseActions">
                <button
                  className="viewBtn"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  View
                </button>

                <button
                  className="removeBtn"
                  onClick={() => handleRemove(course.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="backBtn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default MyCourses;
