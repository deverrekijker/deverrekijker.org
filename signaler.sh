#!/usr/bin/env bash
URL="http://deverrekijker.org"
TIMESTAMP=$(perl -e 'print time')

# log current time
echo $TIMESTAMP >> "t_open.txt"

# if we have internet
if nc -zw1 google.com 80;
then
    # local log
    LOG=$(cat t_open.txt)

    # send query, receive response
    SERVER_RESPONSE=$(curl --data "secret=$SECRET&data=$LOG" -s $URL/open-state/listener.php)

    # if server accepted data
    if [ "$SERVER_RESPONSE" == "okidok" ]
    then
        # delete log
        rm -f t_open.txt
    fi

    echo $TIMESTAMP - Server response: $SERVER_RESPONSE
else
    # there is no internet

    # log to connection failure log
    echo $TIMESTAMP - Internet failure >> t_inet_fail.txt

    # reboot,
    sudo shutdown -r now
fi