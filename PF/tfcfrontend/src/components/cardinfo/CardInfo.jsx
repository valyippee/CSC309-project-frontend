import React from 'react'
import './CardInfo.css'

function CardInfo() {

    return (
        <div className="card-info-container">
            <h2 className="card-h2">Current Card: </h2>
            <form className="text-center">
                    <div className="form-group row">
                        <label htmlFor="email" className="col-sm-2 col-form-label col-form-label-md">Card Number: </label>
                        <div className="col-3">
                        <input required={true} name="card_number" type="text" className="form-control form-control-lg" id="email"/>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="fname" className="col-sm-2 col-form-label col-form-label-md">Expiry:</label>
                        <div className="expiry col-2">
                            <div className="month">
                                <input required={true} name="month" type="number" className="form-control form-control-lg" id="month"/>
                            </div>
                            <p> / </p>
                            <div className="year">
                                <input required={true} name="year" type="number" className="form-control form-control-lg" id="year"/>
                            </div>
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