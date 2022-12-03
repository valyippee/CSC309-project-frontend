import AuthContext from '../api/AuthContext';
import { getUserClassHistory, getUserClassSchedule } from '../api/requests';
import { useState, useContext, useEffect } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Title from '../components/Title';
import { dateToString, Event } from '../components/ClassEvent';

import './MyClassesPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';


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
        onNavigate={ (date, view) => getClassData(date, view) }
        />
    </div>
    </>
  );
}

export default MyClassesPage;