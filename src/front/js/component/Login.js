import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await actions.login(email, password);
        if (success) {
            navigate('/private');
        } else {
            setError("Login failed");
        }
    };

    return (
        <div className='w-50 position-absolute top-50 start-50 translate-middle'>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className='d-flex justify-content-evenly'>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Home</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
