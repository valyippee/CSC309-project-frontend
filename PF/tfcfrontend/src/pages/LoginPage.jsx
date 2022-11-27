import {React, useState, useContext} from 'react'
import { AuthContext } from '../api/AuthContext'
import Navbar from '../components/Navbar'
import './LoginPage.css'

function LoginPage() {

    let [user, setUser] = useState({
        email: '',
        password: '',
    })

    const onChange = (e) => {
        setUser((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
    }

    let {login} = useContext(AuthContext)

    let loginUser = (e) => {
        e.preventDefault()
        
        login(user.email, user.password)
    }

    return (
        <>
        <div className="login-container">

            <h2>Login</h2>
            
            <form className="text-center" onSubmit={loginUser}>
                <div className="form-group row">
                    <label htmlFor="email" className="col-sm-2 col-form-label col-form-label-md">Email Address:</label>
                    <div className="col">
                    <input onChange={onChange} value={user.email} name="email" type="email" className="form-control form-control-lg" id="email"/>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="password" className="col-sm-2 col-form-label col-form-label-md">Password:</label>
                    <div className="col">
                    <input onChange={onChange} value={user.password} name="password" type="password" className="form-control form-control-lg" id="password"/>
                    </div>
                </div>

                <div className="col-auto my-1">
                    <button type="submit" className="btn btn-lg btn-primary">Login</button>
                </div>

            </form>

        </div>

        </>
    )
}

export default LoginPage