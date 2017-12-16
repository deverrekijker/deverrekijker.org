<?php

// password check

require_once ('config.php');
require_once (SECRET_PATH);

function bad_request($post)
{
    if (!isset($post['secret'])) {

        return 'requests contained no secret';

    } else {

        if ($post['secret'] != SECRET) {
            return 'wrong secret';
        }
    }
    if (!isset($post['data'])){
        return 'no data';
    }

    return false;
}