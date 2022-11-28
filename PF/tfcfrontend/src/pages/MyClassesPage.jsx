import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React, { useMemo } from 'react'
import {
    Calendar,
    Views,
    DateLocalizer,
    momentLocalizer,
} from 'react-big-calendar'
import moment from 'moment';
import Title from '../components/Title';
import './MyClassesPage.css';
import events from './events.js';
import * as dates from './dates.js';


function MyClassesPage() {

  const localizer = momentLocalizer(moment);

  const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      defaultDate: new Date(2015, 3, 1),
      max: dates.add(dates.endOf(new Date(2015, 27, 11), 'day'), -1, 'hours'),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  )
    
  return (
    <>
    <Title title="My Classes"/>
    <div className="my-classes-container">
        <Tabs defaultActiveKey="upcomingClasses" id="fill-tab" fill>
            <Tab className="tab-container" eventKey="upcomingClasses" title="My Upcoming Classes">
                <Calendar
                    components={components}
                    defaultDate={defaultDate}
                    events={events}
                    localizer={localizer}
                    max={max}
                    showMultiDayTimes
                    step={60}
                    views={views}
                />
            </Tab>
            <Tab className="tab-container" eventKey="pastClasses" title="My Past Classes">
                Tab 2
            </Tab>
        </Tabs>
    </div>
    </>
  );
}

export default MyClassesPage;