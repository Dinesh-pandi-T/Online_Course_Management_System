package com.onlinecourse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class Dtos {

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String role;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private Long _id;
        private String name;
        private String email;
        private String role;
        private String token;
    }

    @Data
    public static class CourseRequest {
        private String title;
        private String description;
        private Double price;
        private String thumbnail;
        private String duration;
        private Integer seats;
        private List<String> chapters;
    }

    @Data
    @AllArgsConstructor
    public static class MessageResponse {
        private String message;
    }
}
