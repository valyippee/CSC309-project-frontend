import React from 'react'
import Navbar from '../components/Navbar'
import './RegisterPage.css'

function RegisterPage() {
  return (
    <>
    <Navbar></Navbar>
    <div className="register-container">

        <h2>Sign Up</h2>
        
        <form className="text-center">
            <div className="form-group row">
                <label htmlFor="email" className="col-sm-2 col-form-label col-form-label-md">Email Address:</label>
                <div className="col">
                <input type="email" className="form-control form-control-lg" id="email"/>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="fname" className="col-sm-2 col-form-label col-form-label-md">First Name:</label>
                <div className="col">
                <input type="text" className="form-control form-control-lg" id="fname"/>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="lname" className="col-sm-2 col-form-label col-form-label-md">Last Name:</label>
                <div className="col">
                <input type="text" className="form-control form-control-lg" id="lname"/>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="phone" className="col-sm-2 col-form-label col-form-label-md">Phone Number:</label>
                <div className="col">
                <input type="number" className="form-control form-control-lg" id="phone"/>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="password" className="col-sm-2 col-form-label col-form-label-md">Password:</label>
                <div className="col">
                <input type="password" className="form-control form-control-lg" id="password"/>
                </div>
            </div>

            <div className="col-auto my-1">
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </div>

        </form>

    </div>

    </>
  )
}

export default RegisterPage