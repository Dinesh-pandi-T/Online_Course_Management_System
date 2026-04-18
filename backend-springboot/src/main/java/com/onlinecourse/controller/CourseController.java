package com.onlinecourse.controller;

import com.onlinecourse.dto.Dtos.CourseRequest;
import com.onlinecourse.dto.Dtos.MessageResponse;
import com.onlinecourse.model.Course;
import com.onlinecourse.model.User;
import com.onlinecourse.repository.CourseRepository;
import com.onlinecourse.repository.UserRepository;
import com.onlinecourse.security.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Course not found")));
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest request, @AuthenticationPrincipal UserProfile userProfile) {
        User instructor = userRepository.findById(userProfile.getId()).orElse(null);
        if (instructor == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);
        if (request.getThumbnail() != null) {
            course.setThumbnail(request.getThumbnail());
        }
        course.setInstructor(instructor);

        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<?> enrollCourse(@PathVariable Long id, @AuthenticationPrincipal UserProfile userProfile) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Course not found"));
        }

        User student = userRepository.findById(userProfile.getId()).orElse(null);
        
        if (course.getEnrolledStudents().contains(student)) {
            return ResponseEntity.badRequest().body(new MessageResponse("You are already enrolled in this course"));
        }

        course.getEnrolledStudents().add(student);
        courseRepository.save(course);

        return ResponseEntity.ok(new MessageResponse("Enrolled successfully"));
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<Course>> getMyCourses(@AuthenticationPrincipal UserProfile userProfile) {
        User student = userRepository.findById(userProfile.getId()).orElse(null);
        List<Course> courses = courseRepository.findByEnrolledStudentsContaining(student);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/manage")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Course>> getManagedCourses(@AuthenticationPrincipal UserProfile userProfile) {
        if ("admin".equalsIgnoreCase(userProfile.getRole())) {
            return ResponseEntity.ok(courseRepository.findAll());
        } else {
            User instructor = userRepository.findById(userProfile.getId()).orElse(null);
            return ResponseEntity.ok(courseRepository.findByInstructor(instructor));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id, @AuthenticationPrincipal UserProfile userProfile) {
        Course course = courseRepository.findById(id).orElse(null);
        
        if (course == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Course not found"));
        }

        if (!course.getInstructor().getId().equals(userProfile.getId()) && !"admin".equalsIgnoreCase(userProfile.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("User not authorized to delete this course"));
        }

        courseRepository.delete(course);
        return ResponseEntity.ok(new MessageResponse("Course removed"));
    }
}
