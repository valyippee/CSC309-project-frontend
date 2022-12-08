import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import AuthContext from '../../api/AuthContext'
import { getFuturePayments } from '../../api/requests'
import Payment from './Payment'
import './Payment.css'
import InfiniteScroll from 'react-infinite-scroll-component';

function UpcomingPayments() {

    let [payments, setPayments] = useState([])

    let {token} = useContext(AuthContext)

    let [offset, setOffset] = useState(0)

    useEffect(() => {
        getFuturePayments(payments, setPayments, offset, token)
    }, [])

    const fetchPayments = ()  => {
        setOffset(offset + 10)
        getFuturePayments(payments, setPayments, offset, token)
    }

    return (
        <div className="payments-container d-flex align-items-stretch ">
            {payments.length ?
            <InfiniteScroll
            dataLength={payments.length}
            next={fetchPayments}
            hasMore={true}
            loader={<h4>Loading...</h4>}>

            {payments.map((payment, index) => (
                <Payment key={index} payment={payment}/>
            ))}

            </InfiniteScroll>
            :
            <p className="no-payments">You have no upcoming payments.</p>
            }
        </div>
    )
}

export default UpcomingPayments