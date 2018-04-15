import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { showSuccess } from '../../../actions/action_notification'
import { createDeployment } from '../../../actions/action_deployment'
import DeploymentForm from '../DeploymentForm'
import { FORM } from '../../../constants'

class DeploymentRedeploy extends Component {
  constructor(props) {
    super(props)

    this.state = {
      submitDisabled: false
    }
  }

  onSubmit = (data, templateId) => {
    const { handleRequestClose, createDeployment, showSuccess } = this.props
    this.setState({ submitDisabled: true })

    createDeployment({ ...data, template_id: templateId })
      .then(() => {
        showSuccess('Deployment created, please wait until it is finished deploying')
        handleRequestClose()
      })
      .catch(() => {
        this.setState({ submitDisabled: false })
      })
  }

  render() {
    const { handleRequestClose, deployment } = this.props
    const { submitDisabled } = this.state

    return (
      <DeploymentForm
        onSubmitAction={ this.onSubmit }
        actionType={ FORM.ACTION_TYPE.REDEPLOY }
        handleRequestClose={ handleRequestClose }
        submitDisabled={ submitDisabled }
        initialValues={ _.pick(deployment, ['name', 'days_duration', 'data_url', 'template_id']) }
      />
    )
  }
}

DeploymentRedeploy.propTypes = {
  createDeployment: PropTypes.func.isRequired,
  deployment: PropTypes.object.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired,
}

export default connect(null, { showSuccess, createDeployment })(DeploymentRedeploy)
