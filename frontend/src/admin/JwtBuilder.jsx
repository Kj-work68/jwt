import React, { useState } from 'react';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const JwtBuild = () => {
    const [standardClaims, setStandardClaims] = useState({
        issuer: '',
        subject: '',
        audience: '',
        expiration: '',
        notBefore: '',
    });
    const [additionalClaims, setAdditionalClaims] = useState([
        { type: '', value: '' },
    ]);
     const [secret, setSecret] = useState('');
    const [tokens, setTokens] = useState({});
   
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setStandardClaims({ ...standardClaims, [id]: value });
    };

    const handleAdditionalInputChange = (index, event) => {
        const { id, value } = event.target;
        const newClaims = [...additionalClaims];
        newClaims[index][id] = value;
        setAdditionalClaims(newClaims);
    };

    const handleSecret = (event) =>{
        setSecret(event.target.value) // update status secret
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/generate-token', {
                ...standardClaims,
                customClaims: additionalClaims.filter(claim => claim.type && claim.value),secret
            });
            setTokens(response.data);
        } catch (error) {
    
            console.error('Error generating token:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete('/logout', {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.log('Logout failed:', error);
        }
    };

    const addCustomClaim = () => {
        setAdditionalClaims([...additionalClaims, { type: '', value: '' }]);
    };

    return (
        <div>
            <h1>JwtBuilder</h1>

            <form onSubmit={handleSubmit}>
                <div className="card text-left">
                    <div className="card-header">Standard JWT Claims</div>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label">โทเค็นถูกออกโดย</label>
                            <input type="text" className="form-control" id="issuer" value={standardClaims.issuer} onChange={handleInputChange} />
                            <br />
                            <label className="form-label">โทเค็นเกี่ยวข้องกับผู้ใช้ที่มี ID</label>
                            <input type="text" className="form-control" id="subject" value={standardClaims.subject} onChange={handleInputChange} />
                            <br />
                            <label className="form-label">โทเค็นออกแบบมาให้ใช้กับ </label>
                            <input type="text" className="form-control" id="audience" value={standardClaims.audience} onChange={handleInputChange} />
                            <br />
                            <label className="form-label">โทเค็นจะหมดอายุเมื่อถึงเวลา</label>
                            <input type="number" className="form-control" id="expiration" value={standardClaims.expiration} onChange={handleInputChange} />
                            <br />
                            <label className="form-label">โทเค็นสามารถเริ่มใช้งานได้ตั้งแต่เวลา</label>
                            <input type="number" className="form-control" id="notBefore" value={standardClaims.notBefore} onChange={handleInputChange} />
                            <label className="form-label">กำหนดลายเซ็น</label>
                            <input type="text" className="form-control" value={secret} onChange={handleSecret} /> {/* ฟิลด์อินพุตสำหรับ secret ที่กำหนดเอง */}
                        </div>
                    </div>
                </div>
                <br/>
                <div className="card text-left">
                    <div className="card-header">เพิ่มข้อมูลการขอสิทธิ์</div>
                    <div className="card-body">
                        {additionalClaims.map((claim, index) => (
                            <div key={index} className="form-group">
                                <label className="form-label">กำหนดการขอสิทธิ์</label>
                                <input type="text" className="form-control" id="type" value={claim.type} onChange={(e) => handleAdditionalInputChange(index, e)} />
                                <br />
                                <label className="form-label">กำหนดการขอสิทธิ์</label>
                                <input type="text" className="form-control" id="value" value={claim.value} onChange={(e) => handleAdditionalInputChange(index, e)} />
                                <br />
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary" onClick={addCustomClaim}>Add Another Custom Claim</button>
                    </div>
                </div>
                <br />
                <button type="submit" className="btn btn-primary">Generate Token</button>
            </form>
            <br/>
            {tokens.token256 && (
                <div className="card text-left">
                    <div className="card-header">Generated Claim Set (plain text)</div>
                    <div className="card-body">
                        <pre>{JSON.stringify({ ...standardClaims, ...additionalClaims.filter(claim => claim.type && claim.value) }, null, 2)}</pre>
                    </div>
                </div>
            )}
            <br/>
            {tokens.token256 && (
                <div className="card text-left">
                    <div className="card-header">Signed JSON Web Tokens</div>
                    <div className="card-body">
                        <p><strong>HS256:</strong> {tokens.token256}</p>
                        <p><strong>HS384:</strong> {tokens.token384}</p>
                        <p><strong>HS512:</strong> {tokens.token512}</p>
                    </div>
                </div>
            )}
            <br />
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default JwtBuild;
