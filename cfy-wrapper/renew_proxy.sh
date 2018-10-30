#!/bin/bash

set -e

source "$(dirname $0)/config"

FILE=/tmp/x509up_u1000

if [ ! -f $FILE ]
then
   touch $FILE
else
   sudo chown $USER_NAME:$GROUP_NAME $FILE
fi

voms-proxy-init --voms gputest.metacentrum.cz --cert /home/$USER_NAME/.globus/robotcert.crt --key /home/$USER_NAME/.globus/robotkey.pem --rfc --out $FILE || :

sudo chown $USER_NAME:$GROUP_NAME $FILE
