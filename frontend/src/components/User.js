import React, { useState } from 'react';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const [id, setId] = useState(''); // ใช้สำหรับจัดการข้อมูล ID ที่ผู้ใช้ป้อน
  const [data, setData] = useState(null); // ใช้เพื่อเก็บข้อมูลที่ได้รับจาก API
  const [error, setError] = useState(null); // ใช้เพื่อเก็บข้อผิดพลาดที่อาจเกิดขึ้น

  const handleSubmit = async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อส่งฟอร์ม

    try {
      const response = await axios.get('/intel', { id });

      if (response.status === 200) { // ตรวจสอบว่าการร้องขอสำเร็จหรือไม่
        setData(response.data); // เก็บข้อมูลที่ได้รับจาก API ใน state `data`
        setError(null); // รีเซ็ตข้อผิดพลาดถ้าสำเร็จ
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.'); // ตั้งค่าข้อความข้อผิดพลาด
      setData(null); // รีเซ็ตข้อมูลถ้ามีข้อผิดพลาด
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input 
            type="text" 
            id="id" 
            className="form-control"
            value={id}
            onChange={(e) => setId(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-outline-success">GET</button>
      </form>

      {/* แสดงข้อมูลที่ได้รับจาก API */}
      {data && (
        <div>
          <h2>Data from API</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre> {/* แสดงข้อมูลเป็น JSON ที่ฟอร์แมตแล้ว */}
        </div>
      )}

      {/* แสดงข้อความข้อผิดพลาดถ้ามี */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default User;
