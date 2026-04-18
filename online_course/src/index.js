import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/login";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Registration from "./Pages/Registration";
import CourseDetails from "./Pages/Courses";
import MyCourses from "./Pages/Mycourses";
import ManageCourses from "./Pages/ManageCourses";
const routerVariables = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Registration />,
      },
      {
        path: "course/:id",
        element: <CourseDetails />,
      },
      {
        path: "mycourses",
        element: <MyCourses />,
      },
      {
        path: "manage-courses",
        element: <ManageCourses />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={routerVariables}></RouterProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
