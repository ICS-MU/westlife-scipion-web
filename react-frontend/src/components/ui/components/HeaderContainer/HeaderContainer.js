import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import ExitToAppIcon from 'material-ui-icons/ExitToApp'
import Button from 'material-ui/Button'
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft'
import LoadingBar from 'react-redux-loading-bar'

import { getRoutePrevious, getRoutePath } from '../../../../routes'
import { logout } from '../../../../actions/action_authenticated_user'
import './HeaderContainer.css'
import logo from '../../../../images/west-life_logo.png'


class HeaderContainer extends Component {
  /*
   * Logouts the user
   */
  logout = () => {
    this.props.logout()
  }

  /*
   * Renders the navigation menu (back button if we are on subpage)
   */
  renderNav = () => {
    const previous = getRoutePrevious(this.props.location.pathname)
    if(previous) {
      return (
        <div className="left-part">
          <Link to={ getRoutePath(previous) } className="back-icon"><KeyboardArrowLeftIcon /></Link>
          <img src={ logo } alt="Logo" className="logo" />
        </div>
      )
    }
    return (
      <img src={ logo } alt="Logo" className="logo" />
    )
  }

  render() {
    const { authenticatedUser } = this.props

    return (
      <AppBar className="header-container">
        <div className="white-header">
          <LoadingBar />
          <div className="header-wrapper">
            { this.renderNav() }
            <div className="button-area">
              <Button className="btn color-grey" variant="raised" onClick={ this.logout }>
                Logout <ExitToAppIcon className="right-icon" />
              </Button>
            </div>
            <div className="user-name">Welcome, <strong>{ authenticatedUser.name }</strong></div>
          </div>
        </div>
      </AppBar>
    )
  }

}

HeaderContainer.propTypes = {
  authenticatedUser: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
      authenticatedUser: state.authenticatedUser.data
  }
}

export default withRouter(connect(mapStateToProps, { logout })(HeaderContainer))