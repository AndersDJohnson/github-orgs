import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default (props) => {
  return (
    <ReactCSSTransitionGroup
      transitionName="fade"
      transitionEnterTimeout={1000}
      transitionLeaveTimeout={1000}
      transitionAppearTimeout={1000}
      transitionAppear={true}
    >
      {props.children}
    </ReactCSSTransitionGroup>
  )
}
