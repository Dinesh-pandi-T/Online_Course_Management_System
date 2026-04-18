package com.onlinecourse.repository;

import com.onlinecourse.model.Course;
import com.onlinecourse.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor(User instructor);
    List<Course> findByEnrolledStudentsContaining(User student);
}
