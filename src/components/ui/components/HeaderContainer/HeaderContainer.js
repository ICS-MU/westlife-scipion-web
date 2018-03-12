import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { logout } from '../../../../actions/action_authenticated_user'
import AppBar from 'material-ui/AppBar'
import Menu, { MenuItem } from 'material-ui/Menu'
import ExitToAppIcon from 'material-ui-icons/ExitToApp'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft'
import { getRoutePrevious, getRoutePath } from '../../../../routes'

import './HeaderContainer.css'
import logo from '../../../../images/west-life_logo.png'


class HeaderContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moreMenu: {
        open: false,
        anchorEl: null
      }
    }

    this.moreMenuClose = this.moreMenuClose.bind(this)
  }

  logout() {
    this.props.logout()
  }

  moreMenuOpen(event) {
    this.setState({
      moreMenu: {
        open: true,
        anchorEl: event.currentTarget
      }
    })
  }

  moreMenuClose() {
    const { moreMenu } = this.state
    this.setState({
      moreMenu: {
        ...moreMenu,
        open: false
      }
    })
  }

  renderNav() {
    const { pathname } = this.props.location
    const previous = getRoutePrevious(pathname)
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
    const { userName } = this.props
    const { moreMenu } = this.state
    
    const moreMenuOptions = [
      { key: 'faq', title: 'Frequently asked questions' },
      { key: 'terms', title: 'Terms & Conditions' }
    ]

    return (
      <AppBar className="header-container">
        <div className="white-header">
          <div className="header-wrapper">
            { this.renderNav() }

            <div className="button-area">
              <Button className="btn color-grey" variant="raised" onClick={ () => this.logout() }>
                Logout <ExitToAppIcon className="right-icon" />
              </Button>
            </div>

            <div className="more-menu">
              <IconButton
                aria-label="More"
                aria-owns={ moreMenu.open ? 'more-menu' : null }
                aria-haspopup="true"
                onClick={ this.moreMenuOpen.bind(this) }
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="more-menu"
                anchorEl={ moreMenu.anchorEl }
                open={ moreMenu.open }
                onClose={ this.moreMenuClose }
              >
                { 
                  moreMenuOptions.map(option => (
                    <MenuItem key={ option.key } onClick={ this.moreMenuClose }>
                      { option.title }
                    </MenuItem>
                  )) 
                }
              </Menu>
            </div>

            <div className="user-name">Welcome, <strong>{ userName }</strong></div>

          </div>
        </div>
      </AppBar>
    )
  }

}

HeaderContainer.propTypes = {
  userName: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
      userName: state.authenticatedUser.data.name
      //userName: "John Doe"
  }
}

export default withRouter(connect(mapStateToProps, { logout })(HeaderContainer))