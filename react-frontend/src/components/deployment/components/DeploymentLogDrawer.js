import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import { CircularProgress } from 'material-ui/Progress'
import _ from 'lodash'

import { retrieveLog } from '../../../actions/action_deployment'
import DrawerWindow from '../../ui/components/DrawerWindow/DrawerWindow'
import { REFRESH_INTERVAL } from '../../../constants'
import './DeploymentLogDrawer.css'

class DeploymentLogDrawer extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            apiError: {},
            log: ''
        }
    }

    fetchLog = () => {
        const { open, deployment } = this.props
        if(open) {
            retrieveLog(deployment.id)
            .then((response) => {
                this.setState({
                    log: response
                })
            })
            .catch((error) => {
                const status = _.get(error, 'response.status', 'Ups')
                const message = _.get(error, 'response.data.message', 'Something went wrong')

                this.setState({
                    log: '',
                    apiError: {
                        status,
                        message
                    }
                })
            })
             setTimeout(this.fetchLog, REFRESH_INTERVAL.LOG)
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.open === false && this.props.open === true) {
            this.setState({
                log: '',
                apiError: {}
            })
            this.fetchLog()
        }
    }
  
    render() {
        const { open, handleRequestClose, deployment } = this.props
        const { apiError, log } = this.state

        return (
            <DrawerWindow open={ open } handleRequestClose={ handleRequestClose } cssClass="width1000 drawer">
                { deployment && 
                    <section className="log-drawer">
                        <header>
                            <IconButton className="close" onClick={ handleRequestClose }>
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="headline">
                                { deployment.name }
                            </Typography>
                        </header>
                        { _.isEmpty(apiError) && !log &&
                            <div className="progress-box">
                                <CircularProgress className="circular-progress" size={50} />
                            </div>
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
                        { log &&
                            <pre className="content">
                                { log }
                            </pre>
                        }
                    </section>
                }
            </DrawerWindow>
        )
    }
}

DeploymentLogDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    handleRequestClose: PropTypes.func.isRequired,
    deployment: PropTypes.object
}

export default DeploymentLogDrawer