import {React, useEffect, useState, useContext} from 'react'
import AuthContext from '../../api/AuthContext'
import { getCard } from '../../api/requests'
import CardInfo from './CardInfo'

function CardInfoTab() {

    let [card, setCard] = useState({
        last4: '',
        exp_month: '',
        exp_year: '',
    })

    let {token} = useContext(AuthContext)

    useEffect(() => {
        getCard(setCard, token)
    }, [])

    return (
        <div>
            <CardInfo card={card} setCard={setCard} />
        </div>
    )
}

export default CardInfoTab