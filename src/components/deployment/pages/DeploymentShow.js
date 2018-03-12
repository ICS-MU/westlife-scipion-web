import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import DeleteIcon from 'material-ui-icons/DeleteForever'
import DescriptionIcon from 'material-ui-icons/Description'
import _ from 'lodash'
import moment from 'moment'
import ConfirmDialog from '../../ui/components/ConfirmDialog/ConfirmDialog'
import DeploymentLogDrawer from '../components/DeploymentLogDrawer'

import './DeploymentShow.css'
import novnc from '../../../images/novnc.png'

class DeploymentShow extends Component {

  constructor(props) {
    super(props)
    this.state = {
      deleteDialog: {
        open: false
      },
      deploymentLogDrawer: {
        open: false
      }
    }

    this.openDeleteDialog = this.openDeleteDialog.bind(this)
    this.deploymentLogDrawerOpen = this.deploymentLogDrawerOpen.bind(this)
  }

  openDeleteDialog(deployment) {
    this.setState({
      deleteDialog: {
        open: true
      }
    })
  }

  closeDeleteDialog() {
    this.setState({
      deleteDialog: {
        open: false
      }
    })
  }

  deleteDeployment() {
    this.closeDeleteDialog()
  }

  deploymentLogDrawerClose() {
    this.setState({
      deploymentLogDrawer: {
        open: false
      }
    })
  }

  deploymentLogDrawerOpen() {
    this.setState({
      deploymentLogDrawer: {
        open: true
      }
    })
  }

  render() {
    const { deployment } = this.props
    const { deleteDialog, deploymentLogDrawer } = this.state

    return (
      <Grid item xs={12} className="show">
        <div>
          <Paper className="bottom-padding">
            <AppBar position="static" className="show-appbar">
              <Typography variant="title" className="show-title">
                { deployment.name }
              </Typography>
              <div className="button-area">
                <Button className="btn color-white" variant="raised" onClick={ () => this.deploymentLogDrawerOpen() }>
                  <DescriptionIcon className="left-icon" /> Log
                </Button>
                <Button className="btn color-white" variant="raised" onClick={ () => this.openDeleteDialog() }>
                  <DeleteIcon className="left-icon" /> Delete
                </Button>
              </div>
            </AppBar>
            <header className="basic-info">
              <span>VM size: { deployment.size }</span>
              <span className={ deployment.state }>State: { deployment.state }</span>
              <span>Estimated time: { 
                moment().diff(moment(deployment.created).add(deployment.duration_time, 'hour'), 'hour')
              } hours</span>
            </header>
            <img src={ novnc } className="image" alt="novnc dummy img" />
          </Paper>
        </div>
        <DeploymentLogDrawer
          open={ deploymentLogDrawer.open }
          handleRequestClose={ this.deploymentLogDrawerClose.bind(this) }
          deployment={ deployment }
        />
        { deleteDialog.open && 
          <ConfirmDialog 
            open={ deleteDialog.open }
            action="delete"
            type="DELETE"
            what="deployment"
            item={ deployment.name }
            handleRequestClose={ this.deleteDeployment.bind(this) }
            handleRequestConfirm={ this.closeDeleteDialog.bind(this) }
          />
        }
      </Grid>
    )
  }

}

DeploymentShow.propTypes = {
  // here will be fetch functions
  deployment: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
  const id = _.toInteger(ownProps.match.params.id)
  return { 
    deployment: _.find(state.deployments.data.running, { id })
  }
}

export default connect(mapStateToProps)(DeploymentShow)
