import { dropUserClass, dropUserClassInstance, enrollUserClass, enrollUserClassInstance } from '../../api/requests';
import AuthContext from '../../api/AuthContext';
import { useContext, useState } from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import './ClassEvent.css';
import NoticeModal from '../NoticeModal';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

export const dateToString = (date) => {
    return date.getFullYear() + '-' +
      ('0'+ (date.getMonth() + 1)).slice(-2) + '-' +
      ('0'+ date.getDate()).slice(-2);
}

export const Event = ({event}) => {
    let {token} = useContext(AuthContext);
    const navigate = useNavigate();
    const navigateToSub = () => {navigate('/')}  // TODO: add subscriptions page link
    const navigateToLogin = () => {navigate("/login")}
    const navigateToClasses = () => {navigate("/myclasses")}
    const refresh = () => {window.location.reload()}

    const [showModal, setModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [confirmAction, setConfirmAction] = useState();
    const [enrollErrorStatusCode, setEnrollErrorStatusCode] = useState();
    const [dropErrorStatusCode, setDropErrorStatusCode] = useState();

    useEffect(() => {
      // error handling when enrolling in a class
      setModalTitle("Oh no! Something went wrong.");
      if (enrollErrorStatusCode == 1) {
        setModalMessage("You are already enrolled in this class.");
      } else if (enrollErrorStatusCode == 2) {
        setModalMessage("Class is already full.");
      } else if (enrollErrorStatusCode == 3) {
        setModalMessage("You do not have an active subscription.");
        setButtonText("Subscribe now");
        setConfirmAction(() => navigateToSub);
      } else if (enrollErrorStatusCode == 0) {
        setModalMessage("You are not logged in.");
        setButtonText("Log in now");
        setConfirmAction(() => navigateToLogin)
      } else if (enrollErrorStatusCode == -1) {
        setModalMessage("An error occured. Please try again.");
      }
    }, [enrollErrorStatusCode]);

    useEffect(() => {
      // error handling when dropping a class
      setModalTitle("Oh no! Something went wrong.");
      if (dropErrorStatusCode == 0) {
        setModalMessage("You are not logged in.");
        setButtonText("Log in now");
        setConfirmAction(() => navigateToLogin)
      } else if (dropErrorStatusCode == -1) {
        setModalMessage("An error occured. Please refresh and try again.");
        setButtonText("Refresh");
        setConfirmAction(() => refresh)
      }
    }, [dropErrorStatusCode]);
    
    const dropClass = (date, isInstance) => {
      if (token == null) {
        setDropErrorStatusCode(0);
      } else {
        var message = `You have dropped the ${event.title} class for ${date}. Refresh to see the changes.`;
        if (!isInstance) {
          if (!date) {
            message = `You have dropped all recurring ${event.title} class. Refresh to see the changes.`;
          } else {
            message = `You have dropped the recurring ${event.title} class from ${date} onwards. Refresh to see the changes.`;
          }
        } 
        setModalMessage(message);
        setModalTitle("Dropped!");
        setButtonText("Refresh");
        setConfirmAction(() => refresh);
        dropUserClass(setDropErrorStatusCode, isInstance, event.classId, date, token);
      }
      setModal(true);
    }

    const enrollClass = (date) => {
      if (token == null) {
        setEnrollErrorStatusCode(0);
      } else {
        setModalMessage(date 
          ? `You have been enrolled in ${event.title} for ${date}.`
          : `You have been enrolled in ${event.title} as a recurring class.`);
        setModalTitle("Enrolled!");
        setButtonText("Go to my classes");
        setConfirmAction(() => navigateToClasses);
        enrollUserClass(setEnrollErrorStatusCode, event.classId, date, token);
      }
      setModal(true);
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
            {event.classCancelled && event.start < new Date() &&
              <div id='cancelled'>
              <span>This class was cancelled.</span><br/>
            </div>
            }
          </span>
          {event.end > new Date() && !event.enrollEnabled &&
            <div id='drop-buttons'>
              <button 
                className="btn btn-lg btn-primary"
                id="drop-instance" 
                onClick={() => dropClass(dateToString(event.start), true)}>
                  Drop this class instance
              </button>
              {event.isRecurring &&
              <>
                <button 
                  className="btn btn-lg btn-primary"
                  id="drop-class"
                  onClick={() => dropClass(dateToString(event.start), false)}>
                    Drop recurring class from this date
                </button>
                <button 
                  className="btn btn-lg btn-primary"
                  id="drop-class"
                  onClick={() => dropClass(null, false)}>
                    Drop all recurring classes
                </button>
              </>  
              }
            </div>
          }
          {event.enrollEnabled && !event.enrolled &&
            <div id='enroll-buttons'>
              <button 
                className="btn btn-lg btn-primary" 
                id="enroll-instance"
                onClick={() => enrollClass(dateToString(event.start))}>
                  Enroll in this class instance
              </button>
              <button 
                className="btn btn-lg btn-primary" 
                id="enroll-class"
                onClick={() => enrollClass()}>
                  Enroll in all recurring classes
                </button>
            </div>
          }
          {event.enrollEnabled && event.enrolled &&
            <div id='enrolled'>
              <span>You are enrolled in this class.</span>
              <button 
                  className="btn btn-lg btn-primary"
                  id="enrolled-button"
                  onClick={() => navigateToClasses()}>
                    Go to my classes
                </button>
            </div>
          }
        </Popover>
      );
  
    return (
      <div>
        <div>
          <NoticeModal 
            showModal={showModal} title={modalTitle}
            onHide={() => setModal(false)} message={modalMessage}
            buttonText={buttonText}
            onConfirm={confirmAction}
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