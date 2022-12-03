import { Event } from './ClassEvent';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function ClassCalendar(props) {
    const localizer = momentLocalizer(moment);

    const eventStyleGetter = (event) => { 
        var style = { 
          backgroundColor: event.end > new Date() ? "#403E56" : "#7f7d96",
        }; 
        return { style: style }; 
    }; 

    return (
        <>
            <Calendar
                eventPropGetter={eventStyleGetter}
                localizer={localizer}
                defaultView="month"
                views={props.views}
                events={props.events}
                style={{ height: "60em" }}
                components={{ event: Event }}
                onNavigate={(date, view) => props.onNavigate(date, view)}
            />
        </>
    )
}