import React from 'react'
import './Profile.css'

function Profile(props) {

  return (
    <div className="profile-container">

        <form className="text-center">
            <div className="avatar-form form-group row">
                <label htmlFor="avatar" className="avatar-upload">Change Avatar: </label>
                <div className="col-2">
                    <input id="avatar" type="file"/>
                </div>
            </div>

            {!props.user.avatar && <img className="avatar" src="https://www.cs.toronto.edu/~kianoosh/courses/csc309/resources/images/tfc.png" alt="avatar"></img>}
            {props.user.avatar && <img className="avatar" src={props.user.avatar} alt="avatar"></img>}

            <div className="form-group row">
                <label htmlFor="email" className="col-sm-2 col-form-label col-form-label-md">Email Address:</label>
                <div className="col">
                <input required={true} value={props.user.email} name="email" type="email" className="form-control form-control-lg" id="email"/>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="fname" className="col-sm-2 col-form-label col-form-label-md">First Name:</label>
                <div className="col">
                <input required={true} value={props.user.first_name} name="fname" type="text" className="form-control form-control-lg" id="fname"/>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="lname" className="col-sm-2 col-form-label col-form-label-md">Last Name:</label>
                <div className="col">
                <input required={true} value={props.user.last_name} name="lname" type="text" className="form-control form-control-lg" id="lname"/>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="phone" className="col-sm-2 col-form-label col-form-label-md">Phone Number:</label>
                <div className="col">
                <input name="phone" value={props.user.phone_number} type="number" className="form-control form-control-lg" id="phone"/>
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