import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import Input from 'material-ui-icons/Input'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

import { loginDev } from '../../actions/action_authenticated_user'
import { showSuccess } from '../../actions/action_notification'
import './Login.css'
import logo from '../../images/west-life_logo.png'

class LoginDev extends Component {

  login = () => {
    const { loginDev, showSuccess } = this.props
    loginDev()
      .then(() => {
        showSuccess('Login successful')
      })
      .catch(_.noop)
  }

  render() {
    return (
      <div className="login-wrapper">
        <div className="login">
          <Paper className="paper" elevation={20}>
            <div className="logo">
              <img src={ logo } alt="Logo" />
            </div>
            <Typography variant="title" align="center" className="title">
              West-life Cloudify Scipion
            </Typography>
            <Typography variant="button" align="center">
              <Button variant="raised" color="primary" onClick={ this.login }>
                Login
                <Input className="login-icon" />
              </Button>
            </Typography>
          </Paper>
        </div>
      </div>
    )
  }
}

LoginDev.propTypes = {
  loginDev: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired
}

export default connect(null, { loginDev, showSuccess })(LoginDev)
