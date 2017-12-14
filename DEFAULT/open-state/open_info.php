<?php

require_once('load_open_info.php');

$last_edit_time_str = date('F d Y H:i', $last_open);

echo json_encode(
    array(
        "is_open" => ($open) ? 1 : 0,
        "last_signal" => $last_edit_time_str
    )
);

