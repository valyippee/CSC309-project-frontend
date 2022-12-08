import React from 'react'
import './UserSubscription.css'

function UserSubscription({subscription, cancelSubscription}) {

  return (
    <div className="card user-subscription">
        <div className="card-body d-flex flex-column">
            <h2 className="card-title mb-4 mt-auto">{subscription.name}</h2>
            {subscription.plan===0 && <p className="card-text mb-4 mt-auto">Monthly</p>}
            {subscription.plan===1 && <p className="card-text mb-4 mt-auto">Yearly</p>}
            <p className="card-text mb-4 mt-auto">${subscription.price}</p>
            <button onClick={cancelSubscription} className="btn btn-primary btn-lg mt-auto">Cancel</button>
        </div>
    </div>
  )
}

export default UserSubscription