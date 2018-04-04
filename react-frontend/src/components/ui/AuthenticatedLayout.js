import React, { Component } from 'react'
import Grid from 'material-ui/Grid'

import HeaderContainer from './components/HeaderContainer/HeaderContainer'
import AuthenticatedRoutesSwitch from './AuthenticatedRoutesSwitch'
import './AuthenticatedLayout.css'

class AuthenticatedLayout extends Component {
  
  render() {

    return (
      <div className="authenticated-layout">
        <HeaderContainer />
        <div className="wrapper">
          <Grid container spacing={ 24 }>
            <AuthenticatedRoutesSwitch />
          </Grid>
        </div>
      </div>
    )
  }

}

export default AuthenticatedLayout