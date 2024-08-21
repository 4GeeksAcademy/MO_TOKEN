import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className='w-50 position-absolute top-50 start-50 translate-middle'>
            <h1>Welcome to Our App</h1>
            <p>This is the landing page.</p>
            <div className='d-flex justify-content-evenly'>
            <Link to="/signup" className="btn btn-primary">Signup</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>
        </div>
    );
};

export default Landing;
