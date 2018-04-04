import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { showSuccess } from '../../../actions/action_notification'
import DeploymentForm from '../DeploymentForm'
import { FORM } from '../../../constants'

class DeploymentEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      submitDisabled: false
    }
  }

  onSubmit = (data) => {
    const { handleRequestClose, /* recreateDeployment, */ showSuccess } = this.props

    this.setState({ submitDisabled: true })

    /*
    recreateDeployment(data)
      .then(() => {
        showSuccess('Successfully re-deployed', showLink here)
        handleRequestClose()
      })
      .catch(() => {
        this.setState({ submitDisabled: false })
      })
    */

    handleRequestClose()
    showSuccess('Successfully re-deployed')
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
        initialValues={ _.pick(deployment, ['name', 'duration_time', 'one_data_url', 'size']) }
      />
    )
  }
}

DeploymentEdit.propTypes = {
  //createDeployment: PropTypes.func.isRequired,
  deployment: PropTypes.object.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired,
}

export default connect(null, { showSuccess })(DeploymentEdit)
