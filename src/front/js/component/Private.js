import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate('/login');
        } else {
            actions.getPrivateMessage();
        }
    }, [store.token, actions, navigate]);

    const handleLogout = () => {
        actions.logout();
        navigate('/login');
    };

    return (
        <div>
            <h2>Private Page</h2>
            <p>{store.message}</p>
            <div className='d-flex justify-content-evenly'>
                <button onClick={handleLogout} className="btn btn-primary">Logout</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Home</button>
            </div>
        </div>
    );
};

export default Private;
