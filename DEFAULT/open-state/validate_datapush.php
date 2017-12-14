<?php

// password check

function validate_datapush($post)
{

    $log_info = array(time());

    $err = 0;

    if (!isset($post['secret'])) {
        $err++;
        array_push($log_info, 'undefined secret');
    } else if ($post['secret'] != SECRET) {
        $err++;
        array_push($log_info, "wrong secret : " . $post['secret']);
    }
    if (!isset($post['data'])) {
        $err++;
        array_push($log_info, 'no data');
    }

    array_push($log_info, $err);

    return $err < 1;
}