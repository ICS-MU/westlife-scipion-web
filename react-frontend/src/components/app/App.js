import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Snackbar from 'material-ui/Snackbar'
import ErrorIcon from 'material-ui-icons/Error'
import CheckCircle from 'material-ui-icons/CheckCircle'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'

import { hideSuccess, hideError } from '../../actions/action_notification'
import { getRoutePath } from '../../routes'
import { userIsAuthenticatedRedir, userIsNotAuthenticatedRedir } from '../../auth'
//import Login from '../login/LoginDev'
import Login from '../login/Login'
import AuthenticatedLayout from '../ui/AuthenticatedLayout'
import './App.css'

const LoginSection = userIsNotAuthenticatedRedir(Login)
const AuthenticatedSection = userIsAuthenticatedRedir(AuthenticatedLayout)

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#71caff',
      main: '#3399d5',
      dark: '#006ba3',
      contrastText: '#fff',
    },
    secondary: {
      light: '#5be5da',
      main: '#00b2a9',
      dark: '#00827a',
      contrastText: '#fff',
    },
    text: {
      primary: '#54585a'
    }
  }
})

const SnackbarText = (props) => {
  return (
    <span>{ props.children }</span>
  )
}


const App = (props) => {
  const { notifications } = props

  function hideSuccessSnackbar() {
    const { hideSuccess } = props
    hideSuccess()
  }

  function hideErrorSnackbar() {
    const { hideError } = props
    hideError()
  }

  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            <Route path={ getRoutePath('login') } component={ LoginSection } />
            <Route path={ getRoutePath('dashboard') } component={ AuthenticatedSection } />
          </Switch>
          <Snackbar
            className="snackbar"
            anchorOrigin={ { vertical: 'bottom', horizontal: 'right' } }
            open={ notifications.errorMsg ? true : false }
            message={ notifications.errorMsg ? [ 
              <ErrorIcon key={ 0 } className="red" />, 
              <SnackbarText key={ 1 }>{ notifications.errorMsg }</SnackbarText>
              ] : '' 
            }
            autoHideDuration={ 3000 }
            onClose={ hideErrorSnackbar }
          />
          <Snackbar
            className="snackbar"
            anchorOrigin={ {vertical: 'top', horizontal: 'right'} }
            open={ notifications.successMsg ? true : false }
            autoHideDuration={4500}
            message={ notifications.successMsg ? [ 
              <CheckCircle key={0} className="green" />, 
              <SnackbarText key={1}>{ notifications.successMsg }</SnackbarText> 
              ] : '' 
            }
            onClose={ hideSuccessSnackbar }
            action={
              notifications.successPath &&
                <Link to={ notifications.successPath } className="link">
                  View <KeyboardArrowRight />
                </Link>
            }
          />
        </div>
      </MuiThemeProvider>
    </BrowserRouter>
  )
}

App.propTypes = {
  notifications: PropTypes.object.isRequired,
  hideError: PropTypes.func.isRequired,
  hideSuccess: PropTypes.func.isRequired
}

function mapStateToProps({ notifications }) {
  return { notifications }
}

export default connect(mapStateToProps, { hideError, hideSuccess })(App)
