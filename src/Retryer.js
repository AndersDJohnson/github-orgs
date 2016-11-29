import React from 'react'

export default function Retryer (props) {
  return (
    <div>
      Error
      {' '}
      <button onClick={props.retry}>
        Retry
      </button>
    </div>
  )
}
