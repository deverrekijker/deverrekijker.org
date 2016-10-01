# Open Times Tracker

## About

This system keeps track of when a power source has electrity,
    often equivalent to when your institution is open and closed.
The information is stored on your server and visualized.

This is useful for institutions that have unpredictable open hours, such as De Verrekijker at VU Amsterdam,
    where it is currently employed. See [deverrekijker.org](http://deverrekijker.org) for a demo.

## Security

to avoid data spam, set a shared key for the server and client. secure it with ssl

## Installation

### Conforming variables

Make sure that `$URL` and `$SECRET` in `signaler.sh` conforms to `WEB_ROOT` and `SECRET` in `config.php`.

### Signaler

'Signaler' refers to a computer. Here we use a Raspberry Pi.

1. Place `signaler.sh` somewhere on your Signaler.
2.  Do `crontab -e` and add this line

        /5 * * * * /bin/bash $HOME/open-times-tracker/signaler.sh

3. Set your Signaler to boot and log in automatically when it receives power (default for Raspberry Pi)
4. Connect your Signaler to a power source that is turned on when the institution opens and turned off when it closes.

### Server

1. Place the files from the `web` directory somewhere under `public_html` on your server
2. (optional) put `require_once('path/to/open.php')` somewhere on your index or other .php page
