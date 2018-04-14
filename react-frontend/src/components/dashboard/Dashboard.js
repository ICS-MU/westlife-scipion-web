import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import Grid from 'material-ui/Grid'
import UndeployIcon from 'material-ui-icons/Close'
import ReplayIcon from 'material-ui-icons/Replay'
import AddIcon from 'material-ui-icons/Add'
import DescriptionIcon from 'material-ui-icons/Description'

import { listRunningDeployments } from '../../actions/action_deployment'
import { getRoutePath } from '../../routes'
import ConfirmDialog from '../ui/components/ConfirmDialog/ConfirmDialog'
import DeploymentFormDrawer from '../deployment/components/DeploymentFormDrawer'
import DeploymentLogDrawer from '../deployment/components/DeploymentLogDrawer'
import { MOMENT_DATE_TIME_FORMAT, DRAWER, DEPLOYMENT } from '../../constants'

import './Dashboard.css'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      undeployDialog: {
        open: false,
        item: null
      },
      deploymentFormDrawer: {
        open: false,
        item: null,
        method: ''
      },
      deploymentLogDrawer: {
        open: false,
        item: null
      }
    }
  }

  openUndeployDialog = (deployment) => (evt) => {
    evt.stopPropagation()
    this.setState({
      undeployDialog: {
        open: true,
        item: deployment
      }
    })
  }

  closeUndeployDialog = () => {
    this.setState({
      undeployDialog: {
        ...this.state.undeployDialog,
        open: false
      }
    })
  }

  undeployDeployment = () => {
    this.closeUndeployDialog()
  }

  deploymentFormDrawerClose = () => {
    this.setState({
      deploymentFormDrawer: {
        open: false,
        item: null,
        method: ''
      }
    })
  }

  deploymentFormDrawerOpen = (deployment = null) => (evt) => {
    evt.stopPropagation()
    const method = deployment ? DRAWER.METHOD.EDIT : DRAWER.METHOD.CREATE
    this.setState({
      deploymentFormDrawer: {
        open: true,
        item: deployment,
        method: method
      }
    })
  }

  deploymentLogDrawerClose = () => {
    this.setState({
      deploymentLogDrawer: {
        open: false,
        item: null
      }
    })
  }

  deploymentLogDrawerOpen = (deployment) => (evt) => {
    evt.stopPropagation()
    this.setState({
      deploymentLogDrawer: {
        open: true,
        item: deployment
      }
    })
  }

  showDeployment = (deployment) => () => {
    if(deployment.status === DEPLOYMENT.STATUS.DEPLOYED) {
      this.props.history.push(getRoutePath('deployment.show', { id: deployment.id }))
    }
  }

  componentDidMount() {
    this.props.listRunningDeployments()
      .catch(_.noop)
  }

  render() {
    const { deployments } = this.props
    const { undeployDialog, deploymentFormDrawer, deploymentLogDrawer } = this.state

    return (
      <Grid item xs={ 12 } className="list">
        { deployments.running.isFulfilled &&
          <div>
            <Paper>
              <AppBar position="static" className="list-appbar">
                <Typography variant="title" className="list-title">
                  Your running deployments
                </Typography>
                <div className="button-area">
                  <Button className="btn color-white" variant="raised" onClick={ this.deploymentFormDrawerOpen() }>
                    <AddIcon className="left-icon" /> Create new
                  </Button>
                </div>
              </AppBar>
              { !_.isEmpty(deployments.running.data) && 
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell className="align-right">Modified</TableCell>
                      <TableCell className="align-right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      _.map(deployments.running.data, (deployment) => (
                        <TableRow 
                          key={ deployment.id } 
                          className={ `${deployment.status === DEPLOYMENT.STATUS.DEPLOYED ? 'clickable' : 'not-allowed'}` } 
                          onClick={ this.showDeployment(deployment) }
                        >
                          <TableCell className="name">{ deployment.name }</TableCell>
                          <TableCell>{ deployment.days_duration } days</TableCell>
                          <TableCell><span className={ `${deployment.status} status` }>{ _.replace(deployment.status, '_', ' ') }</span></TableCell>
                          <TableCell className="align-right datetime">{ moment.utc(deployment.modified).local().format(MOMENT_DATE_TIME_FORMAT) }</TableCell>
                          <TableCell className="align-right">
                            <Tooltip title="View log" placement="bottom" disableTriggerFocus>
                              <span className="tooltip-button-wrapper">
                                <IconButton className="icon-button" onClick={ this.deploymentLogDrawerOpen(deployment) }>
                                  <DescriptionIcon className="color-secondary" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Undeploy" placement="bottom" disableTriggerFocus>
                              <span className="tooltip-button-wrapper">
                                <IconButton className="icon-button" onClick={ this.openUndeployDialog(deployment) }>
                                  <UndeployIcon className="color-red" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              }
              { _.isEmpty(deployments.running.data) && 
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan="4" className="no-rows">No running virtual machines</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              }
            </Paper>

            <Paper className="second-box">
              <AppBar position="static" className="list-appbar">
                <Typography variant="title" className="list-title">
                  Deployments history
                </Typography>
              </AppBar>
              { !_.isEmpty(deployments.past.data) && 
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Duration time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell className="align-right">Finished</TableCell>
                      <TableCell className="align-right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      _.map(deployments.past.data, (deployment) => (
                        <TableRow key={ deployment.id }>
                          <TableCell className="name">{ deployment.name }</TableCell>
                          <TableCell>{ deployment.days_duration } days</TableCell>
                          <TableCell><span className={ `${deployment.status} status` }>{ _.replace(deployment.status, '_', ' ') }</span></TableCell>
                          <TableCell className="align-right datetime">{ moment.utc(deployment.modified).local().format(MOMENT_DATE_TIME_FORMAT) }</TableCell>
                          <TableCell className="align-right">
                            <Tooltip title="View log" placement="bottom" disableTriggerFocus>
                              <span className="tooltip-button-wrapper">
                                <IconButton className="icon-button" onClick={ this.deploymentLogDrawerOpen(deployment) }>
                                  <DescriptionIcon className="color-secondary" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Re-deploy" placement="bottom" disableTriggerFocus>
                              <span className="tooltip-button-wrapper">
                                <IconButton className="icon-button" onClick={ this.deploymentFormDrawerOpen(deployment) }>
                                  <ReplayIcon className="color-primary" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              }
              { _.isEmpty(deployments.past.data) && 
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan="5" className="no-rows">No past projects yet</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              }
            </Paper>
            <DeploymentFormDrawer
              open={ deploymentFormDrawer.open }
              handleRequestClose={ this.deploymentFormDrawerClose }
              deployment={ deploymentFormDrawer.item }
              method={ deploymentFormDrawer.method }
            />
            <DeploymentLogDrawer
              open={ deploymentLogDrawer.open }
              handleRequestClose={ this.deploymentLogDrawerClose }
              deployment={ deploymentLogDrawer.item }
            />
            <ConfirmDialog 
              open={ undeployDialog.open }
              action="undeploy"
              type="UNDEPLOY"
              what="deployment"
              item={ undeployDialog.item ? undeployDialog.item.name : '' }
              handleRequestClose={ this.undeployDeployment }
              handleRequestConfirm={ this.closeUndeployDialog }
            />
          </div>
        }
      </Grid>
    )
  }
}

Dashboard.propTypes = {
  deployments: PropTypes.object.isRequired,
  listRunningDeployments: PropTypes.func.isRequired
}

function mapStateToProps({ deployments }) {
  return { deployments }
}

export default connect(mapStateToProps, { listRunningDeployments })(Dashboard)
