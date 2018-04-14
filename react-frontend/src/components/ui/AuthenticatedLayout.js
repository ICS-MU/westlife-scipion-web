import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Grid from 'material-ui/Grid'

import { listTemplates } from '../../actions/action_template'
import HeaderContainer from './components/HeaderContainer/HeaderContainer'
import AuthenticatedRoutesSwitch from './AuthenticatedRoutesSwitch'
import './AuthenticatedLayout.css'

class AuthenticatedLayout extends Component {

  componentDidMount() {
    this.props.listTemplates()
      .catch(_.noop)
  }
  
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

export default connect(null, { listTemplates })(AuthenticatedLayout)