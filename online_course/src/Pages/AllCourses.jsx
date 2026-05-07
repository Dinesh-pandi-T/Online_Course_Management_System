import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../Styles/Home.css";
import "./../Styles/allCourses.css";
import axios from "axios";

const AllCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="allCoursesPage">
      <div className="coursesHeader">
        <h1>All Courses</h1>
        <p>Browse our complete catalog of available courses</p>
        
        <div className="searchContainer">
          <input 
            type="text" 
            className="searchBar" 
            placeholder="Search for courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="section" style={{ marginTop: '2rem' }}>
        {filteredCourses.length === 0 ? (
          <p className="noResults">No courses found matching your search.</p>
        ) : (
          <div className="courseGrid">
            {filteredCourses.map((course) => (
              <div className="courseCard" key={course.id}>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="courseInfo">
                  <span>Duration: {course.duration || 'N/A'}</span>
                  <span>Seats: {course.seats || 'N/A'}</span>
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

export default AllCourses;
