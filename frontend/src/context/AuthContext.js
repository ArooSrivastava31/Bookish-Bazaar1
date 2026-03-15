import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: true
};

// Utility to set the authorization header
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};


const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            setAuthToken(action.payload.token);
            // FIX: Ensure the user data from the payload is correctly nested under the 'user' key in the state.
            const { token, ...userData } = action.payload;
            return {
                ...state,
                isAuthenticated: true,
                user: userData,
                token: token,
                loading: false,
            };
        case 'AUTH_ERROR':
        case 'LOGOUT':
            localStorage.removeItem('token');
            setAuthToken(null);
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                loading: false,
            };
        default:
            return state;
    }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // This effect runs on app startup to load the user if a token exists
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
                try {
                    // Use the /api/auth/me endpoint to verify the token and get user data
                    const res = await axios.get(`${API_BASE_URL}/api/auth/me`);
                    dispatch({
                        type: 'USER_LOADED',
                        payload: res.data
                    });
                } catch (err) {
                     dispatch({ type: 'AUTH_ERROR' });
                }
            } else {
                 // Set loading to false if there's no token
                 dispatch({ type: 'AUTH_ERROR' });
            }
        };
        loadUser();
    }, []);


    const login = async (formData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data
            });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR' });
            return err.response.data;
        }
    };

    const signup = async (formData) => {
         try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: res.data
            });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR' });
            return err.response.data;
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            login,
            signup,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

