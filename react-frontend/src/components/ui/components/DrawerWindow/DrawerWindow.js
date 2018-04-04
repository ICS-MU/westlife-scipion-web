import React from 'react'
import PropTypes from 'prop-types'
import Drawer from 'material-ui/Drawer'

import './DrawerWindow.css'

const DrawerWindow = (props) => {
  const { open, handleRequestClose, cssClass } = props

  return (
    <Drawer 
      open={ open } 
      onClose={ handleRequestClose }
      anchor="right"
      className="drawer-right"
    >
      <div className={`drawer-inner ${ cssClass }`}>
        { props.children }
      </div>
    </Drawer>
  )
}

DrawerWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  cssClass: PropTypes.string.isRequired
}

export default DrawerWindow