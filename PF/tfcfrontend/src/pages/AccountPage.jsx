import { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useNavigate, useParams } from 'react-router-dom';
import CardInfoTab from '../components/cardinfo/CardInfoTab';
import ProfileTab from '../components/profile/ProfileTab';
import SubscriptionsTab from '../components/subscriptions/SubscriptionsTab';
import Title from '../components/Title';
import './AccountPage.css'

function AccountPage({match}) {
    
    const [key, setKey] = useState('subscriptions')

    const {tab} = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        setKey(tab)
    }, [])

    const onSelect = (e) => {
        setKey(e)
        navigate(`/accounts/${e}`)
    }

    return (
        <>
        <Title title="My Account"/>
        <div className="accounts-container">
            <Tabs activeKey={key} onSelect = {onSelect} id="fill-tab" fill>
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
                <CardInfoTab/>
            </Tab>
            </Tabs>
        </div>
        </>
    );
}

export default AccountPage;