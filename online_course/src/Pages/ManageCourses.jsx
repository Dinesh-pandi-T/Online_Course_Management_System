/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../Styles/manageCourses.css";
import axios from "axios";
import { toast } from "react-toastify";

const ManageCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [numChapters, setNumChapters] = useState("");
  const [chaptersArray, setChaptersArray] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

const fetchCourses = useCallback(async () => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${user?.token}` },
    };
    const response = await axios.get(
      "https://onlinecoursemanagementsystem-production.up.railway.app/api/courses/manage",
      config
    );
    setCourses(response.data);
  } catch (error) {
    toast.error("Failed to load courses");
  }
}, [user?.token]);

  // Protect admin/instructor route
  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "instructor")) {
      navigate("/login");
      return;
    }

    setIsAuthorized(true);
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, fetchCourses]);

  const handleNumChaptersChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setNumChapters(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setChaptersArray(prev => {
        const newArr = Array(val).fill("");
        for (let i = 0; i < Math.min(prev.length, val); i++) {
          newArr[i] = prev[i];
        }
        return newArr;
      });
    } else {
      setChaptersArray([]);
    }
  };

  const handleChapterChange = (index, value) => {
    const newArr = [...chaptersArray];
    newArr[index] = value;
    setChaptersArray(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };

      if (editId) {
        // Backend for spring boot does not have PUT course yet, so simulated error or update here
        toast.info("Updating is not fully implemented on backend, adding new course instead for now.");
      } 
      
      await axios.post("https://onlinecoursemanagementsystem-production.up.railway.app/api/courses", {
        title,
        description,
        duration,
        seats: Number(seats) || 0,
        price: Number(price) || 0,
        chapters: chaptersArray.map(c => c.trim()).filter(c => c !== "")
      }, config);
      
      toast.success("Course added successfully");
      fetchCourses();
      
      setEditId(null);
      setTitle("");
      setDescription("");
      setDuration("");
      setSeats("");
      setPrice("");
      setNumChapters("");
      setChaptersArray([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (course) => {
    setEditId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price || "");
  };

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await axios.delete(`https://onlinecoursemanagementsystem-production.up.railway.app/api/courses/${id}`, config);
      toast.success("Course deleted");
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="manageCourses">
      <h2>Manage Courses ({user?.role})</h2>

      {/* Course Form */}
      <form className="courseForm" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Duration (e.g. 4 Weeks)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <input
          type="number"
          placeholder="Seats"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />

        <input
          type="number"
          placeholder="Number of Chapters"
          value={numChapters}
          onChange={handleNumChaptersChange}
          min="0"
        />

        {chaptersArray.length > 0 && (
          <div className="chapterInputs" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
            {chaptersArray.map((chap, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Chapter ${index + 1} Title`}
                value={chap}
                onChange={(e) => handleChapterChange(index, e.target.value)}
                style={{ marginBottom: '0' }}
              />
            ))}
          </div>
        )}

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit">{editId ? "Update Course" : "Add Course"}</button>
      </form>

      {/* Course List */}
      <div className="courseList">
        {courses.length === 0 ? (
          <p>No courses added yet</p>
        ) : (
          courses.map((course) => (
            <div className="courseItem" key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>
                <strong>Duration:</strong> {course.duration || "N/A"} | <strong>Seats:</strong> {course.seats || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> ${course.price || 0}
              </p>

              <div className="actions">
                <button className="editBtn" onClick={() => handleEdit(course)}>
                  Edit
                </button>
                <button
                  className="deleteBtn"
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="backBtn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default ManageCourses;
