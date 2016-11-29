import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux'
import { get } from './github'
import Retryer from './Retryer'

import CircularProgress from 'material-ui/CircularProgress';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import { fetchProps, promiseFetcher, stop } from './fetch-actions'

const fetcher = promiseFetcher(
  'orgs',
  props => get(`users/${props.login}/orgs`)
)

export class Organizations extends Component {

  load(props) {
    const user = props.user
    const orgs = props.orgs
    const login = props.login

    if (stop(props)) return

    const change = (user && user.login) !== login

    if (!orgs || change) {
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
    const orgs = this.props.orgs
    const { loading, error } = this.props

    return (
            <div className="Organizations">
                <h3>Organizations</h3>
                <List>
                    { loading ? (
                        <CircularProgress />
                    ) : (
                    error ? (
                      <Retryer retry={() => fetcher(this.props)} />
                    ) : (
                      orgs ?
                      orgs.map(org => {
                        return <ListItem
                            key={org.login}
                            primaryText={org.login}
                            secondaryText={org.description}
                            leftAvatar={<Avatar src={org.avatar_url} />}
                            linkButton={true}
                            href={`https://github.com/${org.login}`}
                          />
                      }) : null
                    ))
                  }
                </List>
            </div>
        )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.github && state.github.user,
    orgs: state.github && state.github.orgs,
    ...fetchProps(`orgs`, state.github)
  }
}

export default connect(mapStateToProps)(Organizations)
