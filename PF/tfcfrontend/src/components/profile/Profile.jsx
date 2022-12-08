import {React, useContext, useState} from 'react'
import './Profile.css'
import { patchProfile } from '../../api/requests'
import AuthContext from '../../api/AuthContext'

function Profile(props) {

    let {token} = useContext(AuthContext)

    let [success, setSuccess] = useState(false)

    const onChange = (e) => {
        props.setUser((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
    }

    const onChangeFile = (e) => {
        props.setUser((prevState) => ({
            ...prevState,
            new_avatar: e.target.files[0],
        }))
    }

    const editProfile = (e) => {
        e.preventDefault()
        
        let user = props.user

        // If they changed avatar, send the new avatar
        if ('new_avatar' in props.user) {
            patchProfile(props.setUser, setSuccess, user.email, user.first_name, user.last_name, user.new_avatar, user.phone_number, token)
        }
        else {
            patchProfile(props.setUser, setSuccess, user.email, user.first_name, user.last_name, null, user.phone_number, token)
        }


    }

    return (
        <div className="profile-container">
                
            <form onSubmit={editProfile} className="text-center">
                <div className="avatar-form form-group row">
                    <label htmlFor="avatar" className="avatar-upload">Change Avatar: </label>
                    <div className="col-2">
                        <input onChange={onChangeFile} name="avatar" id="avatar" type="file"/>
                    </div>
                </div>

                {!props.user.avatar && <img className="avatar" src={require("../../images/default.png")} alt="avatar"></img>}
                {props.user.avatar && <img className="avatar" src={props.user.avatar} alt="avatar"></img>}
                
                <div>
                    {success && <p className='success-profile'>Successfully changed account details.</p>}
                </div>

                <div className="form-group row">
                    <label htmlFor="email" className="col-sm-2 col-form-label col-form-label-md">Email Address:</label>
                    <div className="col">
                    <input onChange={onChange} required={true} value={props.user.email} name="email" type="email" className="form-control form-control-lg" id="email"/>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="fname" className="col-sm-2 col-form-label col-form-label-md">First Name:</label>
                    <div className="col">
                    <input onChange={onChange} required={true} value={props.user.first_name} name="first_name" type="text" className="form-control form-control-lg" id="fname"/>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="lname" className="col-sm-2 col-form-label col-form-label-md">Last Name:</label>
                    <div className="col">
                    <input onChange={onChange} required={true} value={props.user.last_name} name="last_name" type="text" className="form-control form-control-lg" id="lname"/>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="phone" className="col-sm-2 col-form-label col-form-label-md">Phone Number:</label>
                    <div className="col">
                    <input onChange={onChange} name="phone_number" value={props.user.phone_number} type="number" className="form-control form-control-lg" id="phone"/>
                    </div>
                </div>

                <div className="col-auto my-1">
                    <button type="submit" className="btn btn-lg btn-primary">Save</button>
                </div>

            </form>

        </div>
    )
}

export default Profile