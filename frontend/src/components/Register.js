// src/components/Register.js
import React, { useState } from 'react';
import axios from '../config/axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fname: '',
    lname: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/register', formData);
      if (response.data.status === 'ok') {
        alert('Registration successful');
      } else {
        alert(`Registration failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <input type="text" name="fname" placeholder="First Name" onChange={handleChange} />
      <input type="text" name="lname" placeholder="Last Name" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
