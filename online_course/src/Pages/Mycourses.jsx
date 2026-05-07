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
          headers: { Authorization: `Bearer ${user?.token}` },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleRemove = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await axios.post(`https://onlinecoursemanagementsystem-production.up.railway.app/api/courses/${id}/unenroll`, {}, config);
      toast.success("Successfully removed from your courses.");
      setMyCourses(myCourses.filter(course => course.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove course");
    }
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
