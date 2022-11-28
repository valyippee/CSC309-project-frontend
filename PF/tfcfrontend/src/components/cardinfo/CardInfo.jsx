import {React, useState, useContext} from 'react'
import AuthContext from '../../api/AuthContext'
import { putCard } from '../../api/requests'
import './CardInfo.css'

function CardInfo(props) {

    let [cardNum, setCardNum] = useState('')

    let [cvc, setCVC] = useState('')

    let [success, setSuccess] = useState(false)

    let {token} = useContext(AuthContext)

    const onChange = (e) => {
        props.setCard((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
    }

    const onChangeCardNum = (e) => {
        setCardNum(e.target.value)
    }

    const onChangeCVC = (e) => {
        setCVC(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        putCard(setSuccess, cardNum, props.card.exp_month, props.card.exp_year, cvc, token)

    }

    return (
        <div className="card-info-container">
            {props.card.last4 && <h2 className="card-h2">Current Card: </h2>}
            {!props.card.last4 && <h2 className="card-h2">Add payment information: </h2>}

            {success && <p className="card-success">Successfully added card information</p>}

            <form onSubmit={onSubmit} className="text-center">
                    <div className="form-group row">
                        <label htmlFor="card_number" className="col-sm-2 col-form-label col-form-label-md">Card Number: </label>
                        <div className="col-3">
                            {props.card.last4 && 
                            <input required={true} value={cardNum} onChange={onChangeCardNum} placeholder={"**** **** **** " + props.card.last4} name="card_number" type="number" className="form-control form-control-lg" id="card_number"/>
                            }
                            {!props.card.last4 && 
                            <input required={true} value={cardNum} onChange={onChangeCardNum} placeholder={"**** **** **** ****"} name="card_number" type="number" className="form-control form-control-lg" id="card_number"/>
                            }
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="fname" className="col-sm-2 col-form-label col-form-label-md">Expiry:</label>
                        <div className="expiry col-7">
                            <div className="month col-3">
                                <input required={true} placeholder="mm" onChange={onChange} value={props.card.exp_month} name="exp_month" type="number" className="form-control form-control-lg" id="month"/>
                            </div>
                            <p> / </p>
                            <div className="year">
                                <input required={true} placeholder="yyyy" onChange={onChange} value={props.card.exp_year} name="exp_year" type="number" className="form-control form-control-lg" id="year"/>
                            </div>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="cvc" className="col-sm-2 col-form-label col-form-label-md">CVC: </label>
                        <div className="col-1">
                        <input required={true} placeholder="***" value={cvc} onChange={onChangeCVC} name="cvc" type="number" className="form-control form-control-lg" id="cvc"/>
                        </div>
                    </div>

                    <div className="col-auto my-1">
                        <button type="submit" className="btn btn-lg btn-primary">Save</button>
                    </div>

                </form>

        </div>
    )
}

export default CardInfo