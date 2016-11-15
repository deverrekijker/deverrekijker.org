#!/bin/bash

URL="http://deverrekijker.org"
REQ_ADDR=URL
TIMESTAMP=$(perl -e 'print time')
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function get_timestamp() {
  printf  "[LOG] Timestamp: "
  date +"%d:%m:%Y %T"
}

function send_request() {
    # local log
    LOG=$(cat $DIR"/t_open.txt")

    echo $LOG

    # send query, receive response   
    SERVER_RESPONSE=$(curl --data "secret=$SECRET&data=$LOG" -s $URL/open-state/listener.php)

    # if server accepted data
    if [ "$SERVER_RESPONSE" == "okidok" ]
    then
        # delete log
        rm -f $DIR"/t_open.txt"
    fi

    echo $TIMESTAMP - Server response: $SERVER_RESPONSE
}

function fuck() {
    echo "[ERROR] Could not connect to the Internet"

    # log to connection failure log
    echo $TIMESTAMP >> $DIR"/t_inet_fail.txt"

    echo "[WARNING] Rebooting now..."
    # reboot,
    sudo shutdown -r now
}

get_timestamp
echo "[LOG] Current directory: "$DIR

# log current time
echo $TIMESTAMP >> $DIR"/t_open.txt"

#if we have internet
echo "[LOG] Checking for Internet connection..."

case "$(curl -s --max-time 2 -I google.com | sed 's/^[^ ]*  *\([0-9]\).*/\1/; 1q')" in
   [23])
       echo "[SUCCESS] HTTP connectivity is up"
       send_request
       ;;
   5)
       echo "[ERROR] The web proxy won't let us through";;
   *)
       echo "[ERROR] The network is down or very slow"
       fuck
       ;;
esac
