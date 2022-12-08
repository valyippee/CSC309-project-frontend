import { createContext, useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

// This file contains the logic for storing auth tokens and user information

const AuthContext = createContext({});

export default AuthContext;

const server_url = "http://127.0.0.1:8000";

export const AuthProvider = ({children}) => {
    // Set auth token if it exists in localStorage, otherwise set it to null
    let [token, setToken] = useState(() => localStorage.getItem("token") ? localStorage.getItem("token") : null);

    const navigate = useNavigate();

    let login = async(email, password, setError) => {
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
            setError("Email or password is incorrect.")
        })
    }

    let logout = async() => {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
    };

    let register = async(email, fname, lname, phone, password, setError) => {

        axios.post(`${server_url}/api/accounts/register/`, {
            first_name: fname,
            last_name: lname,
            email: email,
            phone_number: phone,
            password: password
        }).then((res) => {
    
            if (res.status === 201) {
                navigate("/login")
            }
    
        }).catch((err) => {
            
            setError(err.response.data)
        })
    }

    let context = {
        token: token,
        login: login,
        logout: logout,
        register: register,
    }

    return(
        <AuthContext.Provider value={context} >
            {children}
        </AuthContext.Provider>
    )
}