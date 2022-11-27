import { createContext, useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

// This file contains the logic for storing auth tokens and user information

export const AuthContext = createContext({});

const server_url = "http://127.0.0.1:8000";

export const AuthProvider = ({children}) => {
    // Set auth token if it exists in localStorage, otherwise set it to null
    let [token, setToken] = useState(() => localStorage.getItem("token") ? localStorage.getItem("token") : null);

    const navigate = useNavigate();

    let login = async(email, password) => {
        axios.post(`${server_url}/api/accounts/login/`, {
            email: email,
            password: password
        }).then((res) => {
            // Set the auth token if we successfully log in
            if (res.status === 200) {
                setToken(res.data.token)
                localStorage.setItem("token", res.data.token)
                navigate("/")
            }
        }).catch(() => {
            // TODO, just alert for now to test it works
            alert("Your email or password was incorrect.")
        })
    }

    let logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
    };
    
    let context = {
        token: token,
        login: login,
        logout: logout,
    }

    return(
        <AuthContext.Provider value={context} >
            {children}
        </AuthContext.Provider>
    )
}