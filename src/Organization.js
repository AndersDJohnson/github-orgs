import React, { PropTypes } from 'react';
import dateFormat from './dateFormat'
import Sidebar from './Sidebar'
import Fade from './Fade'
import Retryer from './Retryer'

import './Organization.css'

import FontAwesome from 'react-fontawesome'
import CircularProgress from 'material-ui/CircularProgress';

const Organization = props => {

  const org = props.org
  const { loading, error } = props

  return (
    <div className="Organization clearfix">
      {
        loading ? (
          <CircularProgress />
        ) : (
        error ? (
          <Retryer retry={props.onRetry} />
        ) : (
          org ? (
            <Fade>
              <div key="Organization">
                <div className="Organization-header clearfix">
                  <div className="Organization-image">
                    <img src={org.avatar_url} role="presentation" width="100" />
                  </div>
                  <div className="Organization-detail">
                    <h1>
                      {org.name}
                      {' '}
                      <a href={org.html_url}>
                        <FontAwesome name='github' />
                      </a>
                    </h1>
                    <div>
                      { org.location ? (
                        <div>
                          <strong>Location:</strong> {org.location}
                        </div>
                      ) : null }
                      { org.created_at ? (
                        <div>
                          <strong>Created:</strong> {dateFormat(org.created_at)}
                        </div>
                      ) : null }
                    </div>
                  </div>
                </div>
                <Sidebar login={props.params.login} orgParam={props.params.org} />
                { props.children ? (
                  props.children
                ) : (
                  <div>Pick a member.</div>
                )}
              </div>
            </Fade>
          ) : null
        ))
      }
    </div>
  )
}

Organization.propTypes = {
  org: PropTypes.object,
  onRetry: PropTypes.func.isRequired,
  error: PropTypes.any,
  loading: PropTypes.any,
  params: PropTypes.object.isRequired
}

export default Organization
