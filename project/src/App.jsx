import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Teammember from "./components/Teammember";
import Signup from "./components/Signup";
import CreatePassword from "./components/CreatePassword"; //  fixed this line
import ForgotPassword from "./components/ForgotPassword";



import "./index.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/teammember" element={<Teammember />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default App;
