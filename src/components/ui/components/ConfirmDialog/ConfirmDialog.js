import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import Slide from 'material-ui/transitions/Slide'

import './ConfirmDialog.css'


class ConfirmDialog extends Component {
  
  renderTransition(props) {
    return <Slide direction="up" {...props} />;
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        transition={this.renderTransition}
        keepMounted
        onClose={this.props.handleRequestClose}
        className="confirm-dialog"
      >
        <DialogTitle className="title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText className="text">
            Do you really want to { this.props.action } <strong>{ this.props.what }: { this.props.item }</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="actions button-area">
          <Button onClick={this.props.handleRequestClose} color="default">
            Cancel
          </Button>
          { this.props.type === 'CONFIRM' &&
            <Button variant="raised" onClick={this.props.handleRequestConfirm} className="btn color-green">
              Confirm
            </Button>
          }
          { this.props.type === 'DELETE' &&
            <Button variant="raised" onClick={this.props.handleRequestConfirm} className="btn color-red">
              Delete
            </Button>
          }
        </DialogActions>
      </Dialog>
    )
  }
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  action: PropTypes.string.isRequired,
  what: PropTypes.string.isRequired,
  item: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  handleRequestConfirm: PropTypes.func.isRequired
}

export default ConfirmDialog