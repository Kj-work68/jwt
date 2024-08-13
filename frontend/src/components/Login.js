// Login.js
import React, { useState } from 'react';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //navigate: ใช้เพื่อเปลี่ยนเส้นทางหลังจากการล็อกอินสำเร็จ
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
//event.preventDefault(): ป้องกันไม่ให้การส่งฟอร์มทำให้หน้าเว็บโหลดใหม่

    try {
      const response = await axios.post('/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Redirect based on role
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const role = decodedToken.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'user') {
        navigate('/user');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('You are not a member.')
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
