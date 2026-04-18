package com.onlinecourse.controller;

import com.onlinecourse.dto.Dtos.AuthResponse;
import com.onlinecourse.dto.Dtos.LoginRequest;
import com.onlinecourse.dto.Dtos.MessageResponse;
import com.onlinecourse.dto.Dtos.RegisterRequest;
import com.onlinecourse.model.User;
import com.onlinecourse.repository.UserRepository;
import com.onlinecourse.security.JwtUtil;
import com.onlinecourse.security.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("User already exists"));
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        
        String role = signUpRequest.getRole() != null ? signUpRequest.getRole() : "student";
        user.setRole(role);

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signUpRequest.getEmail(), signUpRequest.getPassword()));

        String jwt = jwtUtil.generateJwtToken(authentication);

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                jwt
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        UserProfile userDetails = (UserProfile) authentication.getPrincipal();
        String jwt = jwtUtil.generateJwtToken(authentication);

        return ResponseEntity.ok(new AuthResponse(
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                userDetails.getRole(),
                jwt
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserProfile userDetails) {
        return userRepository.findById(userDetails.getId())
                .map(user -> ResponseEntity.ok(new AuthResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        null // no need to return token on profile fetch
                )))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body((AuthResponse) null));
    }
}
