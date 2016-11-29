import 'console-polyfill'
import 'babel-polyfill'

import './index.scss'
import './clearfix.css'
import 'normalize-css/normalize.css'
import 'font-awesome/css/font-awesome.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Member from './Member'
import OrganizationContainer from './OrganizationContainer'
import DevTools from './DevTools'

import configureStore from './configureStore'

import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Material UI
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store)

store.subscribe(function () {
  console.log('store', store.getState())
})


const Root = () => (
  <MuiThemeProvider>
      <Provider store={store}>
          <div>
            <Router history={history}>
                <Route path="/" component={App}>
                    <Route path="org/:org" component={OrganizationContainer}>
                        <Route path="member/:login" component={Member} />
                    </Route>
                </Route>
            </Router>
            <DevTools />
          </div>
      </Provider>
  </MuiThemeProvider>
)

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)
