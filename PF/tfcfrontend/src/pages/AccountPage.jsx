import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import './AccountPage.css'

function AccountPage() {
    
  return (
    <div className="accounts-container">
        <Tabs defaultActiveKey="profile" id="fill-tab" className="mb-3" fill>
        <Tab eventKey="profile" title="Profile">
            Tab 1
        </Tab>
        <Tab eventKey="subscriptions" title="Subscriptions">
            Tab 2
        </Tab>
        <Tab eventKey="upcomingPayments" title="Upcoming Payments">
            Tab 3
        </Tab>
        <Tab eventKey="paymentHistory" title="Payment History">
            Tab 5
        </Tab>
        <Tab eventKey="card" title="My Card">
            Tab 10
        </Tab>
        </Tabs>
    </div>
  );
}

export default AccountPage;