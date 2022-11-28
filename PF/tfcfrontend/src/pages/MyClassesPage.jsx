import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Title from '../components/Title';
import './MyClassesPage.css';
import './AccountPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

function MyClassesPage() {

  const localizer = momentLocalizer(moment);

  // const [selected, setSelected] = useState();

  const events = [
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
    ];
  
  const handleSelected = (event) => {
    // setSelected(event);
    console.log("selected: " + event.title);
  }

  const eventStyleGetter = (event) => { 
    console.log("in event style getter ")
    var style = { 
      backgroundColor: '#656475',
    }; 
    return { style: style }; 
  }; 

  const handleEnablePopover = (event) => {
    return (
      <div>
        <Row>
          <Col lg={12} xs={24}>
            <span>abc: <p>{event.abc}</p></span>
          </Col>
          <Col lg={12} xs={24}>
            <span>xyz: <p>{event.xyz}</p></span>
          </Col>
        </Row>
      </div>
    );
  }

  const eventWrapper = (props) => {
    // Some data that you might have inserted into the event object
    const data = props.event;
    console.log(data);
    // const customDiv = (
    //   <>
    //     <OverlayTrigger
    //       trigger="click"
    //       key="top"
    //       placement="top"
    //       overlay={
    //         <Popover>
    //           <Popover.Header as="h3">Popover Top</Popover.Header>
    //           <Popover.Body>
    //             Holy!
    //           </Popover.Body>
    //         </Popover>

    //       }
    //     />
    //   </>
    // );
    const customDiv = (
      <div className="yourClass">
        <span>{data.title}</span>
        <span>field 2</span>
      </div>
    );
    const eventDiv = React.cloneElement(props.children.props.children, {}, customDiv);
    const wrapper = React.cloneElement(props.children, {}, eventDiv);
    return (<div>
      {wrapper}
    </div>
    );
    // return (
    //   {customDiv}
    // )
  }
    
  return (
    <>
    <Title title="My Classes"/>
    <div className="my-classes-container">
        <Tabs defaultActiveKey="upcomingClasses" id="fill-tab" fill>
            <Tab className="tab-container" eventKey="upcomingClasses" title="My Upcoming Classes">
              <Calendar
                // selected={selected}
                onSelectEvent={handleSelected}
                eventPropGetter={eventStyleGetter}
                localizer={localizer}
                defaultView="month"
                views={['week', 'month']}
                events={events}
                style={{ height: "60em" }}
                components={{ eventWrapper: eventWrapper }}
                  // {
                  //   eventWrapper: eventWrapper
                    // ({ event, children }) => (
                    //   <div
                    //     onMouseOver={
                    //       e => {
                    //         e.preventDefault();
                    //       }
                    //     }
                    //   >
                        // {/* <Popover placement="top" content={handleEnablePopover(event)} title="xyz"> */}
                        //   {/* {children} */}
                        //   {/* hello */}
                        // {/* </Popover> */}
                        // {/* <OverlayTrigger
                        //   trigger="click"
                        //   key="top"
                        //   placement="top"
                        //   overlay={
                        //     <Popover id={`popover-positioned-top`}>
                        //       <Popover.Header as="h3">{`Popover top`}</Popover.Header>
                        //       <Popover.Body>
                        //         <strong>Holy guacamole!</strong> Check this info.
                        //       </Popover.Body>
                        //     </Popover>
                        //   }
                        // /> */}
                    //   </div>
                    // )
                //   }
                // }
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