import React from 'react'

function Payment({payment}) {
  return (
    <div>
        <div className="card payment">
        <div className="card-body d-flex flex-column">
            <div className="card-content">
                <h3 className="card-text mb-4 mt-auto">Card Number: </h3>
                <p>**** **** **** {payment.last4}</p>
            </div>
            <div className="card-content">
                <h3 className="card-text mb-4 mt-auto">Expiry: </h3>
                <p>{payment.exp_month} / {payment.exp_year}</p>
            </div>
            <div className="card-content">
                <h3 className="card-text mb-4 mt-auto">Amount: </h3>
                <p>${payment.amount}</p>
            </div>
            <div className="card-content">
                <h3 className="card-text mb-4 mt-auto">Date: </h3>
                <p>{payment.datetime.slice(0, 10)}</p>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Payment