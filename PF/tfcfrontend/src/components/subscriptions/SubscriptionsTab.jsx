import React, { useState } from 'react'
import { useEffect } from 'react'
import { getSubscriptions } from '../../api/requests'
import Subscription from './Subscription'
import './Subscription.css'

function SubscriptionsTab() {

  let [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    getSubscriptions(setSubscriptions)
}, [])

  return (
    <div className="subscriptions-container d-flex align-items-stretch ">
      {subscriptions.map((subscription) => (
        <Subscription key={subscription.id} subscription={subscription}/>
      ))}
    </div>
  )
}

export default SubscriptionsTab