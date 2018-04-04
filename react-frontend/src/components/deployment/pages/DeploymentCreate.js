import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { showSuccess } from '../../../actions/action_notification'
import DeploymentForm from '../DeploymentForm'
import { FORM } from '../../../constants'

class DeploymentCreate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      submitDisabled: false
    }
  }

  onSubmit = (data) => {
    const { handleRequestClose, /* createDeployment, */ showSuccess } = this.props

    this.setState({ submitDisabled: true })

    /*
    createDeployment(data)
      .then(() => {
        showSuccess('Deployment created', showLink here)
        handleRequestClose()
      })
      .catch(() => {
        this.setState({ submitDisabled: false })
      })
    */

    handleRequestClose()
    showSuccess('Deplyoment created')
  }

  render() {
    const { handleRequestClose } = this.props
    const { submitDisabled } = this.state

    return (
      <DeploymentForm
        onSubmitAction={ this.onSubmit }
        actionType={ FORM.ACTION_TYPE.CREATE }
        handleRequestClose={ handleRequestClose }
        submitDisabled={ submitDisabled }
      />
    )
  }
}

DeploymentCreate.propTypes = {
  //createDeployment: PropTypes.func.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired
}

export default connect(null, { showSuccess })(DeploymentCreate)
