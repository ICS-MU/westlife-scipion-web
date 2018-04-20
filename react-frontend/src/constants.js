export const USER = {
  AUTH: {
    LOGGED_IN: 'USER_LOGGED_IN',
    LOGGED_OUT: 'USER_LOGGED_OUT'
  }
}

export const DEPLOYMENT = {
  LIST: {
    RUNNING: 'DEPLOYMENTS_LIST_RUNNING',
    PAST: 'DEPLOYMENTS_LIST_PAST',
    LOADING_LIMIT: 30
  },
  RETRIEVE: 'DEPLOYMENT_RETRIEVE',
  RETRIEVE_LOG: 'DEPLOYMENT_RETRIEVE_LOG',
  CREATE: 'DEPLOYMENT_CREATE',
  MODIFY: 'DEPLOYMENT_MODIFY',
  UNDEPLOY: 'DEPLOYMENT_UNDEPLOY',
  DELETE: 'DEPLOYMENT_DELETE',
  STATUS: {
    TO_DEPLOY: 'to_deploy',
    DEPLOYING: 'deploying',
    DEPLOYED: 'deployed',
    TO_UNDEPLOY: 'to_undeploy',
    UNDEPLOYING: 'undeploying',
    UNDEPLOYED: 'undeployed',
    ERROR: 'error',
    RUNNING: ['to_deploy', 'deploying', 'deployed'],
    PAST: ['to_undeploy', 'undeploying', 'undeployed', 'error']
  }
}

export const NOTIFICATION = {
  SUCCESS: {
    SHOW: 'SUCCESS_NOTIFICATION_SHOW',
    HIDE: 'SUCCESS_NOTIFICATION_HIDE'
  },
  ERROR: {
    SHOW: 'ERROR_NOTIFICATION_SHOW',
    HIDE: 'ERROR_NOTIFICATION_HIDE'
  }
}

export const TEMPLATE = {
  LIST: 'LIST_TEMPLATES'
}

export const MOMENT_DATE_TIME_FORMAT = 'HH:mm D/M/YY'

export const FORM = {
  ACTION_TYPE: {
    CREATE: 'CREATE_FORM',
    EDIT: 'EDIT_FORM',
    REDEPLOY: 'REDEPLOY_FORM'
  }
}

export const DRAWER = {
  METHOD: {
    CREATE: FORM.ACTION_TYPE.CREATE,
    EDIT: FORM.ACTION_TYPE.EDIT,
    REDEPLOY: FORM.ACTION_TYPE.REDEPLOY
  }
}

// in miliseconds
export const REFRESH_INTERVAL = {
  LOG: 3000,
  RUNNING_DEPLOYMENTS: 10000
}
