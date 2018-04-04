import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import { TextField } from 'redux-form-material-ui'
import { InputAdornment } from 'material-ui/Input'

import { required, positiveNumber } from '../../validators/common_validator'
import { FORM } from '../../constants'
import './DeploymentForm.css'

class DeploymentForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      machineSize: 'small'
    }
  }

  onSubmit = (data) => {
    this.props.onSubmitAction(data)
  }

  onCancelButtonClick = () => {
    this.props.handleRequestClose()
  }

  selectMachineSize = (type) => () => {
    this.setState({
      machineSize: type
    })
  }

  componentDidMount() {
    const { initialValues } = this.props
    if(initialValues) {
      this.setState({
        machineSize: initialValues.size
      })
    }
  }

  render() {
    const { handleSubmit, submitDisabled, actionType } = this.props
    const { machineSize } = this.state
    const isCreate = actionType === FORM.ACTION_TYPE.CREATE
    const isEdit = actionType === FORM.ACTION_TYPE.EDIT

    return (
      <Grid container alignItems='center' justify='center'>
        <Grid item xs={ 12 }>  
          <Paper className="form in-drawer" elevation={ 0 }>
            { isCreate && <h3>Add a new deployment</h3> }
            { isEdit && <h3>Re-deploy</h3> }

            <Typography gutterBottom>
              Select machine's size *
            </Typography>
            <div className="button-area machine-size">
              <Button className={ machineSize === 'small' ? 'selected' : '' } onClick={ this.selectMachineSize('small') }>
                Small
              </Button>
              <Button className={ machineSize === 'medium' ? 'selected' : '' } onClick={ this.selectMachineSize('medium') }>
                Medium
              </Button>
              <Button className={ machineSize === 'large' ? 'selected' : '' } onClick={ this.selectMachineSize('large') }>
                Large
              </Button>
            </div>

            <form autoComplete="off" onSubmit={ handleSubmit(this.onSubmit) }>
              <Field
                name="name"
                component={ TextField }
                label="Project name *"
                className="text-input"
                fullWidth={ true }
                validate={ required }
              />
              <Field
                name="duration_time"
                component={ TextField }
                label="Duration time *"
                className="text-input"
                fullWidth={ true }
                validate={ [ required, positiveNumber ] }
                type="number"
                InputProps={{
                  min: 0,
                  startAdornment: <InputAdornment position="start">Hours</InputAdornment>,
                }}
              />
              <Field
                name="one_data_url"
                component={ TextField }
                label="OneData URL *"
                className="text-input"
                fullWidth={ true }
                validate={ required }
              />

              <Typography variant="button" className="button-area form-buttons">
                <Button className="submit" variant="raised" color="primary" type="submit" disabled={ submitDisabled }> 
                  { isCreate && 'Create' }
                  { isEdit && 'Re-deploy' }
                </Button>
                <Button className="back" color="default" onClick={ this.onCancelButtonClick }>
                  Cancel
                </Button>
              </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

DeploymentForm.propTypes = {
  actionType: PropTypes.string.isRequired,
  onSubmitAction: PropTypes.func.isRequired,
  submitDisabled: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object
}

DeploymentForm = reduxForm({
  form: 'DeploymentForm',
  touchOnBlur: false
})(DeploymentForm)

export default DeploymentForm
