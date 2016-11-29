import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { get } from './github'
import './Sidebar.css'
import Retryer from './Retryer'

import CircularProgress from 'material-ui/CircularProgress';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

import { fetchProps, promiseFetcher, stop, reset } from './fetch-actions'

const fetcher = promiseFetcher('members', props => get(`orgs/${props.orgParam}/members`))

let SelectableList = makeSelectable(List)

export class Sidebar extends Component {

  load(props) {
    const members = props.members
    const org = props.org

    if (stop(props)) return

    const change = (org && org.login) !== props.orgParam

    if (!members || change) {
      fetcher(props)
    }
  }

  componentDidMount() {
    console.log('SIDEBAR MOUNT', this.props)
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    console.log('SIDEBAR RECEIVE', nextProps)
    this.load(nextProps)
  }

  onClick(member) {
    this.props.dispatch(reset(`user`))
  }

  onChange(event, value) {
    this.props.dispatch(reset(`user`))
  }

  render() {
    const members = this.props.members
    const org = this.props.org
    const { loading, error } = this.props

    return (
      <div className="Sidebar">
        <SelectableList
          value={this.props.login}
          onChange={this.onChange.bind(this)}
        >
          <Subheader>Members</Subheader>
            {
              loading ? (
                <CircularProgress />
              ) : (
              error ? (
                <Retryer retry={() => fetcher(this.props)} />
              ) : (
              members ? (
                members.map(member => {
                  const container = (
                    org
                    ? <Link to={`/org/${org.login}/member/${member.login}`} />
                    : null
                  )
                  return <ListItem
                    key={member.login}
                    value={member.login}
                    primaryText={member.login}
                    leftAvatar={<Avatar src={member.avatar_url} />}
                    containerElement={container}
                    onClick={this.onClick.bind(this, member)}
                  />
                })
              ) : null
            ))
          }
        </SelectableList>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    members: state.github && state.github.members,
    org: state.github && state.github.org,
    ...fetchProps('members', state.github)
  }
}

export default connect(mapStateToProps)(Sidebar)
