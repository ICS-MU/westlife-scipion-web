import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import Slide from 'material-ui/transitions/Slide'

import './ConfirmDialog.css'


class ConfirmDialog extends Component {
  
  renderTransition = (props) => {
    return <Slide direction="up" {...props} />
  }

  render() {
    const { open, action, what, item, type, handleRequestClose, handleRequestConfirm } = this.props

    return (
      <Dialog
        open={ open }
        transition={ this.renderTransition }
        keepMounted
        onClose={ handleRequestClose }
        className="confirm-dialog"
      >
        <DialogTitle className="title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText className="text">
            Do you really want to { action } <strong>{  what }: {  item }</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="actions button-area">
          <Button onClick={ handleRequestClose } color="default">
            Cancel
          </Button>
          { type === 'CONFIRM' &&
            <Button variant="raised" onClick={ handleRequestConfirm } className="btn color-green">
              Confirm
            </Button>
          }
          { type === 'DELETE' &&
            <Button variant="raised" onClick={ handleRequestConfirm } className="btn color-red">
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