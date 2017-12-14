<?php

require_once('config.php');


$data = json_decode(file_get_contents(DATA));
$last_open = $data[count($data) - 1][1];
$now = time();
$minutes_since_last_signal = ($now - $last_open) / 60;
$open = $minutes_since_last_signal < WAIT_BEFORE_CLOSE;
