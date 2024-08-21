import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const Signup = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const success = await actions.login(email, password);  // Optional: Log in the user immediately after signup
                if (success) {
                    navigate('/private');
                } else {
                    setError("Login after signup failed");
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Signup failed");
            }
        } catch (error) {
            setError("An error occurred during signup");
            console.error('Error:', error);
        }
    };

    return (
        <div className='w-50 position-absolute top-50 start-50 translate-middle'>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" required />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className='d-flex justify-content-evenly'>
                    <button type="submit" className="btn btn-primary">Signup</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Home</button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
