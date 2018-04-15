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
import Tooltip from 'material-ui/Tooltip'
import InfoIcon from 'material-ui-icons/Info'
import EditIcon from 'material-ui-icons/Edit'

import { getRoutePath } from '../../../routes'
import { retrieveDeployment, undeployDeployment } from '../../../actions/action_deployment'
import { showSuccess } from '../../../actions/action_notification'
import { shortenUrl } from '../../../helpers/helper_shorten_url'
import ConfirmDialog from '../../ui/components/ConfirmDialog/ConfirmDialog'
import DeploymentLogDrawer from '../components/DeploymentLogDrawer'
import DeploymentFormDrawer from '../components/DeploymentFormDrawer'
import { DEPLOYMENT, MOMENT_DATE_TIME_FORMAT, DRAWER } from '../../../constants'
import './DeploymentShow.css'
import novnc from '../../../images/novnc.png'

class DeploymentShow extends Component {

  constructor(props) {
    super(props)
    this.state = {
      undeployDialog: {
        open: false
      },
      deploymentLogDrawer: {
        open: false
      },
      apiError: {},
      deploymentFormDrawer: {
        open: false
      },
    }
  }

  openUndeployDialog = () => {
    this.setState({
      undeployDialog: {
        open: true
      }
    })
  }

  closeUndeployDialog = () => {
    this.setState({
      undeployDialog: {
        open: false
      }
    })
  }

  confirmUndeployDeployment = () => {
    const { undeployDeployment, deployment, showSuccess, history} = this.props
    undeployDeployment(deployment.id)
      .then(() => {
        showSuccess("Added to undeploy queue")
        history.push(getRoutePath('dashboard'))
      })
      .catch(_.noop)
  }

  openEditDeploymentDialog = () => {
    this.setState({
      deploymentFormDrawer: {
        open: true
      }
    })
  }

  closeEditDeploymentDialog = () => {
    this.setState({
      deploymentFormDrawer: {
        open: false
      }
    })
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
    this.props.retrieveDeployment(this.props.match.params.id, true)
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
    const { deployment, templates } = this.props
    const { undeployDialog, deploymentLogDrawer, apiError, deploymentFormDrawer } = this.state

    if(!deployment && _.isEmpty(apiError)) {
      return (
        <div className="show progress-box">
          <CircularProgress className="circular-progress" size={50} />
        </div>
      )
    }

    if(!_.isEmpty(apiError)) {
      return (
        <div className="show">
          <div>
            <Typography align="center" variant="headline" className="status-code">
              { apiError.status }
            </Typography>
            <Typography align="center" variant="subheading">
              { apiError.message }
            </Typography>
          </div>
          {
            this.renderBackDashboardButton()
          }
        </div>
      )
    }

    const templateId = _.get(deployment, 'template_id', 0)
    const template = _.get(templates, `${templateId}`, {})
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
                <Button className="btn color-white" variant="raised" onClick={ this.openEditDeploymentDialog }>
                  <EditIcon className="left-icon" /> Edit
                </Button>
                <Button className="btn color-white" variant="raised" onClick={ this.openUndeployDialog }>
                  <UndeployIcon className="left-icon" /> Undeploy
                </Button>
              </div>
            </AppBar>
            <header className="basic-info">
              <div className="deployment-size">
                <strong>Deployment size:</strong> { _.get(template, 'name', '') }
                { !_.isEmpty(template) && 
                  <Tooltip 
                    placement="right"
                    title={ 
                      <span>
                        Cores: {template.cores}<br />
                        Memory: {template.memory} GB
                      </span> 
                    }
                  >
                    <InfoIcon className="info-icon" />
                  </Tooltip>
                }
              </div>
              <Typography className="status-show-wrapper">
                <span className={ `${deployment.status} status` }>Status: { _.replace(deployment.status, '_', ' ') }</span>
              </Typography>
              <Typography variant="body1" className="undeploy-time-wrapper">
                <strong>Undeploy time:</strong> <span>{ 
                  moment.utc(deployment.modified)
                    .add(deployment.days_duration, 'days')
                    .local()
                    .format(MOMENT_DATE_TIME_FORMAT)
                  }</span>
              </Typography>
              <div variant="body1" className="data-url-wrapper">
                <Tooltip title={ deployment.data_url }>
                  <span><strong>Data url:</strong> { deployment.data_url ? shortenUrl(deployment.data_url) : 'none' }</span>
                </Tooltip>  
              </div>
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
        <DeploymentFormDrawer
          open={ deploymentFormDrawer.open }
          handleRequestClose={ this.closeEditDeploymentDialog }
          deployment={ deployment }
          method={ DRAWER.METHOD.EDIT }
        />
        <ConfirmDialog 
          open={ undeployDialog.open }
          action="undeploy"
          type="UNDEPLOY"
          what="deployment"
          item={ deployment.name }
          handleRequestConfirm={ this.confirmUndeployDeployment }
          handleRequestClose={ this.closeUndeployDialog }
        />
      </Grid>
    )
  }

}

DeploymentShow.propTypes = {
  deployment: PropTypes.object,
  retrieveDeployment: PropTypes.func.isRequired,
  undeployDeployment: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired
}

function mapStateToProps({ deployments, templates }, ownProps) {
  return { 
    deployment: _.find(deployments.running.data, { id: _.toInteger(ownProps.match.params.id) }),
    templates
  }
}

export default connect(mapStateToProps, { retrieveDeployment, undeployDeployment, showSuccess })(DeploymentShow)

