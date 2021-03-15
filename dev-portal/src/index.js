// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import { ThemeProvider } from '@material-ui/core/styles'
import TagManager from 'react-gtm-module'
import ReactGA from 'react-ga'

const tagManagerArgs = {
  gtmId: 'GTM-5V2VJ6C',
}
TagManager.initialize(tagManagerArgs)
ReactGA.initialize('UA-69135965-2')
ReactGA.pageview(window.location.pathname + window.location.search)

import * as queryString from 'query-string'

// content-fragments
import { loadFragments } from 'services/get-fragments'

// semantic-ui
import 'semantic-ui-css/semantic.css'

// pages
import Home from 'pages/Home'
import GettingStarted from 'pages/GettingStarted'
import Dashboard from 'pages/Dashboard'
import Apis from 'pages/Apis'
import Farser from './components/Apps/Farser/Farser'
import Mirage from './components/Apps/Mirage/Mirage'
import Juxtapose from './components/Apps/Juxtapose/Juxtapose'
import Rosetta from './components/Apps/Rosetta/Rosetta'
import Privacy from './components/Privacy'
import Terms from './components/Terms'
import Hipaa from './components/Hipaa'
import Contact from './components/Contact'
import { Admin } from 'pages/Admin'

// components
import AlertPopup from 'components/AlertPopup'
import GlobalModal from 'components/Modal'
import NavBar from 'components/NavBar'
import Feedback from './components/Feedback'
import ApiSearch from './components/ApiSearch'

import { isAdmin, isRegistered, init, login, logout } from 'services/self'
import theme from './utils/theme'
import './index.css'

loadFragments()

// TODO: Feedback should be enabled if
// the following is true && the current
// user is not an administrator
const feedbackEnabled = window && window.config && window.config.feedbackEnabled

export const RegisteredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isRegistered() ? <Component {...props} /> : <Redirect to='/' />
    }
  />
)

export const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAdmin() ? <Component {...props} /> : <Redirect to='/' />
    }
  />
)

// To shut up a dev warning
const HomeWrap = (props) => (<Home {...props} />)
const GettingStartedWrap = (props) => <GettingStarted {...props} />
const DashboardWrap = (props) => <Dashboard {...props} />
const FarserWrap = (props) => (<Farser {...props} />)
const MirageWrap = (props) => (<Mirage {...props} />)
const RosettaWrap = (props) => (<Rosetta {...props} />)
const JuxtaposeWrap = (props) => (<Juxtapose {...props} />)
const ApisWrap = (props) => (<Apis {...props} />)
class App extends React.Component {
  constructor () {
    super()
    init()

    // We are using an S3 redirect rule to prefix the url path with #!
    // This then converts it back to a URL path for React routing
    if (window.location.hash && window.location.hash[1] === '!') {
      const hashRoute = window.location.hash.substring(2)
      window.history.pushState({}, 'home page', hashRoute)
    }
  }

  render () {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CookiesProvider>
          <BrowserRouter>
            <>
              <NavBar />

              <GlobalModal />
              <Switch>
                <Route exact path='/' component={HomeWrap} />
                <Route
                  exact
                  path='/index.html'
                  component={() => {
                    const { action } = queryString.parse(window.location.search)
                    if (action === 'login') {
                      login()
                    } else if (action === 'logout') {
                      logout()
                    }
                    return <Redirect to='/' />
                  }}
                />
                <Route path='/getting-started' component={GettingStartedWrap} />
                <Route path='/contact' component={Contact} />
                <Route path='/terms' component={Terms} />
                <Route path='/privacy' component={Privacy} />
                <Route path='/hipaa' component={Hipaa} />
                <Route path='/farser' component={FarserWrap} />
                <Route path='/mirage' component={MirageWrap} />
                <Route path='/juxtapose' component={JuxtaposeWrap} />
                <Route path='/rosetta' component={RosettaWrap} />
                <RegisteredRoute path='/dashboard' component={DashboardWrap} />
                <AdminRoute path='/admin' component={Admin} />
                <Route exact path='/apis' component={ApisWrap} />
                <Route exact path='/apis/search' component={ApiSearch} />
                <Route exact path='/apis/:apiId' component={Apis} />
                <Route path='/apis/:apiId/:stage' component={Apis} />
                <Route
                  path='/login'
                  render={() => {
                    login()
                    return <Redirect to='/' />
                  }}
                />
                <Route
                  path='/logout'
                  render={() => {
                    logout()
                    return <Redirect to='/' />
                  }}
                />
                <Route component={() => <h2>Page not found</h2>} />
              </Switch>
              {feedbackEnabled && <Feedback />}
              <AlertPopup />
            </>
          </BrowserRouter>
        </CookiesProvider>
      </ThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
