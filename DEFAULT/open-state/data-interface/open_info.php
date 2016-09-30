<?php

require_once('../../config.php');

$data = json_decode(file_get_contents(DATA));

$last_open = $data[count($data)-1][1];
$now = time();
$minutes_since_last_signal = ($now-$last_open)/60;
$open = $minutes_since_last_signal<WAIT_BEFORE_CLOSE;

$last_edit_time_str = date('F d Y H:i', $last_open);

echo json_encode(array("is_open"=>($open)?1:0,"last_signal"=>$last_edit_time_str,"maintenance"=>MAINTENANCE));

