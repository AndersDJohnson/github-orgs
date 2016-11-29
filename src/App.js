import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import TextField from 'material-ui/TextField';
// import RaisedButton from 'material-ui/RaisedButton';

export class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      org: this.props.org
    }
  }

  // TODO: Use redux for state
  onOrgChange(event, value) {
    console.log('onOrgChange', arguments)
    this.setState({
      org: value
    })
  }

  onOrgKeyUp(event) {
    console.log('onOrgEnter', event.charCode, event.keyCode, event, arguments)
    if (event.keyCode !== 13) return
    this.props.onOrgChange(this.state.org)
  }

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <h2>GitHub Organizations</h2>
          <TextField
            value={this.state.org}
            floatingLabelText="Organization"
            onChange={this.onOrgChange.bind(this)}
            onKeyUp={this.onOrgKeyUp.bind(this)}
            inputStyle={{
              color: 'white'
            }}
            floatingLabelStyle={{
              color: 'white'
            }}
            //floatingLabelFocusStyle={{
            //  color: 'red'
            //}}
          />
          {/*<RaisedButton label="Go"
            onClick=
          />*/}
        </div>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  org: React.PropTypes.string,
  onOrgChange: React.PropTypes.func.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    github: state.github,
    org: ownProps.params.org
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onOrgChange(org) {
      const path = `/org/${org}`
      dispatch(push(path))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
