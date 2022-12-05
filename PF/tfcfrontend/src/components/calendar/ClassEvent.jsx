import { dropUserClass, dropUserClassInstance, enrollUserClass, enrollUserClassInstance } from '../../api/requests';
import AuthContext from '../../api/AuthContext';
import { useContext, useState } from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import './ClassEvent.css';
import NoticeModal from '../NoticeModal';
import { useNavigate } from "react-router-dom";

export const dateToString = (date) => {
    return date.getFullYear() + '-' +
      ('0'+ (date.getMonth() + 1)).slice(-2) + '-' +
      ('0'+ date.getDate()).slice(-2);
}

const dropClass = (classId, token) => {
  dropUserClass(classId, token);
  window.location.reload();
}

const dropClassInstance = (classId, date, token) => {
  dropUserClassInstance(classId, date, token);
  window.location.reload();
}

export const Event = ({event}) => {
    let {token} = useContext(AuthContext);
    const navigate = useNavigate();
    const navigateToSub = () => {navigate('/')}  // TODO: add subscriptions page link
    const navigateToLogin = () => {navigate("/login")}

    const [showSuccessModal, setSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showErrorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorButtonText, setErrorButtonText] = useState("");
    const [errorAction, setErrorAction] = useState()

    const enrollClass = () => {
      if (token == null) {
        setErrorModal(true);
        setErrorMessage("You are not logged in.");
        setErrorButtonText("Log in now");
        setErrorAction(() => navigateToLogin)
      } else {
        setSuccessMessage(`You have been enrolled in ${event.title} as a recurring class.`);
        enrollUserClass(setSuccessModal, setErrorModal, setErrorMessage, setErrorButtonText, setErrorAction, navigateToSub, event.classId, null, token);
      }
    }
    
    const enrollClassInstance = () => {
      setSuccessMessage(`You have been enrolled in ${event.title} for ${date}.`);
      enrollUserClass(setSuccessModal, setErrorModal, setErrorMessage, setErrorButtonText, setErrorAction, navigateToSub, event.classId, dateToString(event.start), token);
    }

    let EventPopover = (
        <Popover>
          <strong id="event-title">{event.title}</strong>
          <br/>
          <span id='event-description'>
            {event.description}<br/><br/>
            {event.location &&
              <>
                <strong>Location: </strong>{event.location} <br/>
              </>
            }
            <strong>Coach: </strong> {event.coach}<br/>
            <strong>Time: </strong> {event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()} <br/>
            <strong>Date: </strong> {dateToString(event.start)} <br/>
            {event.capacity &&
              <>
                <strong>Total Class Capacity: </strong>{event.capacity} <br/>
              </>
            }
          </span>
          {event.end > new Date() && !event.enrollEnabled &&
            <div id='drop-buttons'>
              <button 
                className="btn btn-lg btn-primary"
                id="drop-instance" 
                onClick={() => dropClassInstance(event.classId, dateToString(event.start), token)}>
                  Drop this class instance
              </button>
              <button 
                className="btn btn-lg btn-primary"
                id="drop-class"
                onClick={() => dropClass(event.classId, token)}>
                  Drop this recurring class
              </button>
            </div>
          }
          {event.enrollEnabled &&
            <div id='enroll-buttons'>
              <button 
                className="btn btn-lg btn-primary" 
                id="enroll-instance"
                onClick={() => enrollClassInstance()}>
                  Enroll in this class instance
              </button>
              <button 
                className="btn btn-lg btn-primary" 
                id="enroll-class"
                onClick={() => enrollClass()}>
                  Enroll in this recurring class
                </button>
            </div>
          }
        </Popover>
      );
  
    return (
      <div>
        <div>
          <NoticeModal 
            showModal={showErrorModal} title={"Oh no!"}
            onHide={() => setErrorModal(false)} message={errorMessage}
            buttonText={errorButtonText}
            onConfirm={errorAction}
          />
        </div>
        <div>
          <NoticeModal 
            showModal={showSuccessModal} title={"Enrolled!"}
            onHide={() => setSuccessModal(false)} message={successMessage}
            buttonText={"Go to my classes"}
            onConfirm={() => navigate("/myclasses")}
          />
        </div>
        <div>
          <OverlayTrigger 
            id="class-info" trigger="click" 
            rootClose={true} container={this} 
            placement="auto-end" overlay={EventPopover}>
            <div>{event.title}</div>
          </OverlayTrigger>
        </div>
      </div>
    );
  }