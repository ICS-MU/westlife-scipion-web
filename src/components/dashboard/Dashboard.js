import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import Grid from 'material-ui/Grid'
import DeleteIcon from 'material-ui-icons/DeleteForever'
import ReplayIcon from 'material-ui-icons/Replay'
import AddIcon from 'material-ui-icons/Add'
import DescriptionIcon from 'material-ui-icons/Description'
import _ from 'lodash'
import moment from 'moment'
import { MOMENT_DATE_TIME_FORMAT, DRAWER } from '../../constants'
import { getRoutePath } from '../../routes'
import ConfirmDialog from '../ui/components/ConfirmDialog/ConfirmDialog'
import DeploymentFormDrawer from '../deployment/components/DeploymentFormDrawer'
import DeploymentLogDrawer from '../deployment/components/DeploymentLogDrawer'

import './Dashboard.css'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
      }
    }

    this.openDeleteDialog = this.openDeleteDialog.bind(this)
    this.deploymentFormDrawerOpen = this.deploymentFormDrawerOpen.bind(this)
    this.deploymentLogDrawerOpen = this.deploymentLogDrawerOpen.bind(this)
  }

  openDeleteDialog(evt, deployment) {
    evt.stopPropagation()
    this.setState({
      deleteDialog: {
        open: true,
        item: deployment
      }
    })
  }

  closeDeleteDialog() {
    this.setState({
      deleteDialog: {
        open: false,
        item: null
      }
    })
  }

  deleteDeployment() {
    this.closeDeleteDialog()
  }

  deploymentFormDrawerClose() {
    this.setState({
      deploymentFormDrawer: {
        open: false,
        item: null,
        method: ''
      }
    })
  }

  deploymentFormDrawerOpen(evt, deployment = null) {
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

  deploymentLogDrawerClose() {
    this.setState({
      deploymentLogDrawer: {
        open: false,
        item: null
      }
    })
  }

  deploymentLogDrawerOpen(evt, deployment) {
    evt.stopPropagation()
    this.setState({
      deploymentLogDrawer: {
        open: true,
        item: deployment
      }
    })
  }

  showDeployment(id) {
    this.props.history.push(getRoutePath('deployment.show', { id }))
  }

  render() {
    const { deployments } = this.props
    const { deleteDialog, deploymentFormDrawer, deploymentLogDrawer } = this.state

    return (
      <Grid item xs={12} className="list">
        { deployments.isFulfilled &&
          <div>
            <Paper>
              <AppBar position="static" className="list-appbar">
                <Typography variant="title" className="list-title">
                  Your running VMs
                </Typography>
                <div className="button-area">
                  <Button className="btn color-white" variant="raised" onClick={ (evt) => this.deploymentFormDrawerOpen(evt) }>
                    <AddIcon className="left-icon" /> Create new
                  </Button>
                </div>
              </AppBar>
              { deployments.data.running.length && 
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Duration time</TableCell>
                      <TableCell className="align-right">Created</TableCell>
                      <TableCell className="align-right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      _.map(deployments.data.running, (deployment) => (
                        <TableRow key={deployment.id} className="clickable" onClick={ () => this.showDeployment(deployment.id) }>
                          <TableCell className="name">{ deployment.name }</TableCell>
                          <TableCell>{ deployment.duration_time } hours</TableCell>
                          <TableCell className="align-right datetime">{ moment.utc(deployment.created).local().format(MOMENT_DATE_TIME_FORMAT) }</TableCell>
                          <TableCell className="align-right">
                            <Tooltip title="View log" placement="bottom">
                              <IconButton className="icon-button" onClick={ (evt) => this.deploymentLogDrawerOpen(evt, deployment) }>
                                <DescriptionIcon className="color-secondary" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" placement="bottom">
                              <IconButton className="icon-button" onClick={ (evt) => this.openDeleteDialog(evt, deployment) }>
                                <DeleteIcon className="color-red" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              }
              { !deployments.data.running.length && 
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
                  Past projects
                </Typography>
              </AppBar>
              { deployments.data.past.length && 
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Duration time</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell className="align-right">Finished</TableCell>
                      <TableCell className="align-right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      _.map(deployments.data.past, (deployment) => (
                        <TableRow key={deployment.id}>
                          <TableCell className="name">{ deployment.name }</TableCell>
                          <TableCell>{ deployment.duration_time } hours</TableCell>
                          <TableCell><span className={ deployment.state }>{ deployment.state }</span></TableCell>
                          <TableCell className="align-right datetime">{ moment.utc(deployment.finished).local().format(MOMENT_DATE_TIME_FORMAT) }</TableCell>
                          <TableCell className="align-right">
                            <Tooltip title="View log" placement="bottom">
                              <IconButton className="icon-button" onClick={ (evt) => this.deploymentLogDrawerOpen(evt, deployment) }>
                                <DescriptionIcon className="color-secondary" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Re-deploy" placement="bottom">
                              <IconButton className="icon-button" onClick={ (evt) => this.deploymentFormDrawerOpen(evt, deployment) }>
                                <ReplayIcon className="color-primary" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              }
              { !deployments.data.past.length && 
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
              handleRequestClose={ this.deploymentFormDrawerClose.bind(this) }
              deployment={ deploymentFormDrawer.item }
              method={ deploymentFormDrawer.method }
            />
            <DeploymentLogDrawer
              open={ deploymentLogDrawer.open }
              handleRequestClose={ this.deploymentLogDrawerClose.bind(this) }
              deployment={ deploymentLogDrawer.item }
            />
            { deleteDialog.open && 
              <ConfirmDialog 
                open={ deleteDialog.open }
                action="delete"
                type="DELETE"
                what="deployment"
                item={ deleteDialog.item.name }
                handleRequestClose={ this.deleteDeployment.bind(this) }
                handleRequestConfirm={ this.closeDeleteDialog.bind(this) }
              />
            }
          </div>
        }
      </Grid>
    )
  }
}

Dashboard.propTypes = {
  // here will be fetch functions
  deployments: PropTypes.object.isRequired
}

function mapStateToProps({ deployments }) {
  return { deployments }
}

export default connect(mapStateToProps)(Dashboard)
