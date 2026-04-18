import "./../Styles/about.css";

const About = () => {
  return (
    <div className="aboutPage">
      {/* Header Section */}
      <div className="aboutHeader">
        <h1>About Our Platform</h1>
        <p className="intro">
          A modern and user-friendly course registration system designed to make
          online learning accessible to everyone.
        </p>
      </div>

      {/* Mission Section */}
      <div className="section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide an easy-to-use platform where students can
          discover, register, and manage their online courses. We believe in
          making quality education accessible to learners worldwide while
          helping course administrators manage their offerings efficiently.
        </p>
      </div>

      {/* About Section */}
      <div className="section">
        <h2>About This Platform</h2>
        <p>
          CoursePortal is a modern web application built with React that focuses
          on simplicity, usability, and role-based access control. Whether
          you're a student looking to expand your skills or an administrator
          managing courses, our platform provides an intuitive interface
          tailored to your needs.
        </p>
      </div>

      {/* Features Section */}
      <div className="section">
        <h2>Key Features</h2>
        <div className="featureGrid">
          <div className="featureCard">
            <h3>📚 Course Catalog</h3>
            <p>
              Browse through a wide variety of courses across different
              categories and skill levels.
            </p>
          </div>
          <div className="featureCard">
            <h3>✅ Easy Registration</h3>
            <p>
              Simple and quick registration process to enroll in your desired
              courses.
            </p>
          </div>
          <div className="featureCard">
            <h3>👤 Personalized Dashboard</h3>
            <p>
              Keep track of your enrolled courses and manage your learning
              journey.
            </p>
          </div>
          <div className="featureCard">
            <h3>🔐 Role-Based Access</h3>
            <p>
              Secure authentication system with different access levels for
              students and administrators.
            </p>
          </div>
          <div className="featureCard">
            <h3>⚙️ Course Management</h3>
            <p>
              Admins can easily create, update, and manage course information
              and availability.
            </p>
          </div>
          <div className="featureCard">
            <h3>📱 Responsive Design</h3>
            <p>
              Access the platform seamlessly on desktop, tablet, or mobile
              devices.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="section">
        <h2>Built With Modern Technology</h2>
        <div className="techStack">
          <div className="techItem">
            <strong>Frontend:</strong> React.js, React Router
          </div>
          <div className="techItem">
            <strong>State Management:</strong> React Hooks, LocalStorage
          </div>
          <div className="techItem">
            <strong>Styling:</strong> CSS3, Responsive Design
          </div>
          <div className="techItem">
            <strong>Notifications:</strong> React Toastify
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="section">
        <h2>How It Works</h2>
        <div className="stepsContainer">
          <div className="step">
            <div className="stepNumber">1</div>
            <h3>Create Account</h3>
            <p>Register with your email to create a student account</p>
          </div>
          <div className="step">
            <div className="stepNumber">2</div>
            <h3>Explore Courses</h3>
            <p>Browse available courses and view detailed information</p>
          </div>
          <div className="step">
            <div className="stepNumber">3</div>
            <h3>Enroll</h3>
            <p>Choose courses and enroll with just one click</p>
          </div>
          <div className="step">
            <div className="stepNumber">4</div>
            <h3>Learn</h3>
            <p>Track your progress and manage your enrolled courses</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="section">
        <h2>Get in Touch</h2>
        <div className="contactInfo">
          <p>Have questions or suggestions? We'd love to hear from you!</p>
          <p>
            <strong>Email:</strong> support@courseportal.com
            <br />
            <strong>Phone:</strong> +1 (555) 123-4567
            <br />
            <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="section footerNote">
        <p>
          © 2024 CoursePortal. All rights reserved. | Empowering learners
          worldwide.
        </p>
      </div>
    </div>
  );
};

export default About;
