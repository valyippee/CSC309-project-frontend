import React, { useContext, useState, useEffect } from "react";
import AuthContext from '../api/AuthContext';
import Title from "../components/Title";
import ClassCalendar from '../components/calendar/ClassCalendar';
import ClassesFilterBar from '../components/studios/ClassesFilterBar';
import { dateToString } from '../components/calendar/ClassEvent';
import "./StudioPage.css";
import { getStudioInfo, getStudioClassSchedule, getAllCoachAndClass } from "../api/requests";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { MapPin, Phone, Check } from "react-feather";
import moment from "moment";
import StudioImageCarousel from "../components/studios/StudioImageCarousel";


const StudioPage = () => {
  let { studio_id } = useParams();
  let {token} = useContext(AuthContext);  // used to check if user is enrolled in any classes

  const [calendarInfo, setCalendarInfo] = useState({date: new Date().setDate(1), view: 'month'})
  const [classData, setClassData] = useState([]);
  const [filterClassName, setFilterClassName] = useState('Any')
  const [filterCoachName, setFilterCoachName] = useState('Any')
  const [timeRangeValue, setTimeRangeValue] = useState({ start: "08:00", end: "22:00" })
  const [studioInfo, setStudioInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const [allClassNames, setAllClassNames] = useState([]);
  const [allCoachNames, setAllCoachNames] = useState([]);

  useEffect(() => {
    getStudioInfo(setStudioInfo, studio_id);
    getClassData();
    getAllCoachAndClass(setAllClassNames, setAllCoachNames, studio_id);
  }, []);

  useEffect(() => {
    if (Object.keys(studioInfo).length !== 0) {
      setLoading(false);
    }
  }, [studioInfo]);

  useEffect(() => {
    getClassData();
  }, [filterClassName, filterCoachName, timeRangeValue]);

  const onCalendarChange = (date, view) => {
    setCalendarInfo({date: date, view: view})
    getClassData()
  }

  const getClassData = () => {
    const startOfCalendarView = new Date(moment(calendarInfo.date).startOf(calendarInfo.view).subtract(7, 'days')._d);
    const today = new Date();
    const dateRangeFilters = {
      weeks: 7,
      start_date: dateToString(startOfCalendarView),
      coach: filterCoachName != 'Any' ? filterCoachName : null,
      class_name: filterClassName != 'Any' ? filterClassName : null,
      start_time: timeRangeValue.start,
      end_time: timeRangeValue.end
    }
    // if view is in the past, we don't have to display anything
    if (startOfCalendarView.getMonth() >= today.getMonth() - 1) {
      getStudioClassSchedule(
        setClassData, studio_id, dateRangeFilters,
        startOfCalendarView < today ? dateToString(today) : dateToString(startOfCalendarView),
        token
      )
    }
  }

  const timeChangeHandler = (time) => {
    setTimeRangeValue(time);
  }

  const resetFilters = () => {
    setTimeRangeValue({ start: "08:00", end: "22:00" });
    setFilterClassName('Any');
    setFilterCoachName('Any');
  }

  if (loading) {
    return (
      // TODO - Add a spinner here?
      <></>
    );
  } else {
    return (
      <>
        <Title title={"Studio - " + studioInfo.name} />
        <div className="studiopage-body-container">
          <div className="studiopage-body-top-container">
            <div className="amenities-container">
              <h2>Amenities</h2>
              <div className="amenities-table-container">
                <Table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Type</th>
                      <th style={{textAlign: "center"}}>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studioInfo.amenities.map((amenity) => (
                        <tr key={amenity.id}>
                            <td><Check/></td>
                            <td>{amenity.amenity_type}</td>
                            <td style={{textAlign: "center"}}>{amenity.quantity}</td>
                        </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="studio-general-info-container">
              <div className="studio-images-container">
                <StudioImageCarousel images={studioInfo.images}/>
              </div>
              <div className="studio-info-labels-container">
                <h3>Contact</h3>
                <div className="studio-info-labels-icon-p-container">
                  <Phone></Phone>
                  <p>{studioInfo.phone_number}</p>
                </div>
              </div>
              <div className="studio-info-labels-container">
                <h3>Address</h3>
                <div className="studio-info-labels-icon-p-container">
                  <MapPin></MapPin>
                  <p>
                    {studioInfo.address}, {studioInfo.postal_code}
                  </p>
                </div>
              </div>
              <div className="studio-directions-button-container">
                <Button
                  href={studioInfo.directions_url}
                  target="_blank"
                  className="studio-directions-button"
                >
                  Directions
                </Button>
              </div>
            </div>
          </div>
          <div className="studiopage-body-bottom-container">
            <div className="studio-classes-calendar">
              <h3 id="schedule-title">Our Monthly Schedule</h3>
              <ClassesFilterBar 
                studioClassNames={allClassNames}
                coachNames={allCoachNames}
                timeChangeHandler={(time) => timeChangeHandler(time)}
                timeRangeValue={timeRangeValue}
                classData={classData}
                selectedFilters={{coach: filterCoachName, className: filterClassName}}
                resetFilters={resetFilters}
                onClassNameChange={setFilterClassName}
                onCoachChange={setFilterCoachName}
              />
              <ClassCalendar 
                views={['month']}
                events={classData}
                onNavigate={ (date, view) => onCalendarChange(date, view) }
              />
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default StudioPage;