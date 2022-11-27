import React from 'react'
import Navbar from '../components/Navbar'
import './LoginPage.css'

function LoginPage() {
  return (
    <>
    <Navbar></Navbar>
    <div className="login-container">

        <h2>Login</h2>
        
        <form className="text-center">
            <div className="form-group row">
                <label htmlFor="email" className="col-sm-2 col-form-label col-form-label-md">Email Address:</label>
                <div className="col">
                <input type="email" className="form-control form-control-lg" id="email"/>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="password" className="col-sm-2 col-form-label col-form-label-md">Password:</label>
                <div className="col">
                <input type="password" className="form-control form-control-lg" id="password"/>
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