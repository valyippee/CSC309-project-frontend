import { Event } from './ClassEvent';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function ClassCalendar(props) {
    const localizer = momentLocalizer(moment);

    const eventStyleGetter = (event) => { 
        var backgroundColor = "#7f7d96";
        console.log(event)
        if (event.classCancelled && event.start < new Date()) {
            backgroundColor = '#808080';
        } else if (event.end > new Date()) {
            backgroundColor = '#403E56';
        }
        var style = { 
          backgroundColor: backgroundColor,
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