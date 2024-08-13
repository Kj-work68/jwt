// src/components/AdminPage.js
import React, { useEffect, useState } from 'react';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import JwtBuild from '../admin/JwtBuilder';


const AdminPage = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data.message);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);


  const handleLogout = async () =>{
    try{
      const token = localStorage.getItem('token')
      await axios.delete('/logout',{
        headers : {Authorization: `Bearer ${token}`}
      });
      localStorage.removeItem('token');

      navigate('/logout')
    }catch(error){
      console.log('Logout failed :', error)
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      {data ? <p>{data}</p> : <p>Loading...</p>}
        <JwtBuild/>
      <button type='botton' class='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminPage;
