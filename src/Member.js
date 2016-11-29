import React, { Component } from 'react';
import { connect } from 'react-redux'
import { get } from './github'
import dateFormat from './dateFormat'
import './Member.css'
import Fade from './Fade'
import Retryer from './Retryer'
import Repositories from './Repositories'
import Organizations from './Organizations'

import FontAwesome from 'react-fontawesome'
import CircularProgress from 'material-ui/CircularProgress';

import { fetchProps, promiseFetcher, stop } from './fetch-actions'

const fetcher = promiseFetcher(
  'user',
  props => get(`users/${props.params.login}`)
)

export class Member extends Component {

  load(props) {
    const user = props.user
    const login = props.params.login

    if (stop(props)) return

    const change = (user && user.login) !== login

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
    const user = this.props.user
    const login = this.props.params.login
    const { loading, error } = this.props

    return (
          <div className="Member">
            {
              loading ? (
                  <CircularProgress />
              ) : (
              error ? (
                <Retryer retry={() => fetcher(this.props)} />
              ) : (
              user ? (
                <Fade>
                  <div>
                    <div className="clearfix">
                      <div className="Member-image">
                          <img src={user.avatar_url} width="100" role="presentation" />
                      </div>
                      <div className="Member-detail">
                          <h2>
                              {user.login}
                              {' '}
                              ({user.name})
                              {' '}
                              <a href={user.html_url}>
                                <FontAwesome name='github' />
                              </a>
                          </h2>
                          { user.email ? (
                            <div>
                                <strong>Email:</strong> <a href={`mailto:${user.email}`}>{user.email}</a>
                            </div>
                          ) : null }
                          { user.location ? (
                            <div>
                                <strong>Location:</strong> {user.location}
                            </div>
                          ) : null }
                          { user.created_at ? (
                            <div>
                                <strong>Joined:</strong> {dateFormat(user.created_at)}
                            </div>
                          ) : null }
                      </div>
                    </div>
                    <div>
                      <Repositories login={login} />
                      <Organizations login={login} />
                    </div>
                  </div>
                </Fade>
              ) : null
            ))
            }
          </div>
        )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.github && state.github.user,
    ...fetchProps(`user`, state.github)
  }
}

export default connect(mapStateToProps)(Member)
