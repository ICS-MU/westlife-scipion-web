#!/usr/bin/env bash

set -e

source "$(dirname $0)/config"

cd $DEPLOYMENTS_DIR/$1
source /home/${USER_NAME}/cfy/bin/activate

export CFY_BLUEPRINT="scipion${1}"
export CFM_BLUEPRINT="${CFY_BLUEPRINT}"
export CFM_DEPLOYMENT="${CFY_BLUEPRINT}"

if [ "${CFY_TYPE}" = 'cfm' ]; then
    export CLOUDIFY_SSL_TRUST_ALL=True
    make cfm-undeploy > undelete_log.txt 2>&1
else
    make cfy-undeploy > undelete_log.txt 2>&1
fi
