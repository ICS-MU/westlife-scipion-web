#!/usr/bin/env bash

set -e -o pipefail

source "$(dirname $0)/config"

cd $DEPLOYMENTS_DIR/$1
source /home/${USER_NAME}/cfy/bin/activate /log.txt 2>&1

export CFY_BLUEPRINT="scipion${1}"
export CFM_BLUEPRINT="${CFY_BLUEPRINT}"
export CFM_DEPLOYMENT="${CFY_BLUEPRINT}"
export PROVISIONER="${CFY_PROVISIONER}"

if [ "${PROVISIONER}" = 'hostpool' ]; then
    mkdir -p resources/ssh_hostpool

    _KEY_FILENAME="resources/ssh_hostpool/id_rsa"
    touch "${_KEY_FILENAME}"
    chmod 600 "${_KEY_FILENAME}"
    echo "${CFY_HOSTPOOL_PRIVATE_KEY_B64}" | base64 -d >"${_KEY_FILENAME}"
fi

if [ "${CFY_TYPE}" = 'cfm' ]; then
    export CLOUDIFY_SSL_TRUST_ALL=True

    shopt -s nocasematch
    if [[ "${CFM_SSL}" =~ ^(true|yes)$ ]]; then
        CFM_CERT_FILE="/home/${USER_NAME}/cfm.cert"
        echo "${CFM_CERT_B64}" | base64 -d >"${CFM_CERT_FILE}"

        cfy profile use "${CFM_SERVER}" \
            -u "${CFM_USER}" -p "${CFM_PASSWORD}" \
            -t "${CFM_TENANT}" \
            --rest-port "${CFM_PORT}" \
            --ssl --rest-certificate "${CFM_CERT_FILE}"
    else
        cfy profile use "${CFM_SERVER}" \
            -u "${CFM_USER}" -p "${CFM_PASSWORD}" \
            -t "${CFM_TENANT}" \
            --rest-port "${CFM_PORT}"
    fi


    make cfm-deploy >> log.txt 2>&1
    echo $? >> makeresult.txt
    make cfm-outputs | awk 'BEGIN { json=0 } /^{/ { json=1 } { if (json) print }' > outputs.json
else
    make cfy-deploy >> log.txt 2>&1
    echo $? >> makeresult.txt
    make cfy-outputs | awk 'BEGIN { json=0 } /^{/ { json=1 } { if (json) print }' > outputs.json
fi
