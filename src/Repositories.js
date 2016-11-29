import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux'
import { get } from './github'
import Retryer from './Retryer'

import CircularProgress from 'material-ui/CircularProgress';
import { List, ListItem } from 'material-ui/List';

import { fetchProps, promiseFetcher, stop } from './fetch-actions'

const fetcher = promiseFetcher(
  'repos',
  props => get(`users/${props.login}/repos`)
)

export class Repositories extends Component {

  load(props) {
    const user = props.user
    const repos = props.repos
    const login = props.login

    if (stop(props)) return

    const change = (user && user.login) !== login

    if (!repos || change) {
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
    const repos = this.props.repos
    const { loading, error } = this.props

    return (
            <div className="Repositories">
                <h3>Repositories</h3>
                <List>
                    { loading ? (
                        <CircularProgress />
                    ) : (
                    error ? (
                      <Retryer retry={() => fetcher(this.props)} />
                    ) : (
                      repos ?
                      repos.map(repo => {
                        return <ListItem
                            key={repo.name}
                            primaryText={repo.name}
                            secondaryText={repo.description}
                            linkButton={true}
                            href={repo.html_url}
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
    repos: state.github && state.github.repos,
    ...fetchProps(`repos`, state.github)
  }
}

export default connect(mapStateToProps)(Repositories)
