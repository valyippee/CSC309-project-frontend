import AuthContext from '../api/AuthContext';
import { getUserClasses } from '../api/requests';
import { useState, useContext, useEffect } from 'react';
import moment from "moment";
import Title from '../components/Title';
import ClassCalendar from '../components/calendar/ClassCalendar';
import { dateToString } from '../components/calendar/ClassEvent';
import './MyClassesPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function MyClassesPage() {
  let {token} = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const startDate = new Date()
    startDate.setDate(1);  // first day of the month
    getClassData(startDate, 'month');
  }, []);

  const getClassData = (date, view) => {
    const startOfCalendarView = new Date(moment(date).startOf(view).subtract(7, 'days')._d);
    const today = new Date();
    getUserClasses(
      setHistory, setSchedule, 7, dateToString(startOfCalendarView),
      (startOfCalendarView >= today) ? dateToString(startOfCalendarView) : dateToString(today),
      (startOfCalendarView <= today),
      (startOfCalendarView.getMonth() >= today.getMonth() - 1),
      token
    )
  }

  return (
    <>
    <Title title="My Classes"/>
    <div className="my-classes-container">
      <ClassCalendar 
        views={['month']}
        events={[].concat(history, schedule)}
        onNavigate={ (date, view) => getClassData(date, view) }
      />
    </div>
    </>
  );
}

export default MyClassesPage;