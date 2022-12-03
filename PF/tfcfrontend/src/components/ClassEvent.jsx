import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import './ClassEvent.css';

export const dateToString = (date) => {
    return date.getFullYear() + '-' +
      ('0'+ (date.getMonth() + 1)).slice(-2) + '-' +
      ('0'+ date.getDate()).slice(-2);
}

export const Event = ({event}) => {
    let popover = (
      <Popover id="event-popover">
        <strong id="event-title">{event.title}</strong>
        <br/>
        <span id='event-description'>
          {event.description}<br/><br/>
          <strong>Location: </strong>{event.location}<br/>
          <strong>Coach: </strong> {event.coach}<br/>
          <strong>Time: </strong> {event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()} <br/>
          <strong>Date: </strong> {dateToString(event.start)}
        </span>
        {event.end > new Date() && !event.enrollEnabled &&
          <div id='drop-buttons'>
            <button className="btn btn-lg btn-primary" id="drop-instance">Drop this class instance</button>
            <button className="btn btn-lg btn-primary" id="drop-class">Drop this recurring class</button>
          </div>
        }
        {event.enrollEnabled &&
          <div id='enroll-buttons'>
            <button className="btn btn-lg btn-primary" id="enroll-instance">Enroll in this class instance</button>
            <button className="btn btn-lg btn-primary" id="enroll-class">Enroll in this recurring class</button>
          </div>
        }
      </Popover>
    );
  
    return (
      <div>
        <div>
          <OverlayTrigger id="class-info" trigger="click" rootClose container={this} placement="auto-end" overlay={popover}>
            <div>{event.title}</div>
          </OverlayTrigger>
        </div>
      </div>
    );
  }