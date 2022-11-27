import React from 'react'
import './Title.css'

// The title of the page

function Title(props) {
  return (
    <div className="title-container">
        <h1>{props.title}</h1>
    </div>
  )
}

export default Title