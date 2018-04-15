import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import InfoIcon from 'material-ui-icons/Info'
import Tooltip from 'material-ui/Tooltip'
import { TextField } from 'redux-form-material-ui'
import { InputAdornment } from 'material-ui/Input'
import { CircularProgress } from 'material-ui/Progress'

import { required, positiveNumber } from '../../validators/common_validator'
import { FORM } from '../../constants'
import './DeploymentForm.css'

class DeploymentForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedTemplate: null
    }
  }

  onSubmit = (data) => {
    if(!this.state.selectedTemplate) {
      this.setState({
        selectedTemplateError: 'Please select one template'
      })
    } else {
      this.props.onSubmitAction(data, this.state.selectedTemplate)
    }
  }

  onCancelButtonClick = () => {
    this.props.handleRequestClose()
  }

  selectTemplate = (templateId) => () => {
    this.setState({
      selectedTemplate: templateId,
      selectedTemplateError: ''
    })
  }

  componentDidMount() {
    const { initialValues } = this.props
    if(initialValues) {
      this.setState({
        selectedTemplate: initialValues.template_id
      })
    }
  }

  render() {
    const { handleSubmit, submitDisabled, actionType, templates } = this.props
    const { selectedTemplate, selectedTemplateError } = this.state
    const isCreate = actionType === FORM.ACTION_TYPE.CREATE
    const isEdit = actionType === FORM.ACTION_TYPE.EDIT
    const isRedeploy = actionType === FORM.ACTION_TYPE.REDEPLOY

    return (
      <Grid container alignItems='center' justify='center'>
        <Grid item xs={ 12 }>  
          <Paper className="form in-drawer" elevation={ 0 }>
            { isCreate && <h3>Create new deployment</h3> }
            { isEdit && <h3>Edit deployment</h3> }
            { isRedeploy && <h3>Re-deploy</h3> }
            <Typography gutterBottom>
              Select deployment's template *
            </Typography>
            <div className="button-area posrel">
              <div className={ `machine-size ${ selectedTemplateError ? 'error' : '' } ${ isEdit ? 'disabled' : '' }` }>
                { _.isEmpty(templates) && 
                  <div className="progress-box">
                    <CircularProgress className="circular-progress" size={50} />
                  </div>
                }
                { !_.isEmpty(templates) && 
                  _.map(templates, (template) => {
                    return (
                      <Button 
                        key={ template.id }
                        className={ selectedTemplate === template.id ? 'selected template-button' : 'template-button' } 
                        onClick={ this.selectTemplate(template.id) }
                        disabled={ isEdit }
                      >
                        { template.name }
                      </Button>
                    )
                  })
                }
              </div>
              { !_.isEmpty(templates) && 
                <Tooltip 
                  placement="left"
                  title={ 
                    _.map(templates, (template) => {
                      return (
                        <span key={ template.id }>
                          { template.name } – cores: { template.cores }, memory: { template.memory } GB<br />
                        </span>
                      )
                    })
                  }
                >
                  <InfoIcon className="info-icon" />
                </Tooltip>
              }
              { selectedTemplateError &&
                <p className="select-error">{ selectedTemplateError }</p>
              }
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
                name="days_duration"
                component={ TextField }
                label="Duration time *"
                className="text-input"
                parse={ value => !value ? null : Number(value) }
                fullWidth={ true }
                validate={ [ required, positiveNumber ] }
                type="number"
                InputProps={{
                  min: 1,
                  startAdornment: <InputAdornment position="start">Days</InputAdornment>,
                }}
              />
              <Field
                name="data_url"
                component={ TextField }
                label="OneData URL *"
                className="text-input"
                fullWidth={ true }
                validate={ required }
                disabled={ isEdit }
              />

              <Typography variant="button" className="button-area form-buttons">
                <Button className="submit" variant="raised" color="primary" type="submit" disabled={ submitDisabled }> 
                  { isCreate && 'Create' }
                  { isEdit && 'Update' }
                  { isRedeploy && 'Re-deploy' }
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

function mapStateToProps({ templates }) {
  return { templates }
}

DeploymentForm.propTypes = {
  actionType: PropTypes.string.isRequired,
  onSubmitAction: PropTypes.func.isRequired,
  submitDisabled: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  templates: PropTypes.object
}

DeploymentForm = reduxForm({
  form: 'DeploymentForm',
  touchOnBlur: false
})(DeploymentForm)

export default connect(mapStateToProps)(DeploymentForm)
