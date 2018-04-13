import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import { CircularProgress } from 'material-ui/Progress'
import UndeployIcon from 'material-ui-icons/Close'
import DescriptionIcon from 'material-ui-icons/Description'

import { getRoutePath } from '../../../routes'
import { retrieveDeployment } from '../../../actions/action_deployment'
import ConfirmDialog from '../../ui/components/ConfirmDialog/ConfirmDialog'
import DeploymentLogDrawer from '../components/DeploymentLogDrawer'
import { DEPLOYMENT } from '../../../constants'
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
      },
      apiError: {}
    }
  }

  openDeleteDialog = (deployment) => {
    this.setState({
      deleteDialog: {
        open: true
      }
    })
  }

  closeDeleteDialog = () => {
    this.setState({
      deleteDialog: {
        open: false
      }
    })
  }

  deleteDeployment = () => {
    this.closeDeleteDialog()
  }

  deploymentLogDrawerClose = () => {
    this.setState({
      deploymentLogDrawer: {
        open: false
      }
    })
  }

  deploymentLogDrawerOpen = () => {
    this.setState({
      deploymentLogDrawer: {
        open: true
      }
    })
  }

  transitionTo = (path) => () => {
    this.props.history.push(getRoutePath(path))
  }

  renderBackDashboardButton = () => {
    return (
      <Typography align="center" className="back-button-wrapper">
        <Button 
          color="primary" 
          variant="raised"
          onClick={ this.transitionTo('dashboard') }
        >
          Back to dashboard
        </Button>
      </Typography>
    )
  }

  componentDidMount() {
    this.props.retrieveDeployment(this.props.match.params.id)
      .catch((error) => {
        const status = _.get(error, 'response.status', 'Ups')
        const message = _.get(error, 'response.data.message', 'Something went wrong')

        this.setState({
          apiError: {
            status,
            message
          }
        })
      })
  }

  render() {
    const { deployment, error } = this.props
    const { deleteDialog, deploymentLogDrawer, apiError } = this.state

    if(!deployment && !error && _.isEmpty(apiError)) {
      return (
        <div className="show">
          <CircularProgress className="circular-progress" size={50} />
        </div>
      )
    }

    if(error || !_.isEmpty(apiError)) {
      return (
        <div className="show">
          { error && 
            <Typography align="center" variant="subheading">
              { error }
            </Typography>
          }
          { !_.isEmpty(apiError) &&
            <div>
              <Typography align="center" variant="headline" className="status-code">
                { apiError.status }
              </Typography>
              <Typography align="center" variant="subheading">
                { apiError.message }
              </Typography>
            </div>
          }
          {
            this.renderBackDashboardButton()
          }
        </div>
      )
    }

    return (
      <Grid item xs={ 12 } className="show">
        <div>
          <Paper className="bottom-padding">
            <AppBar position="static" className="show-appbar">
              <Typography variant="title" className="show-title">
                { deployment.name }
              </Typography>
              <div className="button-area">
                <Button className="btn color-white" variant="raised" onClick={ this.deploymentLogDrawerOpen }>
                  <DescriptionIcon className="left-icon" /> Log
                </Button>
                <Button className="btn color-white" variant="raised" onClick={ this.openDeleteDialog }>
                  <UndeployIcon className="left-icon" /> Undeploy
                </Button>
              </div>
            </AppBar>
            <header className="basic-info">
              <span>Deployment size: { deployment.size }</span>
              <span className={ `${deployment.status} status` }>Status: { _.replace(deployment.status, '_', ' ') }</span>
              <span>Estimated time: { 
                moment().diff(moment(deployment.created).add(deployment.duration_time, 'hour'), 'hour')
              } hours</span>
            </header>
            { deployment.status === DEPLOYMENT.STATUS.DEPLOYED && 
              <img src={ novnc } className="image" alt="novnc dummy img" />
            }
            { deployment.status !== DEPLOYMENT.STATUS.DEPLOYED &&
              <div className="deployment-not-ready">
                <Typography align="center" variant="subheading">
                  Your deployment is not ready yet. Please, come back later.
                </Typography>
                {
                  this.renderBackDashboardButton()
                }
              </div>
            }
          </Paper>
        </div>
        <DeploymentLogDrawer
          open={ deploymentLogDrawer.open }
          handleRequestClose={ this.deploymentLogDrawerClose }
          deployment={ deployment }
        />
        <ConfirmDialog 
          open={ deleteDialog.open }
          action="delete"
          type="DELETE"
          what="deployment"
          item={ deployment.name }
          handleRequestClose={ this.deleteDeployment }
          handleRequestConfirm={ this.closeDeleteDialog }
        />
      </Grid>
    )
  }

}

DeploymentShow.propTypes = {
  deployment: PropTypes.object,
  retrieveDeployment: PropTypes.func.isRequired
}

function mapStateToProps({ deployments }, ownProps) {
  return { 
    deployment: _.find(deployments.running.data, { id: _.toInteger(ownProps.match.params.id) }),
    error: deployments.running.error 
  }
}

export default connect(mapStateToProps, { retrieveDeployment })(DeploymentShow)

