import {React, useState, useContext} from 'react'
import { AuthContext } from '../api/AuthContext'
import './RegisterPage.css'
import { register } from '../api/requests'

function RegisterPage() {

    let [user, setUser] = useState({
        email: '',
        fname: '',
        lname: '',
        phone: '',
        password: '',
    })

    let [error, setError] = useState(null)

    const onChange = (e) => {
        setUser((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
    }

    let {register} = useContext(AuthContext)

    const registerUser = (e) => {

        e.preventDefault()

        register(user.email, user.fname, user.lname, user.phone, user.password, setError)
    }

    return (
        <>
        <div className="register-container">

            <h2>Sign Up</h2>
            
            {error && error.email && <p className='error-message'>{error.email[0]}</p>}

            <form onSubmit={registerUser} className="text-center">
                <div className="form-group row">
                    <label htmlFor="email" className="col-sm-2 col-form-label col-form-label-md">Email Address:</label>
                    <div className="col">
                    <input onChange={onChange} required={true} value={user.email} name="email" type="email" className="form-control form-control-lg" id="email"/>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="fname" className="col-sm-2 col-form-label col-form-label-md">First Name:</label>
                    <div className="col">
                    <input onChange={onChange} required={true} value={user.fname} name="fname" type="text" className="form-control form-control-lg" id="fname"/>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="lname" className="col-sm-2 col-form-label col-form-label-md">Last Name:</label>
                    <div className="col">
                    <input onChange={onChange} required={true} value={user.lname} name="lname" type="text" className="form-control form-control-lg" id="lname"/>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="phone" className="col-sm-2 col-form-label col-form-label-md">Phone Number:</label>
                    <div className="col">
                    <input onChange={onChange} value={user.phone} name="phone" type="number" className="form-control form-control-lg" id="phone"/>
                    </div>
                </div>

                {error && error.password && <p className='error-message'>{error.password[0]}</p>}

                <div className="form-group row">
                    <label htmlFor="password" className="col-sm-2 col-form-label col-form-label-md">Password:</label>
                    <div className="col">
                    <input onChange={onChange} required={true} value={user.password} name="password" type="password" className="form-control form-control-lg" id="password"/>
                    </div>
                </div>

                <div className="col-auto my-1">
                    <button type="submit" className="btn btn-lg btn-primary">Sign Up</button>
                </div>

            </form>

        </div>

        </>
    )
}

export default RegisterPage