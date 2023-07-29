import React from "react";
import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Company from "./components/Company";
import Employee from "./components/Employee";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/employee" element={<Employee />} />
            <Route path="/company" element={<Company />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
