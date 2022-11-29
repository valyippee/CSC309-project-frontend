import { useState } from 'react'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Title from '../components/Title';
import './MyClassesPage.css';
import './AccountPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import 'bootstrap/dist/css/bootstrap.min.css';

function Event({ event }) {
  let popover = (
    <Popover id="event-popover">
      <strong id="event-title">{event.title}</strong>
      <br/>
      <span id='event-description'>
        {event.description}<br/><br/>
        <strong>Location: </strong>{event.location}<br/>
        <strong>Coach: </strong> {event.coach}<br/>
        <strong>Time: </strong> {event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()}
      </span>
      {event.end > new Date() && 
        <div id='drop-buttons'>
          <button className="btn btn-lg btn-primary" id="drop-instance">Drop this instance</button>
          <button className="btn btn-lg btn-primary" id="drop-class">Drop this recurring class</button>
        </div>
      }
    </Popover>
  );

  console.log(event);
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

function MyClassesPage() {

  const localizer = momentLocalizer(moment);

  // this are just testing data
  const [events, setEvents] = useState(
    [
      {
        title: 'Phone Interview',
        start: new Date(2022, 10, 27, 17, 0, 0),
        end: new Date(2022, 10, 27, 18, 30, 0),
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        location: "Studio 1",
        coach: "Mary"
      },
      {
        title: 'Cooking Class',
        start: new Date(2022, 10, 27, 17, 30, 0),
        end: new Date(2022, 10, 27, 19, 0, 0),
        description: "cooking your favourite dish",
        location: "Studio 2",
        coach: "Mary"
      },
      {
        title: 'Go to the gym',
        start: new Date(2022, 10, 30, 18, 30, 0),
        end: new Date(2022, 10, 30, 20, 0, 0),
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        location: "Studio 3",
        coach: "Mary"
      },
    ]
  );

  const eventStyleGetter = (event) => { 
    console.log(event)
    var style = { 
      backgroundColor: event.end > new Date() ? "#403E56" : "#7f7d96",
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