import React from 'react'
import PropTypes from 'prop-types'

import DrawerWindow from '../../ui/components/DrawerWindow/DrawerWindow'
import DeploymentCreate from '../pages/DeploymentCreate'
import DeploymentEdit from '../pages/DeploymentEdit'
import { DRAWER } from '../../../constants'

const DeploymentFormDrawer = (props) => {
  const { open, handleRequestClose, method, deployment } = props

  return (
    <DrawerWindow open={ open } handleRequestClose={ handleRequestClose } cssClass="width500">
      { method === DRAWER.METHOD.CREATE && 
        <DeploymentCreate handleRequestClose={ handleRequestClose } />
      }
      { method === DRAWER.METHOD.EDIT && 
        <DeploymentEdit handleRequestClose={ handleRequestClose } deployment={ deployment } />
      }
    </DrawerWindow>
  )
}

DeploymentFormDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  method: PropTypes.string.isRequired,
  deployment: PropTypes.object
}

export default DeploymentFormDrawer