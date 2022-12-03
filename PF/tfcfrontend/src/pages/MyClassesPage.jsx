import { useState, useContext, useEffect } from 'react';
import { Calendar, DateLocalizer, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Title from '../components/Title';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import './MyClassesPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthContext from '../api/AuthContext';
import { getUserClassHistory, getUserClassSchedule } from '../api/requests';

function Event({ event }) {
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
      {event.end > new Date() && 
        <div id='drop-buttons'>
          <button className="btn btn-lg btn-primary" id="drop-instance">Drop this instance</button>
          <button className="btn btn-lg btn-primary" id="drop-class">Drop this recurring class</button>
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

const dateToString = (date) => {
  return date.getFullYear() + '-' +
    ('0'+ (date.getMonth() + 1)).slice(-2) + '-' +
    ('0'+ date.getDate()).slice(-2);
}

function MyClassesPage() {
  let {token} = useContext(AuthContext);
  const localizer = momentLocalizer(moment);

  const [history, setHistory] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const startDate = new Date()
    startDate.setDate(1);  // first day of the month
    getClassData(startDate, 'month');
  }, []);

  const getClassData = (date, view) => {
    const startOfCalendarView = new Date(moment(date).startOf(view).subtract(7, 'days')._d);
    const today = new Date()
    if (startOfCalendarView <= today) {
      getUserClassHistory(setHistory, 7, dateToString(startOfCalendarView), token);
    }
    if (startOfCalendarView.getMonth() >= today.getMonth() - 2) {
      // future schedule needs to be displayed
      getUserClassSchedule(
        setSchedule,
        7, 
        (startOfCalendarView >= today) ? dateToString(startOfCalendarView) : dateToString(today), 
        token
      );
    }
  }

  const onNavigate = (date, view) => {
    getClassData(date, view);
  };

  const eventStyleGetter = (event) => { 
    var style = { 
      backgroundColor: event.end > new Date() ? "#403E56" : "#7f7d96",
    }; 
    return { style: style }; 
  }; 

  // console.log("RERENDERING")
  // console.log("HISTORY:")
  // history.forEach(function(entry) {
  //   console.log(entry)
  // })
  // console.log("SCHEDULE:")
  // schedule.forEach(function(entry) {
  //   console.log(entry)
  // })
    
  return (
    <>
    <Title title="My Classes"/>
    <div className="my-classes-container">
      <Calendar
        eventPropGetter={eventStyleGetter}
        localizer={localizer}
        defaultView="month"
        views={['month']}
        events={[].concat(history, schedule)}
        style={{ height: "60em" }}
        components={{ event: Event }}
        onNavigate={ (date, view) => onNavigate(date, view) }
        />
    </div>
    </>
  );
}

export default MyClassesPage;