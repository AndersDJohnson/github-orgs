import React, { Component } from 'react';
import { connect } from 'react-redux'
import { get } from './github'
import { fetchProps, promiseFetcher, stop } from './fetch-actions'

import Organization from './Organization'

const fetcher = promiseFetcher('org', props => get(`orgs/${props.params.org}`))

export class OrganizationContainer extends Component {

  load(props) {
    const org = props.org

    if (stop(props)) return

    console.log('loading org', props.params.org, org)

    const change = (org && org.login) !== props.params.org

        // if (!org || change) {
    if (change) {
      fetcher(props)
    }
  }

  componentDidMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.load(nextProps)
  }

  render() {
    return <Organization {...this.props} />
  }
}

function mapStateToProps(state) {
  return {
    org: state.github && state.github.org,
    ...fetchProps('org', state.github)
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    dispatch,
    onRetry: () => fetcher({...ownProps, dispatch})
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationContainer)
