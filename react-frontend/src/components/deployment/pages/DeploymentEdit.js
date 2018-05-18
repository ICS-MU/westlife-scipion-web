import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { showSuccess } from '../../../actions/action_notification'
import { modifyDeployment } from '../../../actions/action_deployment'
import DeploymentForm from '../DeploymentForm'
import { FORM } from '../../../constants'

class DeploymentEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      submitDisabled: false
    }
  }

  /*
   * Form submit handler, edits the deployment
   *
   * @param {object}  data        Deployment's data
   * @param {integer} templateId  ID of the VM's template
   */
  onSubmit = (data, templateId) => {
    const { handleRequestClose, showSuccess, modifyDeployment, deployment } = this.props

    this.setState({ submitDisabled: true })

    modifyDeployment(deployment.id, { ...data, template_id: templateId })
      .then(() => {
        showSuccess('Deployment updated')
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
        actionType={ FORM.ACTION_TYPE.EDIT }
        handleRequestClose={ handleRequestClose }
        submitDisabled={ submitDisabled }
        initialValues={ _.pick(deployment, ['name', 'days_duration', 'data_url', 'onedata_access_token', 'template_id']) }
      />
    )
  }
}

DeploymentEdit.propTypes = {
  modifyDeployment: PropTypes.func.isRequired,
  deployment: PropTypes.object.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired,
}

export default connect(null, { showSuccess, modifyDeployment })(DeploymentEdit)
