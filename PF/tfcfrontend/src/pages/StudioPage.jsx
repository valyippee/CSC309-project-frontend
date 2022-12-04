import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import ClassCalendar from '../components/calendar/ClassCalendar';
import { dateToString } from '../components/calendar/ClassEvent';
import "./StudioPage.css";
import { getStudioInfo, getStudioClassSchedule } from "../api/requests";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { MapPin, Phone, Check } from "react-feather";
import moment from "moment";

const StudioPage = () => {
  let { studio_id } = useParams();
  console.log(studio_id)

  const [classData, setClassData] = useState([]);
  const [filters, setFilters] = useState({ weeks: 7 })
  const [studioInfo, setStudioInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudioInfo(setStudioInfo, studio_id);

    const startDate = new Date()
    startDate.setDate(1);  // first day of the month
    getClassData(startDate, 'month');
  }, []);

  useEffect(() => {
    if (Object.keys(studioInfo).length !== 0) {
      setLoading(false);
    }
  }, [studioInfo]);

  const getClassData = (date, view) => {
    const startOfCalendarView = new Date(moment(date).startOf(view).subtract(7, 'days')._d);
    const today = new Date();
    const dateRangeFilters = {
      weeks: 7,
      start_date: dateToString(startOfCalendarView)
    }
    // if view is in the past, we don't have to display anything
    if (startOfCalendarView.getMonth() >= today.getMonth() - 1) {
        getStudioClassSchedule(setClassData, studio_id, dateRangeFilters)
    }
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
              <div className="studio-image-container">
                <img src={studioInfo.images[0].studio_image}></img>
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
            {/* TODO Filter Component Placed Here */}
            <div className="studio-classes-calendar">
              <h3 id="schedule-title">Our Monthly Schedule</h3>
              <ClassCalendar 
                views={['month']}
                events={classData}
                onNavigate={ (date, view) => getClassData(date, view) }
              />
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default StudioPage;