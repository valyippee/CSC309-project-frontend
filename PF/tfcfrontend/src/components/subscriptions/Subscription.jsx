import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../../api/AuthContext'
import './Subscription.css'
import { getSubscriptionStatusCodes } from '../../utils/utils'
import { subscribe, changeSubscription, cancelSubscription } from '../../api/requests'
import Spinner from 'react-bootstrap/Spinner';

function Subscription({subscription, status, setSuccessInfo, setErrorInfo}) {
  const [loading, setLoading] = useState(false)
  const [ctaButtonString, setCtaButtonString] = useState("Subscribe")

  let {token} = useContext(AuthContext)

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

  const handleButtonClick = (e) => {
    setLoading(true)
    const subscriptionStatusCodes = getSubscriptionStatusCodes()
    if (status === subscriptionStatusCodes["SUBSCRIBE"]) {
      subscribe(subscription, token, setSuccessInfo, setErrorInfo)
    } else if (status === subscriptionStatusCodes["CHANGE"]) {
      changeSubscription(subscription, token, setSuccessInfo, setErrorInfo)
    } else if (status === subscriptionStatusCodes["CANCEL"]) {
      cancelSubscription(token, setSuccessInfo, setErrorInfo)
    }
  }

  return (
    <div className="card subscription">
        <div className="card-body d-flex flex-column">
            <h2 className="card-title mb-4 mt-auto">{subscription.name}</h2>
            {subscription.plan===0 && <p className="card-text mb-4 mt-auto">Monthly</p>}
            {subscription.plan===1 && <p className="card-text mb-4 mt-auto">Yearly</p>}
            <p className="card-text mb-4 mt-auto">${subscription.price}</p>
            <button onClick={handleButtonClick} className="btn btn-primary btn-lg mt-auto">{loading ? (<Spinner animation="border" />) : ctaButtonString}</button>
        </div>
    </div>
  )
}

export default Subscription