import React, {useState, useEffect} from 'react'
import './Subscription.css'
import { getSubscriptionStatusCodes } from '../../utils/utils'

function Subscription({subscription, status}) {
  const [ctaButtonString, setCtaButtonString] = useState("Subscribe")

  useEffect(() => {
    const subscriptionStatusCodes = getSubscriptionStatusCodes()
    if (status === subscriptionStatusCodes["SUBSCRIBE"]) {
      setCtaButtonString("Subscribe")
    } else if (status === subscriptionStatusCodes["CHANGE"]) {
      setCtaButtonString("Change Plan")
    } else if (status === subscriptionStatusCodes["CANCEL"]) {
      setCtaButtonString("Cancel")
    }
  }, [])


  return (
    <div className="card subscription">
        <div className="card-body d-flex flex-column">
            <h2 className="card-title mb-4 mt-auto">{subscription.name}</h2>
            {subscription.plan===0 && <p className="card-text mb-4 mt-auto">Monthly</p>}
            {subscription.plan===1 && <p className="card-text mb-4 mt-auto">Yearly</p>}
            <p className="card-text mb-4 mt-auto">${subscription.price}</p>
            <a href="#" className="btn btn-primary btn-lg mt-auto">{ctaButtonString}</a>
        </div>
    </div>
  )
}

export default Subscription