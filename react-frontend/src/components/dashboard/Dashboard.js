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
import EditIcon from 'material-ui-icons/Edit'
import DescriptionIcon from 'material-ui-icons/Description'
import DeleteIcon from 'material-ui-icons/DeleteForever'
import SearchIcon from 'material-ui-icons/Search'
import { CircularProgress } from 'material-ui/Progress'
import Waypoint from 'react-waypoint'

import { listRunningDeployments, listPastDeployments, 
  undeployDeployment, deletePastDeployment } from '../../actions/action_deployment'
import { showSuccess } from '../../actions/action_notification'
import { getRoutePath } from '../../routes'
import ConfirmDialog from '../ui/components/ConfirmDialog/ConfirmDialog'
import DeploymentFormDrawer from '../deployment/components/DeploymentFormDrawer'
import DeploymentLogDrawer from '../deployment/components/DeploymentLogDrawer'
import { MOMENT_DATE_TIME_FORMAT, DRAWER, DEPLOYMENT, REFRESH_INTERVAL } from '../../constants'

import './Dashboard.css'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      undeployDialog: {
        open: false,
        item: null
      },
      deleteDialog: {
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
      },
      filter: {
        term: '',
        typingTimeout: 0
      },
      refreshInterval: null
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

  undeployDeploymentConfirm = () => {
    const { undeployDeployment, showSuccess } = this.props
    undeployDeployment(this.state.undeployDialog.item.id)
      .then(() => {
        showSuccess("Added to undeploy queue")
        this.closeUndeployDialog()
      })
      .catch(_.noop)
  }

  openDeleteDialog = (deployment) => (evt) => {
    evt.stopPropagation()
    this.setState({
      deleteDialog: {
        open: true,
        item: deployment
      }
    })
  }

  closeDeleteDialog = () => {
    this.setState({
      deleteDialog: {
        ...this.state.deleteDialog,
        open: false
      }
    })
  }

  deleteDeploymentConfirm = () => {
    const { deletePastDeployment, showSuccess } = this.props
    deletePastDeployment(this.state.deleteDialog.item.id)
      .then(() => {
        showSuccess("Deployment history item deleted")
        this.closeDeleteDialog()
      })
      .catch(_.noop)
  }

  deploymentFormDrawerClose = () => {
    this.setState({
      deploymentFormDrawer: {
        ...this.state.deploymentFormDrawer,
        open: false,
        method: ''
      }
    })
  }

  deploymentFormDrawerOpen = (method, deployment = null) => (evt) => {
    evt.stopPropagation()
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
        ...this.state.deploymentLogDrawer,
        open: false
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

  loadMorePastDeployments = () => {
    const { deployments, listPastDeployments } = this.props
    const offset = deployments.past.currentOffset, limit = DEPLOYMENT.LIST.LOADING_LIMIT
    const nextOffset = offset + limit

    if(deployments.past.hasMoreItems) {
      this.setState({
        isHistoryLoading: true
      })

      listPastDeployments(nextOffset, limit, this.state.filter.term)
        .then(() => {
          this.setState({ isHistoryLoading: false })
        })
        .catch(_.noop)
    }
  }

  renderWaypoint = () => {
    const { deployments } = this.props

    if(!this.state.isHistoryLoading && deployments.past.isFulfilled) {
      return (
        <Waypoint 
          onEnter={ this.loadMorePastDeployments }
          bottomOffset={ -250 }
        />
      )
    }
  }

  onFilterInputChange = (evt) => {
    const { filter } = this.state
    if(filter.typingTimeout) {
      clearTimeout(filter.typingTimeout)
    }

    this.setState({
      filter: {
        term: evt.target.value,
        typingTimeout: setTimeout(() => {
          this.filterHistory()
        }, 250)
      }
    })
  } 

  filterHistory = () => {
    const { listPastDeployments } = this.props
    const { filter } = this.state
    const offset = 0, limit = DEPLOYMENT.LIST.LOADING_LIMIT

    this.setState({
      isHistoryLoading: true
    })

    listPastDeployments(offset, limit, filter.term)
      .then((response) => {
        this.setState({
          isHistoryLoading: false
        })
      })
      .catch(_.noop)
  }

  fetchRunningDeployments = () => {
    const { listRunningDeployments } = this.props
    listRunningDeployments()
      .catch(_.noop)
  }

  componentDidMount() {
    const { listPastDeployments } = this.props

    this.fetchRunningDeployments()
    listPastDeployments(0, DEPLOYMENT.LIST.LOADING_LIMIT)
      .catch(_.noop)
    const intervalId = setInterval(this.fetchRunningDeployments, REFRESH_INTERVAL.RUNNING_DEPLOYMENTS)
    this.setState({
      refreshInterval: intervalId
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.refreshInterval)
  }

  render() {
    const { deployments } = this.props
    const { undeployDialog, deleteDialog, deploymentFormDrawer, deploymentLogDrawer, isHistoryLoading, filter } = this.state

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
                  <Button className="btn color-white" variant="raised" onClick={ this.deploymentFormDrawerOpen(DRAWER.METHOD.CREATE) }>
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
                                <IconButton 
                                  className="icon-button" 
                                  onClick={ this.deploymentLogDrawerOpen(deployment) }
                                  disabled={ deployment.status === DEPLOYMENT.STATUS.TO_DEPLOY }
                                >
                                  <DescriptionIcon className="color-secondary" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Edit" placement="bottom" disableTriggerFocus>
                              <IconButton
                                className="icon-button"
                                onClick={ this.deploymentFormDrawerOpen(DRAWER.METHOD.EDIT, deployment) }
                              >
                                <EditIcon className="color-amber" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Undeploy" placement="bottom" disableTriggerFocus>
                              <span className="tooltip-button-wrapper">
                                <IconButton 
                                  className="icon-button" 
                                  onClick={ this.openUndeployDialog(deployment) }
                                  disabled={ deployment.status !== DEPLOYMENT.STATUS.DEPLOYED }
                                >
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
                <div className="filter-box">
                  <SearchIcon className="search-icon" /> 
                  <input 
                    placeholder="Filter" 
                    value={ filter.term }
                    onChange={ this.onFilterInputChange }
                  /> 
                </div>
              </AppBar>
              { !_.isEmpty(deployments.past.data) && 
                <div>
                  <Table className="history">
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
                                  <IconButton className="icon-button" onClick={ this.deploymentFormDrawerOpen(DRAWER.METHOD.REDEPLOY, deployment) }>
                                    <ReplayIcon className="color-primary" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Delete" placement="bottom" disableTriggerFocus>
                                <span className="tooltip-button-wrapper">
                                  <IconButton 
                                    className="icon-button" 
                                    onClick={ this.openDeleteDialog(deployment) }
                                    disabled={ !_.includes([DEPLOYMENT.STATUS.UNDEPLOYED, DEPLOYMENT.STATUS.ERROR], deployment.status) }
                                  >
                                    <DeleteIcon className="color-red" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                      { isHistoryLoading && deployments.past.hasMoreItems &&
                        <TableRow>
                          <TableCell colSpan="5" className="progress-cell">
                            <CircularProgress color="primary" size={20} className="circular-progress" />
                          </TableCell>
                        </TableRow>
                      }
                    </TableBody>
                  </Table>
                  {
                    this.renderWaypoint()
                  }
                </div>
              }
              { _.isEmpty(deployments.past.data) && 
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan="5" className="no-rows">No results</TableCell>
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
              handleRequestClose={ this.closeUndeployDialog }
              handleRequestConfirm={ this.undeployDeploymentConfirm }
            />
            <ConfirmDialog
              open={ deleteDialog.open }
              action="delete"
              type="DELETE"
              what="past deployment"
              item={ deleteDialog.item ? deleteDialog.item.name : '' }
              handleRequestClose={ this.closeDeleteDialog }
              handleRequestConfirm={ this.deleteDeploymentConfirm }
            />
          </div>
        }
      </Grid>
    )
  }
}

Dashboard.propTypes = {
  deployments: PropTypes.object.isRequired,
  listRunningDeployments: PropTypes.func.isRequired,
  listPastDeployments: PropTypes.func.isRequired,
  undeployDeployment: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired,
  deletePastDeployment: PropTypes.func.isRequired
}

function mapStateToProps({ deployments }) {
  return { deployments }
}

export default connect(mapStateToProps, 
  { listRunningDeployments, listPastDeployments, undeployDeployment, 
    showSuccess, deletePastDeployment })(Dashboard)
