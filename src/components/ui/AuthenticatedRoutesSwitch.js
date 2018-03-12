import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Grid from 'material-ui/Grid'

import { getRoutePath } from '../../routes'
import Dashboard from '../dashboard/Dashboard'
import DeploymentShow from '../deployment/pages/DeploymentShow'

const AuthenticatedRoutesSwitch = () => {    
  return (
    <Grid item xs={12}>
      <Switch>
        <Route path={ getRoutePath('deployment.show') } component={ DeploymentShow } />
        <Route exact path={ getRoutePath('dashboard') } component={ Dashboard } />
      </Switch>
    </Grid>
  )
}

export default AuthenticatedRoutesSwitch