import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import AuthContext from '../../api/AuthContext'
import { cancelUserSubscription, getUserSubscription } from '../../api/requests'
import Subscription from './Subscription'
import './Subscription.css'

function SubscriptionsTab() {

  let {token} = useContext(AuthContext)
  let [userSubscription, setUserSubscription] = useState(false)
  let [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    getUserSubscription(setUserSubscription, token)
  }, [])

  const cancelSubscription = () => {
    cancelUserSubscription(setCancelled, setUserSubscription, token)
}

  return (
    <div className="user-subscriptions-container">
        {userSubscription ?
        <h2 className="title">Current Plan</h2> 
        : 
        <h2 className="no-sub">You do not have a subscription.</h2>}

        {cancelled && <h2 className="sub-cancelled">Your subscription has been successfully cancelled.</h2>}

        {userSubscription ?
        <div className="user-subscription-card-container">
          <Subscription subscription={userSubscription} cancelSubscription={cancelSubscription}/>
        </div>
        :
        <div className="subscriptions-link">
        <a href="/subscriptions" className="btn btn-primary btn-lg mt-auto">See all subscriptions</a>
        </div>
        }
    </div>
  )
}

export default SubscriptionsTab