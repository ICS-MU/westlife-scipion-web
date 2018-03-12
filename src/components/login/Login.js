import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import Input from 'material-ui-icons/Input'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import './Login.css'
import logo from '../../images/west-life_logo.png'
import { BASE_API_URL } from '../../api'
import { login } from '../../actions/action_authenticated_user'
import { showSuccess } from '../../actions/action_notification'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loginTab: null
    }

    this.closeLoginTab = this.closeLoginTab.bind(this)
    this.tokenReceive = this.tokenReceive.bind(this)
  }

  componentDidMount() {
    window.addEventListener('storage', this.tokenReceive)
  }

  componentWillUnmount(){
    window.removeEventListener('storage', this.tokenReceive)
  }

  tokenReceive(evt) {
    if(evt.key !== 'token') 
      return

    const { login, showSuccess } = this.props
    const token = JSON.parse(evt.newValue)
    this.closeLoginTab()
    login(token)
      .then(() => {
        showSuccess('Successfuly logged in')
      })
  }

  openLoginTab() {
    const loginTab = window.open( `${BASE_API_URL}/authenticate`)
    this.setState({ loginTab })
  }

  closeLoginTab() {
    const { loginTab } = this.state
    loginTab.close()
    this.setState({ loginTab: null })
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
              <Button variant="raised" color="primary" onClick={ this.openLoginTab.bind(this) }>
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

export default connect(null, { login, showSuccess })(Login)
