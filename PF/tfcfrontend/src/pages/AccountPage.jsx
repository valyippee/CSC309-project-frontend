import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ProfileTab from '../components/profile/ProfileTab';
import SubscriptionsTab from '../components/subscriptions/SubscriptionsTab';
import Title from '../components/Title';
import './AccountPage.css'

function AccountPage() {
    
  return (
    <>
    <Title title="My Account"/>
    <div className="accounts-container">
        <Tabs defaultActiveKey="profile" id="fill-tab" fill>
        <Tab className="tab-container" eventKey="profile" title="Profile">
            <ProfileTab/>
        </Tab>
        <Tab className="tab-container" eventKey="subscriptions" title="Subscriptions">
            <SubscriptionsTab/>
        </Tab>
        <Tab className="tab-container" eventKey="upcomingPayments" title="Upcoming Payments">
            Tab 3
        </Tab>
        <Tab className="tab-container" eventKey="paymentHistory" title="Payment History">
            Tab 5
        </Tab>
        <Tab className="tab-container" eventKey="card" title="My Card">
            Tab 10
        </Tab>
        </Tabs>
    </div>
    </>
  );
}

export default AccountPage;