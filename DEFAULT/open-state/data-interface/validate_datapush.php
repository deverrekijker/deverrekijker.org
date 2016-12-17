<?php

    // password check
    require_once(SECRET_PATH);

    function validate_datapush($post){

        $log_info = array(time());

        $err=0;

        if (!isset($post['secret'])) {
            $err++;
            array_push($log_info,'undefined secret');
        }
        else if ($post['secret']!=SECRET) {
            $err++;
            array_push($log_info,"wrong secret : " . $post['secret']);
        }
        if (!isset($post['data'])) {
            $err++;
            array_push($log_info,'no data');
        }

        array_push($log_info,$err);

        //if (LOCAL!=1) file_put_contents(REQ_LOG,json_encode($log_info), FILE_APPEND | LOCK_EX) or die(json_encode(error_get_last()).PHP_EOL);else echo json_encode($log_info);

        return $err<1;
    }