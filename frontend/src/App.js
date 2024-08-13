import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./components/Home";
import Admin from "./components/Admin"
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import JwtBuild from "./admin/JwtBuilder";
import Register from "./components/Register";
import User from "./components/User"
const App = () => {
  return (
    <Router>
        <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
          <Link to="/register">Register</Link>
          <br/>
          <Link to="/login">Login</Link>
          <br/>
          <Link to="/logout">Logout</Link>
          </div>
        </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute component={Admin} roles={['admin']} />} />
        <Route path="/jwtbuild" element={<ProtectedRoute component={JwtBuild} roles={['admin']} />} />
        <Route path="/user" element={<ProtectedRoute component={User} roles={['user']} />} />
      </Routes>
    </div>
    </Router>
  );
};

export default App;