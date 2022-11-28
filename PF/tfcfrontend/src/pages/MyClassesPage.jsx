import { useState } from 'react'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Title from '../components/Title';
import './MyClassesPage.css';
import './AccountPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

function Event({ event }) {
  let popoverClickRootClose = (
    <Popover id="event-popover" style={{ height: "8em", width: "18em"}}>
      <strong>{event.title}</strong>
      <br/>
      {event.end > new Date() && 
        <div>
          <button id="drop-instance">Drop this instance</button>
          <button id="drop-class">Drop this recurring class</button>
        </div>
      }
      
    </Popover>
  );

  console.log(event);
  return (
    <div>
      <div>
        <OverlayTrigger id="class-info" trigger="click" rootClose container={this} placement="top" overlay={popoverClickRootClose}>
          <div>{event.title}</div>
        </OverlayTrigger>
      </div>
    </div>
  );
}

function MyClassesPage() {

  const localizer = momentLocalizer(moment);

  // this are just testing data
  const [events, setEvents] = useState(
    [
      {
        title: 'Phone Interview',
        start: new Date(2022, 10, 27, 17, 0, 0),
        end: new Date(2022, 10, 27, 18, 30, 0),
      },
      {
        title: 'Cooking Class',
        start: new Date(2022, 10, 27, 17, 30, 0),
        end: new Date(2022, 10, 27, 19, 0, 0),
      },
      {
        title: 'Go to the gym',
        start: new Date(2022, 10, 28, 18, 30, 0),
        end: new Date(2022, 10, 28, 20, 0, 0),
      },
    ]
  );

  const eventStyleGetter = (event) => { 
    console.log(event)
    var style = { 
      backgroundColor: event.end > new Date() ? "#656475" : "#7f7d96",
    }; 
    return { style: style }; 
  }; 
    
  return (
    <>
    <Title title="My Classes"/>
    <div className="my-classes-container">
      <Calendar
        eventPropGetter={eventStyleGetter}
        localizer={localizer}
        defaultView="month"
        views={['month']}
        events={events}
        style={{ height: "60em" }}
        components={{ event: Event }}
        />
    </div>
    </>
  );
}

export default MyClassesPage;