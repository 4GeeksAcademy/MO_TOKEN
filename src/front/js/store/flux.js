const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            message: null,
        },
        actions: {
            syncTokenFromSessionStorage: () => {
                const token = sessionStorage.getItem("token");
                if (token) setStore({ token });
            },
            login: async (email, password) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ token: data.access_token });
                        sessionStorage.setItem('token', data.access_token);
                        return true;
                    } else {
                        console.error("Login failed");
                        return false;
                    }
                } catch (error) {
                    console.error('Error:', error);
                    return false;
                }
            },
            logout: () => {
                sessionStorage.removeItem("token");
                setStore({ token: null });
            },
            getPrivateMessage: async () => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/private`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${store.token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ message: data.logged_in_as });
                    } else {
                        setStore({ message: "Failed to fetch message" });
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            },
        }
    };
};

export default getState;
