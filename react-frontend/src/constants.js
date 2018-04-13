export const USER = {
  AUTH: {
    LOGGED_IN: 'USER_LOGGED_IN',
    LOGGED_OUT: 'USER_LOGGED_OUT'
  }
}

export const DEPLOYMENT = {
  LIST: {
    RUNNING: 'DEPLOYMENTS_LIST_RUNNING',
    PAST: 'DEPLOYMENTS_LIST_PAST'
  },
  RETRIEVE: 'DEPLOYMENT_RETRIEVE',
  RETRIEVE_LOG: 'DEPLOYMENT_RETRIEVE_LOG',
  STATUS: {
    TO_DEPLOY: 'to_deploy',
    DEPLOYING: 'deploying',
    DEPLOYED: 'deployed',
    TO_UNDEPLOY: 'to_undeploy',
    UNDEPLOYING: 'undeploying',
    UNDEPLOYED: 'undeployed',
    RUNNING: ['to_deploy', 'deploying', 'deployed'],
    PAST: ['to_undeploy', 'undeploying', 'undeployed']
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

export const MOMENT_DATE_TIME_FORMAT = 'HH:mm D/M/YY'

export const DRAWER = {
  METHOD: {
    CREATE: 'CREATE_DRAWER',
    EDIT: 'EDIT_DRAWER'
  }
}

export const FORM = {
  ACTION_TYPE: {
    CREATE: 'CREATE_FORM',
    EDIT: 'EDIT_FORM'
  }
}
